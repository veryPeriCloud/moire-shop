import { defineStore } from 'pinia';
import axios from 'axios';

interface IProduct {

}

function useSerialize(obj: any) {
  const str = [];
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] !== null) {
        // str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
        if (Array.isArray(obj[key])) {
          for (let i in obj[key]) {
            str.push(encodeURIComponent(key) + "[]=" + obj[key][i]);
          }
        } else {
          str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
        }
      }
    }  
  }
  return str.join("&");
}

export const useProductsStore = defineStore('products', {
  state: () => ({ 
    products: null,

    pagination: {
      perPage: 9,
      total: null,
    },

    filters: {
      page: 1,
      minPrice: null,
      maxPrice: null,
      categoryId: null,
      materialIds: null,
      seasonIds: null,
      colorIds: null
    }

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
    getProductsCount: (state) => state.pagination.total,
    getTotalPages: (state) => {
      if (state.pagination.total) {
        return Math.ceil(state.pagination.total / state.pagination.perPage);
      }
    },
    getFilters: (state) => state.filters,
    getFiltersAsUrl: (state) => useSerialize(state.filters),

  },
  actions: {
    setFilters(query) {
      console.log('setFilters query', query)
      if (query.page) this.filters.page = query.page;
      if (query.minPrice) this.filters.minPrice = query.minPrice;
      if (query.maxPrice) this.filters.maxPrice = query.maxPrice;
      if (query.categoryId) this.filters.categoryId = query.categoryId;
      if (query.materialIds) this.filters.materialIds = query.materialIds;
      if (query.seasonIds) this.filters.seasonIds = query.seasonIds;
      if (query.colorIds) this.filters.colorIds = query.colorIds;
      // console.log('setFilters', this.filters)
    },

    setPageFilter(page) {
      this.filters.page = page;
    },

    setCatalogFilter(query) {
      if (query.minPrice) this.filters.minPrice = query.minPrice;
      if (query.maxPrice) this.filters.maxPrice = query.maxPrice;
      if (query.categoryId) this.filters.categoryId = query.categoryId;
      if (query.materialIds) this.filters.materialIds = query.materialIds;
      if (query.seasonIds) this.filters.seasonIds = query.seasonIds;
      if (query.colorIds) this.filters.colorIds = query.colorIds;
    },

    clearFilters() {
      this.filters.page = 1;
      this.filters.minPrice = null;
      this.filters.maxPrice = null;
      this.filters.categoryId = null;
      this.filters.materialIds = null;
      this.filters.seasonIds = null;
      this.filters.colorIds = null;
    },

    async fetchProducts() {
      const params = {
        limit: this.pagination.perPage,
        ...this.filters
      }
      // console.log('params', params)
      await axios.get('https://vue-moire.skillbox.cc/api/products', {
        params: params,
        // paramsSerializer: {
        //   indexes: false
        // },
      })      
        .then((response) => {
          // console.log('params', params)
          this.products = response.data;
          this.pagination.total = response.data.pagination.total;
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
})
