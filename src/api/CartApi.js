import axiosInstance from '../lib/axiosInstance';

const CART_STORAGE_KEY = 'cartItems';

const generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const getCartItems = () => {
    try {
        const cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        return cartItems.map(item => ({
            uuid: item.uuid,
            quantity: item.quantity,
            food: item.food
        }));
    } catch (error) {
        console.error('Error getting cart items:', error);
        return [];
    }
};

export const getCartItemCount = () => {
    try {
        const cartItems = getCartItems();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
};

export const addToCart = (food) => {
    try {
        const cartItems = getCartItems();
        const existingItem = cartItems.find(item => item.food.uuid === food.uuid);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                uuid: generateUuid(),
                food: {
                    uuid: food.uuid,
                    name: food.name,
                    price: food.price,
                    imageUrl: food.imageUrl,
                    description: food.description
                },
                quantity: 1
            });
        }

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw new Error('Không thể thêm món ăn vào giỏ hàng');
    }
};

export const updateCartItemQuantity = (itemUuid, newQuantity) => {
    try {
        const cartItems = getCartItems();
        const itemIndex = cartItems.findIndex(item => item.uuid === itemUuid);

        if (itemIndex === -1) {
            throw new Error('Không tìm thấy món ăn trong giỏ hàng');
        }

        if (newQuantity <= 0) {
            cartItems.splice(itemIndex, 1);
        } else {
            cartItems[itemIndex].quantity = newQuantity;
        }

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw new Error('Không thể cập nhật số lượng món ăn');
    }
};

export const removeFromCart = (itemUuid) => {
    try {
        const cartItems = getCartItems();
        const updatedItems = cartItems.filter(item => item.uuid !== itemUuid);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
        return updatedItems.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw new Error('Không thể xóa món ăn khỏi giỏ hàng');
    }
};
