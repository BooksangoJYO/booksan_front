<template>
  <Header v-if="!isHidden"/>
  <router-view/>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/commons/Header.vue';

const route = useRoute();

const hiddenPaths = ['/login', '/signup','/logout','/auth','/chat']; 
const isHidden = computed(() => hiddenPaths.some(path => route.path.startsWith(path) || route.path === path));
</script>

<style>
@import url("https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css");

#app {
    font-family: "NanumSquare", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-width: 1400px;
}

/* Headings */
h1 {
    font-size: 32px;
    line-height: 48px;
    font-weight: 700;
}

h2 {
    font-size: 24px;
    line-height: 36px;
    font-weight: 700;
}

h3 {
    font-size: 20px;
    line-height: 30px;
    font-weight: 700;
}

h4 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
}

/* Body Text */
body {
    font-size: 17px;
    line-height: 21px;
}

.body-bold {
    font-size: 14px;
    line-height: 21px;
    font-weight: 700;
}

.body-regular {
    font-size: 14px;
    line-height: 21px;
    font-weight: 400;
}

/* Caption */
.caption {
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
}

.wrap {
    padding-bottom: 50px;
}

.font-bold {
    font-weight: 700;
}

.font-regular {
    font-weight: 400;
}
</style>
