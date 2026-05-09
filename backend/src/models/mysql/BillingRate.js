const { DataTypes } = require('sequelize');
const { mysqlDB } = require('../../config/database');

const BillingRate = mysqlDB.define('billing_rates', {
  rate_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_type: {
    type: DataTypes.ENUM('residential', 'commercial', 'industrial', 'government'),
    allowNull: false
  },
  tier_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  min_usage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  max_usage: {
    type: DataTypes.DECIMAL(10, 2)
  },
  rate_per_unit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  effective_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['customer_type'] },
    { fields: ['effective_date'] },
    { fields: ['is_active'] }
  ]
});

module.exports = BillingRate;

// Made with Bob
