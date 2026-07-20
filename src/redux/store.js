import { createStore, combineReducers } from "redux";
import { cartReducer } from "./cartReducer";
import { wholesaleCartReducer } from "./wholesaleCartReducer";

const CUSTOMER_STORAGE_KEY = "cart_items";
const WHOLESALE_STORAGE_KEY = "wholesale_cart_items";

const loadState = () => {
  try {
    const customerSerialized = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    const wholesaleSerialized = localStorage.getItem(WHOLESALE_STORAGE_KEY);
    
    const customerItems = customerSerialized ? JSON.parse(customerSerialized) : [];
    const wholesaleItems = wholesaleSerialized ? JSON.parse(wholesaleSerialized) : [];
    
    return {
      cart: { items: customerItems },
      wholesaleCart: { items: wholesaleItems }
    };
  } catch (error) {
    console.warn("Failed to load cart from localStorage", error);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const customerSerialized = JSON.stringify(state.cart.items);
    const wholesaleSerialized = JSON.stringify(state.wholesaleCart.items);
    
    localStorage.setItem(CUSTOMER_STORAGE_KEY, customerSerialized);
    localStorage.setItem(WHOLESALE_STORAGE_KEY, wholesaleSerialized);
  } catch (error) {
    console.warn("Failed to save cart to localStorage", error);
  }
};

const rootReducer = combineReducers({
  cart: cartReducer,
  wholesaleCart: wholesaleCartReducer
});

export const store = createStore(rootReducer, loadState());

store.subscribe(() => {
  saveState(store.getState());
});
