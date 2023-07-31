<script setup lang="ts">
import TheHeader from "@/components/TheHeader/TheHeader.vue";
import TheFooter from "@/components/TheFooter/TheFooter.vue";
</script>

<template>
  <The-Header />
  <Suspense>
    <router-view></router-view>
  </Suspense>  
  <The-Footer />
</template>

<style scoped></style>
