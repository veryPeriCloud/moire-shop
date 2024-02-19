<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useCartStore } from "@/stores/cart";
import TheHeader from "@/components/TheHeader/TheHeader.vue";
import TheFooter from "@/components/TheFooter/TheFooter.vue";

const cartStore = useCartStore();
onBeforeMount(async()=> {
  const userAccessKey = localStorage.getItem("userAccessKey");
  if (userAccessKey) {
    cartStore.updateUserAccessKey(userAccessKey)
  }
  await cartStore.fetchCart();
})
</script>

<template>
  <The-Header />
  <Suspense>
    <router-view></router-view>
  </Suspense>  
  <The-Footer />
</template>

<style scoped></style>
