// 以后要删
<template>
  <div id="graph-content">
    
        <div id="content">
            
            <grid-layout
                    :layout="layout"
                    :col-num="12"
                    :row-height="rowHeight"
                    :is-draggable="draggable"
                    :is-resizable="resizable"
                    :vertical-compact="true"
                    :use-css-transforms="true"
            >
                <grid-item v-for="(item,index) in layout" :key="item.i"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :min-w="2"
                           :min-h="2"
                           :i="item.i"
                           @resize="resize"
                           @move="move"
                           @resized="resized"
                           @moved="moved"
                           @update="update"
                >
                    <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
                    <test-element :option="newoption[index]" :id="item.i" :h="newHeight" :w="newWidth"></test-element>
                    <!-- <test2-element :option="option[index]" :id="item.i+5" :h="newHeight" :w="newWidth"></test2-element> -->
                    <!--<button @click="clicked">CLICK ME!</button>-->
                </grid-item>
            </grid-layout>
            <hr/>
            <!--<grid-layout
                    :layout="layout2"
                    :col-num="12"
                    :row-height="rowHeight"
                    :is-draggable="draggable"
                    :is-resizable="resizable"
                    :vertical-compact="true"
                    :use-css-transforms="true"
            >
                <grid-item v-for="item in layout2" :key="item.i"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :min-w="2"
                           :min-h="2"
                           :i="item.i"
                           :is-draggable="item.draggable"
                           :is-resizable="item.resizable"
                >
                    <test-element :text="item.i"></test-element>
                </grid-item>
            </grid-layout>-->
        </div>
    
  </div>
</template>

 <script>
// import echarts from 'echarts';
// export default {
//   // name: 'table1',
//   props: {
//     tableName: {
//       type: String
//     }
//   },
//   data(){
//   	return {
//   		myChart: {},
//       option: {
//        series: []
//       },
//       options: {
//         showCheckbox: false,
//         search: {
//           useInitial: true,
//           useEnglish: false,
//           customFilter: null
//         }
//       }
//   	}
//   },
//   created() {
//     // this._getGraphInfo(1, '.graph-content-list');
//     // this._getGraphInfo(2, '.graph-content-list-1');
//     // this._getGraphInfo(3, '.graph-content-list-2');
//     // this._getGraphInfo(4, '.graph-content-list-3');
//   },
//   methods: {
//     _deepCopy(obj) {
//       let str, newobj;
//       str = newobj = obj instanceof Array ? [] : {};
//       if (typeof obj !== 'object') {
//         return;
//       } else if (window.JSON) {
//         str = JSON.stringify(obj) // 系列化对象
//         newobj = JSON.parse(str) // 还原
//       } else {
//         for (var i in obj) {
//           newobj[i] = typeof obj[i] === 'object' ? _deepCopy(obj[i]) : obj[i];
//         }
//       }
//       return newobj;
//     },
//     _getGraphInfo() {
//       this.$http.get('http://localhost:8088/graph/get_info_name?gTable='+this.tableName).then((response) => {
//       // this.$http.get('http://localhost:8088/lxy/graph/get_info?flag=kylin&graphId='+id).then((response) => {
//         var data = response.body;
//         var graphContent = document.getElementById('graph-content');
//         graphContent.innerHTML = "";
//         for(let i=0; i<data.length-1; i++){
//           this.option = this._deepCopy(JSON.parse(data[i].g_options));
//           // html += '<div class="graph-content-list-"'+i+'style="width:450px;height:400px;"></div>';
//           var contentList = document.createElement('div');
//           contentList.setAttribute('class','graph-content-list-'+i);
//           contentList.setAttribute('style','width:500px;height:400px;');
//           console.log(contentList);
//           graphContent.appendChild(contentList)
//           this.myChart = echarts.init(contentList);
//           this.myChart.setOption(this.option);
//         }
//         // this.option = this._deepCopy(JSON.parse(data.g_options));
//         // // this.option = this._deepCopy(data.g_options);
//         // // console.log(this.option);
//         // this.myChart = echarts.init(document.querySelector(contentList));
//         // this.myChart.setOption(this.option);
//       });
//     },
//     handleNode:function(node){
//       if(node.children==undefined||node.children==[])
//       {
//           this.table_title=node.label;

