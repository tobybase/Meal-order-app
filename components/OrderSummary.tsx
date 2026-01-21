
import React from 'react';
import { OrderItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface OrderSummaryProps {
  order: OrderItem[];
  totalCost: number;
  budget: number;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onConfirmOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, totalCost, budget, onUpdateQuantity, onRemoveItem, onConfirmOrder }) => {
  const remainingBudget = budget - totalCost;

  return (
    <div className="sticky top-24">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Order</h2>
            
            <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {order.length === 0 ? (
                <p className="text-gray-500 text-center py-12">Add items to get started</p>
                ) : (
                <div className="max-h-[50vh] overflow-y-auto">
                    {order.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors" aria-label="Decrease quantity">
                                    <MinusIcon />
                                    </button>
                                    <span className="font-bold w-5 text-center text-sm">{item.quantity}</span>
                                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors" aria-label="Increase quantity">
                                    <PlusIcon />
                                    </button>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                )}
            </div>

            <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between font-medium">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="text-gray-900 font-bold">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Budget:</span>
                    <span className="text-gray-500">${budget.toFixed(2)}</span>
                </div>
                 <div className={`flex justify-between font-medium ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    <span>Remaining:</span>
                    <span>${remainingBudget.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <button
            onClick={onConfirmOrder}
            disabled={order.length === 0}
            className="w-full mt-4 bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex justify-between items-center px-6"
        >
            <span>Confirm Order</span>
            <span>${totalCost.toFixed(2)}</span>
        </button>
    </div>
  );
};

export default OrderSummary;
