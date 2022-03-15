<template>
  <div style="height:100%">
    <div class="tabStyle">
      <div class="panel">
        <div
          v-for="(item,index) in dashboard"
          :style="{position:'absolute',top:(item.y*h)/item.tabHeight+'px',left:(item.x*w)/item.tabWidth+'px',width:(item.w*w)/item.tabWidth+'px',height:(item.h*h)/item.tabHeight+'px'}"
        >
          <div class="headStyle graphItem" :id="'delete'+index">
            <div :id="index" style="width:100%;height:100% !important;"></div>
          </div>
        </div>
      </div>
      <div style="margin:30px" v-for="(tab,index) in tabLayoutConf" :style="{position:'absolute',top:(tab.y*h)/tab.tabHeight+'px',left:(tab.x*w)/tab.tabWidth+'px',width:(tab.w*w)/tab.tabWidth+'px',height:(tab.h*h)/tab.tabHeight+'px'}">
        <el-table
            :data="tab.tabOption.muchDimTableData"
            border
          >
            <el-table-column
              v-for="(item,index) in tab.tabOption.tabHeaderQian"
              :label="item.name"
              :prop="item.name"
            ></el-table-column>
            <el-table-column
              v-for="(item,index) in tab.tabOption.tabHeaderHou"
              :label="item.name"
            >
              <el-table-column
                v-for="(item1,index1) in item.last"
                :label="item1.name"
                :prop="item.name+'_'+item1.name"
              ></el-table-column>
            </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable";
