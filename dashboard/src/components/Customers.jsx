import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatCurrency } from '../i18n';

const formatDate = (value, language, t) => {
  if (!value) return t.noOrdersYet;
  return new Date(value).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const segmentColors = {
  VIP: '#294126',
  Loyal: '#536d38',
  New: '#af8a29',
  'At risk': '#c23020',
  'No orders yet': '#6f7768'
};

const getAnalytics = (customers) => {
  const monthly = new Map();
  const items = new Map();
  const segments = new Map();

  customers.forEach((customer) => {
    customer.monthlyBreakdown.forEach((month) => {
      monthly.set(month.month, (monthly.get(month.month) || 0) + month.total);
    });

    customer.favoriteItems.forEach((item) => {
      const current = items.get(item.id) || { ...item, quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += item.revenue;
      items.set(item.id, current);
    });

    segments.set(customer.segment, (segments.get(customer.segment) || 0) + 1);
  });

  return {
    monthly: [...monthly.entries()].map(([month, total]) => ({ month, total })).sort((a, b) => a.month.localeCompare(b.month)),
    items: [...items.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
    segments: [...segments.entries()].map(([segment, count]) => ({ segment, count }))
  };
};

function BarList({ title, rows, valueKey, labelKey, formatValue, formatLabel = (value) => value }) {
  const max = Math.max(...rows.map(row => Number(row[valueKey] || 0)), 1);

  return (
    <div className="card" style={{ margin: 0, padding: '1.15rem' }}>
      <h3 style={{ color: '#294126', marginBottom: '1rem', fontSize: '1.05rem' }}>{title}</h3>
      {rows.length === 0 ? (
        <p style={{ color: '#626c5c' }}>No data yet</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {rows.map(row => (
            <div key={row[labelKey]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.3rem' }}>
                <strong style={{ color: '#294126', fontSize: '0.9rem' }}>{formatLabel(row[labelKey])}</strong>
                <span style={{ color: '#626c5c', fontSize: '0.86rem', fontWeight: 700 }}>{formatValue(row[valueKey])}</span>
              </div>
              <div style={{ height: '10px', background: '#edf0e6', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(5, (Number(row[valueKey] || 0) / max) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #f9ca3d, #c23020)', borderRadius: '999px' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Customers({ language = 'en', t }) {
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    axios.get('http://localhost:5000/api/customers/analytics')
      .then(res => {
        setSummary(res.data.summary);
        setCustomers(res.data.customers);
      })
      .catch(err => console.error(err));
  };

  const sortedCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent || b.totalOrders - a.totalOrders);
  const analytics = getAnalytics(sortedCustomers);
  const labels = t || {};
  const segmentLabel = (segment) => labels.segments?.[segment] || segment;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#294126', fontSize: '2rem' }}>
        {labels.customerDatabase}
      </h2>

      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          {[
            [labels.customers, summary.totalCustomers],
            [labels.payingCustomers, summary.payingCustomers],
            [labels.totalRevenue, formatCurrency(summary.totalRevenue)],
            [labels.avgCustomerValue, formatCurrency(summary.averageCustomerValue)],
            [labels.avgOrders, summary.averageOrdersPerCustomer],
            [labels.vipAtRisk, `${summary.vipCustomers} / ${summary.atRiskCustomers}`]
          ].map(([label, value]) => (
            <div key={label} className="card" style={{ margin: 0, padding: '1.1rem' }}>
              <p style={{ color: '#6f7768', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
                {label}
              </p>
              <strong style={{ color: '#294126', fontSize: '1.45rem' }}>{value}</strong>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginBottom: '1rem', color: '#294126', fontSize: '1.65rem' }}>
        {labels.visualAnalytics}
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <BarList title={labels.monthlySpend} rows={analytics.monthly} valueKey="total" labelKey="month" formatValue={formatCurrency} />
        <BarList title={labels.topCustomers} rows={sortedCustomers.slice(0, 5).map(customer => ({ name: customer.name, totalSpent: customer.totalSpent }))} valueKey="totalSpent" labelKey="name" formatValue={formatCurrency} />
        <BarList title={labels.customerSegments} rows={analytics.segments} valueKey="count" labelKey="segment" formatValue={(value) => value} formatLabel={segmentLabel} />
        <BarList title={labels.topItems} rows={analytics.items.map(item => ({ name: item.name, quantity: item.quantity }))} valueKey="quantity" labelKey="name" formatValue={(value) => `x${value}`} />
      </div>

      {sortedCustomers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#294126', marginBottom: '0.5rem' }}>{labels.noCustomers}</h3>
          <p style={{ color: '#626c5c' }}>{labels.noCustomersText}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {sortedCustomers.map(customer => (
            <div key={customer.customerId} className="card" style={{ padding: '1.35rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
                paddingBottom: '1rem',
                borderBottom: '1px solid #dce1d6',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{ color: '#294126', fontSize: '1.45rem', marginBottom: '0.3rem' }}>{customer.name}</h3>
                  <p style={{ color: '#626c5c', lineHeight: 1.6 }}>{customer.email}</p>
                  <p style={{ color: '#626c5c', lineHeight: 1.6 }}>{customer.phone || 'No phone number'}</p>
                </div>
                <span style={{
                  alignSelf: 'flex-start',
                  background: segmentColors[customer.segment],
                  color: 'white',
                  borderRadius: '999px',
                  padding: '0.45rem 0.9rem',
                  fontWeight: 800
                }}>
                  {segmentLabel(customer.segment)}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.9rem',
                marginBottom: '1rem'
              }}>
                {[
                  [labels.totalSpent, formatCurrency(customer.totalSpent)],
                  [labels.orders, customer.totalOrders],
                  [labels.averageOrder, formatCurrency(customer.averageOrderValue)],
                  [labels.monthlyAvg, formatCurrency(customer.averageMonthlySpend)],
                  [labels.frequency, customer.orderFrequencyDays ? labels.everyDays(customer.orderFrequencyDays) : labels.notEnoughOrders],
                  [labels.lastOrder, formatDate(customer.latestOrderAt, language, labels)]
                ].map(([label, value]) => (
                  <div key={label} style={{
                    background: '#edf0e6',
                    border: '1px solid #dce1d6',
                    borderRadius: '10px',
                    padding: '0.9rem'
                  }}>
                    <p style={{ color: '#6f7768', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>{label}</p>
                    <strong style={{ color: '#294126' }}>{value}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#fffefa', border: '1px solid #dce1d6', borderRadius: '10px', padding: '1rem' }}>
                  <h4 style={{ color: '#294126', marginBottom: '0.75rem' }}>{labels.favoriteItems}</h4>
                  {customer.favoriteItems.length === 0 ? (
                    <p style={{ color: '#626c5c' }}>{labels.noItemHistory}</p>
                  ) : (
                    <ul style={{ marginLeft: '1.1rem', color: '#626c5c', lineHeight: 1.8 }}>
                      {customer.favoriteItems.map(item => (
                        <li key={item.id}>
                          {item.name} <strong style={{ color: '#294126' }}>x{item.quantity}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{ background: '#fffefa', border: '1px solid #dce1d6', borderRadius: '10px', padding: '1rem' }}>
                  <h4 style={{ color: '#294126', marginBottom: '0.75rem' }}>{labels.usefulDetails}</h4>
                  <p style={{ color: '#626c5c', lineHeight: 1.7 }}>
                    {labels.activeMonths}: <strong style={{ color: '#294126' }}>{customer.activeMonths}</strong>
                  </p>
                  <p style={{ color: '#626c5c', lineHeight: 1.7 }}>
                    {labels.completedOrders}: <strong style={{ color: '#294126' }}>{customer.completedOrders}</strong>
                  </p>
                  <p style={{ color: '#626c5c', lineHeight: 1.7 }}>
                    {labels.cancelledOrders}: <strong style={{ color: '#294126' }}>{customer.cancelledOrders}</strong>
                  </p>
                  <p style={{ color: '#626c5c', lineHeight: 1.7 }}>
                    {labels.savedAddresses}: <strong style={{ color: '#294126' }}>{customer.deliveryAddresses.length}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
