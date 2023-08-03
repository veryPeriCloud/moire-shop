<script setup lang="ts">
import BaseCounter from "@/components/ui/BaseCounter.vue";
import { useNumberFormat } from "@/composables/format";

const props = defineProps({
  item: {
    type: Object
  }
});

const incrementAmount = () => {
  props.item.quantity++;
  console.log('incrementAmount', props.item.quantity)
};
const decrementAmount = () => {
  props.item.quantity > 1 ? props.item.quantity-- : 1;
  console.log('decrementAmount', props.item.quantity)
}
</script>

<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="props.item.image" width="120" height="120" :alt="props.item.product.title">
    </div>
    <h3 class="product__title">
      {{ props.item.product.title }} <br>
      размер: {{ props.item.size.title }}
    </h3>
    
    <p class="product__info product__info--color">
      Цвет: 
      <span>
        <i :style="{'background-color': props.item.color.color.code }"></i>
        {{ props.item.color.color.title }}
      </span>
    </p>
    <span class="product__code">
      Артикул: {{ props.item.productId }}
    </span>

    <base-counter
      :count="props.item.quantity"
      @plus="incrementAmount"
      @minus="decrementAmount"
      v-model:count="props.item.quantity"
    />

    <b class="product__price">
      {{ useNumberFormat(props.item.price * props.item.quantity) }} ₽
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<style>
.button-del {
  cursor: pointer;
}
</style>