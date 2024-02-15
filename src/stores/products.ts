
import { defineStore } from 'pinia';
import axios from 'axios';
import { useSerialize } from '@/composables/serialize';
import type { IProduct, IFilter, IParams } from "@/types/Products.d.ts";

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
    getProducts: (state): IProduct[] => {
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
    getProductsCount: (state): number => state.pagination.total ? state.pagination.total : 0,
    getTotalPages: (state): number => {
      if (state.pagination.total) {
        return Math.ceil(state.pagination.total / state.pagination.perPage);
      } else {
        return 0;
      }
    },
    getFilters: (state): IFilter => state.filters,
    getFiltersAsUrl: (state): string => useSerialize(state.filters),

  },
  actions: {
    setFilters(query): void {
      if (query.page) this.filters.page = query.page;
      if (query.minPrice) this.filters.minPrice = query.minPrice;
      if (query.maxPrice) this.filters.maxPrice = query.maxPrice;
      if (query.categoryId) this.filters.categoryId = query.categoryId;
      if (query.materialIds) this.filters.materialIds = query.materialIds;
      if (query.seasonIds) this.filters.seasonIds = query.seasonIds;
      if (query.colorIds) this.filters.colorIds = query.colorIds;
    },

    setPageFilter(page: number): void {
      this.filters.page = page;
    },

    setCatalogFilter(query): void {
      if (query.minPrice) this.filters.minPrice = query.minPrice;
      if (query.maxPrice) this.filters.maxPrice = query.maxPrice;
      if (query.categoryId) this.filters.categoryId = query.categoryId;
      if (query.materialIds) this.filters.materialIds = query.materialIds;
      if (query.seasonIds) this.filters.seasonIds = query.seasonIds;
      if (query.colorIds) this.filters.colorIds = query.colorIds;
    },

    clearFilters(): void {
      this.filters.page = 1;
      this.filters.minPrice = null;
      this.filters.maxPrice = null;
      this.filters.categoryId = null;
      this.filters.materialIds = null;
      this.filters.seasonIds = null;
      this.filters.colorIds = null;
    },

    async fetchProducts(): Promise<void> {
      const params = {
        limit: this.pagination.perPage,
        ...this.filters
      } as IParams;
      await axios.get('https://vue-moire.skillbox.cc/api/products', {
        params: params,
        paramsSerializer: {
          indexes: false
        },
      })      
        .then((response) => {
          this.products = response.data;
          this.pagination.total = response.data.pagination.total;
        })
        .catch((err: Error) => {
          console.error(err)
        })
    }
  },
})
