<script setup lang="ts">
import { computed, ref } from "vue";
import { useNumberFormat } from "@/composables/format.ts";

const props = defineProps<{
  product: IProduct
}>();

const currentColor = ref(null);

const pic = computed(()=> {
  if (currentColor.value === null) {
    return props.product.image ? props.product.image : "./img/empty.jpg";
  } else {
    return currentColor.value.gallery ? currentColor.value.gallery[0].file.url : "./img/empty.jpg";
  }
})
</script>

<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {slug: product.slug}}">
      <img :src="pic" :alt="props.product.title">
    </router-link>

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
          <input class="colors__radio sr-only"
            type="radio"
            name="color-1" 
            :value="color.color.code"
            @input="currentColor=color"
          >
          <span class="colors__value" :style="{'background-color': color.color.code}">
          </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<style scoped>

</style>
