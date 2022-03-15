<template>
    <div id="totalContent">
        <!-- 页面头部框框 -->
        <div class="prehd">
            <a>
                <i class="iconfont icon-fanhui" @click="back()"></i>
            </a>
            <span class="pretitle">退出关联视图</span>
            <a class="save">
                <el-button type="text" @click="saveDialogVisible = true">
              <span class="pretitles">
                <i class="iconfont icon-baocun"></i>&nbsp;&nbsp;保存
              </span>
                </el-button>
            </a>
        </div>
        <div id="containerJsplumb">
            <div id="divForest">
                <div class="tree" v-for="(divData, index) in allDivDatas" :key="index" :style="divData.style" :id="divData.id">
                    <el-card class="box-card"
                             v-for="(table, index1) in divData.tables" :key="index1"
                             :id="table.name"
                             style="position: relative;"
                    >
                        <div slot="header" class="clearfix">
                            <a-icon :component="tableSvg" />
                            <el-button style="margin-left: 4px; font-size: 12px; color: black" type="text">{{ table.name }}</el-button>
                            <!--              <el-button style="float: right; padding: 3px 0; color: black" type="text">x</el-button>-->
                        </div>
                        <div v-for="(field, index2) in divData.tables[index1].fields" :key="index2" class="text item">
                            {{ field }}
                        </div>
                    </el-card>
                </div>
                <div class="tree" style="width: 500px; height: 400px"></div>
            </div>
            <div id="divSingleTable">
                <div class="singleTable" v-for="(table, index) in singleTables" :key="index">
                    <el-card class="box-card"
                             :id="table.name"
                             style="position: relative;"
                    >
                        <div slot="header" class="clearfix">
                            <a-icon :component="tableSvg" />
                            <el-button style="margin-left: 4px; font-size: 12px; color: black" type="text">{{ table.name }}</el-button>
                            <!--              <el-button style="float: right; padding: 3px 0; color: black" type="text">x</el-button>-->
                        </div>
                        <div v-for="(field, index1) in table.fields" :key="index1" class="text item">
                            {{ field }}
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /* global jsPlumb */
    import {jsPlumbInstance as jsPlumb} from "jsplumb";
    import VueDraggableResizable from "vue-draggable-resizable";
    // 导入源码中的css文件，解决handle不显示的问题（无法缩放）
    import 'vue-draggable-resizable/src/components/vue-draggable-resizable.css'

    import tableSvg from '@/assets/assets_mda/svg/tableBlack.svg';

    export default {
        id: "dataView",
        data() {
            return {
                tableSvg,
                jsPlumb,
                allDivDatas: [], // 绘制雪花所用的数据（从后端请求得来）
                tablesInSnow: [], // 在雪花中的所有表的表名
                singleTables: [], // 下半区单独的表
            };
        },
        components: {
            "vue-draggable-resizable": VueDraggableResizable
        },
        created() {
            // this.allDivDatas.push({"id": 1, "tables": this.tables, "style": "width: 1150px; height: 550px"});
            // this.allDivDatas.push({"id": 2, "tables": this.tables2, "style": "width: 300px; height: 400px"});
            // this.allDivDatas.push({"id": 3, "tables": this.tables3, "style": "width: 300px; height: 400px"});

            // jsplumb
            this.jsPlumb = this.$jsPlumb.getInstance({
                Container:"containerJsplumb",   //选择器id
                EndpointStyle: { radius: 1, fill: "#ffffff"},  //端点样式
                PaintStyle: { stroke: '#000000',strokeWidth:4},// 绘画样式，默认8px线宽  #456
                HoverPaintStyle: { stroke: '#1E90FF' }, // 默认悬停样式  默认为null
                EndpointHoverStyle: { fill: '#F00', radius:6 }, // 端点悬停样式
                ConnectionOverlays:[
                    ["PlainArrow",{
                        location:1,
                        width: 7,
                        length: 7,
                        paintStyle: {
                            stroke: '#000000',
                            fill: '#000000',
                        }
                    }]
                ],
                Connector:['Flowchart', { curviness: 50 }],     //要使用的默认连接器的类型：折线，流程等
                DrapOptions:{cursor:"crosshair",zIndex:2000},
                ConnectionsDetachable: false,  // 不允许通过拖拽的方式取消连接
            });
        },
        mounted() {
            // 从后台获取数据，并调用jsplumbReady进行数据加载
            this.getData();
        },
        methods: {
            // 从后台获取dataView的数据
            getData() {
                let that = this;
                this.axios.get("http://localhost:6993/getAllDivDatas",{
                    params: {
                        projectId: 1
                    }
                }).then(res => {
                    let dataViewList = res.data.datum;
                    for (let i = 0; i < dataViewList.length; i++) {
                        let dataView = dataViewList[i];
                        that.allDivDatas.push({
                            id: dataView.id,
                            tables: JSON.parse(dataView.tables),
                            style: dataView.style,
                            layout: JSON.parse(dataView.layout)
                        });
                        // 把雪花中的table写入tablesInSnow
                        let tables = JSON.parse(dataView.tables);
                        for (let j = 0; j < tables.length; j++) {
                            that.tablesInSnow.push(tables[j].name);
                        }
                    }
                    // jsplumb初始化（装载数据）
                    console.log("开始jsplumbReady，等待1ms后执行(等待dom加载)");
                    window.setTimeout(this.jsplumbReady, 1);
                    // 加载singleTables
                    this.getSingleTables();
                })
            },
            // jsplumb初始化函数（jsplumb装载数据）
            jsplumbReady() {
                console.log("等待结束，开始执行jsplumbReady");
                // 设置各表格的初始位置
                for (let i = 0; i < this.allDivDatas.length; i++) {
                    let layoutList = this.allDivDatas[i].layout;
                    for (let j = 0; j < layoutList.length; j++) {
                        let layout = layoutList[j];
                        this.setPosition(layout.id, layout.position.top, layout.position.left);
                    }
                }
                // 设置source、target以及锚点属性
                for (let i = 0; i < this.allDivDatas.length; i++) {
                    for (let j = 0; j < this.allDivDatas[i].tables.length; j++) {
                        let element = document.getElementById(this.allDivDatas[i].tables[j].name);
                        this.makeSourceElement(element);
                        this.makeTargetElement(element);
                        this.jsPlumb.draggable(element);
                    }
                }
                // 设置连线
                let ins = this.jsPlumb;
                this.axios
                    .get(
                        "http://localhost:6993/getRelavances",
                        {
                            params: {
                                projectId: 1
                            }
                        }
                    )
                    .then(function (response) {
                        let queryResult = response.data.datum;
                        console.log(queryResult);
                        // 遍历queryResult，将relavance转化为connection
                        for (let i = 0; i < queryResult.length; i++) {
                            ins.connect({source: queryResult[i].source, target: queryResult[i].target});
                        }
                    });
            },
            // 指定各表格初始位置
            setPosition(id, top, left) {
                let element = document.getElementById(id);
                element.style = "position: absolute; top: " + top + "px; left: " + left + "px;"
            },
            // jsplumb
            // 初始化规则使其可以连线、拖拽
            makeSourceElement(elem){
                let ins = this.jsPlumb;
                ins.makeSource(elem,{
                    // anchor:"AutoDefault", //锚点设置为上、下、左、右
                    anchor: ["Continuous", {anchorCount:200, shape:"Rectangle"}],
                    // anchor: ["Perimeter", {anchorCount:200, shape:"Rectangle"}],
                    allowLoopback: false,
                    maxConnections: -1, // 不限制连线数量
                    filter: ":not(.el-card__header)"
                });
            },
            makeTargetElement(elem){
                let ins = this.jsPlumb;
                ins.makeTarget(elem,{
                    // anchor:"AutoDefault", //锚点设置为上、下、左、右
                    anchor:["Continuous", {anchorCount:200, shape:"Rectangle"}], //锚点设置为上、下、左、右（但是只有左起作用。。。）
                    allowLoopback: false,
                    maxConnections: -1
                });
            },
            // 获取单独表singleTable数据，并在jsplumb中加载
            getSingleTables() {
                let that = this;
                this.axios
                    .get(
                        "http://localhost:6993/getHiveTablesAndColumns",
                    )
                    .then(function (response) {
                        let queryResult = response.data.datum;
                        console.log(queryResult);
                        // 如果queryResult里面出现tablesInSnow里没有的表，把它装进singleTables
                        for (let i = 0; i < queryResult.length; i++) {
                            if (!that.tablesInSnow.includes(queryResult[i].name)) {
                                that.singleTables.push(queryResult[i]);
                            }
                        }
                        console.log(that.singleTables);
                        // 设置source、target以及锚点属性（延时1ms）
                        window.setTimeout(function () {
                            for (let i = 0; i < that.singleTables.length; i++) {
                                let element = document.getElementById(that.singleTables[i].name);
                                that.makeSourceElement(element);
                                that.makeTargetElement(element);
                                that.jsPlumb.draggable(element);
                            }
                        }, 1);
                        // 设置连线
                        let ins = that.jsPlumb;
                        that.axios
                            .get(
                                "http://localhost:6993/getRelavances",
                                {
                                    params: {
                                        projectId: 1
                                    }
                                }
                            )
                            .then(function (response) {
                                let queryResult = response.data.datum;
                                console.log(queryResult);
                                console.log(that.singleTables);
                                // 遍历queryResult，若有新增的target为singleTable的Relavance，对其进行连线
                                for (let i = 0; i < queryResult.length; i++) {
                                    for (let j = 0; j < that.singleTables.length; j++) {
                                        if (that.singleTables[j].name === queryResult[i].target) {
                                            console.log("为singleTable建立连线：");
                                            console.log("source: " + queryResult[i].source + "; target: " + queryResult[i].target);
                                            ins.connect({source: queryResult[i].source, target: queryResult[i].target});
                                        }
                                    }
                                }
                            });
                    });
            },
            // 返回
            back() {
                this.$router.go(-1);
            },
        }
    }
