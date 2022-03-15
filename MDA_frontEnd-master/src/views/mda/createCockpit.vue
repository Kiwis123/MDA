<template>
    <div style="height: 500px">
        <div class="left">
            <div style="margin:0px 8px">
                <el-tabs v-model="story">
                    <el-tab-pane label="图表" name="first">
                        <span class="graphList">图表列表</span>
                        <div class="storyDom graghStyle">
                            <ul class="table-name">
                                <li v-for="(table,index) in tableNameList" class="graph">
                                    <el-popover placement="right" width="320" trigger="hover">
                                        <div
                                                :id="'graph'+index"
                                                class="warpper"
                                                draggable="true"
                                                @dragstart="drag1($event)"
                                        ></div>
                                        <i
                                                class="iconfont icon-tubiao"
                                                :id="'name'+index"
                                                @mouseover="showName(index,table.graphTitle)"
                                                slot="reference"
                                        >&nbsp;{{table.graphTitle}}</i>
                                    </el-popover>
                                </li>
                                <li v-for="(table,indexT) in tabBigData" class="graph">
                                    <el-popover placement="right" width="320" trigger="hover">
                                        <div
                                                class="headStyle"
                                                :id="'tab'+indexT"
                                                draggable="true"
                                                @dragstart="dragTable($event)"
                                        >
                                            <el-table :data="table.muchDimTableData" border style="width: 100%;">
                                                <el-table-column
                                                        v-for="(item,index) in table.tabHeaderQian"
                                                        :label="item.name"
                                                        :prop="item.name"
                                                ></el-table-column>
                                                <el-table-column
                                                        v-for="(item,index) in table.tabHeaderHou"
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
                                        <i
                                                class="iconfont icon-tubiao"
                                                :id="'tabName'+indexT"
                                                @mouseover="showName(indexT,table.graphTitle)"
                                                slot="reference"
                                        >&nbsp;{{table.graphTitle}}</i>
                                    </el-popover>
                                </li>
                            </ul>
                        </div>
                        <!-- <div class="storyDom graghStyle">
                          <span class="graphList">指标卡</span>
                          <ul class="table-name">
                            <li v-for="(table,index) in tableNameList" class="graph">
                              <el-popover placement="right" width="320" trigger="hover">
                                <div
                                  :id="'graph'+index"
                                  class="warpper"
                                  draggable="true"
                                  @dragstart="drag1($event)"
                                ></div>
                                <i
                                  class="iconfont icon-tubiao"
                                  :id="'name'+index"
                                  @mouseover="showName(index,table.graphTitle)"
                                  slot="reference"
                                >&nbsp;{{table.graphTitle}}</i>
                              </el-popover>
                            </li>
                          </ul>
                        </div>-->
                    </el-tab-pane>
                    <el-tab-pane label="布 局" name="second">
                        <el-collapse v-model="activeNames" @change="handleChange">
                            <el-collapse-item title="主题" name="1">
                                <div>
                                    <span>主题</span>
                                    <el-select v-model="itemColor" placeholder="请选择" size="mini" style="width:96px">
                                        <el-option label="深色主题" value="深色主题"></el-option>
                                        <el-option label="浅色主题" value="浅色主题"></el-option>
                                    </el-select>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item title="样式" name="2" id="twoActive">
                                <span>标题</span>
                                <el-input
                                        style="width:130px"
                                        v-model="title"
                                        size="mini"
                                        @blur="updateTitle(title)"
                                ></el-input>
                                <div class="form-group backStyle" style="margin-top:25px;position:relative">
                                    <span for="titledemo" style="margin-top:-50px;margin-right: 20px">标题颜色:</span>
<!--                                    <input-->
<!--                                            type="text"-->
<!--                                            id="titledemo"-->
<!--                                            class="form-control demo backDemo"-->
<!--                                            style="width:130px;"-->
<!--                                            @blur="updateTitleColor()"-->
<!--                                    >-->
                                    <el-color-picker v-model="titleColor" size="small" :predefine="predefineColors"></el-color-picker>
                                </div>
                                <div class="form-group backStyle" style="margin-top:25px;position:relative">
                                    <span for="backdemo" style="margin-top:-50px;margin-right: 20px">图表背景色:</span>
