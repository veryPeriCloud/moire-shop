<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    default: 1,
  }
});
const emit = defineEmits(['plus', 'minus'])

const amountMinus = () => {
  emit('minus')
}
const amountPlus = () => {
  emit('plus')
}
</script>

<template>
<div class="form__counter">
  <button type="button" aria-label="Убрать один товар"
    @click.prevent="amountMinus"
  >
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-minus"></use>
    </svg>
  </button>

  <input type="text" name="count" v-model.number="props.count">

  <button type="button" aria-label="Добавить один товар"
  @click.prevent="amountPlus"
  >
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-plus"></use>
    </svg>
  </button>
</div>
</template>