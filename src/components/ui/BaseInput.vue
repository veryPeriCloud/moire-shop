<script setup lang="ts">

const props = withDefaults(defineProps<{
  modelValue: string;
  type: string;
  placeholder?: string;
  title?: string;
  error?: string;
}>(), {
  type: "text"
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
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