<!--                                    <input-->
<!--                                            type="text"-->
<!--                                            id="backdemo"-->
<!--                                            class="form-control demo"-->
<!--                                            style="width:130px;"-->
<!--                                            @blur="updateBackColor()"-->
<!--                                    >-->
                                    <el-color-picker v-model="backColor" size="small" :predefine="predefineColors"></el-color-picker>
                                </div>
                                <div id="Margin"></div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="right">
            <div class="tabStyle" id="tabContainer">
                <div class="panel" @drop="drop($event)" @dragover="allowDrop($event)">
                    <vue-draggable-resizable
                            v-for="(item,index) in dashboard"
                            :key="index"
                            @resizing="onResize"
                            @dragging="onDragging"
                            @activated="active(index)"
                            @deactivated="deactivate()"
                            :w="item.w"
                            :h="item.h"
                            :x="item.x"
                            :y="item.y"
                            :parent="true"
                    >
                        <div class="headStyle graphItem" :id="'delete'+index">
                            <!-- <div @click="deleteGraph(index)">X</div> -->
                            <div
                                    :id="index"
                                    @mouseover="showGraphName(index,item)"
                                    style="width:100%;height:100% !important;"
                            ></div>
                        </div>
                    </vue-draggable-resizable>
                    <!-- </div> -->
                    <!-- <div
                    v-show="flag == 1"
                    class="panel"
                    @drop="dropTab($event)"
                    @dragover="allowDrop($event)"
                    >-->
                    <vue-draggable-resizable
                            v-for="(tab,index) in tableDashboard"
                            :key="'tab'+index"
                            @resizing="onResize"
                            @dragging="tabOnDragging"
                            @activated="tabActive(index)"
                            @deactivated="deactivate()"
                            :w="tab.w"
                            :h="tab.h"
                            :x="tab.x"
                            :y="tab.y"
                            :parent="true"
                    >
                        <div style="width: 100%;height:100%">
                            <!-- <div @click="deleteGraph(index)">X</div> -->
                            <el-table
                                    :data="tab.tabOption.muchDimTableData"
                                    border
                                    style="width: 100%;height:100%"
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
                    </vue-draggable-resizable>
                </div>
            </div>
            <div>
                <div class="btn">
                    <el-button type="success" plain size="mini" @click="viewDialogVisible=true">保存</el-button>
                    <el-button type="primary" plain size="mini" @click="goPre">预览</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="驾驶舱设置" :visible.sync="viewDialogVisible" width="30%">
            <div class="content">
                <div>驾驶舱名称：</div>
                <br>
                <el-input size="small" v-model="cockpitName"></el-input>
