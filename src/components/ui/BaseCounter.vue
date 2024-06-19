<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
  }
});
const emit = defineEmits(['update:modelValue'])

const amount = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>

<template>
<div class="form__counter">
  <button type="button" aria-label="Убрать один товар"
    :disabled="amount===1"
    @click.prevent="(amount >= 1) ? amount-- : 1"
  >
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-minus"></use>
    </svg>
  </button>

  <input type="text" v-model.number="amount">

  <button type="button" aria-label="Добавить один товар"
    @click.prevent="amount++"
  >
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-plus"></use>
    </svg>
  </button>
</div>
</template>


<style scoped>
.form__counter {
  height: 40px;

  input {
    height: 40px;
  }
}

@media (max-width: 640px) {
  .form__counter {

  input {
    width: 45px;
    font-size: 20px;
  }
}
}
</style>