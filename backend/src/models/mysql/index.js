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

Customer.hasMany(WaterUsage, { foreignKey: 'customer_id', sourceKey: 'customer_id' });
WaterUsage.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'customer_id' });

Customer.hasMany(Bill, { foreignKey: 'customer_id', sourceKey: 'customer_id' });
Bill.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'customer_id' });

WaterUsage.hasOne(Bill, { foreignKey: 'usage_id' });
Bill.belongsTo(WaterUsage, { foreignKey: 'usage_id' });

Bill.hasMany(Payment, { foreignKey: 'bill_id' });
Payment.belongsTo(Bill, { foreignKey: 'bill_id' });

Customer.hasMany(Payment, { foreignKey: 'customer_id', sourceKey: 'customer_id' });
Payment.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'customer_id' });

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
