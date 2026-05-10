import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../utils/api';

const CustomerPortal = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const [billsResponse, paymentsResponse, usageResponse] = await Promise.all([
          customerAPI.getBills(user?.user_id),
          customerAPI.getPayments(user?.user_id),
          customerAPI.getUsageHistory(user?.user_id)
        ]);

        const billsPayload = billsResponse.data?.data || billsResponse.data;
        const paymentsPayload = paymentsResponse.data?.data || paymentsResponse.data;
        const usagePayload = usageResponse.data?.data || usageResponse.data;

        setBills(Array.isArray(billsPayload?.bills) ? billsPayload.bills : Array.isArray(billsPayload) ? billsPayload : []);
        setPayments(Array.isArray(paymentsPayload?.payments) ? paymentsPayload.payments : Array.isArray(paymentsPayload) ? paymentsPayload : []);
        setUsageHistory(Array.isArray(usagePayload) ? usagePayload : usagePayload?.usageHistory || []);
      } catch (err) {
        setError('Unable to load your account data right now. Please try again later.');
      }
    };

    if (user?.user_id) {
      loadCustomerData();
    }
  }, [user]);

  return (
    <div className="customer-portal-page">
      <div className="page-header card">
        <h1>Customer Portal</h1>
        <p>Access your bills, payments, and water usage history.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="portal-grid">
        <div className="portal-card card">
          <h2>Latest Bills</h2>
          {bills.length === 0 ? (
            <p>No bills available yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {bills.slice(0, 5).map((bill) => (
                  <tr key={bill.bill_id || bill.id || bill.billNumber}>
                    <td>{bill.bill_number || bill.billNumber || 'N/A'}</td>
                    <td>{bill.total_amount ? `M${bill.total_amount}` : 'M0.00'}</td>
                    <td>{bill.status || 'pending'}</td>
                    <td>{bill.due_date || bill.billing_period_end || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="portal-card card">
          <h2>Recent Payments</h2>
          {payments.length === 0 ? (
            <p>No payment history available.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment.payment_id || payment.id || payment.reference}>
                    <td>{payment.payment_id || payment.id || payment.reference}</td>
                    <td>{payment.amount ? `M${payment.amount}` : 'M0.00'}</td>
                    <td>{payment.payment_method || payment.method || 'N/A'}</td>
                    <td>{payment.payment_date || payment.createdAt || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="portal-card card">
          <h2>Usage History</h2>
          {usageHistory.length === 0 ? (
            <p>No usage records found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Meter Reading</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.slice(0, 5).map((usage) => (
                  <tr key={usage.usage_id || usage.id || usage.reading_date}>
                    <td>{usage.reading_date || usage.date || 'N/A'}</td>
                    <td>{usage.meter_reading || usage.current_reading || 'N/A'}</td>
                    <td>{usage.usage_amount || usage.usage || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
