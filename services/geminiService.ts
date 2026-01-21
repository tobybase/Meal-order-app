
import { MenuItem } from '../types';

// This function now returns a static menu based on the provided image.
// The Gemini API call has been removed.
export async function fetchMenu(): Promise<MenuItem[]> {
  return Promise.resolve(getStaticMenu());
}

function getStaticMenu(): MenuItem[] {
    const menuData: Omit<MenuItem, 'id'>[] = [
        // Drinks
        { name: "TEA SOUR", description: "茶香酸酒", price: 300, category: "Drink" },
        { name: "TEA SPRITZ", description: "茶香氣泡", price: 320, category: "Drink" },
        { name: "FRUIT SOUR", description: "水果酸酒", price: 280, category: "Drink" },
        { name: "H&W ICE TEA", description: "H&W 冰茶", price: 380, category: "Drink" },
        { name: "STRAWBERRY MILKSHAKE", description: "草莓奶昔", price: 360, category: "Drink" },
        { name: "GIN TONIC", description: "琴通寧", price: 300, category: "Drink" },
        { name: "MOSCOW MULE", description: "莫斯科騾子", price: 300, category: "Drink" },
        { name: "WHISKEY SOUR", description: "威士忌酸酒", price: 300, category: "Drink" },
        { name: "LONG ISLAND", description: "長島冰茶", price: 360, category: "Drink" },
        { name: "CRAFT BEER", description: "精釀啤酒", price: 280, category: "Drink" },

        // Appetizers
        { name: "CAESAR CHICKEN SALAD", description: "凱薩雞肉沙拉", price: 320, category: "Appetizer" },
        { name: "JAPANESE DRESSING DUCK SALAD", description: "和風芥末煙燻鴨肉沙拉", price: 360, category: "Appetizer" },
        { name: "SMOKED SALMON SALAD", description: "橄欖油醋冷燻鮭魚沙拉", price: 360, category: "Appetizer" },
        { name: "SPANISH GARLIC SHRIMP", description: "西班牙橄欖油蒜味蝦", price: 260, category: "Appetizer" },
        { name: "CA POUTINE", description: "加拿大肉汁起司薯條", price: 320, category: "Appetizer" },
        { name: "ZUCCHINI W APPLE & MULLET ROE", description: "櫛瓜佐蘋果烏魚子", price: 220, category: "Appetizer" },
        
        // Fried Snacks
        { name: "CRISPY FRIED YAM W MENTAIKO", description: "酥炸山藥佐明太子", price: 220, category: "Fried Snacks" },
        { name: "H&W DEEP FRIED PLATTER", description: "H&W炸物拼盤(小)", price: 320, category: "Fried Snacks" },
        { name: "TRUFFLE W MAYONNAISE FRIES", description: "黑松露蛋黃醬薯條", price: 300, category: "Fried Snacks" },
        { name: "DEEP FRIED ONION RINGS", description: "酥炸洋蔥圈", price: 240, category: "Fried Snacks" },
        { name: "KARAAGE JAPANESE CHICKEN", description: "酥炸唐揚雞塊", price: 300, category: "Fried Snacks" },
        { name: "SPICY CHICKEN WINGS", description: "辣雞翅", price: 240, category: "Fried Snacks" },
        
        // Main Course
        { name: "FRIED RICE W SCALLOP & TRUFFLE", description: "金黃干貝松露炒飯", price: 340, category: "Main Course" },
        { name: "BEEF BOURGUIGNON RISOTTO", description: "義式紅酒燉牛肉飯", price: 340, category: "Main Course" },
        { name: "PESTO CHICKEN RISOTTO", description: "青醬脆皮雞腿燉飯", price: 360, category: "Main Course" },
        { name: "GARLIC CLAMS SPAGHETTI", description: "蒜香白酒蛤蜊義大利麵", price: 340, category: "Main Course" },
        { name: "MENTAIKO SMOKED SALMON SPAGHETTI", description: "明太子燻鮭魚義大利麵", price: 360, category: "Main Course" },
        { name: "ROASTED GERMAN PORK KNUCKLE", description: "德式烤豬腳佐酸菜培根", price: 420, category: "Main Course" },
        { name: "SALMON FILET W HASSELBACK", description: "鮭魚菲力手風琴馬鈴薯", price: 430, category: "Main Course" },
        { name: "TOMAHAWK PORK W HASSELBACK", description: "戰斧豬排手風琴馬鈴薯", price: 480, category: "Main Course" },

        // Pizza
        { name: "MIXED CHEESE PIZZA", description: "義式綜合起司披薩", price: 320, category: "Pizza" },
        { name: "TRUFFLE AND MUSHROOM PIZZA", description: "黑松露蘑菇披薩", price: 340, category: "Pizza" },
        { name: "BEEF PIZZA WITH ROCK SALT", description: "岩鹽蒜香牛肉披薩", price: 340, category: "Pizza" },
        { name: "SMOKED SALMON W BABY LEAF", description: "燻鮭魚有機生菜披薩", price: 380, category: "Pizza" },
        { name: "DUCK WITH GARLIC BOLT PIZZA", description: "台式蒜苗鴨肉披薩", price: 380, category: "Pizza" },
        { name: "CARAMEL SEA SALT PIZZA W CHESTNUT", description: "焦糖海鹽栗子披薩", price: 340, category: "Pizza" },
    ];

    // Add unique IDs to each item
    return menuData.map((item, index) => ({
        ...item,
        id: index + 1,
    }));
}
