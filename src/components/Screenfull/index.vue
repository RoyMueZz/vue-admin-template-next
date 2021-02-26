<template>
  <i :class="isFullscreen?'el-icon-copy-document':'el-icon-full-screen'" @click="handleClick" />
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import screenfull from 'screenfull'

export default defineComponent({
  name: 'Screenfull',
  setup() {
    const isFullscreen = ref<boolean>(false)

    const handleClick = () => {
      if (!screenfull.isEnabled) {
        getCurrentInstance().appContext.config.globalProperties.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }


    const change = () => {
      isFullscreen.value = (screenfull as screenfull.Screenfull).isFullscreen
    }

    const init = () => {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }

    const destroy = () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      isFullscreen,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
