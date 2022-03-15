<template>
<!-- <img src="../assets/dashboard.png"  width="100%"> -->
  <div class="dashboard">
    <div class="left">
  	     <ul  class="table-name">
          <li v-for="(table,index) in tableNameList" @click="selectTable(table,index)" :class="{'item-name':ind === index}">
              <i class="icon1-file-text" >
                  {{table}}
              </i>
          </li>
        </ul>
  	</div>
    <div class="right">
      <div class="operate-content"  style="margin-top: 10px;">
        <el-button round @click="addReport" class="operate" v-if="show1">生成报告</el-button>
      </div>
      <graphDisplay :option="option" :testLayout="testLayout" v-if="show1">

      </graphDisplay>
      <!-- <reportDisplay v-if="show2" :options="option" :tableName="tableName" @father="father"> -->
      </reportDisplay>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import graphDisplay from './graphDisplayNew.vue';
// import reportDisplay from './reportDisplay.vue';
var  BASE_URL ="http://127.0.0.1:8088/";
// var  BASE_URL ="http://10.108.210.31:8088/";
export default {
  name: 'dashboard',
  data() {
    return {
      ind:0,
      show1:true,
      show2:false,
      myChart: {},
      tableNameList: [],
      tableName:'',
      // option: [{"yAxis":{"name":"人数","type":"value"},"xAxis":{"name":"检查年份","type":"category","data":["1010","1984","1986","2001","2002","2004","2006","2007","2008","2009","2010","2011","2012","2013","2014"],"boundaryGap":true,"axisLabel":{"show":true,"interval":"0","inside":false}},"legend":{"data":["人数"]},"series":[{"type":"bar","name":"人数","stack":"0","color":null,"data":[1,1,1,1,1,1,1,1,5,234,96126,100248,296781,569599,476228],"areaStyle":null,"yAxisIndex":0,"xAxisIndex":0}],"tooltip":{"show":true,"trigger":"axis","formatter":""}},
      //           {"yAxis":{"name":"哈哈","type":"value"},"xAxis":{"name":"压力","type":"category","data":["很大","很少","无压力","有一点","比较大","缺失"],"boundaryGap":true,"axisLabel":{"show":true,"interval":"0","inside":false}},"legend":{"data":["人数"]},"series":[{"type":"bar","name":"人数","stack":"0","color":null,"data":[19489,1091897,2871294,1037956,132437,56631],"areaStyle":null,"yAxisIndex":0,"xAxisIndex":0}],"tooltip":{"show":true,"trigger":"axis","formatter":""}},
      //           {"yAxis":{"name":"比率","type":"value"},"xAxis":{"name":"年份","type":"category","data":["2010","2011","2012","2013","2014","2015","2016","2017"],"boundaryGap":true,"axisLabel":{"show":true,"interval":"0","inside":false}},"legend":{"data":["比率"]},"series":[{"type":"bar","name":"比率","stack":"0","color":null,"data":[0.01,0.05,0.07,0.09,0.1,0.11,0.11,0.11],"areaStyle":null,"yAxisIndex":0,"xAxisIndex":0}],"tooltip":{"show":true,"trigger":"axis","formatter":""}}]
      //           ,
      option: [],
    //   testLayout: [
    //      {"x":0,"y":0,"w":6,"h":8,"i":"0", resizable: true, draggable: true},
    //       {"x":6,"y":0,"w":6,"h":8,"i":"1", resizable: null, draggable: null},
    //      {"x":0,"y":0,"w":6,"h":8,"i":"2", resizable: true, draggable: true},
    //  ],
    testLayout:[],
      options: {
        showCheckbox: false,
        search: {
          useInitial: true,
          useEnglish: false,
          customFilter: null
        }
      }
    }
  },
  mounted() {
    //alert('aaa');
    this.$http.get(BASE_URL+'graph/allGraphs').then((response) => {
      // this.$http.get(BASE_URL+'all/columns?flag=kylin&table_name='+this.tableName).then((response) => {
      var data = response.body;
      this.tableNameList = data;
      this.tableName = data[0];
      this._getGraphInfo();

    });
  },
  methods: {
    father(opt){
                //alert('bbb');
                this.show1 = opt.show1;
                console.log('hh'+this.show1);
                this.show2 = opt.show2;
                console.log('jj'+this.show2);
                this.$http.get(BASE_URL+'graph/allGraphs').then((response) => {
                  // this.$http.get(BASE_URL+'all/columns?flag=kylin&table_name='+this.tableName).then((response) => {
                  var data = response.body;
                  this.tableNameList = data;
                  this.tableName = data[0];
                  this._getGraphInfo();
                  this.ind = 0;

                });

            },
    selectTable(table,index){
      this.show1 = true;
      this.show2 = false;
      this.tableName = table;
      this.ind = index;
      console.log(this.tableName);
      this.option = [];
      this.testLayout = [];
      console.log('------------------------------------');
      console.log(this.option);
      console.log('------------------------------------');
      this.$http.get(BASE_URL+'graph/get_info_name?gTable='+this.tableName).then((response) => {
                // this.$http.get('http://localhost:8088/lxy/graph/get_info?flag=kylin&graphId='+id).then((response) => {
                    var data = response.body;

                    for(let i=0; i<data.length; i++){
                    this.option.push(this._deepCopy(JSON.parse(data[i].g_options))) ;
                     console.log('dd'+JSON.stringify(this.option));
                    // html += '<div class="graph-content-list-"'+i+'style="width:450px;height:400px;"></div>';

                    }
                    var length = this.option.length;
                    console.log('777'+length);
                    for(let i = 0;i < length;i++) {
                        if(i%2 == 0) {
                            var item = {"x":0,"y":0+Math.floor(i/2)*8,"w":6,"h":8,"i":i+"", resizable: true, draggable: true};
                            this.testLayout.push(item);
                        }
                        else {
                            var item = {"x":6,"y":0+Math.floor(i/2)*8,"w":6,"h":8,"i":i+"", resizable: true, draggable: true};
                            this.testLayout.push(item);
                        }
                    }
                    console.log('666'+this.testLayout);


                });
    },
    _getGraphInfo() {
                console.log(this.tableName);
                this.option = [];
                this.testLayout = [];
                this.$http.get(BASE_URL+'graph/get_info_name?gTable='+this.tableName).then((response) => {
                // this.$http.get('http://localhost:8088/lxy/graph/get_info?flag=kylin&graphId='+id).then((response) => {
                    var data = response.body;
                    //换kylin接口后注意改这里，把-1去掉
                    for(let i=0; i<data.length; i++){
                    this.option.push(this._deepCopy(JSON.parse(data[i].g_options))) ;
                    // console.log(this.option);
                    // html += '<div class="graph-content-list-"'+i+'style="width:450px;height:400px;"></div>';

                    }
                    var length = this.option.length;
                    console.log('777'+length);
                    for(let i = 0;i < length;i++) {
                        if(i%2 == 0) {
                            var item = {"x":0,"y":0,"w":6,"h":8,"i":i+"", resizable: true, draggable: true};
                            this.testLayout.push(item);
                        }
                        else {
                            var item = {"x":6,"y":0,"w":6,"h":8,"i":i+"", resizable: true, draggable: true};
                            this.testLayout.push(item);
                        }
                    }
                    console.log('666'+this.testLayout);


                });
            },
            _deepCopy(obj) {
                let str, newobj;
                str = newobj = obj instanceof Array ? [] : {};
                if (typeof obj !== 'object') {
                    return;
                } else if (window.JSON) {
                    str = JSON.stringify(obj) // 系列化对象
                    newobj = JSON.parse(str) // 还原
                } else {
                    for (var i in obj) {
                    newobj[i] = typeof obj[i] === 'object' ? _deepCopy(obj[i]) : obj[i];
                    }
                }
                return newobj;
            },
            addReport() {
                this.show1 = !this.show1;
                this.show2 = !this.show2;
            },
  },
  components: {
    'graphDisplay': graphDisplay,
    // 'reportDisplay': reportDisplay
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  // background-color rgb(202,217,246)
.dashboard

    // position: fixed;
    // top: 105px;
    left:0px;
    right: 0px;
    bottom: 0px;
    // background-color: #f5f5f5;
    .left
    	width: 150px;
    	height: 100%;
    	// background-color: rgb(232,235,237);
    	border-right: 1px rgb(227,230,232);
	    position: absolute;
	    top: 0;
	    left: 0px;
	    bottom: 0;
     background-color: #fff;
    .table-name
        font-size: 15px
        color: #000;
        height: 30px;
        cursor: pointer;
        width: 100%;
        padding-top: 1px;
        li 
          padding: 5px 10px
        .icon1-file-text
          line-height:3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        .item-name
          background-color:#3b8dbc ;
          color: #fff;
          cursor: pointer;

    .right
    	position: absolute;
    	top: 0;
    	left: 150px;
    	right: 0;
    	// background-color: rgb(232,235,237);
    	overflow: scroll;
    	bottom:0px;
     background-color: #eee;
     .operate-content
        overflow: hidden;
        vertical-align: middle;
     .operate
        float: right;
        padding: 10px;
        margin-right: 80px;
        cursor: pointer;
        padding-top :5px;
</style>
