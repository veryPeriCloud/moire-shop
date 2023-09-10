<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  placeholder: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  title: {
    type: String,
    required: false,
  },
  error: {
    type: String,
    required: false,
  }
});

const emit = defineEmits(['update:modelValue']);
const onInput = (e) => {
  emit('update:modelValue', e.target.value);
}
</script>

<template>
  <label class="form__label">
    <input class="form__input"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :type="props.type"
      @input=onInput
    >
    <span class="form__value">{{ props.title }}</span>
    <span v-if="props.error" class="form__error">{{ props.error }} </span>
  </label>
</template>

<style>
.form__error {
  margin-top: 10px;
}
</style>