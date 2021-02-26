<template>
  <div class="navbar">
    <Hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <Screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" size="medium" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/navbar/avatar.jpg" class="user-avatar">
          <div class="user-name">超级管理员</div>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/profile/index">
              <el-dropdown-item>个人资料</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { ActionConstants, GetterConstants } from '@/store/modules/constants'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'

export default defineComponent({
  name: 'Navbar',
  components: { Hamburger, Screenfull },
  setup() {
    const store = useStore()
    const sidebar = computed(() => store.getters[GetterConstants.GetSidebar])
    const device = computed(() => store.getters[GetterConstants.GetDevice])
    const toggleSideBar = () => {
      store.dispatch(ActionConstants.HandleToggleSidebar)
    }
    return {
      sidebar,
      device,
      toggleSideBar
    }
  }
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      line-height: inherit;
      margin-right: 10px;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        display: flex;
        align-items: center;
        cursor: pointer;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .user-name {
          display: inline-block;
          padding: 0 5px 0 10px;
        }

        .el-icon-caret-bottom {
          padding: 0 10px 0 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
