
import React from 'react';
import { MenuItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface MenuItemCardProps {
  item: MenuItem;
  onAddItem: (item: MenuItem) => void;
  quantityInOrder: number;
  hasDrink: boolean;
  remainingBudget: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddItem, quantityInOrder, hasDrink, remainingBudget }) => {
    const isDrink = item.category === 'Drink';
    const isOrderable = !((isDrink && hasDrink) || item.price > remainingBudget);

    const handleClick = () => {
        if (isOrderable) {
            onAddItem(item);
        }
    };

  return (
    <div 
        onClick={handleClick} 
        className={`group relative flex justify-between items-center p-4 bg-white rounded-lg border transition-all duration-200 ${isOrderable ? 'cursor-pointer hover:shadow-md hover:border-gray-300 border-gray-200' : 'opacity-60 cursor-not-allowed bg-gray-50 border-gray-200'}`}
        aria-label={`Add ${item.name} to order`}
        role="button"
        tabIndex={isOrderable ? 0 : -1}
    >
        <div className="flex-1 pr-4">
            <h3 className="text-md font-bold text-gray-800">{item.name}</h3>
            <p className="text-gray-500 mt-1 text-sm line-clamp-2">{item.description}</p>
            <p className="text-md font-semibold text-gray-700 mt-2">${item.price.toFixed(2)}</p>
        </div>
        <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12">
            {isOrderable ? (
                quantityInOrder > 0 ? (
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-sm font-bold rounded-full">
                        {quantityInOrder}
                    </span>
                ) : (
                    <div className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 text-gray-400 rounded-full group-hover:bg-gray-200 group-hover:border-gray-400 group-hover:text-gray-600 transition-colors">
                        <PlusIcon />
                    </div>
                )
            ) : (
                <span className="text-xs font-bold text-gray-400 text-center">
                    {isDrink && hasDrink ? 'Drink limit' : 'Over budget'}
                </span>
            )}
        </div>
    </div>
  );
};

export default MenuItemCard;
