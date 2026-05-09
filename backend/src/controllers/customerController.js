const { Customer, District, User, Bill, Payment, WaterUsage } = require('../models/mysql');
const { Op } = require('sequelize');

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
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const customer = await Customer.findByPk(req.params.id, {
        include: [{ model: District }, { model: User }]
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
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
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
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
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      await customer.update(req.body);
      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      await customer.destroy();
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getBills(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const where = { account_number: accountNumber };
      if (status) where.payment_status = status;

      const { count, rows } = await Bill.findAndCountAll({
        where,
        include: [{ model: WaterUsage }],
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

  async getPayments(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Payment.findAndCountAll({
        where: { account_number: accountNumber },
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

  async getUsageHistory(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const { months = 12 } = req.query;

      const usages = await WaterUsage.findAll({
        where: { account_number: accountNumber },
        limit: parseInt(months),
        order: [['reading_year', 'DESC'], ['reading_month', 'DESC']]
      });

      res.json({
        success: true,
        data: usages
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();

// Made with Bob
