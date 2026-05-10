const { mysqlDB, postgresDB } = require('../config/database');
const bcrypt = require('bcryptjs');
const { User, District, Customer, BillingRate, WaterUsage, Bill, Payment } = require('../models/mysql');

class DatabaseSeeder {
  constructor() {
    this.sampleData = {
      districts: [
        { district_id: 1, district_name: 'Central District', region: 'Central' },
        { district_id: 2, district_name: 'North District', region: 'North' },
        { district_id: 3, district_name: 'South District', region: 'South' },
        { district_id: 4, district_name: 'East District', region: 'East' },
        { district_id: 5, district_name: 'West District', region: 'West' }
      ],
      users: [
        { username: 'admin', email: 'admin@wasco.com', password: 'Admin123!', role: 'administrator', full_name: 'System Administrator', first_name: 'System', last_name: 'Administrator' },
        { username: 'manager', email: 'manager@wasco.com', password: 'Manager123!', role: 'branch_manager', full_name: 'District Manager', first_name: 'District', last_name: 'Manager' },
        { username: 'johnreader', email: 'reader1@wasco.com', password: 'Reader123!', role: 'customer', full_name: 'John Reader', first_name: 'John', last_name: 'Reader' },
        { username: 'janereader', email: 'reader2@wasco.com', password: 'Reader123!', role: 'customer', full_name: 'Jane Reader', first_name: 'Jane', last_name: 'Reader' },
        { username: 'abccompany', email: 'contact@abccompany.com', password: 'Reader123!', role: 'customer', full_name: 'ABC Company Ltd', first_name: 'ABC', last_name: 'Company' },
        { username: 'industrial', email: 'contact@industrial.com', password: 'Reader123!', role: 'customer', full_name: 'Industrial Zone', first_name: 'Industrial', last_name: 'Zone' }
      ],
      billingRates: [
        { rate_tier: 'Residential Basic', connection_type: 'residential', usage_range_min: 0, usage_range_max: 20, cost_per_unit: 15.50, fixed_charge: 50.00, sewerage_charge_percentage: 25.0, vat_percentage: 16.0 },
        { rate_tier: 'Residential Standard', connection_type: 'residential', usage_range_min: 21, usage_range_max: 50, cost_per_unit: 22.00, fixed_charge: 50.00, sewerage_charge_percentage: 25.0, vat_percentage: 16.0 },
        { rate_tier: 'Residential Premium', connection_type: 'residential', usage_range_min: 51, usage_range_max: null, cost_per_unit: 35.00, fixed_charge: 50.00, sewerage_charge_percentage: 25.0, vat_percentage: 16.0 },
        { rate_tier: 'Commercial Basic', connection_type: 'commercial', usage_range_min: 0, usage_range_max: 100, cost_per_unit: 45.00, fixed_charge: 150.00, sewerage_charge_percentage: 30.0, vat_percentage: 16.0 },
        { rate_tier: 'Commercial Premium', connection_type: 'commercial', usage_range_min: 101, usage_range_max: null, cost_per_unit: 65.00, fixed_charge: 150.00, sewerage_charge_percentage: 30.0, vat_percentage: 16.0 },
        { rate_tier: 'Industrial', connection_type: 'industrial', usage_range_min: 0, usage_range_max: null, cost_per_unit: 85.00, fixed_charge: 500.00, sewerage_charge_percentage: 35.0, vat_percentage: 16.0 }
      ],
      customers: [
        { account_number: 'WASCO001', user_email: 'reader1@wasco.com', meter_number: 'M001', customer_type: 'residential', address: '123 Main St, Nairobi', district_id: 1, connection_date: '2023-01-15', status: 'active' },
        { account_number: 'WASCO002', user_email: 'reader2@wasco.com', meter_number: 'M002', customer_type: 'residential', address: '456 Oak Ave, Nairobi', district_id: 1, connection_date: '2023-02-20', status: 'active' },
        { account_number: 'WASCO003', user_email: 'contact@abccompany.com', meter_number: 'M003', customer_type: 'commercial', address: '789 Business Park, Nairobi', district_id: 2, connection_date: '2023-03-10', status: 'active' },
        { account_number: 'WASCO004', user_email: 'contact@industrial.com', meter_number: 'M004', customer_type: 'industrial', address: '321 Industrial Zone, Nairobi', district_id: 3, connection_date: '2023-04-05', status: 'active' }
      ]
    };
  }

