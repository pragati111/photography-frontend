// Cart Actions
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const CLEAR_CART = "CLEAR_CART";
export const UPDATE_QUANTITY = "UPDATE_QUANTITY";
export const SET_CART = "SET_CART";

export const addToCart = (product, configs, offers) => ({
  type: ADD_TO_CART,
  payload: { product, configs, offers }
});

export const removeFromCart = (productId, designId) => ({
  type: REMOVE_FROM_CART,
  payload: { productId, designId }
});

export const updateQuantity = (productId, designId, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { productId, designId, quantity }
});

export const clearCart = () => ({
  type: CLEAR_CART
});

export const setCart = (items) => ({
  type: SET_CART,
  payload: items
});