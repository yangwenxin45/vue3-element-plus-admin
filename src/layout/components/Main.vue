<template>
    <div id="main-content">
        <router-view />
    </div>
</template>

<style lang="scss">
#main-content {
    background-color: #fff;
    padding: 20px;
    min-height: 100%;
    @include webkit(box-sizing, border-box);
}
</style>