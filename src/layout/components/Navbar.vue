<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="header">
      <div class="header-left"></div>
      <div class="header-center"></div>
      <div class="header-right"></div>
    </div>

    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              回到首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 88px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .header {
    position: absolute;
    left: 0;
    top: 0;
    height: 88px;
    display: flex;
    align-items: center;
    background: rgba(29, 67, 84, 1);
    width: 100%;
    .header-left {
      flex: 1;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-left.svg");
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: cover;
      display: flex;
      align-items: center;
      padding-left: px2vw(30);
      color: rgba(0, 242, 255, 1);
      font-weight: 400;
    }
    .header-center {
      width: 488px;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-title1.svg");
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 242, 255, 1);
      font-weight: 400;
      font-size: 36px;
    }

    .header-right {
      flex: 1;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-right.svg");
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: px2vw(27);
      color: rgba(0, 242, 255, 1);
      font-size: 14px;
      .filter {
        background-image: url("../../assets/svgs/detail-header-filter.svg");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        height: 30px;
        width: 166px;
        display: flex;
        align-items: center;
        margin-left: 24px;
        padding-left: 10px;
        padding-right: 10px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

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

  .breadcrumb-container {
    float: left;
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
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
