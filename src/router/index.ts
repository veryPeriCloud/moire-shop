import { createRouter, createWebHistory } from "vue-router";
import Products from "@/pages/products/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Products
    },
  ]
})

export default router
