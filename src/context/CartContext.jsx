import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      let newItems;

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: newItems,
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };
    case "SET_TOTAL":
      return {
        ...state,
        total: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate total whenever items change
  useEffect(() => {
    const total = state.items.reduce((sum, item) => {
      const price = item.isFree ? 0 : (item.priceCents || 0) / 100;
      return sum + price * item.quantity;
    }, 0);

    dispatch({ type: "SET_TOTAL", payload: total });
  }, [state.items]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (wallpaper) => {
    dispatch({ type: "ADD_ITEM", payload: wallpaper });
  };

  const removeFromCart = (wallpaperId) => {
    dispatch({ type: "REMOVE_ITEM", payload: wallpaperId });
  };

  const updateQuantity = (wallpaperId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(wallpaperId);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: wallpaperId, quantity },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items: state.items,
    total: state.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
