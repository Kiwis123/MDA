<template>
  <div class="taskPage">
    <div class="tree-panel" style="width:320px">
      <tree @nodeClick="nodeClick" :list="tree_list"></tree>
      <resizeLine direction="right" />
    </div>
    <div class="code-panel">
      <a-tabs class="codetab" :lazy="false" @tab-click="tabclick" v-model="active_ide" :animated="false" type="card">
        <a-tab-pane v-for="(ide) in ides" :key="ide.name" :name="ide.name" style="height:100%">
          <div slot="tab" class="item">
            <i class="task-icon" v-bind:class="'icon-'+ide.type"></i>
            <span class="name">{{ide.name}}</span>
            <a-icon type="close" class="zclose" @click="(e)=>{closeIde(e,ide)}"></a-icon>
          </div>
          <editor v-model="ide.code" :submit="()=>submit(ide)" :log="ide.log_txt" :results="ide.results" :mode="ide.type" :format="()=>format(ide)" :showLog="ide.showLog" class=".no-selected"></editor>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import Editor from '../../components/dev/CodeEditor/index'
import Tree from '../../components/dev/TreeMenu/index'
import '../../assets/css/taskicon.css'
import sqlFormatter from "sql-formatter"
import tree_list from '../../components/dev/TreeMenu/mock.js'
import { Tabs } from 'ant-design-vue'
import ResizeLine from '../../components/dev/ResizeLine'

