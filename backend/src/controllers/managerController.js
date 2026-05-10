const { sequelize, postgresSequelize } = require('../config/database');
const { Op } = require('sequelize');

class ManagerController {
  // OLAP Analytics - Daily, Weekly, Monthly, Quarterly, Yearly

  async getDailyAnalytics(req, res, next) {
    try {
      const { start_date, end_date, district_id } = req.query;

      let query = `
        SELECT 
          DATE(payment_date) as date,
          COUNT(DISTINCT account_number) as unique_customers,
          COUNT(*) as transaction_count,
          SUM(payment_amount) as total_revenue,
          AVG(payment_amount) as avg_transaction,
          MIN(payment_amount) as min_transaction,
          MAX(payment_amount) as max_transaction
        FROM payments
        WHERE payment_status = 'completed'
      `;

      const params = [];

      if (start_date && end_date) {
        query += ` AND DATE(payment_date) BETWEEN ? AND ?`;
        params.push(start_date, end_date);
      } else {
        query += ` AND DATE(payment_date) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
      }

      if (district_id) {
        query += ` AND account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY DATE(payment_date) ORDER BY date DESC`;

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

  async getWeeklyAnalytics(req, res, next) {
    try {
      const { year, district_id } = req.query;
      const currentYear = year || new Date().getFullYear();

      let query = `
        SELECT 
          YEAR(payment_date) as year,
          WEEK(payment_date) as week,
          DATE(DATE_SUB(payment_date, INTERVAL WEEKDAY(payment_date) DAY)) as week_start,
          COUNT(DISTINCT account_number) as unique_customers,
          COUNT(*) as transaction_count,
          SUM(payment_amount) as total_revenue,
          AVG(payment_amount) as avg_transaction
        FROM payments
        WHERE payment_status = 'completed'
        AND YEAR(payment_date) = ?
      `;

      const params = [currentYear];

      if (district_id) {
        query += ` AND account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY YEAR(payment_date), WEEK(payment_date) ORDER BY year DESC, week DESC`;

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

  async getMonthlyAnalytics(req, res, next) {
    try {
      const { year, district_id } = req.query;
      const currentYear = year || new Date().getFullYear();

      let query = `
        SELECT 
          YEAR(payment_date) as year,
          MONTH(payment_date) as month,
          DATE_FORMAT(payment_date, '%Y-%m') as period,
          COUNT(DISTINCT account_number) as unique_customers,
          COUNT(*) as transaction_count,
          SUM(payment_amount) as total_revenue,
          AVG(payment_amount) as avg_transaction
        FROM payments
        WHERE payment_status = 'completed'
        AND YEAR(payment_date) = ?
      `;

      const params = [currentYear];

      if (district_id) {
        query += ` AND account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY YEAR(payment_date), MONTH(payment_date) ORDER BY year DESC, month DESC`;

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

  async getQuarterlyAnalytics(req, res, next) {
    try {
      const { year, district_id } = req.query;
      const currentYear = year || new Date().getFullYear();

      let query = `
        SELECT 
          YEAR(payment_date) as year,
          QUARTER(payment_date) as quarter,
          CONCAT(YEAR(payment_date), '-Q', QUARTER(payment_date)) as period,
          COUNT(DISTINCT account_number) as unique_customers,
          COUNT(*) as transaction_count,
          SUM(payment_amount) as total_revenue,
          AVG(payment_amount) as avg_transaction
        FROM payments
        WHERE payment_status = 'completed'
        AND YEAR(payment_date) = ?
      `;

      const params = [currentYear];

      if (district_id) {
        query += ` AND account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY YEAR(payment_date), QUARTER(payment_date) ORDER BY year DESC, quarter DESC`;

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

  async getYearlyAnalytics(req, res, next) {
    try {
      const { district_id } = req.query;

      let query = `
        SELECT 
          YEAR(payment_date) as year,
          COUNT(DISTINCT account_number) as unique_customers,
          COUNT(*) as transaction_count,
          SUM(payment_amount) as total_revenue,
          AVG(payment_amount) as avg_transaction
        FROM payments
        WHERE payment_status = 'completed'
      `;

      const params = [];

      if (district_id) {
        query += ` AND account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY YEAR(payment_date) ORDER BY year DESC`;

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

  // Water Usage Analytics
  async getUsageAnalytics(req, res, next) {
    try {
      const { period = 'monthly', year, district_id } = req.query;
      const currentYear = year || new Date().getFullYear();

      let query = `
        SELECT 
          wu.reading_year as year,
          wu.reading_month as month,
          c.connection_type,
          COUNT(DISTINCT wu.account_number) as customer_count,
          SUM(wu.consumption) as total_consumption,
          AVG(wu.consumption) as avg_consumption,
          MAX(wu.consumption) as max_consumption,
          MIN(wu.consumption) as min_consumption
        FROM water_usage wu
        JOIN customers c ON wu.account_number = c.account_number
        WHERE wu.reading_year = ?
      `;

      const params = [currentYear];

      if (district_id) {
        query += ` AND c.district_id = ?`;
        params.push(district_id);
      }

      query += ` GROUP BY wu.reading_year, wu.reading_month, c.connection_type 
                 ORDER BY wu.reading_year DESC, wu.reading_month DESC`;

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

  // Customer Segmentation Analytics
  async getCustomerSegmentation(req, res, next) {
    try {
      const { district_id } = req.query;

      let query = `
        SELECT 
          c.connection_type,
          d.district_name as district_name,
          COUNT(c.customer_id) as customer_count,
          COUNT(CASE WHEN c.is_active = 1 THEN 1 END) as active_count,
          COUNT(CASE WHEN c.is_active = 0 THEN 1 END) as inactive_count,
          AVG(COALESCE(wu.avg_consumption, 0)) as avg_consumption,
          SUM(COALESCE(b.outstanding, 0)) as total_outstanding
        FROM customers c
        JOIN districts d ON c.district_id = d.district_id
        LEFT JOIN (
          SELECT account_number, AVG(consumption) as avg_consumption
          FROM water_usage
          WHERE reading_year = YEAR(CURDATE())
          GROUP BY account_number
        ) wu ON c.account_number = wu.account_number
        LEFT JOIN (
          SELECT account_number, SUM(total_amount) as outstanding
          FROM bills
          WHERE payment_status IN ('pending', 'overdue')
          GROUP BY account_number
        ) b ON c.account_number = b.account_number
      `;

      const params = [];

      if (district_id) {
        query += ` WHERE c.district_id = ?`;
        params.push(district_id);
      }

      query += ` GROUP BY c.connection_type, d.name ORDER BY customer_count DESC`;

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

  // Payment Trends
  async getPaymentTrends(req, res, next) {
    try {
      const { months = 12, district_id } = req.query;

      let query = `
        SELECT 
          DATE_FORMAT(payment_date, '%Y-%m') as period,
          payment_method,
          COUNT(*) as transaction_count,
          SUM(amount) as total_amount,
          AVG(amount) as avg_amount
        FROM payments
        WHERE payment_status = 'completed'
        AND payment_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      `;

      const params = [parseInt(months)];

      if (district_id) {
        query += ` AND account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY DATE_FORMAT(payment_date, '%Y-%m'), payment_method 
                 ORDER BY period DESC, payment_method`;

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

  // Outstanding Bills Analysis
  async getOutstandingAnalysis(req, res, next) {
    try {
      const { district_id } = req.query;

      let query = `
        SELECT 
          d.name as district_name,
          c.connection_type,
          COUNT(DISTINCT b.account_number) as customers_with_outstanding,
          COUNT(b.id) as outstanding_bill_count,
          SUM(b.total_amount) as total_outstanding,
          AVG(b.total_amount) as avg_outstanding,
          SUM(CASE WHEN b.payment_status = 'overdue' THEN b.total_amount ELSE 0 END) as overdue_amount,
          COUNT(CASE WHEN b.payment_status = 'overdue' THEN 1 END) as overdue_count
        FROM bills b
        JOIN customers c ON b.account_number = c.account_number
        JOIN districts d ON c.district_id = d.id
        WHERE b.payment_status IN ('pending', 'overdue')
      `;

      const params = [];

      if (district_id) {
        query += ` AND c.district_id = ?`;
        params.push(district_id);
      }

      query += ` GROUP BY d.name, c.connection_type ORDER BY total_outstanding DESC`;

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

  // Top Consumers
  async getTopConsumers(req, res, next) {
    try {
      const { limit = 10, year, month, district_id } = req.query;
      const currentYear = year || new Date().getFullYear();
      const currentMonth = month || new Date().getMonth() + 1;

      let query = `
        SELECT 
          wu.account_number,
          c.first_name,
          c.last_name,
          c.connection_type,
          d.name as district_name,
          wu.consumption,
          wu.meter_reading as current_reading,
          wu.previous_reading
        FROM water_usage wu
        JOIN customers c ON wu.account_number = c.account_number
        JOIN districts d ON c.district_id = d.id
        WHERE wu.reading_year = ? AND wu.reading_month = ?
      `;

      const params = [currentYear, currentMonth];

      if (district_id) {
        query += ` AND c.district_id = ?`;
        params.push(district_id);
      }

      query += ` ORDER BY wu.consumption DESC LIMIT ?`;
      params.push(parseInt(limit));

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

  // Revenue Forecast
  async getRevenueForecast(req, res, next) {
    try {
      const { district_id } = req.query;

      let query = `
        SELECT 
          DATE_FORMAT(payment_date, '%Y-%m') as period,
          SUM(amount) as actual_revenue,
          COUNT(*) as transaction_count,
          AVG(amount) as avg_transaction
        FROM payments
        WHERE payment_status = 'completed'
        AND payment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      `;

      const params = [];

      if (district_id) {
        query += ` AND account_number IN (
          SELECT account_number FROM customers WHERE district_id = ?
        )`;
        params.push(district_id);
      }

      query += ` GROUP BY DATE_FORMAT(payment_date, '%Y-%m') ORDER BY period`;

      const results = await sequelize.query(query, {
        replacements: params,
        type: sequelize.QueryTypes.SELECT
      });

      // Calculate simple moving average for forecast
      if (results.length >= 3) {
        const lastThreeMonths = results.slice(-3);
        const avgRevenue = lastThreeMonths.reduce((sum, r) => sum + parseFloat(r.actual_revenue), 0) / 3;
        
        results.push({
          period: 'Forecast',
          actual_revenue: null,
          forecasted_revenue: avgRevenue.toFixed(2),
          transaction_count: null,
          avg_transaction: null
        });
      }

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  // District Comparison
  async getDistrictComparison(req, res, next) {
    try {
      const { year, month } = req.query;
      const currentYear = year || new Date().getFullYear();
      const currentMonth = month || new Date().getMonth() + 1;

      const query = `
        SELECT 
          d.name as district_name,
          COUNT(DISTINCT c.id) as total_customers,
          COUNT(DISTINCT CASE WHEN c.is_active = 1 THEN c.id END) as active_customers,
          COALESCE(SUM(wu.consumption), 0) as total_consumption,
          COALESCE(AVG(wu.consumption), 0) as avg_consumption,
          COALESCE(SUM(b.total_amount), 0) as total_billed,
          COALESCE(SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount ELSE 0 END), 0) as total_collected,
          COALESCE(SUM(CASE WHEN b.payment_status IN ('pending', 'overdue') THEN b.total_amount ELSE 0 END), 0) as total_outstanding
        FROM districts d
        LEFT JOIN customers c ON d.id = c.district_id
        LEFT JOIN water_usage wu ON c.account_number = wu.account_number 
          AND wu.reading_year = ? AND wu.reading_month = ?
        LEFT JOIN bills b ON c.account_number = b.account_number 
          AND b.billing_year = ? AND b.billing_month = ?
        GROUP BY d.id, d.name
        ORDER BY d.name
      `;

      const results = await sequelize.query(query, {
        replacements: [currentYear, currentMonth, currentYear, currentMonth],
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

module.exports = new ManagerController();

// Made with Bob
