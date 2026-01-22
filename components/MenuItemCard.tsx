
import React from 'react';
import { MenuItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface MenuItemCardProps {
  item: MenuItem;
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  quantityInOrder: number;
  hasDrink: boolean;
  remainingBudget: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddItem, onUpdateQuantity, quantityInOrder, hasDrink, remainingBudget }) => {
    const isDrink = item.category === 'Drink';
    const canBeAdded = !(isDrink && hasDrink) && item.price <= remainingBudget;
    const canIncrease = item.price <= remainingBudget;

    const handleAddItemClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (canBeAdded) {
            onAddItem(item);
        }
    };

    const handleIncreaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (canIncrease) {
            onAddItem(item);
        }
    };

    const handleDecreaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(item.id, quantityInOrder - 1);
    };
    
    const isDisabled = !canBeAdded && quantityInOrder === 0;

  return (
    <div 
        className={`group relative flex justify-between items-center p-4 bg-white rounded-lg border transition-all duration-200 ${isDisabled ? 'opacity-60 bg-gray-50 border-gray-200' : 'border-gray-200 hover:shadow-md hover:border-gray-300'}`}
        aria-label={item.name}
    >
        <div className="flex-1 pr-4">
            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
            <p className="text-gray-500 mt-1 text-base line-clamp-2">{item.description}</p>
            <p className="text-lg font-semibold text-gray-700 mt-2">${item.price.toFixed(2)}</p>
        </div>

        <div className="relative flex-shrink-0 flex items-center justify-center">
            {quantityInOrder > 0 ? (
                <div className="flex items-center gap-2">
                    <button onClick={handleDecreaseClick} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors" aria-label={`Decrease quantity of ${item.name}`}>
                        <MinusIcon />
                    </button>
                    <span className="font-bold w-6 text-center text-base">{quantityInOrder}</span>
                    <button onClick={handleIncreaseClick} disabled={!canIncrease} className="p-1.5 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label={`Increase quantity of ${item.name}`}>
                        <PlusIcon />
                    </button>
                </div>
            ) : (
                <>
                    {canBeAdded ? (
                        <button onClick={handleAddItemClick} className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 text-gray-400 rounded-full hover:bg-gray-200 hover:border-gray-400 hover:text-gray-600 transition-colors" aria-label={`Add ${item.name} to order`}>
                            <PlusIcon />
                        </button>
                    ) : (
                        <span className="text-sm font-bold text-gray-400 text-center px-2">
                            {isDrink && hasDrink ? 'Drink limit' : 'Over budget'}
                        </span>
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default MenuItemCard;
