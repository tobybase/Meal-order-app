
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MenuItem, OrderItem, MenuCategory } from './types';
import { fetchMenu } from './services/geminiService';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import OrderSummary from './components/OrderSummary';
import NamePrompt from './components/NamePrompt';
import CategoryNav from './components/CategoryNav';

const BUDGET = 1194;

export default function App() {
  const [userName, setUserName] = useState<string>('');
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
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
      removeFromOrder(itemId);
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

  const removeFromOrder = (itemId: number) => {
    setOrder(order.filter(item => item.id !== itemId));
  };

  const confirmOrder = () => {
    if (order.length === 0) {
      alert("Your order is empty.");
      return;
    }

    const headers = ['Participant Name', 'Item Name', 'Category', 'Quantity', 'Unit Price', 'Total Price'];
    const rows = order.map(item => [
      `"${userName.replace(/"/g, '""')}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      item.category,
      item.quantity,
      item.price.toFixed(2),
      (item.price * item.quantity).toFixed(2)
    ].join(','));
    
    const summaryRow = ['', '', '', '', 'Grand Total', totalCost.toFixed(2)].join(',');

    const csvContent = [
      headers.join(','),
      ...rows,
      summaryRow
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `order-${userName.replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Create a detailed order string for the email body
    const orderDetailsForEmail = order.map(item => 
      `- ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const recipient = 'tobylin@kcis.com.tw';
    const subject = `Order for ${userName} - KCIS DAA Gathering Dinner`;
    const body = `Hello,

Here is my order for the KCIS DAA Gathering Dinner:

Participant: ${userName}

Order Details:
${orderDetailsForEmail}

--------------------
Total Cost: $${totalCost.toFixed(2)}
--------------------

A CSV file of this order (${fileName}) has also been downloaded to my computer for record-keeping.

Thank you,
${userName}
`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');

    setSuccessMessage(`Success! Your order is in the new Gmail tab and a CSV copy has been downloaded.`);
    setTimeout(() => {
      setSuccessMessage(null);
      setOrder([]);
    }, 6000);
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setIsNameSubmitted(true);
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
      <Header userName={userName} />
      <CategoryNav categories={categoryOrder} activeCategory={activeCategory} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="w-full lg:w-[calc(100%-24rem)]">
            {isLoading && (
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
                onRemoveItem={removeFromOrder}
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
