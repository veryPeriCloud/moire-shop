<script setup lang="ts">

const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
</script>

<template>
  <div class="form__counter">
    <button
      type="button"
      aria-label="Убрать один товар"
      :disabled="modelValue === 1"
      @click.prevent="
        modelValue >= 1 ? emit('update:modelValue', modelValue - 1) : 1
      "
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <button
      type="button"
      aria-label="Добавить один товар"
      @click.prevent="emit('update:modelValue', modelValue + 1)"
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
