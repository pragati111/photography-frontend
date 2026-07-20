// Wholesale Cart Actions
export const ADD_TO_WHOLESALE_CART = "ADD_TO_WHOLESALE_CART";
export const REMOVE_FROM_WHOLESALE_CART = "REMOVE_FROM_WHOLESALE_CART";
export const CLEAR_WHOLESALE_CART = "CLEAR_WHOLESALE_CART";
export const UPDATE_WHOLESALE_QUANTITY = "UPDATE_WHOLESALE_QUANTITY";
export const SET_WHOLESALE_CART = "SET_WHOLESALE_CART";

export const addToWholesaleCart = (product, configs, offers) => ({
  type: ADD_TO_WHOLESALE_CART,
  payload: { product, configs, offers }
});

export const removeFromWholesaleCart = (productId, designId) => ({
  type: REMOVE_FROM_WHOLESALE_CART,
  payload: { productId, designId }
});

export const updateWholesaleQuantity = (productId, designId, quantity) => ({
  type: UPDATE_WHOLESALE_QUANTITY,
  payload: { productId, designId, quantity }
});

export const clearWholesaleCart = () => ({
  type: CLEAR_WHOLESALE_CART
});

export const setWholesaleCart = (items) => ({
  type: SET_WHOLESALE_CART,
  payload: items
});
