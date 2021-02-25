<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container hasTagsView">
      <div class="fixed-header">
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import { useStore } from '@/store'
import { GetterConstants, ActionConstants } from '@/store/modules/constants'
import ResizeHandler from './hooks/ResizeHandler'


export default defineComponent({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  setup() {
    const store = useStore()
    const sidebar = computed(() => store.getters[GetterConstants.GetSidebar])
    const device = computed(() => store.getters[GetterConstants.GetDevice])
    const classObj = computed(() => {
      return {
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile'
      }
    })

    ResizeHandler()

    const handleClickOutside = () => {
      store.dispatch(ActionConstants.HandleCloseSidebar, { withoutAnimation: false })
    }

    return {
      classObj,
      sidebar,
      device,
      handleClickOutside
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 64px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
