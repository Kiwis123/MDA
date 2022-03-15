<template>

  <a-layout id="components-layout-fixed-sider">
    <a-layout-sider id="metadata-sider" class="ant-menu-inline" theme="light" collapsible v-model="collapsed" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <a-row id="metadata-sider-logo" type="flex" justify="space-between">
<!--        <a-col v-if="!collapsed">-->
<!--          <a-icon type="appstore" />-->
<!--        </a-col>-->
        <a-col>
          <span>数据分析</span>
        </a-col>
      </a-row>
      <div style="padding: 0 10px">
        <a-divider style="margin:10px 0" />
      </div>
      <a-menu id="metadata-menu" theme="light" @select="menuSelect" :defaultOpenKeys="['dataPrepare']" :defaultSelectedKeys="['dataPrepare']" :selectedKeys="[currentPath]" mode="inline">
        <a-menu-item key="dataPrepare">
          <a-icon :component="dataPrepareSvg"/>
          <span>数据准备</span>
        </a-menu-item>
        <a-menu-item key="analysis">
          <a-icon :component="analysisSvg"/>
          <span>多维数据分析</span>
        </a-menu-item>
        <a-menu-item key="cockpit">
          <a-icon :component="cockpitSvg" />
          <span>驾驶舱</span>
        </a-menu-item>
      </a-menu>

      <div style="height: 50px"></div>

      <a-row id="metadata-sider-logo1" type="flex" justify="space-between">
<!--        <a-col v-if="!collapsed">-->
<!--          <a-icon type="appstore" />-->
<!--        </a-col>-->
        <a-col>
          <span>数据管理</span>
        </a-col>
      </a-row>
      <div style="padding: 0 10px">
        <a-divider style="margin:10px 0" />
      </div>
      <a-menu id="metadata-menu1" theme="light" @select="menuSelect" :defaultOpenKeys="[]" :selectedKeys="[currentPath]" mode="inline">
        <a-sub-menu key="sub1">
          <span slot="title">
            <a-icon :component="cubeSvg" />
            <span>Cube管理</span>
          </span>
          <a-menu-item key="cubeList">
            <a-icon :component="cubeSvg" />
            <span>Cube列表</span>
          </a-menu-item>
          <a-menu-item key="createCube">
            <a-icon :component="buildSvg" />
            <span>手动构建Cube</span>
          </a-menu-item>
            <a-menu-item key="jobList">
                <a-icon :component="jobSvg" />
                <span>构建任务列表</span>
            </a-menu-item>
        </a-sub-menu>
          <a-sub-menu key="sub2">
          <span slot="title">
            <a-icon :component="optimizeSvg" />
            <span>多维查询优化</span>
          </span>
              <a-menu-item key="dashBoard">
                  <a-icon :component="dashboardSvg" />
                  <span>查询引擎概览</span>
              </a-menu-item>
              <a-menu-item key="optimizeSetting">
                  <a-icon :component="setSvg" />
                  <span>Cube优化设置</span>
              </a-menu-item>
          </a-sub-menu>
        <a-menu-item key="dataView">
          <a-icon :component="relationSvg" />
          <span>数据表关联视图</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- content 的边界样式 -->
      <a-layout-content :style="{ marginLeft: (collapsed)?'80px':'200px'}">
        <!-- 在layout 的 content 里进行路由 -->
        <div>
          <router-view></router-view>
        </div>

      </a-layout-content>
<!--      <a-layout-footer :style="{ textAlign: 'center' }">BDP ©2019 Created by CAD</a-layout-footer>-->
    </a-layout>
  </a-layout>
</template>

<script>
import dataPrepareSvg from '@/assets/assets_mda/svg/jiazai.svg'; // path to your '*.svg' file.
import relationSvg from '@/assets/assets_mda/svg/moxing.svg'; // path to your '*.svg' file.
import cockpitSvg from '@/assets/assets_mda/svg/qiapianmoshi.svg'; // path to your '*.svg' file.
import cubeSvg from '@/assets/assets_mda/svg/cangku-2.svg'; // path to your '*.svg' file.
import analysisSvg from '@/assets/assets_mda/svg/shujutu.svg'; // path to your '*.svg' file.
import jobSvg from '@/assets/assets_mda/svg/liebiaomoshi.svg'; // path to your '*.svg' file.
import dashboardSvg from '@/assets/assets_mda/svg/yibiaopan.svg'; // path to your '*.svg' file.
import optimizeSvg from '@/assets/assets_mda/svg/youhua.svg'; // path to your '*.svg' file.
import buildSvg from '@/assets/assets_mda/svg/goujian.svg'; // path to your '*.svg' file.
import setSvg from '@/assets/assets_mda/svg/shezhi.svg'; // path to your '*.svg' file.


export default {
/*eslint-disable*/
  data() {
    return {
      dataPrepareSvg,
      relationSvg,
      cockpitSvg,
      cubeSvg,
      analysisSvg,
      jobSvg,
      dashboardSvg,
      optimizeSvg,
      buildSvg,
      setSvg,
      collapsed: false,
      currentPath: this.$route.name,
    };
  },
    created(){
      console.log(this.currentPath.split('/')[2]);
    },
    watch:{
      $route(to, from){
          this.currentPath = to.name;
        }
    },
  methods: {
    onSearch(value) {
      console.log(value);
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues);
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    menuSelect(item) {
        console.log(this.currentPath.split('/')[2]);
      this.$router.push({ 'name': item.key })
        console.log(this.currentPath.split('/')[2]);
    }
  },
}
</script>

<style>
.checkboxRow {
  margin-bottom: 10px;
}

#metadata-sider {
  border-right: 1px solid #e8e8e8;
}
#metadata-sider > .ant-layout-sider-trigger {
  border-right: 1px solid #e8e8e8;
}
#metadata-sider-logo {
  width: 75px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin-left: 18px;
  margin-top: 20px;
  font-size: 16px;
}

#metadata-menu {
  border-right: 0px;
}
#metadata-sider-logo1 {
    width: 75px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin-left: 18px;
    margin-top: 20px;
    font-size: 16px;
}

#metadata-menu1 {
    border-right: 0px;
}

#cardlist > .ant-card-body {
  padding: 0;
}
#components-layout-fixed-sider {
  /* margin-top: 55px; */
}
/*svg.icon{*/
/*  font-size: 20px;*/
/*}*/
.ant-menu-item .anticon .icon {
    font-size: 20px;
}
span .anticon .icon {
    font-size: 20px;
}
    /*.content{*/
    /*    background-color: #f0f2f5;*/
    /*}*/
</style>
