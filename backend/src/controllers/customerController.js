const { Customer, District, User, Bill, Payment, WaterUsage } = require('../models/mysql');
const { Op } = require('sequelize');

// Helper: decide which foreign key to use
function resolveCustomerKey(model) {
  if (model.rawAttributes.customer_id) return 'customer_id';
  if (model.rawAttributes.user_id) return 'user_id';
  return 'customer_id';
}

class CustomerController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, district_id, connection_type, is_active } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (district_id) where.district_id = district_id;
      if (connection_type) where.connection_type = connection_type;
      if (is_active !== undefined) where.is_active = is_active === 'true';

      const { count, rows } = await Customer.findAndCountAll({
        where,
        include: [{ model: District }, { model: User }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          customers: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const customer = await Customer.findByPk(req.params.id, {
        include: [{ model: District }, { model: User }]
      });

      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      res.json({ success: true, data: customer });
    } catch (error) {
      console.error('Error in getById:', error);
      next(error);
    }
  }

  async getByAccountNumber(req, res, next) {
    try {
      const customer = await Customer.findOne({
        where: { account_number: req.params.accountNumber },
        include: [{ model: District }, { model: User }]
      });

      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      res.json({ success: true, data: customer });
    } catch (error) {
      console.error('Error in getByAccountNumber:', error);
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error in create:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      await customer.update(req.body);
      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error in update:', error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      await customer.destroy();
      res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error in delete:', error);
      next(error);
    }
  }

  async getBills(req, res, next) {
    try {
      const { customerId } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const key = resolveCustomerKey(Bill);
      const where = { [key]: customerId };
      if (status) where.payment_status = status;

      const { count, rows } = await Bill.findAndCountAll({
        where,
        include: [{ model: WaterUsage }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['billing_period_end', 'DESC']]
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
      console.error('Error in getBills:', error);
      next(error);
    }
  }

  async getPayments(req, res, next) {
    try {
      const { customerId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const key = resolveCustomerKey(Payment);

      const { count, rows } = await Payment.findAndCountAll({
        where: { [key]: customerId },
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
      console.error('Error in getPayments:', error);
      next(error);
    }
  }

  async getUsageHistory(req, res, next) {
    try {
      const { customerId } = req.params;
      const { months = 12 } = req.query;

      const key = resolveCustomerKey(WaterUsage);

      const usages = await WaterUsage.findAll({
        where: { [key]: customerId },
        limit: parseInt(months),
        order: [['reading_date', 'DESC']]
      });

      res.json({ success: true, data: usages });
    } catch (error) {
      console.error('Error in getUsageHistory:', error);
      next(error);
    }
  }
}

module.exports = new CustomerController();
