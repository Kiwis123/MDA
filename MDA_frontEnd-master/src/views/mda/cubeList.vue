<template>
    <div>
        <div class="rightStyle">
            <div class="preChose">
                <a>
                    <i class="iconfont icon-fuhao"></i>
                </a>
                <span class="pretitle">Cube列表</span>
                <el-input
                        placeholder="请输入Cube名称进行检索"
                        v-model="searchtext"
                        class="input-with-select"
                        style="width:50%;margin-left:150px;"
                >
                    <el-button slot="append" icon="el-icon-search" @click="findresult"></el-button>
                </el-input>
                <el-button round id="jobList" icon="iconfont icontcchakanrenwu" @click="jobList"> 查看构建任务</el-button>
                <el-button round id="createCube" icon="el-icon-circle-plus-outline" @click="createCube">手动构建Cube</el-button>
            </div>
            <div class="tableData">
                <el-table
                        :data="tableData"
                        style="width: 100%"
                >
                    <el-table-column prop="id" width="120" label="ID"></el-table-column>
                    <el-table-column prop="cubeName" label="Cube名称"></el-table-column>
                    <el-table-column prop="info" label="描述"></el-table-column>
                    <el-table-column prop="expansion" label="膨胀率"></el-table-column>
                    <el-table-column prop="query_count" label="查询次数"></el-table-column>
                    <el-table-column prop="build_type" label="构建类型"></el-table-column>
                    <el-table-column prop="last_modified" label="最后构建时间"></el-table-column>
                    <el-table-column prop="operate" width="250" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="success"
                                    icon="el-icon-view"
                                    circle
                                    @click="viewCube(scope.row)"
                            ></el-button>
                            <el-button
                                    size="mini"
                                    icon="el-icon-edit"
                                    type="primary"
                                    circle
                                    @click="editData(scope.row)"
                            ></el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle
                                    @click="deleteDialog(scope.row)"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-row>
                <div class="pages">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pagesize"
                            layout="total, prev, pager, next, jumper"
                            :total="total"
                    ></el-pagination>
                </div>
            </el-row>
        </div>
        <el-dialog :visible.sync="deleteDialogVisible" width="25%" center>
            <div class="content">
                <span>你确定要删除此Cube吗？</span>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="deleteData()">确 定</el-button>
      </span>
        </el-dialog>
        <el-dialog
                id="viewCube"
                title="Cube模型预览"
                :visible.sync="viewCubeVisible"
                width="45%">
                <div id="container">
                    <div class="col1">
                        <div class="tableDiv" name="tableDiv" draggable="true" :factTable="factTable">
                            <a-icon :component="tableSvg" />
                            <span class="tableName" name="cell"> {{ factTable }}</span>
                        </div>
                    </div>
                    <div class="col2">

                    </div>
                </div>
        </el-dialog>
    </div>
</template>

