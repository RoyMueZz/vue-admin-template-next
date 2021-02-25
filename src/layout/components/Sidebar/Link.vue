<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  name: 'Link',
  props: {
    to: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const _isExternal = computed(() => isExternal(props.to))
    const type = computed(() => {
      if (_isExternal.value) {
        return 'a'
      }
      return 'router-link'
    })

    const linkProps = (to: string) => {
      if (_isExternal.value) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return { to }
    }

    return {
      type,
      linkProps
    }
  }
})
</script>

