const { mysqlDB } = require('../config/database');
const { BillingRate, WaterUsage, Bill, Customer } = require('../models/mysql');
const { Op } = require('sequelize');

class BillCalculationService {
  async calculateBillForUsage(usageId) {
    const usage = await WaterUsage.findByPk(usageId, {
      include: [{ model: Customer, include: ['District'] }]
    });

    if (!usage) {
      throw new Error('Usage record not found');
    }

    const consumption = usage.meter_reading - usage.previous_reading;
    const connectionType = usage.Customer.connection_type;

    const rate = await BillingRate.findOne({
      where: {
        connection_type: connectionType,
        usage_range_min: { [Op.lte]: consumption },
        [Op.or]: [
          { usage_range_max: { [Op.gte]: consumption } },
          { usage_range_max: null }
        ],
        is_active: true,
        effective_from: { [Op.lte]: new Date() },
        [Op.or]: [
          { effective_to: { [Op.gte]: new Date() } },
          { effective_to: null }
        ]
      },
      order: [['effective_from', 'DESC']]
    });

    if (!rate) {
      throw new Error('No applicable billing rate found');
    }

    const waterCharge = consumption * parseFloat(rate.cost_per_unit);
    const sewerageCharge = waterCharge * (parseFloat(rate.sewerage_charge_percentage) / 100);
    const fixedCharge = parseFloat(rate.fixed_charge);
    const subtotal = waterCharge + sewerageCharge + fixedCharge;
    const vatAmount = subtotal * (parseFloat(rate.vat_percentage) / 100);
    const totalAmount = subtotal + vatAmount;

    return {
      consumption,
      waterCharge: waterCharge.toFixed(2),
      sewerageCharge: sewerageCharge.toFixed(2),
      fixedCharge: fixedCharge.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      rate: {
        tier: rate.rate_tier,
        costPerUnit: rate.cost_per_unit
      }
    };
  }

  async generateBillForUsage(usageId, generatedBy) {
    const usage = await WaterUsage.findByPk(usageId, {
      include: [Customer]
    });

    if (!usage) {
      throw new Error('Usage record not found');
    }

    const existingBill = await Bill.findOne({
      where: {
        account_number: usage.account_number,
        billing_month: usage.reading_month,
        billing_year: usage.reading_year
      }
    });

    if (existingBill) {
      throw new Error('Bill already exists for this period');
    }

    const calculation = await this.calculateBillForUsage(usageId);

    const previousBalance = await this.getPreviousBalance(usage.account_number);

    const dueDate = new Date(usage.reading_year, usage.reading_month, 15);

    const billNumber = `WASCO-${usage.reading_year}${String(usage.reading_month).padStart(2, '0')}-${String(usageId).padStart(6, '0')}`;

    const bill = await Bill.create({
      account_number: usage.account_number,
      bill_number: billNumber,
      billing_month: usage.reading_month,
      billing_year: usage.reading_year,
      usage_id: usageId,
      consumption: calculation.consumption,
      water_charge: calculation.waterCharge,
      sewerage_charge: calculation.sewerageCharge,
      fixed_charge: calculation.fixedCharge,
      vat_amount: calculation.vatAmount,
      total_amount: calculation.totalAmount,
      previous_balance: previousBalance,
      due_date: dueDate,
      generated_by: generatedBy
    });

    return bill;
  }

  async getPreviousBalance(accountNumber) {
    const result = await Bill.sum('balance', {
      where: {
        account_number: accountNumber,
        payment_status: { [Op.in]: ['unpaid', 'partial', 'overdue'] }
      }
    });

    return result || 0;
  }

  async generateMonthlyBills(month, year, generatedBy) {
    const usages = await WaterUsage.findAll({
      where: {
        reading_month: month,
        reading_year: year,
        reading_status: 'verified'
      }
    });

    const results = {
      success: [],
      failed: []
    };

    for (const usage of usages) {
      try {
        const bill = await this.generateBillForUsage(usage.usage_id, generatedBy);
        results.success.push({
          usage_id: usage.usage_id,
          bill_id: bill.bill_id,
          account_number: usage.account_number
        });
      } catch (error) {
        results.failed.push({
          usage_id: usage.usage_id,
          account_number: usage.account_number,
          error: error.message
        });
      }
    }

    return results;
  }

  async updateBillStatus() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Bill.update(
      { payment_status: 'overdue' },
      {
        where: {
          due_date: { [Op.lt]: today },
          payment_status: { [Op.in]: ['unpaid', 'partial'] }
        }
      }
    );
  }
}

module.exports = new BillCalculationService();

// Made with Bob
