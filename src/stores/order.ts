import { defineStore } from "pinia";
import { useCartStore } from "./cart";
import { API_BASE_URL } from "@/assets/ts/config.js";
import axios from "axios";
import type { FormError, IDelivery, IOrderFormData, IOrderInfo, IPayment } from "@/types/Order";

export const useOrderStore = defineStore('order', {
  state: () => ({ 
    deliveries: [] as IDelivery[],
    payments: [] as IPayment[],
    orderInfo: null as IOrderInfo | null,
    formError: null as FormError | null,
    formErrorMessage: '',
  }),
  getters: {
    getDeliveries: (state) => state.deliveries,
    getPayments: (state) => state.payments,
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

    async fetchPayments(deliveryTypeId: number): Promise<void> {
      await axios.get(`${API_BASE_URL}/api/payments`, {
        params: {
          deliveryTypeId
        }
      })
      .then((res) => {
        this.payments = res.data;
      })
    },

    resetCart() {
      const cartStore = useCartStore();
      cartStore.cartProducts = [];
      cartStore.cartProductsData = [];
    },

    async createOrder(formData: IOrderFormData): Promise<void> {
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

    async loadOrderInfo(orderId: string): Promise<void> {
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
