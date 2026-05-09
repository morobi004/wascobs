const { DataTypes } = require('sequelize');
const { mysqlDB } = require('../../config/database');

const Customer = mysqlDB.define('customers', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  account_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  meter_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  customer_type: {
    type: DataTypes.ENUM('residential', 'commercial', 'industrial', 'government'),
    allowNull: false,
    defaultValue: 'residential'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  district_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'districts',
      key: 'district_id'
    }
  },
  connection_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['account_number'] },
    { fields: ['meter_number'] },
    { fields: ['district_id'] },
    { fields: ['customer_type'] },
    { fields: ['status'] }
  ]
});

module.exports = Customer;

// Made with Bob
