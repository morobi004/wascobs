const { Bill, WaterUsage, Customer, BillingRate } = require('../models/mysql');
const billCalculationService = require('../services/billCalculationService');
const { Op } = require('sequelize');

class BillingController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, status, year, month, district_id } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.payment_status = status;
      if (year) where.billing_year = year;
      if (month) where.billing_month = month;

      const include = [{
        model: WaterUsage,
        include: [{
          model: Customer,
          ...(district_id && { where: { district_id } })
        }]
      }];

      const { count, rows } = await Bill.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['billing_year', 'DESC'], ['billing_month', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          bills: rows,
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
      const bill = await Bill.findByPk(req.params.id, {
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

      res.json({
        success: true,
        data: bill
      });
    } catch (error) {
      next(error);
    }
  }

  async generateBill(req, res, next) {
    try {
      const { account_number, year, month } = req.body;

      // Validate input
      if (!account_number || !year || !month) {
        return res.status(400).json({
          success: false,
          error: 'Account number, year, and month are required'
        });
      }

      // Check if bill already exists
      const existingBill = await Bill.findOne({
        where: {
          account_number,
          billing_year: year,
          billing_month: month
        }
      });

      if (existingBill) {
        return res.status(400).json({
          success: false,
          error: 'Bill already exists for this period'
        });
      }

      // Generate bill
      const bill = await billCalculationService.generateBill(account_number, year, month);

      res.status(201).json({
        success: true,
        message: 'Bill generated successfully',
        data: bill
      });
    } catch (error) {
      next(error);
    }
  }

  async generateBulkBills(req, res, next) {
    try {
      const { year, month, district_id } = req.body;

      // Validate input
      if (!year || !month) {
        return res.status(400).json({
          success: false,
          error: 'Year and month are required'
        });
      }

      // Generate bills for all customers or specific district
      const result = await billCalculationService.generateBulkBills(year, month, district_id);

      res.status(201).json({
        success: true,
        message: `Generated ${result.generated} bills successfully`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBill(req, res, next) {
    try {
      const bill = await Bill.findByPk(req.params.id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      // Only allow updating certain fields
      const allowedUpdates = ['due_date', 'notes'];
      const updates = {};
      
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      await bill.update(updates);

      res.json({
        success: true,
        message: 'Bill updated successfully',
        data: bill
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBill(req, res, next) {
    try {
      const bill = await Bill.findByPk(req.params.id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      // Only allow deleting unpaid bills
      if (bill.payment_status === 'paid') {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete paid bills'
        });
      }

      await bill.destroy();

      res.json({
        success: true,
        message: 'Bill deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getOutstandingBills(req, res, next) {
    try {
      const { account_number } = req.params;

      const bills = await Bill.findAll({
        where: {
          account_number,
          payment_status: { [Op.in]: ['pending', 'overdue'] }
        },
        include: [{ model: WaterUsage }],
        order: [['due_date', 'ASC']]
      });

      const totalOutstanding = bills.reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0);

      res.json({
        success: true,
        data: {
          bills,
          total_outstanding: totalOutstanding,
          count: bills.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBillingSummary(req, res, next) {
    try {
      const { year, month, district_id } = req.query;

      const where = {};
      if (year) where.billing_year = year;
      if (month) where.billing_month = month;

      const include = district_id ? [{
        model: WaterUsage,
        include: [{
          model: Customer,
          where: { district_id }
        }]
      }] : [{ model: WaterUsage }];

      const bills = await Bill.findAll({ where, include });

      const summary = {
        total_bills: bills.length,
        total_amount: bills.reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0),
        paid_bills: bills.filter(b => b.payment_status === 'paid').length,
        pending_bills: bills.filter(b => b.payment_status === 'pending').length,
        overdue_bills: bills.filter(b => b.payment_status === 'overdue').length,
        total_paid: bills
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0),
        total_outstanding: bills
          .filter(b => b.payment_status !== 'paid')
          .reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0)
      };

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  async getBillingRates(req, res, next) {
    try {
      const rates = await BillingRate.findAll({
        where: { is_active: true },
        order: [['connection_type', 'ASC'], ['min_usage', 'ASC']]
      });

      res.json({
        success: true,
        data: rates
      });
    } catch (error) {
      next(error);
    }
  }

  async createBillingRate(req, res, next) {
    try {
      const rate = await BillingRate.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Billing rate created successfully',
        data: rate
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBillingRate(req, res, next) {
    try {
      const rate = await BillingRate.findByPk(req.params.id);

      if (!rate) {
        return res.status(404).json({
          success: false,
          error: 'Billing rate not found'
        });
      }

      await rate.update(req.body);

      res.json({
        success: true,
        message: 'Billing rate updated successfully',
        data: rate
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBillingRate(req, res, next) {
    try {
      const rate = await BillingRate.findByPk(req.params.id);

      if (!rate) {
        return res.status(404).json({
          success: false,
          error: 'Billing rate not found'
        });
      }

      // Soft delete by setting is_active to false
      await rate.update({ is_active: false });

      res.json({
        success: true,
        message: 'Billing rate deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BillingController();

// Made with Bob
