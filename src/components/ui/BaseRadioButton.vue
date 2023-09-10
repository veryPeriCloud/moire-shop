<script setup lang="ts">

const props = defineProps({
  modelValue: {
    type: Number,
  },
  option: {
    type: Object,
  },
  name: {
    type: String,
  }
});

const emit = defineEmits(['update:modelValue']);

const onChange = (e) => {
  emit("update:modelValue", e.target.value);
}
</script>

<template>
  <li class="options__item">
    <label class="options__label">
      <input
        class="options__radio sr-only"
        type="radio"
        :name="props.name"
        :value.number="props.option.id"
        @change="onChange"
      >
      <span class="options__value">
        {{ props.option.title }} <b v-if="props.option.price">{{ props.option.price }} ₽</b>
      </span>
    </label>
  </li>
</template>