<!--                <div class="top-style">驾驶舱是否实时：</div>-->
<!--                <br>-->
<!--                <el-radio v-model="realTimeRadio" :label="false">非实时</el-radio>-->
<!--                <el-radio v-model="realTimeRadio" :label="true">实时</el-radio>-->
<!--                <br>-->
                <div class="top-style">驾驶舱描述：</div>
                <br>
                <el-input type="textarea" autosize placeholder="请输入描述" v-model="cockpitInfo"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="viewDialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="toSave">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import $ from "jquery";
    import echarts from "echarts";
    // echarts4需要单独引入词云图
    import "echarts-wordcloud/dist/echarts-wordcloud";
    import axios from "axios";
    import qs from "qs";
    import "../../../static/js/macarons.js";
    import "../../../static/js/roma.js";
    import "../../../static/js/vintage.js";
    import "../../../static/js/infographic.js";
    import "../../../static/js/dark.js";
    // import "../../../static/js/jquery.minicolors.js"
    import VueDraggableResizable from "vue-draggable-resizable";
    // 导入源码中的css文件，解决handle不显示的问题（无法缩放）
    import 'vue-draggable-resizable/src/components/vue-draggable-resizable.css'
    export default {
        data() {
            return {
                tableNameList: [],
                //画图
                myChart: {},
                dashboard: [],
                dragContent: '',
                //选择的图表
                chooseOption: "",
                //选择的图表ID
                choseId: '',
                //存储图表option
                saveOption: [{ option: {} }],
                //保存ID的数组
                diagramId: [{ id: '' }],
                //dashboard里面的每个数据的id
                count: -1,
                //存放dom的数组
                charts: [],
                active_index: '',
                // 默认的显示第几个
                story: 'first',
                // 默认展开第几个
                activeNames: ['1'],
                // 主题颜色
                itemColor: '浅色主题',
                title: '',
                margin: '',
                newOption: '',
                newCount: '',
                color: '',
                // 驾驶舱名称
                cockpitName: '',
                viewDialogVisible: false,
                classificaion: 0,
                tabHeaderQian: [],
                tabHeaderHou: [],
                //多维表格
                muchDimTableData: [],
                tabData: [],
                // 多维表格的option存储
                tableOption: [],
                // 选择的多维表格的id
                tableId: '',
                // 多维表格的仪表盘
                tableDashboard: [],
                tabBigData: [],
                // 标志是表格还是图表
                flag: 0,
                // 当前推拽的表格是第几个
                tab_active_index: '',
                // 存放传给后台的多维表格的数组
                tabCharts: [],
                realTimeRadio: false,
                // 驾驶舱图表的id
                diagramIDs: [],
                // 驾驶舱描述
                cockpitInfo: '',
                // 传给后台的多维表格option
                tableOptionToBack: [],
                tabWidth: '',
                tabHeight: '',
                // 标题颜色
                titleColor: '#1e90ff',
                // 背景颜色
                backColor: '#90ee90',
                // 预定义颜色（color-picker）
                predefineColors: [
                    '#ff4500',
                    '#ff8c00',
                    '#ffd700',
                    '#90ee90',
                    '#00ced1',
                    '#1e90ff',
                    '#c71585',
                    'rgba(255, 69, 0, 0.68)',
                    'rgb(255, 120, 0)',
                    'hsv(51, 100, 98)',
                    'hsva(120, 40, 94, 0.5)',
                    'hsl(181, 100%, 37%)',
                    'hsla(209, 100%, 56%, 0.73)',
                    '#c7158577'
                ],
                // 如果是编辑，存储cockpitId
                cockpitId: "",
            }
        },
        mounted() {
            let tabContainer = document.getElementById('tabContainer')
            this.tabWidth = tabContainer.offsetWidth || tabContainer.clientWidth
            this.tabHeight = tabContainer.offsetHeight || tabContainer.clientHeight
            // 如果是由cockpitList页面跳转来的（启用编辑功能），则接受变量：
            let dashboardData = this.$route.query.data;
            if (dashboardData != "" && dashboardData != null) {
                console.log("接受cockpitList页面传值");
                this.dashboard = JSON.parse(dashboardData);
                console.log(this.dashboard);
                for (let i = 0; i < this.dashboard.length; i++) {
                    this.$nextTick(() => {
                        this.count++;
                        this.drawGraph(this.count, this.dashboard[i].choseOption);
                    })
                }
                let diagrams = this.$route.query.diagramids.split(",");
                for (let i = 0; i < diagrams.length; i++) {
                    this.diagramIDs.push(Number(diagrams[i]));
                }
                this.cockpitId += this.$route.query.id;
                console.log("cockpitId=" + this.cockpitId);
                this.cockpitName = this.$route.query.cockpitName;
                this.cockpitInfo = this.$route.query.cockpitInfo;
                console.log("cockpitName=" + this.cockpitName);
                console.log("cockpitInfo=" + this.cockpitInfo);
            }
            console.log("开始请求diagram接口");
            this.axios.get("http://localhost:6993/getDiagramByUserId?userId=1").then(response => {
                var data = response.data.datum;
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].classificaion == -3) {
                        this.classificaion = data[i].classificaion
                        this.tabData.push({ graphTitle: data[i].diagramName, graphOption: data[i].option, diagramId: data[i].diagramId });
                        console.log(this.tabData)
                    } else {
                        this.tableNameList.push({ graphTitle: data[i].diagramName, graphOption: data[i].option, diagramId: data[i].diagramId });
                    }
                }
                console.log(this.tableNameList);
                this.$nextTick(() => {
                    for (var i = 0; i < this.tableNameList.length; i++) {
                        $("#graph" + i).css('height', '200px');
                        $('#graph' + i).css('width', '300px');
                        if (this.tableNameList[i].graphOption.series != undefined) {
                            // this.myChart.dispose()
                            this.myChart = echarts.init(
                                document.getElementById("graph" + i), "macarons"
                            );
                            this.myChart.setOption(this.tableNameList[i].graphOption, true);
                            this.init();
                        } else if (this.tableNameList[i].graphOption.rows != undefined) {

                        } else {
                            var newdiv = document.getElementById("graph" + i)
                            newdiv.innerHTML = "<div class=\"graphValue\">" + this.tableNameList[i].graphOption.name + "</div><div class=\"cardGraphValue\">" + this.tableNameList[i].graphOption.value + "</div>";
                        }
                    }
                    for (var k = 0; k < this.tabData.length; k++) {
                        function extend(target, source) {
                            for (var obj in source) {
                                target[obj] = source[obj];
                            } return target;
                        }
                        this.tabHeaderHou = this.tabData[k].graphOption.cows;
                        // 多维表格的行
                        var data = this.tabData[k].graphOption.rows;
                        this.tabHeaderQian = [];
                        var tabhead = { name: '' }
                        // 表格左上角的名称
                        var tableColumn = []
                        tableColumn.push(this.tabData[k].graphOption.row.split(',')[0])
                        for (var i = 0; i < tableColumn.length; i++) {
                            tabhead.name = tableColumn[i]
                            this.tabHeaderQian.push(tabhead);
                            this.muchDimTableData = [];
                            for (var j = 0; j < data.length; j++) {
                                var cowHead = {}
                                cowHead[tableColumn[i]] = data[j].name
                                var bind = extend(cowHead, data[j].value);
                                // console.log(bind);
                                this.muchDimTableData.push(bind);
                            }
                        }
                        this.tabBigData.push({ tabHeaderHou: this.tabHeaderHou, tabHeaderQian: this.tabHeaderQian, muchDimTableData: this.muchDimTableData, graphTitle: this.tabData[k].graphTitle })
                    }
                    console.log(this.tabBigData)
                })
            })
            .catch((res) => {
              this.$message.error('哎哟～出错了～');
            });
            console.log(this.tableNameList);
            this.$nextTick(() => {
                for (var i = 0; i < this.tableNameList.length; i++) {
                    $("#graph" + i).css('height', '200px');
                    $('#graph' + i).css('width', '300px');
                    if (this.tableNameList[i].graphOption.series != undefined) {
                        // this.myChart.dispose()
                        this.myChart = echarts.init(
                            document.getElementById("graph" + i), "macarons"
                        );
                        this.myChart.setOption(this.tableNameList[i].graphOption, true);
                        this.init();
                    } else if (this.tableNameList[i].graphOption.rows != undefined) {

                    } else {
                        var newdiv = document.getElementById("graph" + i)
                        newdiv.innerHTML = "<div class=\"graphValue\">" + this.tableNameList[i].graphOption.name + "</div><div class=\"cardGraphValue\">" + this.tableNameList[i].graphOption.value + "</div>";
                    }
                }
                for (var k = 0; k < this.tabData.length; k++) {
                    function extend(target, source) {
                        for (var obj in source) {
                            target[obj] = source[obj];
                        } return target;
                    }
                    this.tabHeaderHou = this.tabData[k].graphOption.cows;
                    // 多维表格的行
                    var data = this.tabData[k].graphOption.rows;
                    this.tabHeaderQian = [];
                    var tabhead = { name: '' }
                    // 表格左上角的名称
                    var tableColumn = []
                    tableColumn.push(this.tabData[k].graphOption.row.split(',')[0])
                    for (var i = 0; i < tableColumn.length; i++) {
                        tabhead.name = tableColumn[i]
                        this.tabHeaderQian.push(tabhead);
                        this.muchDimTableData = [];
                        for (var j = 0; j < data.length; j++) {
                            var cowHead = {}
                            cowHead[tableColumn[i]] = data[j].name
                            var bind = extend(cowHead, data[j].value);
                            // console.log(bind);
                            this.muchDimTableData.push(bind);
                        }
                    }
                    this.tabBigData.push({ tabHeaderHou: this.tabHeaderHou, tabHeaderQian: this.tabHeaderQian, muchDimTableData: this.muchDimTableData, graphTitle: this.tabData[k].graphTitle })
                }
                console.log(this.tabBigData)
            })
            this.changeItem();
        },
        methods: {
            handleChange(val) {
                this.tabsVal = val;
            },
            //初始化
            init() {
                window.addEventListener(
                    "resize",
                    function () {
                        this.myChart.resize();
                    }.bind(this)
                );
            },
            showName(index, name) {
                $("#name" + index).attr("title", name);
            },
            showGraphName(index, name) {
                if (name.choseOption.name != undefined) {
                    $("#" + index).attr("title", name.choseOption.value);
                }
            },
            _deepCopy(obj) {
                let str, newobj;
                str = newobj = obj instanceof Array ? [] : {};
                if (typeof obj !== "object") {
                    return;
                } else if (window.JSON) {
                    str = JSON.stringify(obj); // 系列化对象
                    newobj = JSON.parse(str); // 还原
                } else {
                    for (var i in obj) {
                        newobj[i] = typeof obj[i] === "object" ? _deepCopy(obj[i]) : obj[i];
                    }
                }
                return newobj;
            },
            onResize(x, y, width, height) {
                console.log("开始resize函数~~~");
                if (this.flag == 1) {
                    if (this.tableDashboard[this.tab_active_index]) {
                        // this.tabCharts[this.tab_active_index].resize();
                        this.tableDashboard[this.tab_active_index].x = x;
                        this.tableDashboard[this.tab_active_index].y = y;
                        this.tableDashboard[this.tab_active_index].w = width;
                        this.tableDashboard[this.tab_active_index].h = height;
                        this.tabCharts[this.tab_active_index].x = x;
                        this.tabCharts[this.tab_active_index].y = y;
                        this.tabCharts[this.tab_active_index].w = width;
                        this.tabCharts[this.tab_active_index].h = height;
                    } else {
                        console.log("chart 未初始化");
                    }
                } else {
                    if (this.dashboard[this.active_index]) {
                        if (this.dashboard[this.active_index].choseOption.series != undefined) {
                            this.charts[this.active_index].resize();
                            this.dashboard[this.active_index].x = x;
                            this.dashboard[this.active_index].y = y;
                            this.dashboard[this.active_index].w = width;
                            this.dashboard[this.active_index].h = height;
                        } else {
                            this.dashboard[this.active_index].x = x;
                            this.dashboard[this.active_index].y = y;
                            this.dashboard[this.active_index].w = width;
                            this.dashboard[this.active_index].h = height;
                        }
                        // this.$emit("putData", this.dashboard);
                    } else {
                        console.log("chart 未初始化");
                    }
                }
            },
            onDragging(x, y) {
                console.log(this.active_index)
                this.dashboard[this.active_index].x = x;
                this.dashboard[this.active_index].y = y;
            },
            tabOnDragging(x, y) {
                this.tableDashboard[this.tab_active_index].x = x;
                this.tableDashboard[this.tab_active_index].y = y;
                this.tabCharts[this.tab_active_index].x = x;
                this.tabCharts[this.tab_active_index].y = y;
            },
            tabActive(index) {
                this.tab_active_index = index;
            },
            active(index) {
                this.active_index = index;
                $("#backdemo").val("");
                $("#titledemo").val("");
                var self = this;
                this.title = '';
                $('#delete' + index).click(function () {
                    self.story = 'second';
                    self.newOption = self._deepCopy(self.dashboard[index].choseOption);
                    self.newCount = index;
                })
                console.log(self.newCount);
            },
            deactivate() {
                this.active_index = -1;
                this.tab_active_index = -1;
            },
            drawGraph(value, option) {
                console.log(this.count);
                $(".dimValue").remove()
                $(".cardValue").remove()
                if (this.itemColor == '浅色主题') {
                    // $(".graphItem").css('background', '#fff');
                    if (option.series != undefined) {
                        // this.myChart.dispose();
                        console.log("获取dom~~~")
                        var dom = document.getElementById(value);
                        console.log(dom);
                        this.myChart = echarts.init(dom, "macarons");
                        this.myChart.setOption(option, true);
                        this.charts.push(this.myChart);
                    } else {
                        var newdiv = document.getElementById(value);
                        newdiv.innerHTML = "<div class=\"drawGraphValue\">" + option.name + "</div><div class=\"drawCardGraphValue\">" + option.value + "</div>";
                        this.charts.push(newdiv);
                    }
                } else {
                    // $(".graphItem").css('background', '#333');
                    if (option.series != undefined) {
                        // this.myChart.dispose();
                        var dom = document.getElementById(value);
                        this.myChart = echarts.init(dom, "dark");
                        this.myChart.setOption(option, true);
                        this.charts.push(this.myChart);
                    } else {
                        var newdiv = document.getElementById(value);
                        newdiv.innerHTML = "<div class=\"drawGraphValue\">" + option.name + "</div><div class=\"drawCardGraphValue\">" + option.value + "</div>";
                        this.charts.push(newdiv);
                    }
                }
            },
            drawGraph2(value, option) {
                console.log(this.count);
                $(".dimValue").remove()
                $(".cardValue").remove()
                if (this.itemColor == '浅色主题') {
                    // $(".graphItem").css('background', '#fff');
                    if (option.series != undefined) {
                        // this.myChart.dispose();
                        var dom = document.getElementById(value);
                        this.myChart = echarts.init(dom, "macarons");
                        this.myChart.setOption(option, true);
                    }
                    //  else {
                    //   var newdiv = document.getElementById(value);
                    //   newdiv.innerHTML = "<div class=\"drawGraphValue\">" + option.name + "</div><div class=\"drawCardGraphValue\">" + option.value + "</div>";
                    // }
                } else {
                    // $(".graphItem").css('background', '#333');
                    if (option.series != undefined) {
                        // this.myChart.dispose();
                        var dom = document.getElementById(value);
                        this.myChart = echarts.init(dom, "dark");
                        this.myChart.setOption(option, true);
                    }
                    //  else {
                    //   var newdiv = document.getElementById(value);
                    //   newdiv.innerHTML = "<div class=\"drawGraphValue\">" + option.name + "</div><div class=\"drawCardGraphValue\">" + option.value + "</div>";
                    // }
                }
            },
            drag1(event) {
                //通过复制被拖拽节点，使原来的位置上仍保存节点
                this.chart = event.currentTarget;
                this.dragContent = this.chart.cloneNode(true);
                this.dragContent.setAttribute("draggable", "false");
                var str = this.dragContent.id.substring(5);
                this.chooseOption = this.tableNameList[str].graphOption;
                this.choseId = this.tableNameList[str].diagramId;
                this.flag = 0;
            },
            dragTable(event) {
                this.chart = event.currentTarget
                this.dragContent = this.chart.cloneNode(true)
                this.dragContent.setAttribute("draggable", "false")
                var str = this.dragContent.id.substring(3)
                this.tableOption = this.tabBigData[str]
                this.tableOptionToBack = this.tabData[str].graphOption
                console.log(this.tableOption)
                this.tableId = this.tabData[str].diagramId;
                this.flag = 1
            },
            drop(ev) {
                ev.preventDefault();
                console.log("drop函数~~~~");
                console.log(this.flag);
                if (this.flag == 0) {
                    var data = {};
                    data.x = (document.documentElement.clientWidth - 700) / 2;
                    data.y = (document.documentElement.clientHeight - 200) / 2;
                    data.w = 200;
                    data.h = 100;
                    data.tabWidth = this.tabWidth
                    data.tabHeight = this.tabHeight
                    data.itemColor = this.itemColor
                    data["choseOption"] = this.chooseOption
                    this.diagramIDs.push(this.choseId)
                    // data.tag = this.count;
                    this.count++;
                    this.dashboard.push(data);
                    // var self = this;
                    // var option = this._deepCopy(this.chooseOption);
                    // if (option.series != undefined) {
                    //   self.title = option.title.text;
                    // } else {
                    //   self.title = option.name;
                    // }
                    this.$nextTick(() => {
                        this.drawGraph(this.count, this.chooseOption);
                    })
                    console.log(this.charts);
                    console.log("打印dashboard：");
                    console.log(this.dashboard);
                } else {
                    let obj = {};
                    obj.x = (document.documentElement.clientWidth - 700) / 2;
                    obj.y = (document.documentElement.clientHeight - 700) / 2;
                    obj.w = 200;
                    obj.h = 100;
                    obj.tabWidth = this.tabWidth
                    obj.tabHeight = this.tabHeight
                    obj.itemColor = this.itemColor
                    obj["tabOption"] = this.tableOptionToBack
                    this.tabCharts.push(obj)

                    var table = {};
                    table.x = (document.documentElement.clientWidth - 700) / 2;
                    table.y = (document.documentElement.clientHeight - 200) / 2;
                    table.w = 200;
                    table.h = 100;
                    table.itemColor = this.itemColor
                    table.tabWidth = this.tabWidth
                    table.tabHeight = this.tabHeight
                    table["tabOption"] = this.tableOption
                    this.tableDashboard.push(table)
                    this.diagramIDs.push(this.tableId)
                }
            },
            // dropTab(ev) {
            //   ev.preventDefault();
            //   var table = {};
            //   table.x = (document.documentElement.clientWidth - 700) / 2;
            //   table.y = (document.documentElement.clientHeight - 200) / 2;
            //   table.w = 200;
            //   table.h = 100;
            //   table["tabOption"] = this.tableOption
            //   console.log(this.diagramIDs)
            //   this.tableDashboard.push(table)
            //   this.tabCharts.push(table)
            //   console.log(this.tabCharts)
            // },
            updateTitle(title) {
                var color = $("#titledemo").val()
                this.$nextTick(() => {
                    $("#delete" + this.newCount).css('background', $("#backdemo").val())
                    $('#' + this.newCount + ' .drawGraphValue').css('color', color);
                    $('#' + this.newCount + ' .drawCardGraphValue').css('color', color);
                    console.log($('#' + this.newCount).children(".drawGraphValue"))
                })
                if (this.newOption.series != undefined) {
                    this.newOption.title.text = title;
                } else {
                    $('#' + this.newCount + ' .drawGraphValue').text(title);
                }
                this.$nextTick(() => {
                    // this.charts = [];
                    this.drawGraph2(this.newCount, this.newOption)
                })

            },
            updateBackColor() {
                var color = $("#titledemo").val();
                this.$nextTick(() => {
                    $('#' + this.newCount + ' .drawGraphValue').css('color', color);
                    $('#' + this.newCount + ' .drawCardGraphValue').css('color', color);
                    $("#delete" + this.newCount).css('background', $("#backdemo").val())
                })
            },
            updateTitleColor() {
                var color = $("#titledemo").val();
                $("#delete" + this.newCount).css('background', $("#backdemo").val())
                if (this.newOption.series != undefined) {
                    var itemStyle = {
                        "color": color
                    }
                    this.newOption.title['textStyle'] = itemStyle;
                } else {
                    this.$nextTick(() => {
                        $('#' + this.newCount + ' .drawGraphValue').css('color', color);
                        $('#' + this.newCount + ' .drawCardGraphValue').css('color', color);
                    })
                }
                this.$nextTick(() => {
                    // this.charts = [];
                    this.drawGraph2(this.newCount, this.newOption)
                })
            },
            allowDrop(ev) {
                ev.preventDefault();
            },
            changeItem() {
                $(".demo").each(function () {
                    $(this).minicolors({
                        control: $(this).attr("data-control") || "hue",
                        defaultValue: $(this).attr("data-defaultValue") || "",
                        inline: $(this).attr("data-inline") === "true",
                        letterCase: $(this).attr("data-letterCase") || "lowercase",
                        opacity: $(this).attr("data-opacity"),
                        position: $(this).attr("data-position") || "bottom left",
                        change: function (hex, opacity) {
                            if (!hex) return;
                            if (opacity) hex += ", " + opacity;
                            try {
                            } catch (e) { }
                        },
                        theme: "bootstrap"
                    });
                })
            },
            // 删除图表
            deleteGraph(index) {
                this.dashboard.splice(index, 1);
                this.charts = [];
                this.count--;
                for (var i = 0; i < this.dashboard.length; i++) {
                    this.drawGraph(i, this.dashboard[i].choseOption);
                }
            },
            toSave() {
                axios
                    .post(
                        "http://localhost:6993/saveCockpit",
                        qs.stringify({
                            userId: 1,
                            cockpitId: this.cockpitId, // 若是编辑，则有id，否则为空字符串
                            diagramIDs: this.diagramIDs.join(','),
                            name: this.cockpitName,
                            info: this.cockpitInfo,
                            tableDashboard: JSON.stringify(this.tabCharts),
                            layoutConf: JSON.stringify(this.dashboard),
                            realtime: this.realTimeRadio
                        })
                    ).then(response => {
                    this.cockpitName = '';
                    this.viewDialogVisible = false;
                    this.$router.push({path:'/mda/cockpit'})
                    this.$message.success('保存成功')
                }).catch((res) => {
                    this.$message.error('哎哟～出错了～');
                });
            },
            goPre() {
                let routeData = this.$router.resolve({
                    path: "/mda/previewCockpit",
                    query: {
                        data: JSON.stringify(this.dashboard),
                        itemColor: this.itemColor,
                        tabWidth: this.tabWidth,
                        tabHeight: this.tabHeight,
                        tableDashboard: JSON.stringify(this.tableDashboard)
                    }
                });
                window.open(routeData.href, '_blank');
            }
        },
        components: {
            "vue-draggable-resizable": VueDraggableResizable
        },
        watch: {
            itemColor: {
                handler: function () {
                    if (this.itemColor == '深色主题') {
                        this.charts = [];
                        $(".graphItem").css('background', '#333');
                        this.$nextTick(() => {
                            $('.drawGraphValue').css('color', '#fff');
                            $('.drawCardGraphValue').css('color', '#fff');
                        })
                        // $(".panel").css('background','#333 !important');
                        for (var i = 0; i < this.dashboard.length; i++) {
                            if (this.dashboard[i].choseOption.series != undefined) {
                                var dom = document.getElementById(i);
                                this.myChart = echarts.init(dom);
                                this.myChart.dispose();
                                var dom = document.getElementById(i);
                                this.myChart = echarts.init(dom, "dark");
                                this.myChart.setOption(this.dashboard[i].choseOption, true);
                                console.log(this.myChart);
                                this.charts.push(this.myChart);
                                console.log(this.charts);
                            } else {
                                var newdiv = document.getElementById(i);
                                newdiv.innerHTML = "<div class=\"drawGraphValue\">" + this.dashboard[i].choseOption.name + "</div><div class=\"drawCardGraphValue\">" + this.dashboard[i].choseOption.value + "</div>";
                                this.charts.push(newdiv);
                            }
                        }
                    } else {
                        this.charts = [];
                        $(".graphItem").css('background', '#fff');
                        // $(".panel").css('background','#fff !important');
                        this.$nextTick(() => {
                            $('.drawGraphValue').css('color', 'black');
                            $('.drawCardGraphValue').css('color', 'black');
                        })
                        for (var i = 0; i < this.dashboard.length; i++) {
                            if (this.dashboard[i].choseOption.series != undefined) {
                                var dom = document.getElementById(i);
                                this.myChart = echarts.init(dom);
                                this.myChart.dispose();
                                var dom = document.getElementById(i);
                                this.myChart = echarts.init(dom, "macarons");
                                this.myChart.setOption(this.dashboard[i].choseOption, true);
                                this.charts.push(this.myChart);
                            } else {
                                var newdiv = document.getElementById(i);
                                newdiv.innerHTML = "<div class=\"drawGraphValue\">" + this.dashboard[i].choseOption.name + "</div><div class=\"drawCardGraphValue\">" + this.dashboard[i].choseOption.value + "</div>";
                                this.charts.push(newdiv);
                            }
                        }
                    }
                }
            },
            // chooseOption:{
            //   handler:function(){
            //     this.drawGraph(this.count, this.chooseOption);
            //   }
            // }
        }
    }
