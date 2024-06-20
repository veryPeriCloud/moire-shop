<script setup lang="ts">
import { computed } from 'vue';

interface IQuery {
  [key: string]: string
}

const props = defineProps<{
  path: string;
  totalPages: number;
  query: IQuery
}>();

const emit = defineEmits<{
  (e: "update", value: string): void
}>();

const currentPage = computed((): number => {
  return props.query.page !== undefined
    ? parseInt(props.query.page)
    : 1
});

const getPageUrl = (page: number): string => {
  let q = JSON.parse(JSON.stringify(props.query));
  q.page = page;
  return (
    props.path +
    "?" +
    Object.keys(q)
      .map((key) => {
        return key + "=" + q[key];
      })
      .join("&")
  );
};
</script>

<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <router-link
        :to="getPageUrl(currentPage - 1)"
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': currentPage <= 1}"
        aria-label="Предыдущая страница"
        @click.prevent="emit('update', currentPage - 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </router-link>
    </li>
    <li class="pagination__item"
      v-for="pageNumber in props.totalPages"
      :key="pageNumber"
    >
      <router-link
        :to="getPageUrl(pageNumber)"
        class="pagination__link" 
        :class="{'pagination__link--current': pageNumber === currentPage}"
        @click.prevent="emit('update', pageNumber)"
      >
        {{ pageNumber }}
      </router-link>
    </li>
    <li class="pagination__item">
      <router-link
        :to="getPageUrl(currentPage + 1)"
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': currentPage >= totalPages}"
        href="#"
        aria-label="Следующая страница"
        @click.prevent="emit('update', currentPage + 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.pagination__link {
  cursor: pointer;
}

.pagination__link--disabled {
  pointer-events: none;
}
</style>
