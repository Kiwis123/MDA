<template>
  <div class="right-bar-inner">
      <div @click="savaGraph" class="save-graph">保存</div>
  	  <div>
        <div class="right-title">图表标题</div>
        <input type="text" name="graph-title" style="width:100%" v-model="graphTitle" @blur="updateGraphTitle(graphTitle)">
      </div>
      <div class="graph-type">
        <div class="right-title">图表类型</div>
        <div class="iconfont graph-content clearfix">
          <i class="icon-shangwutubiao-" @click="update(0)" v-show="barShow1">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">柱形图</div>
              <div>1个维度,1个或多个度量</div>
            </div>
          </i>
          <i class="icon-bingtu" @click="update(5)">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">饼图</div>
              <div>0或1个维度,多个度量</div>
              <!-- <div>0个维度,多个度量</div> -->
            </div>
          </i>
          <i class="icon-hengxiangtiaoxingtu"></i>
          <i class="icon-column" @click="update(2)">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">条形图</div>
              <div>1个维度,1个或多个度量</div>
            </div>
          </i>
          <i class="icon-loudoutu" @click="update(13)">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">漏斗图</div>
              <div>1个维度,1个度量</div>
              <!-- <div>0个维度,多个度量</div> -->
            </div>
          </i>
          <i class="icon-jiliangtu">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">计量图</div>
              <div>0个维度,1个度量</div>
            </div>
          </i>
          <i class="icon-guanxitu">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">关系图</div>
              <!-- <div>0个维度,1个度量</div> -->
            </div>
          </i>
          <i class="icon-tubiaozhexiantu" @click="update(4)">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">折线图</div>
              <div>1个维度,1个或多个度量</div>
            </div>
          </i>
          <i class="icon-mianjitu" @click="update(6)">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">面积图</div>
              <div>1个维度,1个或多个度量</div>
            </div>
          </i>
          <i class="icon-mianjitu1">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">面积堆积图</div>
              <div>1个维度,1个或多个度量</div>
            </div>
          </i>
          <i class="icon-sandiantu">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">散点图</div>
              <div>0或多个维度,2个度量</div>
            </div>
          </i>
          <i class="icon-radar_active" @click="update(7)">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">雷达图</div>
              <div>1个维度,多个度量</div>
            </div>
          </i>
          <i class="icon-relitu" @click="update(10)">
            <div class="angle"></div>
            <div class="icon-bar-hover">
              <div class="bar-title">热力图</div>
              <div>2个维度,1个度量</div>
            </div>
          </i>

        </div>
      </div>
      <!-- <div class="right-title"> -->
        <!-- <input type="checkbox" name="">显示图表标签 -->
      <!-- </div> -->
      <div class="axis" v-show="axisDisplay">
        <div class="right-title">X坐标轴</div>
        <div class="right-title">标题<input type="text" name="axis-title" style="width:75%" v-model="xaxisTitle" @blur="updatexAxisTitle(xaxisTitle)" value="axisTitle"></div>
        <div class="right-title">单位<input type="text" name="unit" style="width:75%" v-model="xaxisUnit" @blur="updatexAxisUnit(xaxisUnit)"></div>
      </div>
      <div class="axis" v-show="axisDisplay">
        <div class="right-title">Y坐标轴</div>
        <div class="right-title">标题<input type="text" name="axis-title" style="width:75%" v-model="yaxisTitle" @blur="updateyAxisTitle(yaxisTitle)" value="axisTitle"></div>
        <div class="right-title">单位<input type="text" name="unit" style="width:75%" v-model="yaxisUnit" @blur="updateyAxisUnit(yaxisUnit)"></div>
        <div class="right-title">最大值<input type="text" name="max" style="width:70%" v-model="max" @blur="updateMax(max)">
        </div>
        <div class="right-title">最小值<input type="text" name="min" style="width:70%" v-model="min" @blur="updateMin(min)">
        </div>
      </div>
      <!-- <div class="right-title">辅助线</div> -->
      <!-- <div class="right-title"><input type="checkbox" name="">显示缩略轴</div> -->
      <!-- <div>
        <div class="right-title">图表备注</div>
        <input type="text" name="" style="width:100%">
      </div> -->
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
      barShow1: true
    }
  },
  created() {
    // this.axisTitle = this.option.yAxis.name;
    // this.dimensionLength = this.searchdimension.length;
    // this.measureLength = this.searchmeasure.length;
    // console.log(this.measureLength);
  },
  updated() {
  },
  methods: {
    update(type){
      this.$emit('update-type',type);
    },
    updateGraphTitle(graphTitle){
      var a = JSON.stringify(this.newOption);
      console.log(a);
      if(this.newOption.title == undefined) {
        this.newOption.title = {};
      }
        this.newOption.title.text = graphTitle;
        this.newOption.title.left = 'center';
        this.newOption.legend.top = '30px';
        this.newOption.grid = {};
        this.newOption.grid.y = 80;
        this.$emit('update-option',this.newOption);
    },
    updateyAxisTitle(title){
      // console.log(this.option);
      this.newOption.yAxis.name = title;
      this.$emit('update-option',this.newOption);
    },
    updateyAxisUnit(unit){
      let pattern = new RegExp("\\(.+\\)");
      console.log(unit);
      if(pattern.test(this.newOption.yAxis.name)){
        console.log(11111);
        console.log(this.newOption.yAxis.name);
        this.newOption.yAxis.name.replace(pattern, '('+unit+')');
      } else {
        console.log(222222);
        this.newOption.yAxis.name += '('+unit+')';
      }
      this.$emit('update-option',this.newOption);
    },
    updateMax(max) {
      console.log(max);
      if(max != null && max != '') {
        this.newOption.yAxis.max = max;
        this.$emit('update-option',this.newOption);
      } else {
        if(this.newOption.yAxis.max != undefined) {
          delete(this.newOption.yAxis["max"]);
          this.$emit('update-option',this.newOption);
        }
      }
    },
    updateMin(min) {
      console.log(min);
      if(min != null && min != '') {
        this.newOption.yAxis.min = min;
        this.$emit('update-option',this.newOption);
      }
    },
    updatexAxisTitle(title){
      // console.log(this.option);
      this.newOption.xAxis.name = title;
      this.$emit('update-option',this.newOption);
    },
    updatexAxisUnit(unit){
      let pattern = new RegExp("\\(.+\\)");
      console.log(unit);
      if(pattern.test(this.newOption.xAxis.name)){
        console.log(11111);
        console.log(this.newOption.xAxis.name);
        this.newOption.xAxis.name.replace(pattern, '('+unit+')');
      } else {
        console.log(222222);
        this.newOption.xAxis.name += '('+unit+')';
      }
      this.$emit('update-option',this.newOption);
    },
    _createxmlHttpRequest() {
      let xmlHttp ;
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
      xmlHttp.onreadystatechange = function() {
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
      xmlHttp.onreadystatechange = function() {
        if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
          console.log("ok");
          alert("保存成功！")
        } else {
           //alert('fail');
        }
      }
    },
    savaGraph(){
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
      // console.log(saveOptionsString);
      this._doPost(this.baseUrl+'graph/save_graph', saveOptionsString);
      // this.$http.post(this.baseUrl+'graph/save_graph',
      //  {graph:{gId: 3,tableName:"worker"}}
      //  ).then((response) => {
      //   console.log(response);
      //   // if(response.ok == true){
      //   //   alert("保存成功");
      //   // }
      // });
    }
  },
  watch: {
    type: {
      handler: function(){
      this.newType = this.type;
      // this.myChart.setOption(this.optionUpdate,true);
      }
    },
    newType: {
      handler: function(){
        if(this.newType == 5){
          this.axisDisplay = false;
        } else {
          this.axisDisplay = true;
        }
      }
    },
    option: {
      handler: function(){
        this.newOption = this.option;
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.graph-content {
  font-size:30px;
  padding-left :6px;
}
// input {outline:none;}
.right-bar-inner
    flex: 0 0 200px;
    width: 200px;
    padding: 5px 5px 20px 5px;
    // background-color: #F5F5F5;
    // color: #000;
    overflow-y: auto;
    // overflow-x: hidden;
    .save-graph
      background-color: #3b8dbc;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 3px;
      cursor: pointer;
      margin: 0 5px;
      padding: 0px 10px;
      color: #fff;
    .right-title
      height: 40px;
      line-height: 40px;
      text-align: left;
    input
      // margin-bottom: 45px;
      border-top:0px;
      border-right:0px;
      border-bottom:1px solid #29A2E6;
      border-left:0px;
      background-color:transparent;
      color: #000;
      text-align: center;
      // &:focus
      //   border: 0;
    .graph-type
      .graph-content
        width: 90%;
        height: 200px;
        border: 1px solid #868686;
        [class^="icon-"]
          position: relative;
          cursor: pointer;
          .angle
            display: none;
          .icon-bar-hover
            display: none;
        [class^="icon-"]:hover
          position: relative;
          cursor: pointer;
          background-color: #fff;
          text-align: left;
          .angle
            position: absolute;
            display: block;
            left: 10px;
            top: 30px;
            height: 0px;
            z-index: 10;
            border-color: transparent transparent #e2e2e2 transparent;
            border-width: 0 10px 10px 10px;
            border-style: dashed dashed solid dashed;
            border-bottom-color: #fff;
          .icon-bar-hover
            position: absolute;
            display: block;
            left: 0px;
            top: 50;
            z-index: 10;
            width: 90px;
            padding: 3px;
            background-color: #fff;
            line-height: 20px;
            font-size: 12px;
            .bar-title
              font-size: 14px;
</style>