//       }
//     }
//   },
//   watch: {
//     tableName: {
//       handler: function(){
//         console.log('haha');
//         this._getGraphInfo();
//       },
//       //深度观察
//       deep: true
//     }
//   },
//   components: {}
// }

    import GridItem from './GridItem.vue';
    import GridLayout from './GridLayout.vue';
    //import ResponsiveGridLayout from './ResponsiveGridLayout.vue';
    import TestElement from './TestElement.vue';
    import CustomDragElement from './CustomDragElement.vue';
    //var eventBus = require('./eventBus');

    // var testLayout = [
    //     {"x":0,"y":0,"w":6,"h":8,"i":"0", resizable: true, draggable: true},
    //     {"x":6,"y":0,"w":6,"h":8,"i":"1", resizable: null, draggable: null},
    //     {"x":0,"y":0,"w":6,"h":8,"i":"2", resizable: true, draggable: true},
    // ];

    export default {
        name: 'app',
        props: {
            option: {
                type: Array
            },
            testLayout: {
                type: Array
            }
        },
        components: {
            //ResponsiveGridLayout,
            GridLayout,
            GridItem,
            TestElement,
            CustomDragElement,
        },
        data () {
            return {
                
                // layout:[],
                // layout2:[],
                layout: JSON.parse(JSON.stringify(this.testLayout)),
                layout2: JSON.parse(JSON.stringify(this.testLayout)),
                draggable: true,
                resizable: true,
                rowHeight: 30,
                newHeight: 310,
                newWidth: 530,
                colNum: 0,
                index: 0,
                newoption: [],
                newtestLayout: []
                // option:[{"yAxis":{"name":"人数","type":"value"},"xAxis":{"name":"检查年份","type":"category","data":["1010","1984","1986","2001","2002","2004","2006","2007","2008","2009","2010","2011","2012","2013","2014"],"boundaryGap":true,"axisLabel":{"show":true,"interval":"0","inside":false}},"legend":{"data":["人数"]},"series":[{"type":"bar","name":"人数","stack":"0","color":null,"data":[1,1,1,1,1,1,1,1,5,234,96126,100248,296781,569599,476228],"areaStyle":null,"yAxisIndex":0,"xAxisIndex":0}],"tooltip":{"show":true,"trigger":"axis","formatter":""}},
                // {"yAxis":{"name":"哈哈","type":"value"},"xAxis":{"name":"压力","type":"category","data":["很大","很少","无压力","有一点","比较大","缺失"],"boundaryGap":true,"axisLabel":{"show":true,"interval":"0","inside":false}},"legend":{"data":["人数"]},"series":[{"type":"bar","name":"人数","stack":"0","color":null,"data":[19489,1091897,2871294,1037956,132437,56631],"areaStyle":null,"yAxisIndex":0,"xAxisIndex":0}],"tooltip":{"show":true,"trigger":"axis","formatter":""}},
                // {"yAxis":{"name":"比率","type":"value"},"xAxis":{"name":"年份","type":"category","data":["2010","2011","2012","2013","2014","2015","2016","2017"],"boundaryGap":true,"axisLabel":{"show":true,"interval":"0","inside":false}},"legend":{"data":["比率"]},"series":[{"type":"bar","name":"比率","stack":"0","color":null,"data":[0.01,0.05,0.07,0.09,0.1,0.11,0.11,0.11],"areaStyle":null,"yAxisIndex":0,"xAxisIndex":0}],"tooltip":{"show":true,"trigger":"axis","formatter":""}}]
            }
        },
        mounted: function () {
            this.index = this.layout.length;
            console.log('kkk'+this.option);
            console.log('ppp'+this.layout)
        },
        methods: {
            clicked: function() {
                window.alert("CLICK!");
            },
            increaseWidth: function(item) {
                var width = document.getElementById("content").offsetWidth;
                width += 20;
                document.getElementById("content").style.width = width+"px";
            },
            decreaseWidth: function(item) {

                var width = document.getElementById("content").offsetWidth;
                width -= 20;
                document.getElementById("content").style.width = width+"px";
            },
            removeItem: function(item) {
                //console.log("### REMOVE " + item.i);
                this.layout.splice(this.layout.indexOf(item), 1);
            },
            addItem: function() {
                var self = this;
                //console.log("### LENGTH: " + this.layout.length);
                var item = {"x":6,"y":0,"w":6,"h":6,"i":this.index+"", whatever: "bbb"};
                this.index++;
                this.layout.push(item);
            },
            move: function(i, newX, newY){
                console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
            },
            resize: function(i, newH, newW, newHPx, newWPx){
                console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
                this.newHeight = newHPx;
                this.newWidth = newWPx;
            },         
            moved: function(i, newX, newY){
                console.log("### MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
            },
            resized: function(i, newH, newW, newHPx, newWPx){
                console.log("### RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
                this.newHeight = newHPx;
                this.newWidth = newWPx;
            },
            update: function(width){
                this.newWidth = width;
            },
            /**
             * Add change direction button
             */
            changeDirection() {
                let documentDirection = (document.dir !=undefined) ?
                    document.dir :
                    document.getElementsByTagName("html")[0].getAttribute("dir");
                let toggle = "";
                if (documentDirection == "rtl") {
                    toggle = "ltr"
                } else {
                    toggle = "rtl"
                }
                var html = document.getElementsByTagName("html")[0];
                html.setAttribute("dir", toggle);
                //eventBus.$emit('directionchange');
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
        },
        watch: {
            option: {
                handler: function(){
                    console.log('haha');
                    console.log(this.option);
                    this.newoption = this.option;
                },
                //深度观察
                deep: true
            },
            testLayout: {
                handler: function(){
                    console.log('hehe');
                    console.log(this.testLayout);
                    this.layout = JSON.parse(JSON.stringify(this.testLayout));
                },
                //深度观察
                deep: true
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
#graph-content
   margin:10px 30px;
  [class^="graph-content-list"]
    // width: 450px;
    // height: 400px;
    float: left;
</style>
