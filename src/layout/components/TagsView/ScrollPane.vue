<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, onUnmounted, inject, Ref } from 'vue'
import { RouterLinkProps } from 'vue-router'
import { ElScrollbar } from 'element-plus'
const tagAndTagSpacing = 4 // tagAndTagSpacing

interface WheelEventExtend extends WheelEvent {
  readonly wheelDelta: number;
}

interface RouterLinkPropsExtend extends RouterLinkProps {
  readonly $el: HTMLElement;
}

export default defineComponent({
  name: 'ScrollPane',
  emits: ['wheel', 'scroll'],
  setup(props, { emit }) {
    const scrollContainer = ref<InstanceType<typeof ElScrollbar>>(null)
    const tagInstances = inject<Ref<RouterLinkProps[]>>('tagInstances')

    const emitScroll = () => {
      emit('scroll')
    }

    const handleScroll = (e: WheelEventExtend) => {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      scrollContainer.value.wrap = scrollContainer.value.wrap + eventDelta / 4
    }

    const moveToTarget = (currentTag: RouterLinkProps) => {
      const $container = scrollContainer.value.wrap
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = scrollContainer.value.$refs.wrap
      let firstTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagInstances.value.length > 0) {
        firstTag = tagInstances.value[0]
        lastTag = tagInstances.value[tagInstances.value.length - 1]
      }

      if (firstTag === currentTag) {
        ($scrollWrapper as HTMLElement).scrollLeft = 0
      } else if (lastTag === currentTag) {
        ($scrollWrapper as HTMLElement).scrollLeft = ($scrollWrapper as HTMLElement).scrollWidth - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagInstances.value.findIndex(item => item === currentTag)
        const prevTag = tagInstances.value[currentIndex - 1]
        const nextTag = tagInstances.value[currentIndex + 1]

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = (nextTag as RouterLinkPropsExtend).$el.offsetLeft + (nextTag as RouterLinkPropsExtend).$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = (prevTag as RouterLinkPropsExtend).$el.offsetLeft - tagAndTagSpacing

        if (afterNextTagOffsetLeft > ($scrollWrapper as HTMLElement).scrollLeft + $containerWidth) {
          ($scrollWrapper as HTMLElement).scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < ($scrollWrapper as HTMLElement).scrollLeft) {
          ($scrollWrapper as HTMLElement).scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }

    onMounted(() => {
      scrollContainer.value.wrap.addEventListener('scroll', emitScroll, true)
    })

    onUnmounted(() => {
      scrollContainer.value.wrap.removeEventListener('scroll', emitScroll)
    })

    return {
      scrollContainer,
      handleScroll,
      moveToTarget
    }
  }
})
</script>




<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  // https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md
  ::v-deep(.el-scrollbar__bar){
    bottom: 0px;
  }
  ::v-deep(.el-scrollbar__wrap){
    height: 49px;
  }
}
</style>
