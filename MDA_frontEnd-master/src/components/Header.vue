<template>
  <div class="header" style="width:100%">
    <div class="logo-panel">
      <img class="logo" src="../../public/白色.png" />
      <span class="logo-txt">CAD大数据中台</span>
    </div>
    <div class="nav">
      <a-menu v-if="navShow" mode="horizontal" @select="menuSelect" :defaultSelectedKeys="[$route.meta.menu]">
        <a-menu-item key="dev">开发中心</a-menu-item>
        <a-menu-item key="operatin" disabled>任务运维</a-menu-item>
        <a-menu-item key="dm">数据资产管理</a-menu-item>
        <a-menu-item key="mdaProjectList">多维数据建模分析</a-menu-item>
      </a-menu>
    </div>
    <div class="info">
      <div class="item">
        <a-icon type="bell" theme="filled" style="font-size:15px;color:#fff" />
      </div>
      <div class="item">
        <span style="font-size:13px;" @click="()=>{if($route.name!='home')$router.push({'name':'home'})}">管理中心</span>
      </div>
      <div class="item">
        <a-dropdown>
          <a class="ant-dropdown-link" href="#">
            admin
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">个人中心</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { Button, Menu, Icon, Dropdown } from 'ant-design-vue';

export default {
  props: {
    navShow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'a-button': Button,
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-icon': Icon,
    'a-dropdown': Dropdown
  },
  methods: {
    menuSelect(item) {
      this.$router.push({ 'name': item.key })
    }
  }
}
</script>
<style scoped>
.header {
  font-size: 16px;
  color: #fff;
  padding-left: 45px;
  width: 100%;
  height: 55px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.2);
  background: rgba(67, 117, 222, 1);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
  min-width: 1200px;
}
.logo-panel {
  width: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 25px;
}
.logo {
  width: 60px;
  height: 40px;
}
.logo-txt {
  font-size: 17px;
  margin: 0px;
  margin-left: 3px;
  font-weight: 490;
  color: #fff;
}
.nav {
  height: 100%;
  flex: 1;
}
.nav >>> .ant-menu {
  height: 100%;
  background: none;
  border: none;
  color: #fff !important;
}

.nav >>> .ant-menu:hove {
  color: #fff !important;
}
.nav >>> .ant-menu > .ant-menu-item {
  height: 100%;
  line-height: 55px;
  color: rgba(255, 255, 255, 0.95);
  position: relative;
  border: none;
}
.nav >>> .ant-menu > .ant-menu-item-selected::after {
  height: 100%;
  width: 60%;
  box-sizing: border-box;
  border-bottom: 3px solid #fff;
  position: absolute;
  left: 20%;
  top: 0;
  transition: all 0.6s ease-in-out;
  content: "";
}
.nav >>> .ant-menu > .ant-menu-item-selected {
  color: #fff;
  font-weight: 500;
  /* border-bottom: 2px solid #fff; */
  border: none;
}
.nav >>> .ant-menu > .ant-menu-item-active {
  color: #fff;
  border: none;
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  border: none;
  font-weight: 430;
}
.nav >>> .ant-menu > .ant-menu-item-disabled {
  color: rgba(240, 240, 240, 0.75) !important;
}
.info {
  width: 200px;
  line-height: 55px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
}
.info > .item {
  display: inline-block;
  height: 100%;
  line-height: 55px;
  padding: 0 10px;
  cursor: pointer;
}
.info >>> .ant-dropdown-link {
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
}
</style>
