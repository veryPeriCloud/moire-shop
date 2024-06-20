<script setup lang="ts">

const props = withDefaults(defineProps<{
  modelValue: string;
  type?: string;
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
    <textarea class="form__input form__input--area"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input=onInput
    >
    </textarea>
    <span class="form__value">{{ props.title }}</span>
  </label>
</template>

<style>
.form__error {
  margin-top: 10px;
}
</style>