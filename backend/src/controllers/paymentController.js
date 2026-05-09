const { Payment, Bill, Customer } = require('../models/mysql');
const stripeService = require('../services/stripeService');
const { Op } = require('sequelize');

class PaymentController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, status, method, account_number } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.payment_status = status;
      if (method) where.payment_method = method;
      if (account_number) where.account_number = account_number;

      const { count, rows } = await Payment.findAndCountAll({
        where,
        include: [{ model: Bill }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['payment_date', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          payments: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [{ model: Bill }]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async createPaymentIntent(req, res, next) {
    try {
      const { bill_id, payment_method } = req.body;

      // Validate input
      if (!bill_id) {
        return res.status(400).json({
          success: false,
          error: 'Bill ID is required'
        });
      }

      // Get bill details
      const bill = await Bill.findByPk(bill_id, {
        include: [{
          model: WaterUsage,
          include: [{ model: Customer }]
        }]
      });

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      if (bill.payment_status === 'paid') {
        return res.status(400).json({
          success: false,
          error: 'Bill is already paid'
        });
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripeService.createPaymentIntent(
        parseFloat(bill.total_amount),
        bill.account_number,
        bill_id
      );

      res.json({
        success: true,
        data: {
          client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id,
          amount: bill.total_amount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const { payment_intent_id, bill_id } = req.body;

      // Validate input
      if (!payment_intent_id || !bill_id) {
        return res.status(400).json({
          success: false,
          error: 'Payment intent ID and bill ID are required'
        });
      }

      // Confirm payment with Stripe
      const paymentIntent = await stripeService.confirmPayment(payment_intent_id);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          error: 'Payment not successful',
          status: paymentIntent.status
        });
      }

      // Get bill details
      const bill = await Bill.findByPk(bill_id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      // Create payment record
      const payment = await Payment.create({
        bill_id,
        account_number: bill.account_number,
        amount: bill.total_amount,
        payment_method: 'stripe',
        payment_status: 'completed',
        transaction_reference: payment_intent_id,
        payment_date: new Date()
      });

      // Update bill status
      await bill.update({
        payment_status: 'paid',
        paid_date: new Date()
      });

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async recordManualPayment(req, res, next) {
    try {
      const { bill_id, amount, payment_method, transaction_reference, notes } = req.body;

      // Validate input
      if (!bill_id || !amount || !payment_method) {
        return res.status(400).json({
          success: false,
          error: 'Bill ID, amount, and payment method are required'
        });
      }

      // Get bill details
      const bill = await Bill.findByPk(bill_id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      if (bill.payment_status === 'paid') {
        return res.status(400).json({
          success: false,
          error: 'Bill is already paid'
        });
      }

      // Create payment record
      const payment = await Payment.create({
        bill_id,
        account_number: bill.account_number,
        amount,
        payment_method,
        payment_status: 'completed',
        transaction_reference,
        notes,
        payment_date: new Date()
      });

      // Update bill status if fully paid
      if (parseFloat(amount) >= parseFloat(bill.total_amount)) {
        await bill.update({
          payment_status: 'paid',
          paid_date: new Date()
        });
      } else {
        await bill.update({
          payment_status: 'partial'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Payment recorded successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentHistory(req, res, next) {
    try {
      const { account_number } = req.params;
      const { months = 12 } = req.query;

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - parseInt(months));

      const payments = await Payment.findAll({
        where: {
          account_number,
          payment_date: { [Op.gte]: startDate }
        },
        include: [{ model: Bill }],
        order: [['payment_date', 'DESC']]
      });

      const summary = {
        total_payments: payments.length,
        total_amount: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
        payments
      };

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const payment = await Payment.findByPk(id, {
        include: [{ model: Bill }]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
      }

      if (payment.payment_status === 'refunded') {
        return res.status(400).json({
          success: false,
          error: 'Payment already refunded'
        });
      }

      // Process refund with Stripe if applicable
      if (payment.payment_method === 'stripe' && payment.transaction_reference) {
        await stripeService.refundPayment(payment.transaction_reference);
      }

      // Update payment status
      await payment.update({
        payment_status: 'refunded',
        notes: `Refunded: ${reason || 'No reason provided'}`
      });

      // Update bill status
      if (payment.Bill) {
        await payment.Bill.update({
          payment_status: 'pending'
        });
      }

      res.json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentSummary(req, res, next) {
    try {
      const { start_date, end_date, district_id } = req.query;

      const where = {
        payment_status: 'completed'
      };

      if (start_date && end_date) {
        where.payment_date = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      const include = district_id ? [{
        model: Bill,
        include: [{
          model: WaterUsage,
          include: [{
            model: Customer,
            where: { district_id }
          }]
        }]
      }] : [{ model: Bill }];

      const payments = await Payment.findAll({ where, include });

      const summary = {
        total_payments: payments.length,
        total_amount: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
        by_method: {},
        by_status: {}
      };

      // Group by payment method
      payments.forEach(payment => {
        const method = payment.payment_method;
        if (!summary.by_method[method]) {
          summary.by_method[method] = { count: 0, amount: 0 };
        }
        summary.by_method[method].count++;
        summary.by_method[method].amount += parseFloat(payment.amount);
      });

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req, res, next) {
    try {
      const signature = req.headers['stripe-signature'];
      const event = stripeService.constructWebhookEvent(req.body, signature);

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Payment was successful
          console.log('Payment succeeded:', event.data.object.id);
          break;
        case 'payment_intent.payment_failed':
          // Payment failed
          console.log('Payment failed:', event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();

// Made with Bob
