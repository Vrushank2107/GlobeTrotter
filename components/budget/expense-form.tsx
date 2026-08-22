'use client';

import React, { useState } from 'react';
import { Expense } from '@/types';

export default function ExpenseForm({ onSubmit }: { onSubmit?: (expense: Omit<Expense, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Accommodation');
  const [amount, setAmount] = useState<number | ''>('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          onSubmit({
            title: name || 'Sample Expense',
            category: category as any,
            amount: Number(amount) || 0,
            date: new Date().toISOString().split('T')[0],
          });
        }
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded text-sm outline-none"
          placeholder="Enter expense name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded text-sm outline-none"
        >
          <option>Accommodation</option>
          <option>Transport</option>
          <option>Food</option>
          <option>Activities</option>
          <option>Misc</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
        <input
          type="number"
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full p-2 border rounded text-sm outline-none"
          placeholder="0"
        />
      </div>
      <button type="submit" className="w-full bg-slate-900 text-white p-2 rounded hover:bg-slate-800 text-sm font-medium">
        Add Expense
      </button>
    </form>
  );
}
