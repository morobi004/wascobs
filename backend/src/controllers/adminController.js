const { Customer, User, Bill, Payment, BillingRate, WaterUsage, District } = require('../models/mysql');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class AdminController {
  // Dashboard Statistics
  async getDashboardStats(req, res, next) {
    try {
      const stats = await sequelize.query(`
        SELECT 
          (SELECT COUNT(*) FROM customers WHERE is_active = 1) as active_customers,
          (SELECT COUNT(*) FROM customers WHERE is_active = 0) as inactive_customers,
          (SELECT COUNT(*) FROM bills WHERE payment_status = 'pending') as pending_bills,
          (SELECT COUNT(*) FROM bills WHERE payment_status = 'overdue') as overdue_bills,
          (SELECT COUNT(*) FROM bills WHERE payment_status = 'paid') as paid_bills,
          (SELECT COALESCE(SUM(total_amount), 0) FROM bills WHERE payment_status IN ('pending', 'overdue')) as total_outstanding,
          (SELECT COALESCE(SUM(payment_amount), 0) FROM payments WHERE payment_status = 'completed' AND MONTH(payment_date) = MONTH(CURRENT_DATE)) as monthly_revenue,
          (SELECT COUNT(*) FROM users) as total_users
      `, { type: sequelize.QueryTypes.SELECT });

      res.json({
        success: true,
        data: stats[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // User Management
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (role) where.role = role;

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password_hash'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users: rows,
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

  async createUser(req, res, next) {
    try {
      const { email, password, role, full_name, phone_number } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        email,
        password_hash: hashedPassword,
        role,
        full_name,
        phone_number
      });

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password_hash;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // If password is being updated, hash it
      if (req.body.password) {
        req.body.password_hash = await bcrypt.hash(req.body.password, 10);
        delete req.body.password;
      }

      await user.update(req.body);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'User updated successfully',
        data: userResponse
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Prevent deleting own account
      if (user.id === req.user.id) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete your own account'
        });
      }

      await user.destroy();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Customer Management
  async getAllCustomers(req, res, next) {
    try {
      const { page = 1, limit = 10, district_id, connection_type, is_active, search } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (district_id) where.district_id = district_id;
      if (connection_type) where.connection_type = connection_type;
      if (is_active !== undefined) where.is_active = is_active === 'true';
      
      if (search) {
        where[Op.or] = [
          { account_number: { [Op.like]: `%${search}%` } },
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

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

  async createCustomer(req, res, next) {
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

  async updateCustomer(req, res, next) {
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

  async deleteCustomer(req, res, next) {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Check if customer has outstanding bills
      const outstandingBills = await Bill.count({
        where: {
          account_number: customer.account_number,
          payment_status: { [Op.in]: ['pending', 'overdue'] }
        }
      });

      if (outstandingBills > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete customer with outstanding bills'
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

  // Billing Rate Management
  async getAllBillingRates(req, res, next) {
    try {
      const rates = await BillingRate.findAll({
        order: [['connection_type', 'ASC'], ['usage_range_min', 'ASC']]
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

      // Soft delete
      await rate.update({ is_active: false });

      res.json({
        success: true,
        message: 'Billing rate deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Reports
  async getRevenueReport(req, res, next) {
    try {
      const { start_date, end_date, district_id } = req.query;

      let query = `
        SELECT 
          DATE_FORMAT(p.payment_date, '%Y-%m') as month,
          COUNT(p.payment_id) as payment_count,
          SUM(p.payment_amount) as total_revenue,
          AVG(p.payment_amount) as avg_payment
        FROM payments p
        WHERE p.payment_status = 'completed'
      `;

      const params = [];

      if (start_date && end_date) {
        query += ` AND p.payment_date BETWEEN ? AND ?`;
        params.push(start_date, end_date);
      }

      if (district_id) {
        query += ` AND p.account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY DATE_FORMAT(p.payment_date, '%Y-%m') ORDER BY month DESC`;

      const results = await sequelize.query(query, {
        replacements: params,
        type: sequelize.QueryTypes.SELECT
      });

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  async getConsumptionReport(req, res, next) {
    try {
      const { year, district_id } = req.query;

      let query = `
        SELECT 
          wu.reading_month as month,
          COUNT(DISTINCT wu.account_number) as customer_count,
          SUM(wu.consumption) as total_consumption,
          AVG(wu.consumption) as avg_consumption,
          MAX(wu.consumption) as max_consumption,
          MIN(wu.consumption) as min_consumption
        FROM water_usage wu
        JOIN customers c ON wu.account_number = c.account_number
        WHERE wu.reading_year = ?
      `;

      const params = [year || new Date().getFullYear()];

      if (district_id) {
        query += ` AND c.district_id = ?`;
        params.push(district_id);
      }

      query += ` GROUP BY wu.reading_month ORDER BY wu.reading_month`;

      const results = await sequelize.query(query, {
        replacements: params,
        type: sequelize.QueryTypes.SELECT
      });

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  async getDistrictReport(req, res, next) {
    try {
      const query = `
        SELECT 
          d.district_name as district_name,
          COUNT(DISTINCT c.customer_id) as customer_count,
          COUNT(DISTINCT CASE WHEN c.is_active = 1 THEN c.customer_id END) as active_customers,
          COUNT(DISTINCT b.bill_id) as total_bills,
          COALESCE(SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount ELSE 0 END), 0) as total_revenue,
          COALESCE(SUM(CASE WHEN b.payment_status IN ('pending', 'overdue') THEN b.total_amount ELSE 0 END), 0) as outstanding_amount
        FROM districts d
        LEFT JOIN customers c ON d.district_id = c.district_id
        LEFT JOIN bills b ON c.account_number = b.account_number
        GROUP BY d.district_id, d.district_name
        ORDER BY d.district_name
      `;

      const results = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
      });

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();

// Made with Bob
