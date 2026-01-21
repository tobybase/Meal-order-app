
export type MenuCategory = 'Appetizer' | 'Main Course' | 'Pizza' | 'Fried Snacks' | 'Drink';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}
