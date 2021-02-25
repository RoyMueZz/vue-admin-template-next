<template>
  <div class="has-logo">
    <logo :collapse="!isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!isCollapse"
        :collapse-transition="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { GetterConstants } from '@/store/modules/constants'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss'

export default defineComponent({
  name: 'Sidebar',
  components: { Logo, SidebarItem },
  setup() {
    const store = useStore()
    const route = useRoute()
    const permissionRoutes = computed(() => store.getters[GetterConstants.GetPermissionRoutes])
    const sidebar = computed(() => store.getters[GetterConstants.GetSidebar])
    const isCollapse = computed(() => sidebar.value.opened)
    const activeMenu = computed(() => {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    return {
      variables,
      permissionRoutes,
      isCollapse,
      activeMenu
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
