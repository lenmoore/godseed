<script setup>
import { RouterView } from 'vue-router'

console.log(import.meta.env.VITE_API_BASE_URL) // Add this line in your component or http.js

</script>

<template>
    <div style="background-color: #181818">
        <a href="/params" style="font-size: 1.5rem; background-color: #2c3e50">Toggle parameters</a>
        -|-
        <a href="/scenes">Edit scenes</a>
        <RouterView />
    </div>
</template>

<style scoped>
header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin: 0;
    padding: 0.5rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

    }
}
</style>
