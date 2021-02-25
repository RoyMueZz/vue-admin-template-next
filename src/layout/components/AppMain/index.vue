<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
import { GetterConstants } from '@/store/modules/constants'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'AppMain',
  setup() {
    const store = useStore()
    const route = useRoute()
    const cachedViews = computed(
      () => store.getters[GetterConstants.GetCachedViews]
    )
    const key = computed(() => route.path)

    return {
      cachedViews,
      key,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: 100vh;
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
