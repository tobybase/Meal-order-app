
import React, { forwardRef } from 'react';
import { MenuItem, OrderItem } from '../types';
import MenuItemCard from './MenuItemCard';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  order: OrderItem[];
  hasDrink: boolean;
  remainingBudget: number;
}

const MenuSection = forwardRef<HTMLDivElement, MenuSectionProps>(({ title, items, onAddItem, onUpdateQuantity, order, hasDrink, remainingBudget }, ref) => {
  return (
    <section id={title} ref={ref} className="pt-6 -mt-6 scroll-mt-32">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="space-y-4">
        {items.map(item => {
          const orderItem = order.find(oi => oi.id === item.id);
          const quantityInOrder = orderItem ? orderItem.quantity : 0;
          return (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddItem={onAddItem}
              onUpdateQuantity={onUpdateQuantity}
              quantityInOrder={quantityInOrder}
              hasDrink={hasDrink}
              remainingBudget={remainingBudget}
            />
          );
        })}
      </div>
    </section>
  );
});

export default MenuSection;
