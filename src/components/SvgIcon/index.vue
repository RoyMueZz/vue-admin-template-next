<template>
  <div
    v-if="canExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$attrs"
  />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String as PropType<string>,
      required: true
    },
    className: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    const canExternal = computed(() => isExternal(props.iconClass))
    const iconName = computed(() => `#icon-${props.iconClass}`)
    const svgClass = computed(() => props.className ? 'svg-icon ' + props.className : 'svg-icon')
    const styleExternalIcon = computed(() => ({ mask: `url(${props.iconClass}) no-repeat 50% 50%`, '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%` }))

    return {
      styleExternalIcon,
      canExternal,
      iconName,
      svgClass
    }
  },
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
