import { defineStore } from "pinia";
import { useCartStore } from "./cart";
import { API_BASE_URL } from "@/../config.js";
import axios from "axios";

export const useOrderStore = defineStore('order', {
  state: () => ({ 
    deliveries: null,
    orderInfo: null,
    formError: {},
    formErrorMessage: '',
  }),
  getters: {
    getDeliveries: (state) => state.deliveries,
    getOrders: (state) => state.orderInfo,
    getErrors: (state) => state.formError
  },
  actions: {
    async fetchDeliveries() {
      await axios.get(`${API_BASE_URL}/api/deliveries`)
      .then((res) => {
        this.deliveries = res.data;
      })
    },

    resetCart() {
      const cartStore = useCartStore();
      cartStore.cartProducts = [];
      cartStore.cartProductsData = [];
    },

    async createOrder(formData: Object) {
      this.formError = {};
      this.formErrorMessage = '';
      const cartStore = useCartStore();

      await axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...formData
        },   
        {
          params: {
            userAccessKey: cartStore.userAccessKey,
          }
        })
        .then((res) => {
          this.resetCart();
          this.orderInfo = res.data;
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {}
          this.formErrorMessage = error.response.data.error.message
        })
    },

    async loadOrderInfo(orderId: String) {
      const cartStore = useCartStore();

      await axios
      .get(`${API_BASE_URL}/api/orders/` + orderId, {
        params: {
          userAccessKey: cartStore.userAccessKey,
        }
      })
        .then((res) => {
          this.orderInfo = res.data;
        })
    }
  },
})
