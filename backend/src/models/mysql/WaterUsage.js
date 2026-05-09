const { DataTypes } = require('sequelize');
const { mysqlDB } = require('../../config/database');

const WaterUsage = mysqlDB.define('water_usage', {
  usage_id: {
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
  reading_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  meter_reading: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  previous_reading: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  consumption: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  reading_type: {
    type: DataTypes.ENUM('actual', 'estimated'),
    defaultValue: 'actual'
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
    { fields: ['reading_date'] },
    { fields: ['reading_type'] },
    { fields: ['customer_id', 'reading_date'], unique: true }
  ]
});

module.exports = WaterUsage;

// Made with Bob
