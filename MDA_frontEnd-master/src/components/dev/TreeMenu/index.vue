<template>
  <div style="height:100%;display:flex;flex-direction:column;z-index:0;overflow:hidden">
    <div class="option-panel">
      <div class="tab">
        <span class="tab-item" :class="{'is-alive':active_tab=='task'}" @click="tabChange('task')">任务</span>
        <span class="tab-item" :class="{'is-alive':active_tab=='data'}" @click="tabChange('data')">数据</span>
      </div>
      <div class="option-box">
        <icon class="option-item" type="plus"></icon>
        <icon class="option-item" type="sync"></icon>
      </div>
    </div>
    <div class="content">
      <div style="height:100%;padding:12px 15px" v-if="active_tab=='task'">
        <a-tree :treeData="treeList" style="font-size:13px" class="mytree" :filter-node-method="filterNode" ref="tree" @select="nodeClick" showIcon>
          <template slot="icon" slot-scope="{dataRef}">
            <i :class="[dataRef.icon,'icon']"></i>
          </template>
        </a-tree>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import { Tree, Icon } from 'ant-design-vue'
import ResizeLine from '../ResizeLine'
export default {
  components: {
    'a-tree': Tree, Icon, ResizeLine
  },
  props: {
    list: {
      default: () => {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      searchTxt: "",
      active_tab: "task"
    }
  },
  watch: {
    searchTxt(newVal, oldVal) {
      this.$refs.tree.filter(newVal);
    }
  },
  computed: {
    treeList() {
      var treeList = [...this.list]
      this.handleData(treeList)
      return treeList
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeClick(key, e) {
      this.$emit("nodeClick", e.node.dataRef, key)
    },
    tabChange(val) {
      this.active_tab = val
    },
    handleData(list) {
      if (list == undefined) {
        return;
      }
      for (var i in list) {
        var node = list[i];
        node.scopedSlots = { icon: "icon" }
        this.handleData(node.children)
      }
    }
  }
}
</script>
<style scoped>
.option-panel {
  width: 100%;
  height: 35px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
}
.tab {
  height: 100%;
  font-size: 13px;
  line-height: 35px;
  color: rgba(0, 0, 0, 0.65);
  margin-left: -25px;
}

.tab-item {
  display: inline-block;
  height: 100%;
  padding: 0 14px;
  cursor: pointer;
}
.is-alive {
  border-bottom: 2px solid #409eef;
  color: rgba(0, 0, 0, 0.95);
}
.option-box {
  height: 100%;
  position: absolute;
  right: 2px;
  top: 0;
}
.option-item {
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
  line-height: 35px;
  margin-right: 7px;
  /* padding: 0 5px; */
}
.content {
  flex: 1;
}
.createtask {
  height: 35px;
  width: 100%;
  border: 1px solid rgba(200, 200, 200, 0.65);
  border-radius: 3px;
}

.mytab >>> .is-active {
  color: #555 !important;
}
.mytab >>> .el-tabs__item {
  color: #999;
}
.search {
  display: block;
}
.search >>> .el-input__inner {
  height: 35px;
  line-height: 35px;
}

.custom-tree-node {
  position: relative;
  padding-left: 18px;
  overflow: hidden;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
}
.icon {
  height: 15px;
  width: 15px;
  line-height: 24px;
  margin-right: 5px;
  margin-top: 5px;
  /* position: absolute; */
  /* left: 0; */
  /* top: 50%; */
  /* margin: -8px 0px 0; */
  display: inline-block;
  vertical-align: initial;
  overflow: hidden;
}
.label {
  width: 90%;
  height: 36px;
  line-height: 36px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}
.mytree >>> .ant-tree-node-content-wrapper {
  position: relative;
}
.mytree >>> .ant-tree-node-content-wrappe::after {
  z-index: -1;
}
.mytree >>> .ant-tree-node-selected::after,
.mytree >>> .ant-tree-node-content-wrapper:hover::after {
  content: "";
  height: 32px;
  width: 1000px;
  position: absolute;
  left: -200px;
  top: -4px;
  z-index: -1;

  background: rgba(0, 154, 249, 0.1);
}
.mytree >>> .ant-tree-node-content-wrapper:hover {
  background-color: rgba(0, 0, 0, 0) !important;
}
.mytree >>> .ant-tree-node-selected {
  background-color: rgba(0, 0, 0, 0) !important;
}
.mytree >>> .ant-tree-title {
  user-select: none;
}
</style>
