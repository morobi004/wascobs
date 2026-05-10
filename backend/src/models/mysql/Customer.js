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
    type: DataTypes.STRING(20)
  },
  customer_type: {
    type: DataTypes.ENUM('residential', 'commercial', 'industrial', 'government'),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT
  },
  district_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'districts',
      key: 'district_id'
    }
  },
  connection_date: {
    type: DataTypes.DATEONLY
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
    { fields: ['user_id'] },
    { fields: ['district_id'] },
    { fields: ['customer_type'] },
    { fields: ['status'] }
  ]
});

// Associations
Customer.associate = (models) => {
  Customer.belongsTo(models.User, { foreignKey: 'user_id' });
  Customer.belongsTo(models.District, { foreignKey: 'district_id' });
  Customer.hasMany(models.WaterUsage, { foreignKey: 'account_number', sourceKey: 'account_number' });
  Customer.hasMany(models.Bill, { foreignKey: 'account_number', sourceKey: 'account_number' });
};

module.exports = Customer;

// Made with Bob