export default {
  components: {
    Editor, 'a-tabs': Tabs, 'a-tab-pane': Tabs.TabPane, Tree, ResizeLine
  },
  data() {
    return {
      active_ide: "sql_example",
      tree_list: [],
      ides: [
        {
          name: "sql_example",
          type: 'sql',
          code: 'select * from douban.movie limit 10 \n',
          log_txt: "",
          results: [
            {
              "data": [
                {
                  "cover": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2043944718.jpg",
                  "loc": "日本",
                  "cate": "动画",
                  "rate": 7.900000095367432,
                  "id": 10001432,
                  "title": "颠倒的帕特玛",
                  "url": "https://movie.douban.com/subject/10001432/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1634119717.jpg",
                  "loc": "日本",
                  "cate": "动画",
                  "rate": 8.800000190734863,
                  "id": 10174444,
                  "title": "剧场版魔法少女小圆 前篇 起始的故事",
                  "url": "https://movie.douban.com/subject/10174444/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1924498395.jpg",
                  "loc": "未知",
                  "cate": "剧情,动作,犯罪",
                  "rate": 7.300000190734863,
                  "id": 10344754,
                  "title": "毒战",
                  "url": "https://movie.douban.com/subject/10344754/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2029391129.jpg",
                  "loc": "韩国",
                  "cate": "剧情,惊悚,灾难",
                  "rate": 7.800000190734863,
                  "id": 10432911,
                  "title": "流感",
                  "url": "https://movie.douban.com/subject/10432911/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2507486724.jpg",
                  "loc": "韩国",
                  "cate": "剧情,犯罪",
                  "rate": 8.600000381469727,
                  "id": 10437779,
                  "title": "新世界",
                  "url": "https://movie.douban.com/subject/10437779/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1722545381.jpg",
                  "loc": "未知",
                  "cate": "剧情,犯罪",
                  "rate": 7.300000190734863,
                  "id": 10438426,
                  "title": "浮城谜事",
                  "url": "https://movie.douban.com/subject/10438426/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1768410538.jpg",
                  "loc": "韩国",
                  "cate": "剧情,爱情",
                  "rate": 7.300000190734863,
                  "id": 10439235,
                  "title": "创可贴",
                  "url": "https://movie.douban.com/subject/10439235/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2154816416.jpg",
                  "loc": "韩国",
                  "cate": "动作",
                  "rate": 6.5,
                  "id": 10441571,
                  "title": "朋友2",
                  "url": "https://movie.douban.com/subject/10441571/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2369337420.jpg",
                  "loc": "日本",
                  "cate": "动画",
                  "rate": 9.5,
                  "id": 10461356,
                  "title": "大雄的怀念奶奶",
                  "url": "https://movie.douban.com/subject/10461356/",
                  "ds": "20191125"
                },
                {
                  "cover": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1407592064.jpg",
                  "loc": "日本",
                  "cate": "音乐",
                  "rate": 9.600000381469727,
                  "id": 10461367,
                  "title": "平安结祈",
                  "url": "https://movie.douban.com/subject/10461367/",
                  "ds": "20191125"
                }
              ],
              "title": [
                "id",
                "title",
                "loc",
                "cate",
                "url",
                "cover",
                "rate",
                "ds"
              ]
            }
          ],
          showLog: true
        },
        {
          name: "scala_example",
          type: 'scala-spark',
          code: 'val df=spark.sql(\"select * from douban.movie_loc\")\ndf.repartition(1).write.mode(\"overwrite\").insertInto(\"douban.movie_loc\")',
          log_txt: "",
          results: [],
          showLog: false
        },
        {
          name: "movie_loc",
          type: 'sql',
          code: 'insert overwrite table douban.`movie_loc` partition(ds = 20191120) select loc,count(loc) from douban.movie group by loc',
          log_txt: "",
          results: [],
          showLog: false
        },
        {
          name: "movie_loc_show",
          type: 'sql',
          code: 'select * from douban.movie_loc',
          log_txt: "",
          results: [],
          showLog: false
        }
      ],
      show_ides: [],
      wsId: 0,
      icons: {
        0: 'icon-folder',
        1: 'icon-subfolder',
        2: 'icon-flow'
      }
    }
  },
  mounted() {
    this.wsId = this.$route.query.wsId
    this.getCatas(this.wsId)

  },
  destroyed() {
    clearInterval(this.getLogs)
  },
  methods: {
    tabclick(arg) {
      this.$nextTick(() => {
        if (arg.$children[0].codemirror) {
          arg.$children[0].codemirror.refresh()
        }
      })
    },
    getCatas(wsId) {
      this.axios.get(`/api/dev/catalog/${wsId}/list`).then(res => {
        if (res.data.code == 200) {
          this.tree_list = []
          this.trans(res.data.data, this.tree_list, undefined)
          console.log(this.tree_list)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submit(ide) {
      ide.showLog = true;
      var params = new URLSearchParams();
      params.append("type", ide.type);
      params.append("code", ide.code);
      this.$http.post("/task/submit", params).then(res => {
        var data = res.data
        if (data.code == 0) {
          this.getLogs(ide, data.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getLogs(ide, task_id) {
      var url = "/task/" + task_id + "/log"
      this.$http.get(url).then(res => {
        var data = res.data
        if (data.code == 0) {
          ide.log_txt = data.data.log.join('\n\r')
          if (data.data.state != 'end') {
            setTimeout(() => {
              this.getLogs(ide, task_id)
            }, 2000);
          } else {
            console.log(ide.log_txt)
            var result = data.data.results
            if (result && result != null)
              ide.results.push(data.data.results)
          }

        }
      }).catch(err => {
        console.log(err)
      })
    },
    format(ide) {

      if (ide.type == 'sql' || ide.type == 'ddl') {
        ide.code = sqlFormatter.format(ide.code, {
          language: "sql", // Defaults to "sql"
          indent: "    "   // Defaults to two spaces
        })
      }
    },
    nodeClick(data, node) {
      var types = ["sql", "ddl"]
      if (types.indexOf(data.type) == -1) {
        return;
      }
      var ide = {}
      ide.name = data.title
      ide.type = data.type
      ide.code = data.code
      ide.log_txt = ""
      ide.results = []
      ide.showLog = false
      if (this.show_ides.indexOf(data.label) == -1) {
        this.ides.push(ide)
        this.show_ides.push(ide.name)
      }
      this.active_ide = ide.name
    },
    closeIde(e, ide) {
      this.ides.splice(this.ides.indexOf(ide), 1)
      this.active_ide = this.ides[0].name
      e = e || window.event;
      if (e.stopPropagation) { //W3C阻止冒泡方法 
        e.stopPropagation();
      } else {
        e.cancelBubble = true; //IE阻止冒泡方法 
      }
      this.show_ides.splice(this.show_ides.indexOf(ide.name), 1)
    },
    trans(catas, list, parent) {
      for (var i = 0; i < catas.length; i++) {
        if (catas[i].parentCataId == parent) {
          var node = {}
          node.title = catas[i].name
          node.id = catas[i].id
          node.icon = this.icons[catas[i].category]
          node.children = []
          this.trans(catas, node.children, node.id)
          list.push(node)
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
.taskPage {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-width: 960px;
  box-sizing: border-box;
  padding-top: 5px;
}
.tree-panel {
  width: 300px;
  max-width: 350px;
  min-width: 250px;
  border-top: 1px solid #dcdfe6;
  border-right: 1px solid #d9d9d9;
  background-repeat: no-repeat;
  background-size: 250px;
  position: relative;
  z-index: 0;
  background: #fff;
}

.code-panel {
  flex: 1;
  overflow: hidden;
  border-top: 1px solid #dcdfe6;
}
.codetab {
  height: 100%;
  padding: 0;
  border-left: none;
  border-right: none;
  box-shadow: none;
  /* background: #f7f7f7; */
  /* height: 30px; */
}

.name {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  color: rgba(0, 0, 0, 0.65);
}
.zclose {
  position: absolute;
  right: -2px;
  top: 50%;
  display: inline-block;
  vertical-align: initial;
  overflow: hidden;
  transform: translateY(-50%);
  font-size: 12px;
}

.item {
  color: rgba(0, 0, 0, 0.65);
  height: 100%;
  width: 120px;
  max-width: 140px;
  min-width: 90px;
  height: 30px;
  line-height: 30px;
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
/* .mytab >>> .ant-tabs-nav-wrap {
  background: #f7f7f7;
  height: 30px;
} */
</style>
<style>
.codetab > .ant-tabs-bar {
  margin: 0;
  height: 30px;
  overflow: hidden;
}
.codetab
  > .ant-tabs-bar
  > .ant-tabs-nav-container
  > .ant-tabs-nav-wrap
  > .ant-tabs-nav-scroll
  > .ant-tabs-nav
  > div
  > .ant-tabs-tab {
  /* width: 100%; */
  margin: 0 !important;
  padding: 0 !important;
  height: 30px !important;
  line-height: 30px !important;
  border: none !important;
  background: #f7f7f7 !important;
  /* background: #f700ff !important; */
}
.codetab
  > .ant-tabs-bar
  > .ant-tabs-nav-container
  > .ant-tabs-nav-wrap
  > .ant-tabs-nav-scroll
  > .ant-tabs-nav
  > div
  > .ant-tabs-tab-active::before {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  background: #2c73e8;
  top: 0;
  left: 0;
}
.codetab
  > .ant-tabs-bar
  > .ant-tabs-nav-container
  > .ant-tabs-nav-wrap
  > .ant-tabs-nav-scroll
  > .ant-tabs-nav
  > div
  > .ant-tabs-tab-active {
  background: #fff !important;
  /* border-top: 3px solid #4376de !important; */
}
.codetab > .ant-tabs-content {
  height: calc(100% - 30px);
  padding: 0 !important;
}
</style>