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
  account_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'customers',
      key: 'account_number'
    }
  },
  payment_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'card', 'mobile_money', 'bank_transfer', 'online'),
    allowNull: false
  },
  payment_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  transaction_id: {
    type: DataTypes.STRING(100)
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING(100)
  },
  stripe_charge_id: {
    type: DataTypes.STRING(100)
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'),
    defaultValue: 'pending'
  },
  processed_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  receipt_number: {
    type: DataTypes.STRING(50)
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['payment_date'] },
    { fields: ['payment_status'] },
    { fields: ['account_number'] },
    { fields: ['bill_id'] },
    { fields: ['payment_reference'] },
    { fields: ['payment_method'] }
  ]
});

module.exports = Payment;

// Made with Bob
