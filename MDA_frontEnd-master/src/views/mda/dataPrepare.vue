<template>
    <!-- eslint-disable -->
    <a-row type="flex" justify="space-around" style="background-color: rgba(255, 255, 255, 0.64)">
        <a-col :xl="5" style="min-width: 190px;width: 23%">
            <el-tabs type="border-card" v-model="dataPanel" stretch>
                <el-tab-pane label="数据模型" name="dataModel">
                    <a-card id="modellist" style="background-color: white;width: 100%;height: 100%">
                        <el-table :data="modelList">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form label-position="left" inline class="demo-table-expand">
                                        <el-form-item label="模型名称：">
                                            <span>{{ props.row.fileName }}</span>
                                        </el-form-item>
                                        <el-form-item label="模型描述：">
                                            <span>{{ props.row.description }}</span>
                                        </el-form-item>
                                        <el-form-item label="编辑时间：">
                                            <span>{{ props.row.updateTime }}</span>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="模型名称"
                                    prop="fileName">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="props">
                                    <el-button
                                            size="mini"
                                            type="success"
                                            icon="el-icon-check"
                                            circle
                                            @click="previewModel(props.row)"
                                    ></el-button>
                                    <el-button
                                            size="mini"
                                            icon="el-icon-edit"
                                            type="primary"
                                            circle
                                            @click="editDialogVisible = true; editModel(props.row)"
                                    ></el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-delete"
                                            circle
                                            @click="deleteDialogVisible = true; deleteModel(props.row)"
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </a-card>
                </el-tab-pane>
                <el-tab-pane label="数据仓库" name="dataWareHouse">
                    <a-card id="tablelist" title="数据表" style="background-color: white;width: 100%;height: 50%">
                        <a-col name="tableDiv" draggable="true" @dragstart='drag($event)' @dragend="dragend($event)" v-for="hiveTable in hiveTables" :key="hiveTable.index" style="width: 250px">
                            <a-icon :component="tableSvg" />
                            <span id="hive" class="tableName" name="cell"> {{ hiveTable }}</span>
                        </a-col>
                    </a-card>
                    <a-card class="" id="cubelist" title="数据立方体" style="background-color: white;width: 100%;height: 50%">
                        <a-col v-for="cube in cubes" :key="cube.index" draggable="true" @dragstart='drag($event)' @dragend="dragend($event)">
                            <a-icon :component="cubeSvg"/>
                            <span id="kylin" class="tableName"> {{ cube }}</span>
                        </a-col>
                    </a-card>
                </el-tab-pane>
            </el-tabs>
        </a-col>
        <a-col :xl="18" :md="17">
            <div :style="{ background: '#fff',padding: '24px', }">
                <a-row type="flex" justify="space-between">
                    <a-col :span="8">
                        <span style="font-size: 25px;font-weight: 400">模型视图</span>
                    </a-col>
                </a-row>
                <!-- 分割线 -->
                <a-divider />
                <!-- 拖拽放置区域 -->
                <!-- jsPlumb , 允许拖拽（拖拽目标区域）-->
                <div id="container" @drop="drop($event)" @dragover="allowDrop($event)">
                    <div class="col1">
<!--                        <span class="tips">拖放事实表或Cube</span>-->
                    </div>
                    <div class="col2">
<!--                        <span class="tips">拖放维度表</span>-->
                    </div>
                </div>
                <!-- dialog 弹窗，引用dialog.vue组件 -->
                <div class="main">
