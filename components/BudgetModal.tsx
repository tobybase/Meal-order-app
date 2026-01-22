
import React from 'react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  budget: number;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, userName, budget }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50 flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {userName}!</h2>
        <p className="text-lg text-gray-600 mt-4 mb-6">Your budget for the dinner is:</p>
        <div className="bg-gray-100 rounded-lg p-4 my-4">
            <span className="text-4xl font-bold text-gray-900 tracking-tight">${budget.toFixed(2)}</span>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
        >
          Start Ordering
        </button>
      </div>
    </div>
  );
};

export default BudgetModal;
