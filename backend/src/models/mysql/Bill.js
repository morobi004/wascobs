const { DataTypes } = require('sequelize');
const { mysqlDB } = require('../../config/database');

const Bill = mysqlDB.define('bills', {
  bill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customer_id'
    }
  },
  usage_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'water_usage',
      key: 'usage_id'
    }
  },
  bill_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  billing_period_start: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  billing_period_end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  consumption: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  base_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'overdue'),
    defaultValue: 'unpaid'
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['customer_id'] },
    { fields: ['bill_number'] },
    { fields: ['billing_period_end'] },
    { fields: ['due_date'] },
    { fields: ['payment_status'] }
  ]
});

module.exports = Bill;

// Made with Bob
