import api from "./api";

export const paymentService = {
  createCheckoutSession: async (cartItems) => {
    const items = cartItems.map((item) => ({
      wallpaperId: item.id,
      quantity: item.quantity,
    }));

    const response = await api.post("/payment/checkout", { items });
    return response.data;
  },

  getOrderHistory: async (params = {}) => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};
