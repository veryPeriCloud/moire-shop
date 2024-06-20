import axios from "axios";
import { defineStore } from "pinia";
import { API_BASE_URL } from "@/assets/ts/config.js";
import type {
  ICartProductData,
  ICartProduct,
  IUpdateProductAmountArgs,
} from "@/types/Cart";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartProducts: [] as ICartProduct[],

    userAccessKey: null as null | string,

    cartProductsData: [] as ICartProductData[],
  }),
  getters: {
    cartDetailProducts(state) {
      if (state.cartProducts.length > 0) {
        return state.cartProducts.map((item) => {
          const productData = state.cartProductsData;
          if (productData.length > 0) {
            const product = state.cartProductsData.find(
              (p) =>
                p.product.id === item.productId &&
                p.color.color.id === item.colorId &&
                p.size.id === item.sizeId
            );

            return {
              ...product,
              image: product.color.gallery
                ? product.color.gallery[0].file.url
                : "../img/empty.jpg",
            };
          }
        });
      } else return [];
    },
    getCartTotalSumm(getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => item.product.price * item.quantity + acc,
        0
      );
    },
  },
  actions: {
    updateUserAccessKey(accessKey: string): void {
      this.userAccessKey = accessKey;
    },
    async fetchCart(): Promise<void> {
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: this.userAccessKey,
          },
        })
        .then((response) => {
          if (!this.userAccessKey) {
            localStorage.setItem("userAccessKey", response.data.user.accessKey);
            this.userAccessKey = response.data.user.accessKey;
          }
          this.cartProductsData = response.data.items;

          this.cartProducts = this.cartProductsData.map((item) => {
            return {
              productId: item.product.id,
              quantity: item.quantity,
              colorId: item.color.color.id,
              sizeId: item.size.id,
            };
          });
        });
    },
    async addProductToCart({
      productId,
      quantity,
      colorId,
      sizeId,
    }): Promise<void> {
      return axios
        .post(
          `${API_BASE_URL}/api/baskets/products`,
          {
            productId,
            quantity,
            colorId,
            sizeId,
          },
          {
            params: {
              userAccessKey: this.userAccessKey,
            },
          }
        )
        .then((response) => {
          this.cartProductsData = response.data.items;

          this.cartProducts = this.cartProductsData.map((item) => {
            return {
              productId: item.product.id,
              quantity: item.quantity,
              colorId: item.color.color.id,
              sizeId: item.size.id,
            };
          });
        });
    },
    async updateCartProductAmount({ basketItemId, quantity }: IUpdateProductAmountArgs): Promise<void> {
      const item = this.cartProducts.find((item) => item.id === basketItemId);
      if (item) {
        item.quantity = quantity;
      }

      return axios
        .put(
          `${API_BASE_URL}/api/baskets/products`,
          {
            basketItemId,
            quantity,
          },
          {
            params: {
              userAccessKey: this.userAccessKey,
            },
          }
        )
        .then((response) => {
          this.cartProductsData = response.data.items;
        })
        .catch(() => {
          this.cartProducts = this.cartProductsData.map((item) => {
            return {
              basketItemId: item.id,
              quantity: item.quantity,
            };
          });
        });
    },
    async deleteCartProduct(basketItemId: number): Promise<void> {
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: this.userAccessKey,
          },
          data: {
            basketItemId,
          },
        })
        .then((response) => {
          this.cartProductsData = response.data.items;
          this.cartProducts = response.data.items.map((item) => {
            return {
              productId: item.product.id,
              quantity: item.quantity,
              colorId: item.color.color.id,
              sizeId: item.size.id,
            };
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
});
