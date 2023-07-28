<script setup lang="ts">
import { computed } from "vue";
import { useNumberFormat } from "@/composables/format.ts";

const props = defineProps({
  product: {
    type:  Object,
  }
});

const pic = computed(()=> {
  return props.product.image ? props.product.image : "./img/empty.jpg";
})

</script>

<template>
  <li class="catalog__item">
    <a class="catalog__pic" href="#">
      <!-- to change src for color-->
      <img :src="pic" :alt="props.product.title">
    </a>

    <h3 class="catalog__title">
      <a href="#">
        {{ props.product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ useNumberFormat(props.product.price) }} ₽
    </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in props.product.colors" :key="color.id">
        <label class="colors__label">
          <input class="colors__radio sr-only" type="radio" name="color-1" :value="color.color.code" checked="">
          <span class="colors__value" :style="{'background-color': color.color.code}">
          </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<style scoped>

</style>
