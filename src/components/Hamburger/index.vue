<template>
    <div @click="toggleClick">
        <Icon icon-name="menu" :color="'#fff'" :size="24" class="ham-icon hamburger" :class="{'is-active':isActive}" ></Icon>
    </div>
</template>

<script>
    export default {
      name: 'hamburger',
      props: {
        isActive: {
          type: Boolean,
          default: false
        },
        toggleClick: {
          type: Function,
          default: null
        }
      }
    }
</script>

<style scoped>
    .hamburger {
        display: inline-block;
        cursor: pointer;
        width: 20px;
        height: 20px;
        transform: rotate(0deg);
        transition: .38s;
        transform-origin: 50% 50%;
    }
    .hamburger.is-active {
        transform: rotate(90deg);
    }
</style>
