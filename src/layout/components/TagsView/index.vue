<template>
  <div id="tags-view-container" ref="tagsViewContainer" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" :visitedViews="visitedViews" @scroll="handleScroll">
      <router-link
        v-for="(tag, i) in visitedViews"
        :ref="el => { if (el) tagInstance[i] = el }"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, watch, onMounted, nextTick, onBeforeUpdate, provide, readonly } from 'vue'
import { useStore } from '@/store'
import { GetterConstants, ActionConstants } from '@/store/modules/constants'
import { useRoute, useRouter, _RouteLocationBase, RouteRecordRaw, RouterLinkProps } from 'vue-router'
import ScrollPane from './ScrollPane.vue'
import path from 'path'

export default defineComponent({
  name: 'TagsView',
  emits: ['contextmenu'],
  components: { ScrollPane },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const visible = ref<boolean>(false)
    const top = ref<number>(0)
    const left = ref<number>(0)
    const selectedTag = ref<_RouteLocationBase | object>({})
    const affixTags = ref<_RouteLocationBase[]>([])
    const tagInstance = ref<RouterLinkProps[]>([])
    const scrollPane = ref<InstanceType<typeof ScrollPane>>(null)
    const tagsViewContainer = ref<Nullable<HTMLElement>>(null)

    provide('tagInstances', readonly(tagInstance))



    function isActive(_route: _RouteLocationBase): boolean {
      return _route.path === route.path
    }

    function isAffix(tag: _RouteLocationBase) {
      return tag.meta && tag.meta.affix
    }

    function filterAffixTags(routes: RouteRecordRaw[], basePath = '/'): _RouteLocationBase[] {
      let tags: _RouteLocationBase[] = []
      routes.forEach((route: RouteRecordRaw) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          } as _RouteLocationBase)
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    function addTags(): boolean {
      const { name } = route
      if (name) {
        store.dispatch(ActionConstants.HandleAddView, route)
      }
      return false
    }

    function moveToCurrentTag() {
      nextTick(() => {
        for (const tag of tagInstance.value) {
          if ((tag.to as _RouteLocationBase).path === route.path) {
            scrollPane.value.moveToTarget(tag as RouterLinkProps)
            // when query is different then update
            if ((tag.to as _RouteLocationBase).fullPath !== route.fullPath) {
              store.dispatch(ActionConstants.HandleUpdateVisitedView, route)
            }
          }
        }
      })
    }

    function refreshSelectedTag(view: _RouteLocationBase) {
      store.dispatch(ActionConstants.HandleDelCachedView, view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    }

    function toLastView(visitedViews: _RouteLocationBase[], view: _RouteLocationBase) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }

    function closeSelectedTag(view: _RouteLocationBase) {
      store.dispatch(ActionConstants.HandleDelView, view).then(({ visitedViews }: { visitedViews: _RouteLocationBase[] }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }

    function closeOthersTags() {
      router.push(selectedTag.value)
      store.dispatch(ActionConstants.HandleDelOthersViews, selectedTag.value as _RouteLocationBase).then(() => {
        moveToCurrentTag()
      })
    }

    function closeAllTags(view: _RouteLocationBase) {
      store.dispatch(ActionConstants.HandleDelAllViews).then(({ visitedViews }: { visitedViews: _RouteLocationBase[] }) => {
        // TODO 之前的 vue-element-admin 当前的页面不是首页（高亮的地方不是首页）的时候，右键点击 close all 时，剩下的一个首页的tab时也不会高亮
        // if (affixTags.value.some(tag => tag.path === view.path)) {
        //   return
        // }
        toLastView(visitedViews, view)
      })
    }

    function openMenu(tag: _RouteLocationBase, e: MouseEventInit) {
      const menuMinWidth = 105
      const offsetLeft = tagsViewContainer.value.getBoundingClientRect().left // container margin left
      const offsetWidth = tagsViewContainer.value.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const _left = e.clientX - offsetLeft + 15 // 15: margin right

      if (_left > maxLeft) {
        left.value = maxLeft
      } else {
        left.value = _left
      }

      top.value = e.clientY
      visible.value = true
      selectedTag.value = tag
    }

    function closeMenu() {
      visible.value = false
    }

    function handleScroll() {
      closeMenu()
    }


    const routes = computed(() => store.getters[GetterConstants.GetPermissionRoutes])

    function initTags() {
      const _affixTags = affixTags.value = filterAffixTags(routes.value)
      for (const tag of _affixTags) {
        // Must have tag name
        if (tag.name) {
          store.dispatch(ActionConstants.HandleAddVisitedView, tag)
        }
      }
    }

    onMounted(() => {
      initTags()
      addTags()
    })

    const visitedViews = computed(() => store.getters[GetterConstants.GetVisitedViews])



    watch(() => route.path, () => {
      addTags()
      moveToCurrentTag()
    })

    watch(() => visible.value, (v) => {
      if (v) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    // 确保在每次更新之前重置ref
    // https://v3.cn.vuejs.org/guide/composition-api-template-refs.html#template-refs
    onBeforeUpdate(() => {
      tagInstance.value = []
    })

    return {
      left,
      top,
      tagsViewContainer,
      selectedTag,
      tagInstance,
      scrollPane,
      visible,
      handleScroll,
      visitedViews,
      isActive,
      isAffix,
      closeSelectedTag,
      closeOthersTags,
      openMenu,
      refreshSelectedTag,
      closeAllTags
    }
  }
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
