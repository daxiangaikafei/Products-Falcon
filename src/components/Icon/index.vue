<template>
  <svg
      v-bind:style="styles"
      class="icon">
      <use :xlink:href="`${svgUrl}#icon-${iconName}`"></use>
    </svg>
</template>
<script>
  import svgUrl from 'assets/iconsvg/symbol-defs.svg'
  export default {
    name: 'Icon',
    props: {
      iconName: {
        type: String,
        required: true,
        default: 'home'
      },
      size: {
        type: Number,
        default: 16
      },
      color: {
        type: String,
        default: 'currentColor'
      },
      style: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        styles: {
          width: this.size + 'px',
          height: this.size + 'px',
          fill: this.color,
          ...this.style
        },
        svgUrl
      }
    }

  }
</script>
<style lang="scss">
.icon {
    display: inline-block;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
}
</style>