</script>
<style scoped>
    .left {
        width: 150px;
        height: 100%;
        top: 0;
        left: 200px;
        bottom: 0;
        background-color: #fff;
    }
    .tabStyle {
        width: 100%;
        position: relative;
        height: 98%;
    }
    .right {
        position: absolute;
        top: 0;
        left: 350px;
        right: 0;
        overflow: scroll;
        bottom: 0px;
        padding: 20px;
        /* height: 100vh; */
        background: #eee !important;
    }
    .storyDom {
        margin-top: 10px;
    }
    .graphList {
        font-size: 16px;
        font-weight: 500;
        color: #87a8d0;
    }
    .graghStyle {
        overflow: scroll;
        padding-left: 20px;
    }
    .table-name {
        margin-top: 10px;
        padding: 0;
    }
    .graph {
        margin-top: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .panel {
        /* border: 1px solid #eee; */
        background: #eee !important;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        /* margin: 80px 50px; */
        /* padding: 20px; */
    }
    .el-collapse {
        border: 0px !important;
    }
    .graphItem {
        border: 1px solid #dfdcf5;
        border-radius: 5px;
        background: #fff;
    }
    .headStyle {
        height: 100%;
    }
    .minicolors-swatch {
        top: 3px;
        left: 3px;
        width: 22px !important;
        height: 22px !important;
        border-radius: 3px;
    }
    .demo {
        width: 130px;
        height: 28px;
    }
    .minicolors-panel {
        width: 120px;
        height: 120px;
    }
    .minicolors-slider,
    .minicolors-opacity-slider {
        left: 120px;
        width: 20px;
        height: 120px;
    }
    .minicolors .minicolors-grid-inner {
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        height: 120px;
        background: none;
    }
    .el-collapse-item__wrap {
        overflow: scroll;
        height: 300px !important;
    }
    .btn {
        text-align: center;
        width: 100%;
    }
    .top-style {
        margin-top: 20px;
    }
</style>
