<template>
  <Header v-if="!isHidden"/>
  <router-view/>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/commons/Header.vue';

const route = useRoute();

const hiddenPaths = ['/login', '/signup','/logout','/mypage','/profileInfo','/auth','/chat']; 
const isHidden = computed(() => hiddenPaths.some(path => route.path.startsWith(path) || route.path === path));
</script>
