
import React, { useState } from 'react';

interface NamePromptProps {
  onSubmit: (name: string) => void;
}

const NamePrompt: React.FC<NamePromptProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">KCIS DAA Gathering Dinner</h1>
        <p className="text-gray-600 mt-2 mb-6">Please enter your name to start your order.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 focus:outline-none transition-shadow"
            required
            aria-label="Your Name"
          />
          <button
            type="submit"
            className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            disabled={!name.trim()}
          >
            Start Ordering
          </button>
        </form>
      </div>
    </div>
  );
};

export default NamePrompt;
