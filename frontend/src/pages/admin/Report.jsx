import React from 'react';
import { Link } from 'react-router-dom';

export default function Report() {
  const cards = [
    { to: '/admin/report/sales', title: 'Sales Report', desc: 'Revenue by day/month' },
    { to: '/admin/report/material', title: 'Materials Report', desc: 'Usage and estimated cost' },
    { to: '/admin/report/order', title: 'Orders Report', desc: 'Counts and status breakdown' },
    { to: '/admin/report/profit', title: 'Profit Report', desc: 'Revenue - COGS' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="block border rounded-lg p-4 hover:shadow">
            <div className="text-lg font-semibold">{c.title}</div>
            <div className="text-gray-600">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
