import { ref, computed } from 'vue'
import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductsStore = defineStore('products', {
  state: () => ({ 
    products: null,

    page: 1,
    productsPerPage: 3,
  }),
  getters: {
    getProducts: (state) => {
      if (state.products === null) {
        return [];
      }

      return state.products.items.map((item: any) => {
        return {
          ...item,
          image: item.colors[0].gallery !== null ? item.colors[0].gallery[0].file.url : null,
        };
      })
    },
    getProductsCount: (state) => state.products.pagination.total,
  },
  actions: {
    async fetchProducts() {
      await axios.get('https://vue-moire.skillbox.cc/api/products', {
        params: {
          // page: this.$state.page,
          // limit: this.$state.productsPerPage,
          // minPrice: filterPriceFrom.value,
          // maxPrice: filterPriceTo.value,
          // categoryId: ,
        }
      })
        .then((response) => {
          this.$state.products = response.data;
        });
    }
  },
})
