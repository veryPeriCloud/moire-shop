import { createRouter, createWebHistory } from "vue-router";
import Products from "@/pages/products/index.vue";
import ProductPage from "@/pages/product/index.vue";
import CartPage from "@/pages/cart/index.vue";
import OrderPage from "@/pages/order/index.vue";
import NotFoundPage from "@/pages/notFound/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Products
    },
    {
      path: '/products/:slug',
      name: 'product',
      component: ProductPage,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage
    },
    {
      path: '/order',
      name: 'order',
      component: OrderPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFoundPage
    },
  ]
})

export default router
