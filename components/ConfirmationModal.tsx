
import React, { useState, useMemo } from 'react';
import { OrderItem } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem[];
  totalCost: number;
  userName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, order, totalCost, userName }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Order');

  const orderDetailsText = useMemo(() => {
    const itemsText = order.map(item => 
      `- ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    return `KCIS DAA Gathering Dinner Order
Participant: ${userName}
--- ORDER SUMMARY ---
${itemsText}
---------------------
Total Cost: $${totalCost.toFixed(2)}
---------------------
`;
  }, [order, totalCost, userName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetailsText).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Order'), 2000);
    }, (err) => {
      console.error('Failed to copy text: ', err);
      setCopyButtonText('Error!');
      setTimeout(() => setCopyButtonText('Copy Order'), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50 flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-lg transform transition-all">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Order Complete!</h2>
        <p className="text-lg text-gray-600 mt-2 text-center">
            Thank you, {userName}. Please copy your order and send it to Toby.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6 text-left max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{orderDetailsText}</pre>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <button
              onClick={handleCopy}
              className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              {copyButtonText}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              Finish
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
