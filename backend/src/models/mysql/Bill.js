const { DataTypes } = require('sequelize');
const { mysqlDB } = require('../../config/database');

const Bill = mysqlDB.define('bills', {
  bill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  account_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'customers',
      key: 'account_number'
    }
  },
  bill_number: {
    type: DataTypes.STRING(30),
    unique: true,
    allowNull: false
  },
  billing_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  billing_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usage_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'water_usage',
      key: 'usage_id'
    }
  },
  consumption: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  water_charge: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sewerage_charge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  fixed_charge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  vat_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  previous_balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  total_due: {
    type: DataTypes.VIRTUAL,
    get() {
      return parseFloat(this.total_amount) + parseFloat(this.previous_balance);
    }
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  balance: {
    type: DataTypes.VIRTUAL,
    get() {
      return parseFloat(this.total_amount) + parseFloat(this.previous_balance) - parseFloat(this.amount_paid);
    }
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'unpaid'
  },
  generated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  generated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['payment_status'] },
    { fields: ['due_date'] },
    { fields: ['billing_month', 'billing_year'] },
    { fields: ['account_number'] },
    { fields: ['bill_number'] },
    { fields: ['account_number', 'billing_month', 'billing_year'], unique: true }
  ]
});

module.exports = Bill;

// Made with Bob