import "../../../static/js/macarons.js";
import "../../../static/js/dark.js";
import echarts from "echarts";
const webSocketUrl = 'ws://10.108.211.136:6993/socketServer/'
export default {
  data() {
    return {
      dashboard: eval("(" + this.$route.query.data + ")"),
      tableDashboard: eval("(" + this.$route.query.tableDashboard + ")"),
      myChart: "",
      // itemColor: this.$route.query.itemColor,
      // tabWidth: this.$route.query.tabWidth,
      // tabHeight: this.$route.query.tabHeight,
      id: this.$route.query.id,
      w: window.innerWidth-60,
      h: window.innerHeight-60,
      tabHeaderQian: [],
      tabHeaderHou: [],
      //多维表格
      muchDimTableData: [],
      tabOption: [],
      realtime: this.$route.query.realtime,
      tabLayoutConf:[]
    }
  },
  created() {
   if (this.realtime) {
     this.webSocketMethod()
   }
  },
  mounted() {
    console.log(this.tableDashboard)
    if (this.tableDashboard !== '') {
      for (var i = 0;i < this.tableDashboard.length; i++) {
        this.changeTabDashboard(this.tableDashboard[i].tabOption,this.tableDashboard[i].x, this.tableDashboard[i].y, this.tableDashboard[i].w, this.tableDashboard[i].h, this.tableDashboard[i].tabWidth, this.tableDashboard[i].tabHeight)
      }
    }
    if (this.dashboard !== 'undefined') {
      for (var i = 0; i < this.dashboard.length; i++) {
        this.drawGraph(i, this.dashboard[i].choseOption, this.dashboard[i].itemColor, this.dashboard[i].tabWidth, this.dashboard[i].tabHeight);
      }
    }
  },
  components: {
    "vue-draggable-resizable": VueDraggableResizable
  },
  methods: {
    webSocketMethod () {
      if ('WebSocket' in window){
      let ws = new WebSocket(webSocketUrl + this.id);
      var self = this
      ws.onmessage = function(evt) {
        console.log(evt)
        this.axios.get("analysis/getCockpitById?cockpitId=" + self.id).then(response => {
          console.log(response);
          let dataBody = response.data.datum
          // 为数据增加observer属性
          self.$set(self, 'tableDashboard', JSON.parse(dataBody.tabledashboard))
          self.$set(self, 'dashboard', JSON.parse(dataBody.layoutconf))
          console.log(self.tableDashboard)
          if (self.tableDashboard !== '') {
           for (var i = 0;i < self.tableDashboard.length; i++) {
              self.changeTabDashboard(self.tableDashboard[i].tabOption,self.tableDashboard[i].x, self.tableDashboard[i].y, self.tableDashboard[i].w, self.tableDashboard[i].h, self.tableDashboard[i].tabWidth, self.tableDashboard[i].tabHeight)
            }
          }
          if (self.dashboard != 'undefined') {
            for (var i = 0; i < self.dashboard.length; i++) {
              self.drawGraph(i, self.dashboard[i].choseOption, self.dashboard[i].itemColor, self.dashboard[i].tabWidth, self.dashboard[i].tabHeight);
            }
          }
          }).catch((error) => {
            console.log(error)
            self.$message.error('接口出错了～');
          })
        }
      } else if ('MozWebSocket' in window){
        let ws = new MozWebSocket(webSocketUrl + this.id);
      } else {
          alert("该浏览器不支持websocket");
      }
    },
    drawGraph(value, option, itemColor, tabWidth, tabHeight) {
      console.log(option)
      $(".dimValue").remove()
      $(".cardValue").remove()
      if (itemColor == '浅色主题') {
        if (option.series != undefined) {
          var dom = document.getElementById(value);
          this.myChart = echarts.init(dom, "macarons");
          this.myChart.setOption(option, true);
        } else {
          var newdiv = document.getElementById(value);
          newdiv.innerHTML = "<div class=\"drawGraphValue\">" + option.name + "</div><div class=\"drawCardGraphValue\">" + option.value + "</div>";
        }
      } else {
        $(".graphItem").css('background', '#333');
        this.$nextTick(() => {
          $('.drawGraphValue').css('color', '#fff');
          $('.drawCardGraphValue').css('color', '#fff');
        })
        if (option.series != undefined) {
          var dom = document.getElementById(value);
          this.myChart = echarts.init(dom, "dark");
          this.myChart.setOption(option, true);
        } else {
          var newdiv = document.getElementById(value);
          newdiv.innerHTML = "<div class=\"drawGraphValue\">" + option.name + "</div><div class=\"drawCardGraphValue\">" + option.value + "</div>";
        }
      }
    },
    extend(target, source) {
      for (var obj in source) {
        target[obj] = source[obj];
      }
      return target;
    },
    changeTabDashboard (datum,x,y,w,h,tabWidth,tabHeight) {
      console.log(datum)
      this.tabHeaderHou = datum.cows;
      var data = datum.rows;
      this.tabHeaderQian = [];
      var tabhead = { name: '' }
      var tableColumn = []
      tableColumn.push(datum.row.split(',')[0])
      for (var i = 0; i < tableColumn.length; i++) {
        tabhead.name = tableColumn[i]
        this.tabHeaderQian.push(tabhead);
        this.muchDimTableData = [];
        for (var j = 0; j < data.length; j++) {
          var cowHead = {}
          cowHead[tableColumn[i]] = data[j].name
          var bind = this.extend(cowHead, data[j].value);
          console.log(bind);
          this.muchDimTableData.push(bind);
        }
      }
      console.log(this.tabHeaderHou)
      this.tabOption = { tabHeaderHou: this.tabHeaderHou, tabHeaderQian: this.tabHeaderQian, muchDimTableData: this.muchDimTableData }
      this.tabLayoutConf.push({tabOption: this.tabOption, x:x, y:y, w:w, h:h, tabWidth: tabWidth, tabHeight: tabHeight})
      console.log(this.tabLayoutConf[0].tabOption.muchDimTableData)
    }
  }
}
</script>
<style scoped>
.tabStyle {
  height: 100%;
}
.panel {
  background: #eee;
  position: absolute;
  margin: 30px;
}
.graphItem {
  border: 1px solid #dfdcf5;
  border-radius: 5px;
  background: #fff;
}
.headStyle {
  height: 100%;
}
</style>

