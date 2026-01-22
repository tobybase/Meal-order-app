
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MenuItem, OrderItem, MenuCategory } from './types';
import { fetchMenu } from './services/geminiService';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import OrderSummary from './components/OrderSummary';
import NamePrompt from './components/NamePrompt';
import CategoryNav from './components/CategoryNav';
import BudgetModal from './components/BudgetModal';
import ConfirmationModal from './components/ConfirmationModal';

const BUDGET = 1194;

export default function App() {
  const [userName, setUserName] = useState<string>('');
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Appetizer');
  
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const totalCost = useMemo(() => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [order]);

  const remainingBudget = useMemo(() => BUDGET - totalCost, [totalCost]);
  const hasDrink = useMemo(() => order.some(item => item.category === 'Drink'), [order]);

  const fetchMenuItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const menuItems = await fetchMenu();
      setMenu(menuItems);
    } catch (err)
 {
      setError('Failed to load the menu. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isNameSubmitted) {
      fetchMenuItems();
    }
  }, [isNameSubmitted, fetchMenuItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id as MenuCategory);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px', threshold: 0 }
    );

    const refs = sectionRefs.current;
    // FIX: Using Object.keys and map to iterate over refs. This helps with type inference
    // where Object.values might be inferred as `unknown[]` in some environments. We also
    // store the list of refs to ensure we unobserve the same elements in the cleanup.
    const currentRefs = Object.keys(refs).map((key) => refs[key]);
    
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [isLoading]);

  const addToOrder = (itemToAdd: MenuItem) => {
    if (itemToAdd.category === 'Drink' && hasDrink) {
      alert('You can only order one drink.');
      return;
    }

    if (totalCost + itemToAdd.price > BUDGET) {
      alert('Adding this item would exceed your budget.');
      return;
    }

    const existingItem = order.find(item => item.id === itemToAdd.id);

    if (existingItem) {
      updateQuantity(itemToAdd.id, existingItem.quantity + 1);
    } else {
      setOrder([...order, { ...itemToAdd, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      setOrder(order.filter(item => item.id !== itemId));
      return;
    }

    const updatedOrder = order.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    const newTotalCost = updatedOrder.reduce((total, item) => total + item.price * item.quantity, 0);

    if (newTotalCost > BUDGET) {
      alert('This change exceeds your budget.');
      return;
    }

    setOrder(updatedOrder);
  };

  const confirmOrder = () => {
    if (order.length === 0) {
      alert("Your order is empty.");
      return;
    }
    setIsConfirmationModalOpen(true);
  };
  
  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setOrder([]);
    setSuccessMessage("Thank you for your order!");
    setTimeout(() => {
        setSuccessMessage(null);
    }, 5000);
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setIsNameSubmitted(true);
    setIsBudgetModalOpen(true);
  };

  const handleCloseBudgetModal = () => {
    setIsBudgetModalOpen(false);
  };

  const menuByCategory = useMemo(() => {
    return menu.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<MenuCategory, MenuItem[]>);
  }, [menu]);

  const categoryOrder: MenuCategory[] = ['Appetizer', 'Fried Snacks', 'Main Course', 'Pizza', 'Drink'];

  if (!isNameSubmitted) {
    return <NamePrompt onSubmit={handleNameSubmit} />;
  }
  
  return (
    <div className="bg-white">
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={handleCloseBudgetModal}
        userName={userName}
        budget={BUDGET}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        order={order}
        totalCost={totalCost}
        userName={userName}
      />
      <Header userName={userName} />
      <CategoryNav categories={categoryOrder} activeCategory={activeCategory} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="w-full lg:w-[calc(100%-24rem)]">
            {isLoading && !isBudgetModalOpen && (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}
            {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
            {!isLoading && !error && (
              <div className="space-y-12">
                {categoryOrder.map(category => (
                  menuByCategory[category] && (
                    <MenuSection
                      key={category}
                      // FIX: The ref callback was implicitly returning the assigned element, which is not allowed. By using a block body, the arrow function returns undefined, which satisfies the type.
                      ref={el => { sectionRefs.current[category] = el; }}
                      title={category}
                      items={menuByCategory[category]}
                      onAddItem={addToOrder}
                      onUpdateQuantity={updateQuantity}
                      order={order}
                      hasDrink={hasDrink}
                      remainingBudget={remainingBudget}
                    />
                  )
                ))}
              </div>
            )}
          </div>
          <aside className="w-full lg:w-96 mt-8 lg:mt-0">
             <OrderSummary
                order={order}
                totalCost={totalCost}
                budget={BUDGET}
                onUpdateQuantity={updateQuantity}
                onConfirmOrder={confirmOrder}
              />
          </aside>
        </div>
      </main>
      
      {successMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white py-3 px-6 rounded-full shadow-lg z-50 text-base">
          {successMessage}
        </div>
      )}
    </div>
  );
}
