<template>
  <a-layout id="components-layout-fixed-sider">
    <a-layout-sider id="metadata-sider" class="ant-menu-inline" theme="light" collapsible v-model="collapsed" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <a-row id="metadata-sider-logo" type="flex" justify="space-between">
        <a-col v-if="!collapsed">
          <a-icon type="appstore" />
        </a-col>
        <a-col>
          <span>控制台</span>
        </a-col>
      </a-row>
      <div style="padding: 0 10px">
        <a-divider style="margin:10px 0" />
      </div>
      <a-menu id="metadata-menu" theme="light" :defaultOpenKeys="['sub1']" :defaultSelectedKeys="['4']" mode="inline">
        <a-menu-item key="1">
          <a-icon :component="dataAssetSvg" />
          <span>数据资产</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <span slot="title">
            <a-icon type="bar-chart" />
            <span>数据管理</span>
          </span>
          <a-menu-item key="3">
            <a-icon :component="dataCollectionSvg" />
            <span>数据采集</span>
          </a-menu-item>
          <a-menu-item key="4">
            <a-icon type="file-search" />
            <span>数据查询</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title">
            <a-icon type="tags" />
            <span>标签管理</span>
          </span>
          <a-menu-item key="6">
            <a-icon :component="tagMapSvg" />
            <span>标签地图</span>
          </a-menu-item>
          <a-menu-item key="8">
            <a-icon :component="tagPoolSvg" />
            <span>标签池</span>
          </a-menu-item>
          <a-menu-item key="9">
            <a-icon :component="tagScenarioSvg" />
            <span>标签场景</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <div :style="{width: (collapsed)?'80px':'200px'}"></div>

    <a-layout>
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <a-row type="flex" justify="space-around">
          <a-col :xl="5" style="min-width: 190px">
            <a-card id="cardlist" title="条件筛选" style="background-color: white;width: 100%;height: 100%">
              <a-card style="width:100%;border-bottom: 1px solid #e8e8e8;border-top: 1px solid #e8e8e8;" :bordered="false">
                <a-row style="margin-bottom: 15px;font-size: 16px;font-weight: 500">
                  <a-col>
                    <span>数据环境</span>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col>
                    <a-checkbox-group @change="onChange">
                      <a-row>
                        <a-col>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="A">生产环境(100)</a-checkbox>
                            </a-col>
                          </a-row>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="B">开发环境(200)</a-checkbox>
                            </a-col>
                          </a-row>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-col>
                </a-row>
              </a-card>
              <a-card style="width:100%;" :bordered="false">
                <a-row style="margin-bottom: 15px;font-size: 16px;font-weight: 500">
                  <a-col>
                    <span>存储种类</span>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col>
                    <a-checkbox-group @change="onChange">
                      <a-row>
                        <a-col>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="A">Hive(110)</a-checkbox>
                            </a-col>
                          </a-row>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="D">HBase(700)</a-checkbox>
                            </a-col>
                          </a-row>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="B">HDFS(79)</a-checkbox>
                            </a-col>
                          </a-row>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="C">MYSQL(100)</a-checkbox>
                            </a-col>
                          </a-row>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="E">MongoDB(100)</a-checkbox>
                            </a-col>
                          </a-row>
                          <a-row class="checkboxRow">
                            <a-col>
                              <a-checkbox value="F">Elasticsearch(100)</a-checkbox>
                            </a-col>
                          </a-row>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-col>
                </a-row>
              </a-card>
            </a-card>
          </a-col>
          <a-col :xl="18" :md="17">
            <div :style="{ background: '#fff',padding: '24px', }">
              <a-row type="flex" justify="space-between">
                <a-col :span="8">
                  <span style="font-size: 25px;font-weight: 400">数据库列表</span>
                </a-col>
                <a-col :span="8">
                  <a-input-search size="large" style="margin-bottom: 30px" placeholder="输入数据库名称" @search="onSearch" enterButton />
                </a-col>
              </a-row>
              <a-table :columns="columns" :dataSource="data">
                <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
                <span slot="customTitle">
                  <a-icon type="smile-o" />数据库名称
                </span>
                <span slot="tags" slot-scope="tags">
                  <a-tag v-for="tag in tags" :color="tag==='开发环境' ? 'geekblue' : 'green'" :key="tag">{{tag.toUpperCase()}}</a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                  <a href="javascript:;">Invite 一 {{record.name}}</a>
                  <a-divider type="vertical" />
                  <a href="javascript:;">Delete</a>
                  <a-divider type="vertical" />
                  <a href="javascript:;" class="ant-dropdown-link">
                    More actions
                    <a-icon type="down" />
                  </a>
                </span>
              </a-table>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">BDP ©2019 Created by CAD</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import dataCollectionSvg from '@/assets/assets_dm/svg/datacollection.svg'; // path to your '*.svg' file.
