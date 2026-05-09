const { DataTypes } = require('sequelize');
const { mysqlDB } = require('../../config/database');

const District = mysqlDB.define('districts', {
  district_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  district_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  district_code: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING(50)
  },
  population: {
    type: DataTypes.INTEGER
  },
  area_km2: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['district_code'] },
    { fields: ['district_name'] }
  ]
});

module.exports = District;

// Made with Bob
