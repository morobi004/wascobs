const User = require('./User');
const District = require('./District');
const Customer = require('./Customer');
const BillingRate = require('./BillingRate');
const WaterUsage = require('./WaterUsage');
const Bill = require('./Bill');
const Payment = require('./Payment');

// Define associations
User.hasMany(Customer, { foreignKey: 'user_id' });
Customer.belongsTo(User, { foreignKey: 'user_id' });

District.hasMany(Customer, { foreignKey: 'district_id' });
Customer.belongsTo(District, { foreignKey: 'district_id' });

Customer.hasMany(WaterUsage, { foreignKey: 'account_number', sourceKey: 'account_number' });
WaterUsage.belongsTo(Customer, { foreignKey: 'account_number', targetKey: 'account_number' });

Customer.hasMany(Bill, { foreignKey: 'account_number', sourceKey: 'account_number' });
Bill.belongsTo(Customer, { foreignKey: 'account_number', targetKey: 'account_number' });

WaterUsage.hasOne(Bill, { foreignKey: 'usage_id' });
Bill.belongsTo(WaterUsage, { foreignKey: 'usage_id' });

Bill.hasMany(Payment, { foreignKey: 'bill_id' });
Payment.belongsTo(Bill, { foreignKey: 'bill_id' });

Customer.hasMany(Payment, { foreignKey: 'account_number', sourceKey: 'account_number' });
Payment.belongsTo(Customer, { foreignKey: 'account_number', targetKey: 'account_number' });

User.hasMany(BillingRate, { foreignKey: 'created_by' });
BillingRate.belongsTo(User, { foreignKey: 'created_by' });

User.hasMany(WaterUsage, { foreignKey: 'meter_reader_id' });
WaterUsage.belongsTo(User, { as: 'MeterReader', foreignKey: 'meter_reader_id' });

User.hasMany(Bill, { foreignKey: 'generated_by' });
Bill.belongsTo(User, { as: 'Generator', foreignKey: 'generated_by' });

User.hasMany(Payment, { foreignKey: 'processed_by' });
Payment.belongsTo(User, { as: 'Processor', foreignKey: 'processed_by' });

module.exports = {
  User,
  District,
  Customer,
  BillingRate,
  WaterUsage,
  Bill,
  Payment
};

// Made with Bob