<script>
    import fullscreen from "vue-fullscreen";
    import "../../../static/js/macarons.js";
    import echarts from "echarts";
    import tableSvg from '@/assets/assets_mda/svg/liebiao.svg'; // path to your '*.svg' file.

    export default {
        name: "cubeList",
        data() {
            return {
                currentPage: 1, //当前页
                pagesize: 10, //每页条数
                total: 0, //总条数
                searchtext: "",
                deleteDialogVisible: false,
                viewCubeVisible: false,
                //删除的CubeId
                cockpitId: -1,
                flag: false,
                tabs: [
                ],
                saveOption: [],
                num: 0,
                tableLength: 1,
                storyNameFullscreen: '',
                fullscreen: '',
                mTime: '',
                index: 0,
                datalen: '',
                // tableData: [],
                // tableDataLoading: true,
                tableData: [],
                tableSvg,
                factTable: "",
                lookupTables: [],
                // jsplumb
                jsPlumb: null,
            };
        },
        created() {
            // jsplumb
            this.jsPlumb = this.$jsPlumb.getInstance({
                Container:"container",   //选择器id
                EndpointStyle: { radius: 4, fill: "#ffffff"},  //端点样式
                PaintStyle: { stroke: '#000000',strokeWidth:4},// 绘画样式，默认8px线宽  #456
                HoverPaintStyle: { stroke: '#1E90FF' }, // 默认悬停样式  默认为null
                EndpointHoverStyle: { fill: '#F00', radius:6 }, // 端点悬停样式
                ConnectionOverlays:[
                    ["Arrow",{
                        location:1,
                        paintStyle: {
                            stroke: '#00688B',
                            fill: '#00688B',
                        }
                    }]
                ],
                Connector:['Bezier', { curviness: 50 }],     //要使用的默认连接器的类型：折线，流程等
                DrapOptions:{cursor:"crosshair",zIndex:2000},
                ConnectionsDetachable: false,  // 不允许通过拖拽的方式取消连接
            });
        },
        mounted() {
            this.searchStory();
            this.tableData = [
                {id: "4", cubeName: "GD_PREGENCY_RESULT2GD_BAD_BABY_REGIST", info: "【自动构建】事实表：GD_BAD_BABY_REGIST；维表：GD_BAD_BABY_REGIST", expansion: "85%", query_count: 47, build_type: "自动构建", last_modified: "2020-06-04 04:00:56"},
                {id: "3", cubeName: "GD_BASIC_INFO_DETAIL2GD_PREGENCY_RESULT2GD_PHYSICAL_EXAM_W", info: "【自动构建】事实表：GD_BASIC_INFO_DETAIL；维表：GD_PREGENCY_RESULT、GD_PHYSICAL_EXAM_W", expansion: "115%", query_count: 82, build_type: "自动构建", last_modified: "2020-05-30 04:01:27"},
                {id: "1", cubeName: "DupTest4babyS_badR", info: "22", expansion: "233%", query_count: 56, build_type: "手动构建", last_modified: "2019-11-27 14:58:33"},
                {id: "2", cubeName: "2cube", info: "testFor2", expansion: "306%", query_count: 33, build_type: "手动构建", last_modified: "2020-04-15 10:08:21"},
            ];
        },
        methods: {
            handleCurrentChange(val) {
                //切换页面时触发
                this.currentPage = val;
            },
            findresult() {

            },
            searchStory() {
                // this.tableData = [];
                // this.axios.get("http://localhost:6993/getCockpitByUserId?userId=1").then(response => {
                //     console.log(response);
                //     for (var i = 0; i < response.data.datum.length; i++) {
                //         var obj = {
                //             id: response.data.datum[i].id,
                //             cubeName: response.data.datum[i].name,
                //             // realtime: response.data.datum[i].realtime ? '实时' : '非实时',
                //             info: response.data.datum[i].info
                //         };
                //         this.tableData.push(obj);
                //         this.total = response.data.datum.length;
                //         this.tableDataLoading = false
                //     }
                // }).catch((res) => {
                //     this.$message.error('哎哟～出错了～');
                // });
            },
            editData(row) {
                this.$router.push({
                    path: "/mda/optimizeSetting",
                    query: {
                        cubeName: row.cubeName
                    }
                });
            },
            viewCube(row) {
                console.log("开始预览");
                this.viewCubeVisible = true;
                console.log(row.cubeName);
                console.log("开始画图~~");
                // 假数据画图代码
                this.factTable = "GD_BASIC_INFO_DETAIL";
                this.lookupTables = ["GD_PREGENCY_RESULT", "GD_PHYSICAL_EXAM_W"];
                // 渲染后执行，否则获取不到dom元素
                this.$nextTick(()=>{
                    let dropArea2 = document.getElementsByClassName("col2")[0];
                    dropArea2.innerHTML = "";
                    let dragElement = document.getElementsByName("tableDiv")[0];
                    console.log(dragElement);
                    // 画factTable
                    dragElement.id = this.factTable;
                    this.makeSourceElement(dragElement);
                    // 画lookupTables
                    for (let i = 0; i < this.lookupTables.length; i++) {
                        console.log(this.lookupTables[i]);
                        let dragElementTemp1 = dragElement.cloneNode(true);
                        dragElementTemp1.id = this.lookupTables[i];
                        dragElementTemp1.childNodes[1].innerText = " " + this.lookupTables[i];
                        dropArea2.appendChild(dragElementTemp1);
                        this.makeTargetElement(dragElementTemp1);
                    }
                });



                // let dropArea1 = document.getElementsByClassName("col1")[0];
                // let dropArea2 = document.getElementsByClassName("col2")[0];
                // this.dragElement = document.getElementsByName("tableDiv")[0];
                // let that = this;
                // axios
                //     .get("http://localhost:6993/getModelDesc",
                //         {
                //             params: {
                //                 modelId: row.id,
                //             }
                //         },
                //     )
                //     .then(function (response) {
                //         let factTableAndLookupTables = response.data.datum;
                //         console.log(factTableAndLookupTables);
                //         let factTable = factTableAndLookupTables.factTable;
                //         let lookupTables = factTableAndLookupTables.lookupTables;
                //         // 画factTable
                //         that.dragElement.id = factTable;
                //         that.factTable = factTable;
                //         that.setStyleOfDragElement();
                //         that.dragElement.style.lineHeight = "40px";
                //         that.dragElement.style.margin = "100px";
                //         let dragElementTemp = that.dragElement.cloneNode(true);
                //         dragElementTemp.childNodes[1].innerText = " " + factTable;
                //         dropArea1.appendChild(dragElementTemp);
                //         that.makeSourceElement(dragElementTemp);
                //         // 画lookupTables
                //         that.dragElement.style.margin = "15px";
                //         for (let i = 0; i < lookupTables.length; i++) {
                //             that.dragElement.id = lookupTables[i];
                //             let dragElementTemp1 = that.dragElement.cloneNode(true);
                //             dragElementTemp1.childNodes[1].innerText = " " + lookupTables[i];
                //             dropArea2.appendChild(dragElementTemp1);
                //             that.makeTargetElement(dragElementTemp1);
                //         }
                //     });
            },
            deleteDialog(row) {
                this.deleteDialogVisible = true;
                this.cockpitId = row.id;
            },
            deleteData() {
                let that = this;
                this.axios.get("http://localhost:6993/deleteCockpitById?cockpitId=" + this.cockpitId).then(response => {
                    if (response.data.result == true) {
                        that.$message.success('恭喜你，删除成功！');
                        that.deleteDialogVisible = false;
                        that.searchStory();
                    } else {
                        that.$message.error('哎哟～出错了～');
                    }
                })
            },
            handleClose(done) {
                this.$confirm("确认关闭？")
                    .then(_ => {
                        done();
                    })
                    .catch(_ => { });
            },
            createCube() {
                this.$router.push({"name": "createCube"});
            },
            jobList() {
                this.$router.push({"name": "jobList"});
            },
            // jsplumb
            // 初始化规则使其可以连线、拖拽
            makeSourceElement(elem){
                console.log("开始makeSource");
                let ins = this.jsPlumb;
                ins.makeSource(elem,{
                    anchor: ["Continuous", {anchorCount:200, shape:"Rectangle"}],
                    allowLoopback: false,
                    maxConnections: -1 // 不限制连线数量
                });
                ins.draggable(elem, { // 可拖拽不起作用
                    containment:true
                });
            },
            makeTargetElement(elem){
                let ins = this.jsPlumb;
                ins.makeTarget(elem,{
                    anchor:"AutoDefault", //锚点设置为上、下、左、右（但是只有左起作用。。。）
                    allowLoopback: false,
                    maxConnections: 1
                });
                ins.draggable(elem, { // 可拖拽不起作用
                    containment:true
                });
                // 自动连接source和target
                let connection = ins.connect({source:this.factTable, target:elem.id});
            },
        }
    };
