<template>
  <el-menu-item v-if="sidebarLogo" :class="{'submenu-title-noDropdown':isCollapse}" index="0" style="pointer-events: none;">
    <!-- 缩小时显示的logo，可以自定义，这里直接使用图标库中的 -->
    <svg-icon v-if="isCollapse" icon-class="smalllogo" />
    <!--正常状态下显示的，可以使用本地的logoImg-->
    <div style="height:90px;align-items: center;">
      <img src="../../../../static/icon1.png" style="width:auto;height:auto;max-width:100%;max-height:100%;">
    </div>
  </el-menu-item>
</template>

<script>
// import logoImg from '@/assets/logo/logo.png'
import { mapState } from 'vuex'
export default {
  name: 'Logo',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // logoImg: logoImg
    }
  },
  computed: {
    ...mapState({
      sidebarLogo: state => state.settings.sidebarLogo
    })
  }
}
</script>

<style scoped>

</style>
