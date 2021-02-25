<template>
  <div v-if="!item.meta || (item.meta && !item.meta.hidden)">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <i v-if="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :class="[onlyOneChild.meta.icon||(item.meta&&item.meta.icon)]" />
            <template #title>
              <span v-if="onlyOneChild.meta.title">
                {{ onlyOneChild.meta.title }}
              </span>
            </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <i v-if="item.meta" :class="[item.meta && item.meta.icon]" />
      <template #title>
        <span v-if="item.meta && item.meta.title">
          {{ item.meta.title }}
        </span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>


<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import AppLink from './Link.vue'
import FixiOSBug from './FixiOSBug'
import { isExternal } from '@/utils/validate'
import path from 'path'
import { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    },
    isNest: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    basePath: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    const onlyOneChild = ref(null)
    const subMenu = ref(null)
    const hasOneShowingChild = (children: RouteRecordRaw[] = [], parent: RouteRecordRaw) => {
      const showingChildren = children.filter((item: RouteRecordRaw) => {
        if (item.meta && item.meta.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          onlyOneChild.value = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ... parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    }

    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    FixiOSBug(subMenu)

    return {
      onlyOneChild,
      hasOneShowingChild,
      resolvePath,
      subMenu
    }
  }
})
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>