  async seed() {
    try {
      console.log('Starting database seeding...');

      // Seed MySQL data
      await this.seedMySQL();

      // Seed PostgreSQL analytics data
      await this.seedPostgreSQL();

      console.log('Seeding completed successfully!');
      return { success: true, message: 'Seeding completed successfully' };

    } catch (error) {
      console.error('Seeding failed:', error);
      return { success: false, error: error.message };
    }
  }

  async seedMySQL() {
    try {
      console.log('Seeding MySQL database...');

      // Seed districts
      for (const district of this.sampleData.districts) {
        await District.findOrCreate({
          where: { district_id: district.district_id },
          defaults: district
        });
      }
      console.log('Districts seeded');

      // Seed users
      for (const user of this.sampleData.users) {
        await User.findOrCreate({
          where: { email: user.email },
          defaults: {
            username: user.username,
            email: user.email,
            password_hash: user.password, // Don't hash here, let the model hook do it
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name
          }
        });
      }
      console.log('Users seeded');

      // Seed billing rates
      // Temporarily commented out due to schema mismatch
      /*
      for (const rate of this.sampleData.billingRates) {
        await BillingRate.findOrCreate({
          where: {
            rate_tier: rate.rate_tier,
            connection_type: rate.connection_type,
            usage_range_min: rate.usage_range_min
          },
          defaults: rate
        });
      }
      console.log('Billing rates seeded');
      */

      // Seed customers
      for (const customer of this.sampleData.customers) {
        // Get user_id for customer if user_email is provided
        let userId = null;
        if (customer.user_email) {
          const user = await User.findOne({ where: { email: customer.user_email } });
          userId = user ? user.user_id : null;
        }

        await Customer.findOrCreate({
          where: { account_number: customer.account_number },
          defaults: {
            account_number: customer.account_number,
            user_id: userId,
            meter_number: customer.meter_number,
            customer_type: customer.customer_type,
            address: customer.address,
            district_id: customer.district_id,
            connection_date: customer.connection_date,
            status: customer.status
          }
        });
      }
      console.log('Customers seeded');

      // Generate sample water usage data
      // TODO: Fix schema mismatch for water_usage table
      // await this.generateSampleUsageData();

      console.log('MySQL seeding completed');
    } catch (error) {
      console.error('MySQL seeding failed:', error);
      throw error;
    }
  }

  async generateSampleUsageData() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Generate 6 months of usage data for each customer
    for (const customerData of this.sampleData.customers) {
      // Get the actual customer_id from database
      const customer = await Customer.findOne({ where: { account_number: customerData.account_number } });
      if (!customer) continue;

      let previousReading = Math.floor(Math.random() * 100) + 50; // Initial reading

      for (let month = currentMonth - 5; month <= currentMonth; month++) {
        let year = currentYear;
        let mutableMonth = month;
        if (mutableMonth <= 0) {
          mutableMonth += 12;
          year -= 1;
        }

        const consumption = Math.floor(Math.random() * 30) + 10; // 10-40 units
        const currentReading = previousReading + consumption;

        await WaterUsage.findOrCreate({
          where: {
            customer_id: customer.customer_id,
            reading_date: new Date(year, mutableMonth - 1, 15)
          },
          defaults: {
            customer_id: customer.customer_id,
            reading_date: new Date(year, mutableMonth - 1, 15),
            meter_reading: currentReading.toFixed(2),
            previous_reading: previousReading.toFixed(2),
            consumption: consumption.toFixed(2),
            reading_type: 'actual'
          }
        });

        previousReading = currentReading;
      }
    }

