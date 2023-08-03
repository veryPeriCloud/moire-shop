import { ref, computed } from 'vue'
import { defineStore } from 'pinia';
import axios from 'axios';
import { API_BASE_URL } from "@/../config.js";

export const useCartStore = defineStore('cart', {
  state: () => ({ 
    cartProducts: [],

    userAccessKey: null,

    cartProductsData: [],
  }),
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...item,
          // product: {
            ...product,
            image: product.color.gallery[0].file.url,
          // }
        }
      });
    },
    getCartTotalSumm(getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0)
    },
    // updateCartProductAmount(state, { productId, quantity }) {
    //   const item = state.cartProducts.find((item) => item.productId === productId);

    //   if (item) {
    //     item.quantity = quantity;
    //   }
    // },
  },
  actions: {
    updateUserAccessKey(accessKey: any) {
      this.$state.userAccessKey = accessKey;
    },
    async fetchCart() {
      return axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: this.$state.userAccessKey,
        },
      })
      .then((response) => {
        if (!this.$state.userAccessKey) {
          localStorage.setItem('userAccessKey', response.data.user.accessKey)
          this.$state.userAccessKey = response.data.user.accessKey;
        }
        this.$state.cartProductsData = response.data.items;

        this.$state.cartProducts = this.$state.cartProductsData.map((item) => {
          return {
            productId: item.product.id,
            quantity: item.quantity,
            colorId: item.color.color.id,
            sizeId: item.size.id,
          };
        });
      })
    },
    async addProductToCart({productId, colorId, sizeId, quantity}) {
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity,
          colorId,
          sizeId
        }, {
          params: {
            userAccessKey: this.$state.userAccessKey,
          },
        })
        .then((response) => {
          this.$state.cartProductsData = response.data.items;

          this.$state.cartProducts = this.$state.cartProductsData.map((item) => {
            return {
              productId: item.product.id,
              quantity: item.quantity,
              colorId: item.color.color.id,
              sizeId: item.size.id,
            };
          });
        });
    },
    async updateCartProductAmount({ productId, quantity, colorId, sizeId }) {

      const item = this.$state.cartProducts.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
      
      return axios
      .put(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        quantity,
        colorId,
        sizeId
      }, {
        params: {
          userAccessKey: this.$state.userAccessKey,
        },
      })
      .then((response) => {
        this.$state.cartProductsData = response.data.items;

      })
      .catch(() => {
        this.$state.cartProducts = this.$state.cartProductsData.map((item) => {
          return {
            productId: item.product.id,
            quantity: item.quantity,
            colorId: item.color.color.id,
            sizeId: item.size.id,
          };
        });
      })
    },
  },
})
