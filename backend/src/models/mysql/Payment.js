const { DataTypes } = require('sequelize');
const { mysqlDB } = require('../../config/database');

const Payment = mysqlDB.define('payments', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bills',
      key: 'bill_id'
    }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customer_id'
    }
  },
  payment_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'card', 'mobile_money', 'bank_transfer', 'online'),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  transaction_id: {
    type: DataTypes.STRING(100)
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['customer_id'] },
    { fields: ['bill_id'] },
    { fields: ['payment_date'] },
    { fields: ['payment_status'] },
    { fields: ['payment_reference'] }
  ]
});

module.exports = Payment;

// Made with Bob