    console.log('Sample usage data generated');
  }

  async seedPostgreSQL() {
    try {
      console.log('Seeding PostgreSQL analytics database...');

      // Create some sample analytics data
      const sampleAnalytics = {
        customer_analytics: [
          { account_number: 'WASCO001', customer_name: 'John Doe', district_id: 1, district_name: 'Central District', connection_type: 'residential', total_consumption: 450.50, total_bills: 1350.00, total_payments: 1350.00, outstanding_balance: 0.00, average_monthly_consumption: 75.08, payment_behavior: 'excellent', last_payment_date: new Date(), customer_since: new Date('2023-01-15') },
          { account_number: 'WASCO002', customer_name: 'Jane Smith', district_id: 1, district_name: 'Central District', connection_type: 'residential', total_consumption: 380.25, total_bills: 1100.00, total_payments: 1100.00, outstanding_balance: 0.00, average_monthly_consumption: 63.38, payment_behavior: 'excellent', last_payment_date: new Date(), customer_since: new Date('2023-02-20') },
          { account_number: 'WASCO003', customer_name: 'ABC Company Ltd', district_id: 2, district_name: 'North District', connection_type: 'commercial', total_consumption: 1200.75, total_bills: 5800.00, total_payments: 5800.00, outstanding_balance: 0.00, average_monthly_consumption: 200.13, payment_behavior: 'excellent', last_payment_date: new Date(), customer_since: new Date('2023-03-10') }
        ]
      };

      // Insert sample customer analytics
      for (const customer of sampleAnalytics.customer_analytics) {
        await postgresDB.query(`
          INSERT INTO customer_analytics (
            account_number, customer_name, district_id, district_name,
            connection_type, total_consumption, total_bills, total_payments,
            outstanding_balance, average_monthly_consumption, payment_behavior,
            last_payment_date, customer_since
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (account_number) DO NOTHING
        `, [
          customer.account_number, customer.customer_name, customer.district_id,
          customer.district_name, customer.connection_type, customer.total_consumption,
          customer.total_bills, customer.total_payments, customer.outstanding_balance,
          customer.average_monthly_consumption, customer.payment_behavior,
          customer.last_payment_date, customer.customer_since
        ]);
      }

      console.log('PostgreSQL seeding completed');
    } catch (error) {
      console.error('PostgreSQL seeding failed:', error);
      throw error;
    }
  }

  async clear() {
    try {
      console.log('Clearing database data...');

      // Clear MySQL data (in reverse order of dependencies)
      await mysqlDB.query('DELETE FROM payments');
      await mysqlDB.query('DELETE FROM bills');
      await mysqlDB.query('DELETE FROM water_usage');
      await mysqlDB.query('DELETE FROM customers');
      await mysqlDB.query('DELETE FROM billing_rates');
      await mysqlDB.query('DELETE FROM users');
      await mysqlDB.query('DELETE FROM districts');

      // Clear PostgreSQL data
      await postgresDB.query('DELETE FROM customer_analytics');
      await postgresDB.query('DELETE FROM usage_analytics');
      await postgresDB.query('DELETE FROM district_analytics');
      await postgresDB.query('DELETE FROM revenue_analytics');
      await postgresDB.query('DELETE FROM payment_trends');
      await postgresDB.query('DELETE FROM consumption_patterns');

      console.log('Database cleared successfully');
      return { success: true, message: 'Database cleared successfully' };

    } catch (error) {
      console.error('Clearing failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Run seeder if called directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();

  const command = process.argv[2];

  if (command === 'clear') {
    seeder.clear().then(result => {
      console.log('Clear result:', result);
      process.exit(result.success ? 0 : 1);
    });
  } else {
    seeder.seed().then(result => {
      console.log('Seed result:', result);
      process.exit(result.success ? 0 : 1);
    });
  }
}

module.exports = DatabaseSeeder;

// Made with Bob