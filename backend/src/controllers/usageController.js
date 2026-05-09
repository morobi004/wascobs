const { WaterUsage, Customer, District } = require('../models/mysql');
const { Op } = require('sequelize');

class UsageController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, year, month, account_number } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (year) where.reading_year = year;
      if (month) where.reading_month = month;
      if (account_number) where.account_number = account_number;

      const { count, rows } = await WaterUsage.findAndCountAll({
        where,
        include: [{ model: Customer, include: [{ model: District }] }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['reading_year', 'DESC'], ['reading_month', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          usages: rows,
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
      const usage = await WaterUsage.findByPk(req.params.id, {
        include: [{ model: Customer, include: [{ model: District }] }]
      });

      if (!usage) {
        return res.status(404).json({
          success: false,
          error: 'Water usage record not found'
        });
      }

      res.json({
        success: true,
        data: usage
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const usage = await WaterUsage.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Water usage record created successfully',
        data: usage
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const usage = await WaterUsage.findByPk(req.params.id);

      if (!usage) {
        return res.status(404).json({
          success: false,
          error: 'Water usage record not found'
        });
      }

      await usage.update(req.body);

      res.json({
        success: true,
        message: 'Water usage record updated successfully',
        data: usage
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const usage = await WaterUsage.findByPk(req.params.id);

      if (!usage) {
        return res.status(404).json({
          success: false,
          error: 'Water usage record not found'
        });
      }

      await usage.destroy();

      res.json({
        success: true,
        message: 'Water usage record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getByAccountNumber(req, res, next) {
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

module.exports = new UsageController();

// Made with Bob