import dataAssetSvg from '@/assets/assets_dm/svg/dataasset.svg'; // path to your '*.svg' file.
import tagMapSvg from '@/assets/assets_dm/svg/tagmap.svg'; // path to your '*.svg' file.
import tagPoolSvg from '@/assets/assets_dm/svg/tagpool.svg'; // path to your '*.svg' file.
import tagScenarioSvg from '@/assets/assets_dm/svg/tagscenario.svg'; // path to your '*.svg' file.
// require('@/assets/assets_dm/svg/datamanage.svg')

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '大小(MB)',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '存储类型',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '数据环境',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  {
    title: '备注',
    dataIndex: 'action',
    key: 'action',
  },
];

const data = [
  {
    key: '1',
    name: 'firbird',
    age: 567,
    address: 'Hive',
    tags: ['开发环境'],
    action: '计生委备用数据库'
  },
  {
    key: '2',
    name: 'jishengwei',
    age: 412,
    address: 'Hive',
    tags: ['生产环境'],
    action: '计生委原数据库'

  },
  {
    key: '3',
    name: 'people_new',
    age: 3200,
    address: 'HDFS',
    tags: ['生产环境'],
    action: '新入人员数据库'
  },
  {
    key: '4',
    name: 'dataset_capacity',
    age: 3322,
    address: 'MYSQL',
    tags: ['开发环境'],
    action: '数据容量记录数据库'

  },
  {
    key: '5',
    name: 'dataset_index',
    age: 42,
    address: 'MYSQL',
    tags: ['开发环境'],
    action: '数据索引记录数据库'

  },
  {
    key: '6',
    name: 'dataset_reference',
    age: 45,
    address: 'HBase',
    tags: ['开发环境'],
    action: '数据引用记录数据库'

  },
  {
    key: '7',
    name: 'dict_dataset_field_comment',
    age: 77,
    address: 'HBase',
    tags: ['开发环境'],
    action: '数据字段关系记录数据库'

  },
  {
    key: '8',
    name: 'INNODB_SYS_TABLESPACES',
    age: 50,
    address: 'MYSQL',
    tags: ['生产环境'],
    action: '数据引用记录数据库'

  },
  {
    key: '9',
    name: 'dataset_compliance',
    age: 32,
    address: 'HDFS',
    tags: ['开发环境'],
    action: '数据集记录数据库'

  },
  {
    key: '10',
    name: 'INNODB_CMP_PER_INDEX',
    age: 45,
    address: 'Hive',
    tags: ['开发环境'],
    action: '数据INNODB引擎数据库'
  },


];


export default {
  data() {
    return {
      dataCollectionSvg,
      dataAssetSvg,
      tagMapSvg,
      tagPoolSvg,
      tagScenarioSvg,
      collapsed: false,
      data,
      columns
    };
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
#cardlist > .ant-card-body {
  padding: 0;
}
#components-layout-fixed-sider {
  /* margin-top: 55px; */
}
</style>
