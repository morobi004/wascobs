const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Bill } = require('../models/mysql');

class StripeService {
  async createPaymentIntent(billId, accountNumber) {
    const bill = await Bill.findByPk(billId);

    if (!bill) {
      throw new Error('Bill not found');
    }

    if (bill.account_number !== accountNumber) {
      throw new Error('Unauthorized access to bill');
    }

    const amount = Math.round(parseFloat(bill.balance) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'zar',
      metadata: {
        bill_id: billId,
        account_number: accountNumber,
        bill_number: bill.bill_number
      },
      description: `Water bill payment for ${bill.bill_number}`
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount / 100
    };
  }

  async confirmPayment(paymentIntentId, billId, accountNumber) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful');
    }

    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await Payment.create({
      bill_id: billId,
      account_number: accountNumber,
      payment_reference: paymentReference,
      payment_method: 'online',
      payment_amount: paymentIntent.amount / 100,
      transaction_id: paymentIntent.id,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_charge_id: paymentIntent.charges.data[0]?.id,
      payment_status: 'completed',
      receipt_number: `RCP-${Date.now()}`
    });

    await this.updateBillPaymentStatus(billId);

    return payment;
  }

  async updateBillPaymentStatus(billId) {
    const bill = await Bill.findByPk(billId);
    const totalPaid = await Payment.sum('payment_amount', {
      where: {
        bill_id: billId,
        payment_status: 'completed'
      }
    });

    const totalDue = parseFloat(bill.total_amount) + parseFloat(bill.previous_balance);

    let paymentStatus = 'unpaid';
    if (totalPaid >= totalDue) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }

    await bill.update({
      amount_paid: totalPaid,
      payment_status: paymentStatus
    });
  }

  async handleWebhook(event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  async handlePaymentSuccess(paymentIntent) {
    const payment = await Payment.findOne({
      where: { stripe_payment_intent_id: paymentIntent.id }
    });

    if (payment && payment.payment_status === 'pending') {
      await payment.update({ payment_status: 'completed' });
      await this.updateBillPaymentStatus(payment.bill_id);
    }
  }

  async handlePaymentFailure(paymentIntent) {
    const payment = await Payment.findOne({
      where: { stripe_payment_intent_id: paymentIntent.id }
    });

    if (payment) {
      await payment.update({
        payment_status: 'failed',
        notes: paymentIntent.last_payment_error?.message || 'Payment failed'
      });
    }
  }

  async createRefund(paymentId) {
    const payment = await Payment.findByPk(paymentId);

    if (!payment || payment.payment_status !== 'completed') {
      throw new Error('Payment not eligible for refund');
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id
    });

    await payment.update({
      payment_status: 'refunded',
      notes: `Refunded: ${refund.id}`
    });

    await this.updateBillPaymentStatus(payment.bill_id);

    return refund;
  }
}

module.exports = new StripeService();

// Made with Bob