<!--                    <div @click="openMask">打开弹窗</div>-->
                    <dialog-bar v-model="sendVal" :table1="factTable" :table2="lookupTable" :table1-columns="factTableColumns" :table2-columns="lookupTableColumns"
                                type="confirm" title="数据表关联条件" v-on:cancel="clickCancel()" @danger="clickDanger()" @confirm="clickConfirm(arguments)"></dialog-bar>
                </div>
            </div>

            <!-- 分割线 -->
            <a-divider />

            <div :style="{ background: '#fff',padding: '24px', }">
                <a-row type="flex" justify="space-between">
                    <a-col :span="8">
                        <span style="font-size: 25px;font-weight: 400">数据预览</span>
                    </a-col>
                    <a-col :span="8">
                        <!--                        <a-input-search size="large" style="margin-bottom: 30px" placeholder="输入数据库名称" @search="onSearch" enterButton />-->
                    </a-col>
                </a-row>
                <!-- 预览表格，带loading -->
                <a-table :loading="previewLoading" :columns="columns" :dataSource="previewData" :scroll="{ x: '250%'}">
                    <a slot="id" slot-scope="text" href="javascript:;">{{text}}</a>
                </a-table>
            </div>

            <!-- 头部的各种按钮 -->
            <div>
                <div class="preheader">
                    <span class="btn-layer iconfont">
                        <a>
                        <el-button @click="goDataView">
                          <span class="sum">
                            <a-icon :component="relationSvg" />&nbsp;&nbsp;数据表关联视图
                          </span>
                        </el-button>
                      </a>
                      <a>
                        <el-button type="danger" @click="clearDragArea">
                          <span class="sum">
                            <i class="icontcshanchu"></i>&nbsp;&nbsp;清空
                          </span>
                        </el-button>
                      </a>
                      <a>
                        <el-button type="success" v-if="modelId == -1" @click="viewDialogVisible=true" size="medium">

                          <span class="sum">
                            <i class="icontcxiayibu"></i>&nbsp;&nbsp;下一步
                          </span>
                        </el-button>
                        <el-button type="success" v-else @click="chooseData()" size="medium">
                              <span class="sum">
                            <i class="icontcxiayibu"></i>&nbsp;&nbsp;下一步
                          </span>
                        </el-button>
                      </a>
                    </span>
                </div>
            </div>

            <el-dialog title="保存数据模型" :visible.sync="viewDialogVisible" width="30%">
                <div class="content">
                    <div>模型名称：</div>
                    <br>
                    <el-input size="small" v-model="fileName"></el-input>
                    <div style="margin-top: 20px">描述信息：</div>
                    <br>
                    <el-input type="textarea" autosize placeholder="请输入描述" v-model="description"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="viewDialogVisible=false">取 消</el-button>
                    <el-button size="small" type="primary" @click="chooseData">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="修改模型信息" :visible.sync="editDialogVisible" width="20%" center="">
                <div class="content">
                    <div>模型名称：</div>
                    <br>
                    <el-input size="small" v-model="fileName"></el-input>
                    <div style="margin-top: 20px">描述信息：</div>
                    <br>
                    <el-input type="textarea" autosize placeholder="请输入描述" v-model="description"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="editDialogVisible = false">取 消</el-button>
                    <el-button size="mini" type="primary" @click="saveModel">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog :visible.sync="deleteDialogVisible" width="25%" center>
                <div class="content">
                    <span>你确定要删除此模型吗？</span>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="confirmDelete()">确 定</el-button>
                </span>
            </el-dialog>
        </a-col>
    </a-row>
</template>

