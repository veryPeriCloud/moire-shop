<script setup lang="ts">
import { computed } from "vue";

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

const errorText = computed(() => {
  let val;
  try {
    val = JSON.parse(JSON.stringify(props.error));
  } catch (err) {}

  if (val.$dirty) {
    if (val.minLength !== undefined && val.minLength.$invalid) {
      return { text: "Минимальная длина должна быть:", value: val.minLength.$params.min };
    }
    if (val.required !== undefined && val.required.$invalid) {
      return { text: "Обязательное поле"};
    }
    if (val.numeric !== undefined && val.numeric.$invalid) {
      return { text: "Ведите числовые значения."};
    }
    if (val.email !== undefined && val.email.$invalid) {
      return { text: "Неправильный формат e-mail."};
    }
  }
  return { text: "" };
})

</script>

<template>
  <label class="form__label">
    <input class="form__input" type="text" 
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input=onInput
    >
    <span class="form__value">{{ props.title }}</span>
    <span v-if="errorText.text !== ''" class="form__error">{{ errorText.text }} {{ errorText.value }} </span>
  </label>
</template>

<style>
.form__error {
  margin-top: 10px;
}
</style>