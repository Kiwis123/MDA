<template>
  <div class="right-bar-inner">
    <div class="graph-type">
      <div class="right-title">图表类型</div>
      <div class="iconfont graph-content clearfix">
        <i class="icon-aa graph16" @click="flag16 && update(16)">
          <div class="angle"></div>
          <img src="../../../static/img/table.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">表格</div>
            <div>0个或多个维度,0个或多个度量</div>
          </div>
        </i>
        <i class="icon-aa graph0" @click="flag0 && update(0)">
          <div class="angle"></div>
          <img src="../../../static/img/bar.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">柱形图</div>
            <div>2个以内维度,1个或多个度量</div>
          </div>
        </i>
        <i class="icon-aa graph14" @click="flag14 && update(14)">
          <div class="angle"></div>
          <img src="../../../static/img/card.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">指标卡</div>
            <div>0个维度,1个或2个度量</div>
          </div>
        </i>
        <i class="icon-aa graph3" @click="flag3 && update(3)">
          <div class="angle"></div>
          <img src="../../../static/img/pie.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">饼图</div>
            <div>1个维度,1个度量</div>
          </div>
        </i>
        <i class="icon-aa graph6" @click="flag6 && update(6)">
          <div class="angle"></div>
          <img src="../../../static/img/line.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">条形图</div>
            <div>2个以内维度,1个或多个度量</div>
          </div>
        </i>
        <i class="icon-aa graph13" @click="flag13 && update(13)">
          <div class="angle"></div>
          <img src="../../../static/img/funnel.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">漏斗图</div>
            <div>1个维度,1个度量</div>
          </div>
        </i>
        <i class="icon-aa graph8" @click="flag8 && update(8)">
          <div class="angle"></div>
          <img src="../../../static/img/gauge.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">计量图</div>
            <div>0个维度,1个度量</div>
          </div>
        </i>
        <!-- <i class="icon-aa" @click="update(9)">
          <div class="angle"></div>
          <img src="../../../static/img/guanxi.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">关系图</div>
            <div>0个维度,1个度量</div>
          </div>
        </i>-->
        <i class="icon-aa graph7" @click="flag7 && update(7)">
          <div class="angle"></div>
          <img src="../../../static/img/zhexian.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">折线图</div>
            <div>1个或2个维度,1个或多个度量</div>
          </div>
        </i>
        <i class="icon-aa graph2" @click="flag2 && update(2)">
          <div class="angle"></div>
          <img src="../../../static/img/area.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">面积图</div>
            <div>1个或2个维度,1个或多个度量</div>
          </div>
        </i>
        <i class="icon-aa graph1" @click="flag1 && update(1)">
          <div class="angle"></div>
          <img src="../../../static/img/duiji.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">堆积图</div>
            <div>1个或2个维度,2个或多个度量</div>
          </div>
        </i>
        <i class="icon-aa graph12" @click="flag12 && update(12)">
          <div class="angle"></div>
          <img src="../../../static/img/scatter.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">散点图</div>
            <div>0或多个维度,2个度量</div>
          </div>
        </i>
        <i class="icon-aa graph4" @click="flag4 && update(4)">
          <div class="angle"></div>
          <img src="../../../static/img/radar.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">雷达图</div>
            <div>1个维度,多个度量</div>
          </div>
        </i>
        <!-- <i class="icon-aa" @click="update(10)">
          <div class="angle"></div>
          <img src="../../../static/img/heatmap.png" style="width:25px;height:25px;">
          <div class="icon-bar-hover">
            <div class="bar-title">热力图</div>
            <div>2个维度,1个度量</div>
          </div>
        </i>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    baseUrl: {
      type: String
    },
    option: {
      type: Object
    },
    type: {
      type: Number
    },
    tableName: {
      type: String
    },
    searchmeasure: {
      type: Array
    },
    searchdimension: {
      type: Array
    },
    searchmethods: {
      type: Array
    }
  },
  data() {
    return {
      newOption: this.option,
      newType: this.type,
      graphTitle: '',
      axisDisplay: true,
      xaxisTitle: '',
      xaxisUnit: '',
      yaxisTitle: '',
      yaxisUnit: '',
      max: '',
      min: '',
      dimensionLength: 0,
      measureLength: 0,
      barShow: true,
      barShow1: true,
      //传过来的度量
      sendMeasure: this.searchmeasure,
      //传过来的维度
      sendDimension: this.searchdimension,
      sendMethods: this.searchmethods,
      flag16: false, //表格是否点击
      flag0: false, //柱形图是否点击
      flag14: false, //指标卡是否点击
      flag3: false, //饼图是否点击
      flag6: false, //条形图是否点击
      flag13: false, //漏斗图是否点击
      flag8: false, //计量图是否点击
      flag7: false, //折线图是否点击
      flag2: false, //面积图是否点击
      flag1: false, //堆积图是否点击
      flag12: false, //散点图是否点击
      flag4: false, //雷达图是否点击
    }
  },
  created() {
    // this.axisTitle = this.option.yAxis.name;
    // this.dimensionLength = this.searchdimension.length;
    // this.measureLength = this.searchmeasure.length;
    // console.log(this.measureLength);
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    update(type) {
      this.$emit('update-type', type);
    },
    updateGraphTitle(graphTitle) {
      var a = JSON.stringify(this.newOption);
      console.log(a);
      if (this.newOption.title == undefined) {
        this.newOption.title = {};
      }
      this.newOption.title.text = graphTitle;
      this.newOption.title.left = 'center';
      this.newOption.legend.top = '30px';
      this.newOption.grid = {};
      this.newOption.grid.y = 80;
      this.$emit('update-option', this.newOption);
    },
    updateyAxisTitle(title) {
      // console.log(this.option);
      this.newOption.yAxis.name = title;
      this.$emit('update-option', this.newOption);
    },
    updateyAxisUnit(unit) {
      let pattern = new RegExp("\\(.+\\)");
      console.log(unit);
      if (pattern.test(this.newOption.yAxis.name)) {
        console.log(11111);
        console.log(this.newOption.yAxis.name);
        this.newOption.yAxis.name.replace(pattern, '(' + unit + ')');
      } else {
        console.log(222222);
        this.newOption.yAxis.name += '(' + unit + ')';
      }
      this.$emit('update-option', this.newOption);
    },
    updateMax(max) {
      console.log(max);
      if (max != null && max != '') {
        this.newOption.yAxis.max = max;
        this.$emit('update-option', this.newOption);
      } else {
        if (this.newOption.yAxis.max != undefined) {
          delete (this.newOption.yAxis["max"]);
          this.$emit('update-option', this.newOption);
        }
      }
    },
    updateMin(min) {
      console.log(min);
      if (min != null && min != '') {
        this.newOption.yAxis.min = min;
        this.$emit('update-option', this.newOption);
      }
    },
    updatexAxisTitle(title) {
      // console.log(this.option);
      this.newOption.xAxis.name = title;
      this.$emit('update-option', this.newOption);
    },
    updatexAxisUnit(unit) {
      let pattern = new RegExp("\\(.+\\)");
      console.log(unit);
      if (pattern.test(this.newOption.xAxis.name)) {
        console.log(11111);
        console.log(this.newOption.xAxis.name);
        this.newOption.xAxis.name.replace(pattern, '(' + unit + ')');
      } else {
        console.log(222222);
        this.newOption.xAxis.name += '(' + unit + ')';
      }
      this.$emit('update-option', this.newOption);
    },
    _createxmlHttpRequest() {
      let xmlHttp;
      if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      } else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
      }
      return xmlHttp;
    },
    _doGet(url, data) {
      // 注意在传参数值的时候最好使用encodeURI处理一下，以防出现乱码
      let xmlHttp = this._createxmlHttpRequest();
      xmlHttp.open("GET", url);
      xmlHttp.send(data);
      xmlHttp.onreadystatechange = function () {
        if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
          console.log("ok"); //alert('success');
        } else {
          console.log('fail');
        }
      }
    },
    _doPost(url, data) {
      // 注意在传参数值的时候最好使用encodeURI处理一下，以防出现乱码
      let xmlHttp = this._createxmlHttpRequest();
      xmlHttp.open("POST", url);
      xmlHttp.setRequestHeader("Content-Type", "application/json");
      xmlHttp.send(data);
      xmlHttp.onreadystatechange = function () {
        if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
          console.log("ok");
          alert("保存成功！")
        } else {
          //alert('fail');
        }
      }
    },
    savaGraph() {
      let saveOptions = {
        "gId": 0,
        "tableName": this.tableName,
        "dim": this.searchdimension.join(","),
        "values": this.searchmeasure.join(","),
        "methods": this.searchmethods.join(","),
        "compare": '',
        "options": JSON.stringify(this.option),
        "type": this.type
      }
      var saveOptionsString = JSON.stringify(saveOptions);
      this._doPost(this.baseUrl + 'graph/save_graph', saveOptionsString);
    },
    initConfig() {
      this.flag16 = false
      this.flag0 = false
      this.flag14 = false
      this.flag3 = false
      this.flag6 = false
      this.flag13 = false
      this.flag8 = false
      this.flag7 = false
      this.flag2 = false
      this.flag1 = false
      this.flag12 = false
      this.flag4 = false
    }
  },
  watch: {
    type: {
      handler: function () {
        this.newType = this.type;
        // this.myChart.setOption(this.optionUpdate,true);
      }
    },
    // sendMeasure: {
    //   immediate: true,
    //   handler: function () {
    //     console.log("度量" + this.sendMeasure.length);
    //     if (this.sendMeasure.length == 0) {
    //       $(".graph14").css('background-color', '')
    //       $(".graph14").css('opacity', '0.5')
    //     } else if (this.sendMeasure.length == 1 && this.searchdimension.length == 0) {
    //       $(".graph14").css('background-color', '#fff')
    //       $(".graph14").css('opacity', '12')
    //     }
    //   },
    //   deep: true
    // },
    // searchdimension: {
    //   immediate: true,
    //   handler: function () {
    //     console.log("维度" + this.searchdimension.length);
    //     if (this.searchdimension.length != 0) {
    //       $(".graph14").css('background-color', 'rgba(0, 0, 0, 0.075)')
    //       $(".graph14").css('opacity', '0.5')
    //     } else {
    //     }

    //   },
    //   deep: true
    // },
    newType: {
      handler: function () {
        if (this.newType == 5) {
          this.axisDisplay = false;
        } else {
          this.axisDisplay = true;
        }
      }
    },
    option: {
      handler: function () {
        this.newOption = this.option;
      }
    },
    address: {
      handler: function (newval, oldval) {
        $('.icon-aa').css({ 'background-color': 'rgba(0, 0, 0, 0.075)', 'opacity': '0.5' })
        this.initConfig()
        console.log(JSON.stringify(newval));
        var change = eval('(' + JSON.stringify(newval) + ')')
        console.log(change);
        //维度
        var searchdimension = change.searchdimension;
        //度量
        var sendMeasure = change.sendMeasure;
        if (searchdimension.length == 0 && sendMeasure.length == 1) {
          $(".graph16").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph14").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph8").css({ 'background-color': '#fff', 'opacity': '12' })
          this.flag16 = true
          this.flag14 = true
          this.flag8 = true
        } else if (searchdimension.length == 0 && sendMeasure.length == 0) {
          $('.icon-aa').css({ 'background-color': 'rgba(0, 0, 0, 0.075)', 'opacity': '0.5' })
          this.initConfig()
        } else if (searchdimension.length == 1 && sendMeasure.length == 1) {
          $(".graph0").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph3").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph6").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph13").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph7").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph2").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph12").css({ 'background-color': '#fff', 'opacity': '12' })
          this.flag0 = true
          this.flag3 = true
          this.flag6 = true
          this.flag13 = true
          this.flag7 = true
          this.flag2 = true
          this.flag12 = true
          this.flag16 = true
        } else if (searchdimension.length == 1 && sendMeasure.length == 2) {
          $(".graph0").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph6").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph7").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph2").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph4").css({ 'background-color': '#fff', 'opacity': '12' })
          $(".graph1").css({ 'background-color': '#fff', 'opacity': '12' })
          this.flag0 = true
          this.flag6 = true
          this.flag7 = true
          this.flag2 = true
          this.flag4 = true
          this.flag1 = true
          this.flag16 = true
        } else if (searchdimension.length == 1) {
          $(".graph16").css({ 'background-color': '#fff', 'opacity': '12' })
          this.flag16 = true
        }else{
          $(".graph16").css({ 'background-color': '#fff', 'opacity': '12' })
          this.flag16 = true
        }
      },
      deep: true
    }

  },
  computed: {
    address() {
      const { sendMeasure, searchdimension } = this
      return {
        sendMeasure,
        searchdimension
      }
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.graph-content {
  font-size: 30px;
  padding-left: 6px;
}

.icon-aa {
  background-color: rgba(0, 0, 0, 0.075);
  margin: 5px;
  border-radius: 2px;
  opacity: 0.5;
}

.right-bar-inner {
  flex: 0 0 200px;
  width: 100%;
  padding: 5px 5px 20px 5px;
  overflow-y: auto;

  .save-graph {
    background-color: #3b8dbc;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    cursor: pointer;
    margin: 0 5px;
    padding: 0px 10px;
    color: #fff;
  }

  .right-title {
    height: 40px;
    line-height: 40px;
    text-align: left;
    font-weight: 600;
  }

  .graph-type {
    .graph-content {
      width: 90%;
      height: 300px;

      [class^='icon-'] {
        position: relative;
        cursor: pointer;

        .angle {
          display: none;
        }

        .icon-bar-hover {
          display: none;
        }
      }

      [class^='icon-']:hover {
        position: relative;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.075);
        text-align: left;
        width: 25px;

        .icon-bar-hover {
          position: absolute;
          display: block;
          left: 0px;
          top: 50;
          z-index: 10;
          width: 50px;
          padding: 3px;
          background-color: #fff;
          line-height: 20px;
          font-size: 12px;
          opacity: 10;

          .bar-title {
            font-size: 14px;
            font-weight: 600;
            opacity: 10;
          }
        }
      }
    }
  }
}
</style>
