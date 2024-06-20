<script setup lang="ts">

const props = defineProps<{
  modelValue: number;
  option: IDelivery;
  name: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>();

const onChange = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
</script>

<template>
  <li class="options__item">
    <label class="options__label">
      <input
        class="options__radio sr-only"
        type="radio"
        :name="props.name"
        :value="props.option.id"
        @change="onChange"
      >
      <span class="options__value">
        {{ props.option.title }} <b v-if="props.option.price">{{ props.option.price }} ₽</b>
      </span>
    </label>
  </li>
</template>