</script>
<style scoped>
    .tableData {
        padding: 0px 40px;
    }
    .chose {
        font-size: 20px;
        font-family: 微软雅黑;
        color: #00c1de;
        margin-left: 30px;
    }
    .preChose {
        width: 100%;
        height: 53px;
        line-height: 45px;
        padding: 1px 20px;
        background-color: #f5f7fa;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1),
        0 10px 12px 0 rgba(170, 182, 206, 0.2),
        inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);
        margin-bottom: 20px;
    }
    .pretitle {
        font-size: 22px;
        font-family: 微软雅黑;
        color: rgb(71, 172, 253);
        margin-left: 30px;
    }
    .pages {
        float: right;
        margin: 15px;
    }
    .icon-fuhao {
        font-size: 23px;
        color: #89c7f9;
    }
    .content {
        font-weight: 500;
    }
    .panel {
        border: 1px solid #eee;
        border-radius: 5px;
        width: 90%;
        height: 80%;
        margin: 80px 50px;
        padding: 20px;
        top: 60px;
        position: absolute;
    }
    .tabStyle {
        width: 100%;
        top: 50px;
        position: relative;
    }
    .text {
        position: absolute;
        left: 45px;
        right: 100px;
        width: 70%;
        white-space: nowrap;
        overflow-x: scroll;
        text-align: center;
        margin-left: 10%;
        margin-right: 10%;
        margin-top: 10px;
        display: inline-block;
    }
    .icon1 {
        position: absolute;
        margin-top: 10px;
        left: 90px;
    }
    .icon2 {
        position: absolute;
        margin-top: 10px;
        right: 90px;
    }
    .icon-ene_mon_are_left,
    .icon-ene_mon_are_right {
        font-size: 32px;
        color: #409eff;
    }
    .active {
        border: 1px solid #00c4e2;
        background-color: #ebeef5;
    }
    .contentStyle {
        margin: 0px 15px;
        border-radius: 3px;
        width: 80px;
    }
    #jobList {
        float: right;
        margin: 5px 20px;
        /*background-color: #48bfff;*/
        font-size: 14px;
    }
    #createCube {
        float: right;
        margin: 5px 20px;
        /*background-color: #00a659;*/
        font-size: 14px;
    }
    .rightStyle{
        background-color: rgba(255, 255, 255, 0.64);
    }
    /*jsplumb*/
    #container{
        margin: 20px;
        position: relative;
        background: rgba(239, 239, 239, 0);
        width: 750px;
        height: 260px;
        overflow: auto;
        /*background-color: white;*/
    }
    .col2,.col1{
        float: left;
        width: 300px;
        height: 100%;
    }
    .col1{
        /*margin-left: 40px;*/
    }
    .col2{
        margin-left: 150px;
    }
    #container>div>div{
        width: 100px;
        height: 40px;
        line-height: 40px;
        background: #f5f7fa;
        margin-top: 40px;
    }
    .tableDiv {
        width: auto;
        height: auto;
        min-width: 200px;
        max-width: 230px;
        margin: 50px;
        border: solid;
        box-shadow: rgb(204, 204, 204) 5px 5px;
        border-radius: 8px;
        line-height: 40px;
    }
</style>