<script>
    /*eslint-disable*/
    import axios from "axios";
    import qs from "qs";
    import cubeSvg from '@/assets/assets_mda/svg/cangku-2.svg'; // path to your '*.svg' file.
    import tableSvg from '@/assets/assets_mda/svg/liebiao.svg'; // path to your '*.svg' file.
    import tableJoinPng from '@/assets/assets_mda/svg/tableJoin.png'; // path to your '*.svg' file.
    import relationSvg from '@/assets/assets_mda/svg/moxing.svg'; // path to your '*.svg' file.
    import dialogBar from '../../components/mda/dialog';

    export default {
        id: "dataPrepare",
        components: {
            'dialog-bar': dialogBar,
        },
        data() {
            return {
                cubeSvg,
                tableSvg,
                tableJoinPng,
                relationSvg,
                viewDialogVisible: false,
                previewData: [],
                searchText: '',
                searchInput: null,
                hiveTables: [],
                cubes: [],
                columns: [],
                factTable: "",
                lookupTable: "",
                lookupTables: [], // 记录lookupTable、joinType、joinCondition
                // jsplumb
                jsPlumb: null,
                // dialog
                sendVal: false,
                factTableColumns: [],
                lookupTableColumns: [],
                singleHivePreview: false, // flag变量，{true：factTable已被预览，false：未被预览}
                previewLoading: false, // flag变量，{true: 正在加载，false：无需加载或已完成}
                originDropArea: "", // 记录拖拽区一开始的html设置，方便清空后恢复
                fileName: "", // 模型名称
                fileUrl: "", // 记录宽表的sql语句（拼接factTable和lookupTables），传参给下一个页面和后台
                modelType: "", // 模型类型：{hive: hive单表或宽表；kylin：cube模型}
                dataPanel: "dataModel", // 标签tabs默认值：数据模型
                modelList: [], // 数据模型列表（从后台获取）
                description: "", // 数据模型的描述信息
                editDialogVisible: false,
                modelId: -1,
                deleteDialogVisible: false,
            };
        },
        created() {
            this.getHiveTables();
            this.getCubes();
            this.getModelList();
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
        // jsplumb
        mounted() {
            this.switchContainer(true,true,true);
            this.originDropArea = document.getElementById("container").innerHTML;
        },
        methods: {
            handleSearch(selectedKeys, confirm) {
                confirm();
                this.searchText = selectedKeys[0];
            },

            handleReset(clearFilters) {
                clearFilters();
                this.searchText = '';
            },
            // 获取hive表名列表
            getHiveTables(){
                // 保留外层的this指向
                var that = this;
                axios
                    .get(
                        "http://localhost:6993/getHiveTables",
                    )
                    .then(function (response) {
                        var queryResult = response.data.datum;
                        for (let i = 0; i < queryResult.length; i++) {
                            that.hiveTables.push(queryResult[i].tab_name);
                        }
                    })
            },
            // 获取cube列表
            getCubes(){
                // 保留外层的this指向
                var that = this;
                axios
                    .get(
                        "http://localhost:6993/listCubes",
                    )
                    .then(function (response) {
                        var queryResult = response.data.datum;
                        for (let i = 0; i < queryResult.length; i++) {
                            that.cubes.push(queryResult[i].name);
                        }
                    })
            },
            // 获取model列表
            getModelList(){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/getDataSource",
                    )
                    .then(function (response) {
                        let queryResult = response.data.datum;
                        console.log("打印modelList");
                        console.log(queryResult);
                        that.modelList = queryResult;
                    })
            },
            //拖拽
            allowDrop(event) {
                event.preventDefault();
                let dt = event.dataTransfer;
                dt.effectAllowed = "copy";
                dt.dropEffect = "copy";
            },
            drag(event){
                // 提取拖拽的节点
                this.dragElement = event.currentTarget.cloneNode(true);
                // 设置该element的id、name和样式
                this.dragElement.id = this.dragElement.getElementsByClassName("tableName").item(0).innerHTML.trim();
                this.setStyleOfDragElement();
            },
            setStyleOfDragElement() {
                this.dragElement.name = "cell";
                this.dragElement.style.height = "auto";
                this.dragElement.style.width = "auto";
                this.dragElement.style.minWidth = "200px";
                this.dragElement.style.maxWidth = "230px";
                this.dragElement.style.margin = "20px";
                this.dragElement.style.border = "solid";
                this.dragElement.style.boxShadow = "5px 5px #ccc";
                this.dragElement.style.borderRadius = "8px";
            },
            drop(event) {
                event.preventDefault();
                let dropArea = event.target;
                if (dropArea.getElementsByClassName("tableName").length == 0 && this.factTable == "") {

                    // 当拖拽第一个表/cube到col1区域时，设定modelType（hive或kylin）
                    this.modelType = this.dragElement.childNodes[1].id;

                    // 当向col1区域拖拽表格时，设置当前拖拽的表格为factTable
                    this.factTable = this.dragElement.id;
                    this.dragElement.style.margin = "100px";
                    // 向拖放区域放置元素
                    if (dropArea){
                        dropArea.appendChild(this.dragElement);
                    }
                    // 设置为jsPlumb的起点
                    this.makeSourceElement(this.dragElement);
                }else {
                    // 向拖放区域放置元素
                    if (dropArea){
                        dropArea.appendChild(this.dragElement);
                    }
                    // 设置为jsPlumb的终点
                    this.makeTargetElement(this.dragElement);
                }
                var that = this;
                var url = "http://localhost:6993";
                if (this.dragElement.getElementsByClassName("tableName").item(0).id == "hive"){
                    url += "/previewHive";
                }else {
                    url += "/previewCube"
                }
                // 预览hive单表/cube
                if (!that.singleHivePreview) {
                    // 更改标志:已被预览，防止拖拽lookupTable时由drop()函数更新预览视图
                    that.singleHivePreview = true;
                    // 更改标志：正在加载
                    that.previewLoading = true;
                    axios
                        .get(
                            url,
                            {
                                params: {
                                    tableName: that.factTable
                                }
                            },
                        )
                        .then(function (response) {
                            that.previewData = response.data.datum;

                            for (let key in that.previewData[0]){
                                var head = { title: '' , dataIndex: ''};
                                head.title = key;
                                head.dataIndex = key;
                                that.columns.push(head);
                            }
                            // 修改标志：加载完成
                            that.previewLoading = false;
                        })
                }
            },
            dragend(event){
                event.dataTransfer.clearData();
            },
            // jsplumb
            // 初始化规则使其可以连线、拖拽
            makeSourceElement(elem){
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
                // 自动连接source和target、设置单击连接事件
                var connection = ins.connect({source:this.factTable, target:elem.id});
                let vm = this;
                connection.bind("click", function (conn) {
                    // 赋值给当前组件的变量，并传值给子组件
                    vm.factTable = conn.sourceId;
                    vm.lookupTable = conn.targetId;

                    // 获取两个表的列名信息，为弹窗做准备
                    for (let i = 0; i < 2; i++) {
                        let url = "http://localhost:6993/getHiveColumns";
                        axios
                            .get(
                                url,
                                {
                                    params: {
                                        tableName: i==0?vm.factTable: vm.lookupTable
                                    }
                                },
                            )
                            .then(function (response) {
                                if (i == 0) {
                                    vm.factTableColumns = response.data.datum;
                                }else {
                                    vm.lookupTableColumns = response.data.datum;
                                }
                            })
                    }

                    // 打开弹窗，设置数据表关联条件
                    vm.openMask();
                });
            },
            switchContainer (target,source,draggable) {
                let elem = document.getElementsByName("cell"),
                    ins = this.jsPlumb;
                ins.setSourceEnabled(elem,source);
                ins.setTargetEnabled(elem,target);
                ins.setDraggable(elem,draggable);
            },
            // dialog 表间连线弹出对话框
            openMask(){
                this.sendVal = true;
            },
            clickCancel(){
                console.log('点击了取消');
            },
            clickDanger(){
                console.log('这里是danger回调')
            },
            // 点击确认键的函数，接受子组件（弹窗dialog）的传参
            clickConfirm(childMsgs){ // 子组件往父组件传参时，若为多个参数，传递的是数组；注意：上面的函数必须写参数(arguments)
                console.log('点击了confirm');
                let joinType = childMsgs[0];
                let joinCondition = childMsgs[1];
                let temp = {
                    lookupTable: this.lookupTable,
                    joinType: joinType,
                    joinCondition: joinCondition
                };
                let duplicate = false;
                // 如果已添加过此lookupTable，则对其所在元素进行替换；否则直接push
                for (let i = 0; i < this.lookupTables.length; i++) {
                    let item = this.lookupTables[i];
                    if (item.lookupTable == this.lookupTable){
                        this.lookupTables.splice(i, 1, temp);
                        duplicate = true;
                    }
                }
                if (!duplicate) {
                    this.lookupTables.push(temp);
                }
                console.log(this.lookupTables);
                // 预览多表关联的hive
                console.log(this.lookupTables.length);
                // 修改标志：加载中
                this.previewLoading = true;
                if (this.lookupTables.length > 0) {
                    let url = "http://localhost:6993/previewFlatHive";
                    let that = this;
                    axios
                        .post(url, qs.stringify({
                            factTable: that.factTable,
                            joinJson: JSON.stringify(that.lookupTables),
                        }))
                        .then(function (response) {
                            that.previewData = response.data.datum;
                            console.log(that.previewData);

                            for (let key in that.previewData[0]){
                                var head = { title: '' , dataIndex: ''};
                                head.title = key;
                                head.dataIndex = key;
                                that.columns.push(head);
                            }
                            // 修改标志：加载完成
                            that.previewLoading = false;
                        })
                }
            },
            // 清空拖拽区内容，以及相应的参数
            clearDragArea(){
                console.log("clear开始~~~");
                console.log(this);
                this.$confirm("确认清空当前数据视图？").then(() => {
                        console.log("进入then函数");
                        let dropArea = document.getElementById("container");
                        dropArea.innerHTML = this.originDropArea;
                        this.factTable = "";
                        this.lookupTable = "";
                        this.lookupTables = [];
                        this.previewData = [];
                        this.columns = [];
                        this.singleHivePreview = false;
                        this.previewLoading = false;
                        this.$message.success("清空成功");
                        // this.switchContainer(true,true,true);
                    })
                    .catch(_ => {
                        this.$message.error("取消清空");
                    });
            },
            // 选择数据，进入多维分析
            chooseData(){
                // 区分是hive还是kylin
                sessionStorage.setItem("modelType", this.modelType);
                // 传递其他参数
                sessionStorage.setItem("modelName", this.fileName);
                sessionStorage.setItem("factTable", this.factTable);
                sessionStorage.setItem("lookupTables", JSON.stringify(this.lookupTables));
                console.log("chooseData函数中，modelType为：" + this.modelType);

                // 拼接fileUrl
                if (this.modelId == -1) {
                    if (this.modelType == "hive") {
                        this.fileUrl = "select * from " + this.factTable;
                        for (let i = 0; i < this.lookupTables.length; i++) {
                            if (this.lookupTables[i].joinType == "内部") {
                                this.fileUrl += " inner join ";
                            }else if (this.lookupTables[i].joinType == "左侧") {
                                this.fileUrl += " left join ";
                            }else {
                                this.fileUrl += " right join ";
                            };
                            this.fileUrl += this.lookupTables[i].lookupTable + " on " + this.factTable + "." + this.lookupTables[i].joinCondition.split("=")[0]
                                + " = " + this.lookupTables[i].lookupTable + "." + this.lookupTables[i].joinCondition.split("=")[1];

                        }
                        console.log("打印拼接好的fileUrl：" + this.fileUrl);
                    } else if (this.modelType == "kylin") {
                        this.fileUrl = this.factTable;
                        sessionStorage.setItem("cubeName", this.factTable);
                    }
                }

                sessionStorage.setItem("fileUrl", this.fileUrl);

                // 保存数据模型（只有新建模型时需要保存）
                if (this.modelId == -1) {
                    this.saveModel();
                }

                // 路由跳转至多维分析页面
                this.$router.push({"name": "analysis"});
            },
            // 保存数据模型
            saveModel() {
                let params = new URLSearchParams();
                params.append("id", this.modelId);
                params.append("fileName", this.fileName);
                params.append("fileType", this.modelType);
                params.append("fileUrl", this.fileUrl);
                params.append("projectId", 0);
                params.append("description", this.description);
                let that = this;
                axios
                    .post("http://localhost:6993/saveDataSource", params)
                    .then(function (response) {
                        if (response.data.result == true) {
                            that.$message.success("保存模型成功");
                            that.editDialogVisible = false;
                            // 重新获取数据
                            that.getModelList();
                            // 保存（新增）Relavance
                            that.saveRelavances();
                        }else {
                            that.$message.error("保存模型失败");
                        }
                    });
                this.modelId = -1;
            },
            // 保存（新增）Relavance
            saveRelavances() {
                let that = this;
                let params = new URLSearchParams();
                params.append("projectId", 1);
                params.append("source", this.factTable);
                let targetTables = [];
                for (let i = 0; i < this.lookupTables.length; i++) {
                    targetTables.push(this.lookupTables[i].lookupTable);
                }
                console.log("打印targets");
                console.log(targetTables);
                params.append("targets", targetTables.toString());
                console.log("打印paramss");
                console.log(params);
                axios
                    .post("http://localhost:6993/saveRelavances", params)
                    .then(function (response) {
                        if (response.data.result == true) {
                            that.$message.success("保存关联信息成功");
                        }else {
                            that.$message.error("保存关联信息失败");
                        }
                    });
            },
            // 编辑模型按钮，加载fileName和description、modelId、modelType、fileUrl
            editModel(row) {
                this.fileName = row.fileName;
                this.description = row.description;
                this.modelId = row.id;
                this.modelType = row.fileType;
                this.fileUrl = row.fileUrl;
            },
            // 准备删除模型，存储其id
            deleteModel(row) {
                console.log(row);
                this.modelId = row.id;
            },
            // 确认删除（点击确定触发）
            confirmDelete() {
                let that = this;
                let params = new URLSearchParams();
                params.append("id", this.modelId);
                axios.post("http://localhost:6993/deleteDataSource", params)
                    .then(function (response) {
                        if (response.data.result == true) {
                            that.$message.success("删除成功");
                            that.deleteDialogVisible = false;
                            // 重新获取数据
                            that.getModelList();
                        }else {
                            that.$message.error("删除失败");
                        }
                    })
                this.modelId = -1;
            },
            // 预览（选择）数据模型，同时在“模型视图”中画出jsplumb元素及连线
            previewModel(row) {
                console.log("开始画图~~");
                let dropArea1 = document.getElementsByClassName("col1")[0];
                let dropArea2 = document.getElementsByClassName("col2")[0];
                this.dragElement = document.getElementsByName("tableDiv")[0];
                let that = this;
                axios.get("http://localhost:6993/getModelDesc",
                    {
                        params: {
                            modelId: row.id,
                        }
                    },
                ).then(function (response) {
                    let factTableAndLookupTables = response.data.datum;
                    console.log(factTableAndLookupTables);
                    let factTable = factTableAndLookupTables.factTable;
                    let lookupTables = factTableAndLookupTables.lookupTables;
                    // 画factTable
                    that.dragElement.id = factTable;
                    that.factTable = factTable;
                    that.setStyleOfDragElement();
                    that.dragElement.style.lineHeight = "40px";
                    that.dragElement.style.margin = "100px";
                    let dragElementTemp = that.dragElement.cloneNode(true);
                    dragElementTemp.childNodes[1].innerText = " " + factTable;
                    dropArea1.appendChild(dragElementTemp);
                    that.makeSourceElement(dragElementTemp);
                    // 画lookupTables
                    that.dragElement.style.margin = "15px";
                    for (let i = 0; i < lookupTables.length; i++) {
                        that.dragElement.id = lookupTables[i];
                        let dragElementTemp1 = that.dragElement.cloneNode(true);
                        dragElementTemp1.childNodes[1].innerText = " " + lookupTables[i];
                        dropArea2.appendChild(dragElementTemp1);
                        that.makeTargetElement(dragElementTemp1);
                    }
                });

                console.log("开始预览~~");
                this.previewLoading = true;
                // 加载模型的各个字段进来，方便后续chooseData
                this.modelId = row.id;
                this.modelType = row.fileType;
                this.fileName = row.fileName;
                this.fileUrl = row.fileUrl;
                // 若为hive多表关联模型，还需加载factTable和lookupTables【仅加载lookupTable字段即可】
                if (this.modelType == "hive" && this.fileUrl.startsWith("select")) {
                    let joinSplit = this.fileUrl.split(" join ");
                    for (let i = 1; i < joinSplit.length; i++) {
                        let temp = joinSplit[i].split(" on ")[0];
                        this.lookupTables.push({
                            lookupTable: temp,
                        })
                    }
                    this.factTable = joinSplit[0].split(" from ")[1].split(" ")[0];
                }else {
                    this.factTable = this.fileUrl;
                }

                axios
                    .get("http://localhost:6993/previewModel",
                        {
                            params: {
                                id: row.id,
                            }
                        },
                    )
                    .then(function (response) {
                        that.previewData = response.data.datum;
                        console.log(that.previewData);

                        for (let key in that.previewData[0]){
                            var head = { title: '' , dataIndex: ''};
                            head.title = key;
                            head.dataIndex = key;
                            that.columns.push(head);
                        }
                        // 修改标志：加载完成
                        that.previewLoading = false;
                    })
            },
            // 跳转数据表关联视图页面
            goDataView() {
                this.$router.push({"name": "dataView"});
            },
        },
    }
</script>

<style scoped>
.sum .anticon .icon {
    font-size: 17px;
}
    .highlight {
        background-color: rgb(255, 192, 105);
        padding: 0px;
    }
    .tableName{
        font-size: 17px;
        font-family: Arial;
        cursor: pointer;
    }
    .spin-content {
        border: 1px solid #91d5ff;
        background-color: #e6f7ff;
        padding: 30px;
    }
    /*jsplumb*/
    #container{
        margin: 20px;
        position: relative;
        background: rgba(239, 239, 239, 0);
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
        margin-left: 40px;
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
    /*头部按钮*/
    .preheader {
        background-color: transparent;
        box-shadow: none;
        padding-right: 350px;
        line-height: 64px;
        position: absolute;
        z-index: 2000;
        top: 10px;
        width: 100%;
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
    /*.el-button{*/
    /*    font-size: 18px;*/
    /*}*/
    .sum {
        font-size: 14px;
        color: rgba(10, 18, 32, 0.64);
    }
    i{
        font-style: normal;
        font-weight: bold;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
        font-weight: bold;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        /*width: 50%;*/
    }
    .el-table .expanded-cell{
        background: #fafbfc;
    }
</style>
