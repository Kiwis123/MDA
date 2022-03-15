<template>
  <div style="height:100%;width:100%">
    <a-tabs class="logtab" closable :lazy="true" type="card">
      <a-tab-pane tab="运行日志" style="overflow:hidden;height:100%">
        <div class="log-txt">
          <pre ref="log_scroll" style="word-break: break-all;word-wrap: break-word;padding: 10px 5px;background: #fff;font-size: 12px;height: 100%;overflow: auto;margin:0">
<span>{{log}}</span>
        </pre>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="结果1" v-for="(result,index) in results" :key="index" style="overflow:hidden;height:100%">
        <div style="height:100%;width:100%;display:flex;flex-direction: column;">
          <!-- <div style="flex:1;overflow:hidden"> -->
          <a-table :columns="getCols(result.title)" :dataSource="result.data" bordered size="small" tableLayout="fixed">
            <!-- <template v-for="(col,index) in result.title" :slot="col" slot-scope="text,record">
              <div :key="col">
                <div>123</div>
              </div>
            </template>-->
            <p  slot="loc" slot-scope="record" style="margin: 0" >{{record}}123</p>
          </a-table>
          <!-- </div> -->
          <!-- <div style="height:60px"></div> -->
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
/*eslint-disable */
import { Tabs } from 'ant-design-vue'
export default {
  components: {
    'a-tabs': Tabs, 'a-tab-pane': Tabs.TabPane
  },
  props: {
    log: {
      type: String,
      default: ""
    },
    results: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    log(n, o) {
      this.$nextTick(() => {
        var el = this.$refs.log_scroll
        el.scrollTop = el.scrollHeight
      })
    },
    results(n, o) {
      console.log(n, o)
    }
  },
  methods: {
    getCols(titles) {
      var cols = []
      for (var i = 0; i < titles.length; i++) {
        // if (titles[i] == 'loc' || titles[i] == 'cover' || titles[i] == 'url') continue
        var col = {}
        col.title = titles[i]
        col.dataIndex = titles[i]
        col.key = titles[i]
        col.ellipsis = true
        if (i != titles.length - 1)
          col.width = '120px'
        cols.push(col)
      }
      console.log(cols)
      return cols
    }
  }
}
</script>
<style scoped>
.logtab {
  height: 100%;
  padding: 0;
  border-left: none;
  border-right: none;
  box-shadow: none;
}
.log-txt {
  height: 100%;
  width: 100%;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.65);
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
    monospace;
}
</style>
<style>
.logtab > .ant-tabs-bar {
  margin: 0;
  height: 30px;
  overflow: hidden;
}
.logtab
  > .ant-tabs-bar
  > .ant-tabs-nav-container
  > .ant-tabs-nav-wrap
  > .ant-tabs-nav-scroll
  > .ant-tabs-nav
  > div
  > .ant-tabs-tab {
  color: rgba(0, 0, 0, 0.65);
  height: 100%;
  width: 120px;
  max-width: 140px;
  min-width: 90px;
  height: 30px;
  line-height: 30px;
  border: none;
  border-radius: 0;
  border-right: 1px solid #dbdbdb !important;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -ms-flex: 1;
  flex: 1;
  padding: 0 20px 0 35px !important;
}
.logtab > .ant-tabs-content {
  height: calc(100% - 30px);
  padding: 0 !important;
}
</style>
