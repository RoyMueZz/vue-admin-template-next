<template>
  <div :class="{'show':show}" class="header-search">
    <i class="el-icon-search search-icon" @click.stop="handleClick"></i>
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      reserve-keyword
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="handleChange"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script lang='ts'>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'
import { computed, ref, defineComponent, watch, onMounted, nextTick } from 'vue'
import { useStore } from '@/store'
import { GetterConstants } from '@/store/modules/constants'
import { RouteLocationRaw, useRouter, _RouteRecordBase } from 'vue-router'
import { ElSelect } from 'element-plus'

interface Options {
  path: string;
  title: string[];
}

export default defineComponent({
  name: 'HeaderSearch',
  emits: ['click', 'change'],
  setup() {
    const store = useStore()
    const router = useRouter()
    const headerSearchSelect = ref<InstanceType<typeof ElSelect>>(null)
    const search = ref<string>('')
    const options = ref<Options[] | []>([])
    const searchPool = ref<Options | []>([])
    const show = ref<boolean>(false)
    const fuse = ref<Fuse<Options>>(null)
    const routes = computed(() => store.getters[GetterConstants.GetPermissionRoutes])

    const handleClick = () => {
      show.value = !show.value
      if (show.value) {
        headerSearchSelect.value && headerSearchSelect.value.focus()
      }
    }

    const close = () => {
      headerSearchSelect.value && headerSearchSelect.value.blur()
      options.value = []
      show.value = false
    }

    const handleChange = (val: { path: RouteLocationRaw }) => {
      router.push(val.path)
      search.value = ''
      options.value = []
      nextTick(() => {
        show.value = false
      })
    }

    const initFuse = (list: { path: string; title: string[] }[]) => {
      fuse.value = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    }

    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    const generateRoutes = (routes: _RouteRecordBase[], basePath = '/', prefixTitle: string[] = []): Options[] => {
      let res: Options[] = []

      for (const router of routes) {
        // skip hidden router
        if (router.meta && router.meta.hidden) { continue }

        const data: Options = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title] as string[]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }

    const querySearch = (query: string) => {
      if (query !== '') {
        options.value = []
        const querys = fuse.value.search(query)
        querys.forEach(item => {
          (options.value as Options[]).push(item.item)
        })
      } else {
        options.value = []
      }
    }

    watch(() => routes.value, () => {
      (searchPool.value as Options[]) = generateRoutes(routes.value)
    })

    watch(() => searchPool.value, (list) => {
      initFuse(list as Options[])
    })

    watch(() => show.value, (value) => {
      value ? document.body.addEventListener('click', close) : document.body.removeEventListener('click', close)
    })

    onMounted(() => {
      (searchPool.value as Options[]) = generateRoutes(routes.value)
    })


    return {
      headerSearchSelect,
      handleClick,
      handleChange,
      querySearch,
      show,
      search,
      options
    }
  }
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
