import api from "./api";

export const paymentService = {
  createOrder: async (data) => {
    const response = await api.post("/payment/create-order", data);
    return response.data;
  },

  verifyPayment: async (data) => {
    const response = await api.post("/payment/verify-payment", data);
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
