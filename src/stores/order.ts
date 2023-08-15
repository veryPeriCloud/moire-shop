import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useCartStore } from "./cart";
import axios from "axios";
import { API_BASE_URL } from "@/../config.js";

export const useOrderStore = defineStore('order', {
  state: () => ({ 
    deliveries: null,
    orders: null,
  }),
  getters: {
    getDeliveries: (state) => state.deliveries,
    getOrders: (state) => state.orders,
  },
  actions: {
    async fetchDeliveries() {
      await axios.get(`${API_BASE_URL}/api/deliveries`)
      .then((res) => {
        this.$state.deliveries = res.data;
      })
    },
    async createOrder({ name, address, phone, email, deliveryTypeId, paymentTypeId, comment }) {
      const cartStore = useCartStore();

      await axios
        .post(`${API_BASE_URL}/api/orders`, {
          name,
          address,
          phone,
          email,
          deliveryTypeId,
          paymentTypeId,
          comment,
        },   
        {
          params: {
            userAccessKey: cartStore.userAccessKey,
          }
        })
        .then((res) => {
          this.$state.orders = res.data;
        })
    },
  },
})
