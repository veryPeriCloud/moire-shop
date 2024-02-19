<script setup lang="ts">

const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  placeholder: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  error: {
    type: Object,
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