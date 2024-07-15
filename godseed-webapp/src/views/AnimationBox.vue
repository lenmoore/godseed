<template>
    <div class="animation-box-wrapper">
        <small style="color: black;">
            {{ item }}
        </small>
    </div>
</template>

<script>
export default {
    name: 'AnimationBox',
    props: {
        item: Object
    }
}
</script>

<style lang="scss">

.animation-box-wrapper {

    height: 100%;
    width: 100%;
    &:hover {
        border: 1px solid blue;
    }
}
</style>