</script>

<style>
    /* 头部样式 */
    .prehd {
        position: relative;
        width: 100%;
        height: 55px;
        line-height: 45px;
        padding: 5px 20px;
        background-color: #f5f7fa;
        box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.98),
        0 10px 12px 0 rgba(170, 182, 206, 0.2),
        inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);
        left: 10px;
    }
    .pretitle {
        font-size: 18px;
        font-family: 微软雅黑;
        color: rgb(71, 172, 253);
        margin-left: 30px;
    }
    .pretitles {
        font-size: 15px;
        font-family: 微软雅黑;
        color: rgb(71, 172, 253);
        margin-left: 30px;
        margin-right: 30px;
    }
    .icon-fanhui {
        font-size: 23px;
        color: #89c7f9;
    }
    .preheader {
        background-color: transparent;
        box-shadow: none;
        padding-right: 350px;
        line-height: 64px;
        position: absolute;
        z-index: 2000;
        top: 10px;
        width: 90%;
        height: 64px;
    }
    .preheader .btn-layer {
        font-style: normal;
        position: absolute;
        right: 24px;
        width: auto;
        height: 48px;
        font-size: 17px;
    }
    .preheader .btn-layer a {
        display: inline-block;
        padding: 0 16px;
        color: rgba(10, 18, 32, 0.64);
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease-in-out;
    }
    .sum:hover {
        color: #00c1de;
    }
    .sum {
        font-size: 17px;
        color: rgba(10, 18, 32, 0.64);
    }
    .save {
        float: right;
    }
    /* 主体样式 */
    #totalContent {
        position: absolute;
        height: 100%;
        width: 1705px;
        left: 200px;
        background-color: #f7f8fa;
    }
    #containerJsplumb {
        position: relative;
        background: #ffffff;
        height: 790px;
        left: 10px;
        right: 30px;
        bottom: 15px;
        top: 0px;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    #divForest {
        position: relative;
        height: 70%;
        margin-bottom: 15px;
        border-bottom: thin dashed #e8eaed;
        white-space: nowrap;
        /*配合子元素的align-self: center实现竖直居中*/
        /*display: flex;*/
    }
    #divSingleTable {
        position: relative;
        margin-top: 15px;
        white-space: nowrap;
        /*配合子元素的align-self: center实现竖直居中*/
        display: flex;
    }
    div.tree {
        display:inline-block;
        position: relative;
        margin-right: 20px;
        border-right: thin dashed #e8eaed;
        align-self: center;
        /*height: 100%;*/
    }
    div.singleTable {
        height: 165px;
        display:inline-block;
        position: relative;
        margin-left: 20px;
        margin-right: 20px;
        align-self: center;
    }
    /*svg.icon {*/
    /*    font-size: 12px;*/
    /*}*/
    .el-card__header. anticon .icon {
        font-size: 12px;
    }
    /*card设置*/
    .el-card {
        border-style:solid;
        border-width:1px;
        border-color: black;
    }
    .el-card__header {
        padding: 5px 10px;
        background-color: #48bfff;
    }
    .el-card__body {
        padding: 5px 10px;
        /*必须设置height才能使用overflow，height的值无所谓*/
        height: 75px;
        /*只上下滚动，不允许左右滚动*/
        overflow: auto;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .text {
        font-size: 7px;
    }
    .item {
        margin: 2px 0px 2px 3px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 180px;
        height: 130px;
    }
    /*jsplumb的连线样式*/
    /*宽度 4 --> 1*/
    path {
        stroke-width: 1;
    }
</style>
