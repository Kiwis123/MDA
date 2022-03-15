<template>
    <div>
        <div class="rightStyle">
            <div class="preChose">
                <a>
                    <i class="iconfont icon-fuhao"></i>
                </a>
                <span class="pretitle">驾驶舱报告</span>
                <el-input
                        placeholder="请输入驾驶舱名字进行检索"
                        v-model="searchtext"
                        class="input-with-select"
                        style="width:50%;margin-left:150px;"
                >
                    <el-button slot="append" icon="el-icon-search" @click="findresult"></el-button>
                </el-input>
                <el-button type="primary" id="createCockpit" icon="el-icon-circle-plus-outline" @click="createCockpit">新建驾驶舱</el-button>
            </div>
            <div class="tableData">
                <el-table
                        :data="tableData"
                        style="width: 100%"
                >
                    <el-table-column prop="id" width="120" label="ID"></el-table-column>
                    <el-table-column prop="cockpitName" label="驾驶舱名称"></el-table-column>
<!--                    <el-table-column prop="realtime" label="是否实时"></el-table-column>-->
                    <el-table-column prop="info" label="描述"></el-table-column>
                    <el-table-column prop="operate" width="250" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="success"
                                    icon="el-icon-check"
                                    circle
                                    @click="checkData(scope.row)"
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
                <span>你确定要删除此驾驶舱吗？</span>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="deleteData()">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import fullscreen from "vue-fullscreen";
    import "../../../static/js/macarons.js";
    import echarts from "echarts";
    export default {
        name: "dashboard",
        data() {
            return {
                currentPage: 1, //当前页
                pagesize: 10, //每页条数
                total: 0, //总条数
                searchtext: "",
                deleteDialogVisible: false,
                //删除的驾驶舱id
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
            };
        },
        mounted() {
            this.searchStory();
            // this.tableData = [
            //     {id: "1", cockpitName: "驾驶舱模板一", info: "18同济交通录取情况"},
            //     {id: "2", cockpitName: "驾驶舱模板二", info: "世界各地专利情况分布图"},
            //     {id: "3", cockpitName: "驾驶舱模板三", info: "CAN-LAX的销售收入 2016-2017"},
            // ];
        },
        methods: {
            handleCurrentChange(val) {
                //切换页面时触发
                this.currentPage = val;
            },
            findresult() {

            },
            searchStory() {
                this.tableData = [];
                this.axios.get("http://localhost:6993/getCockpitByUserId?userId=1").then(response => {
                    console.log(response);
                    for (var i = 0; i < response.data.datum.length; i++) {
                        var obj = {
                            id: response.data.datum[i].id,
                            cockpitName: response.data.datum[i].name,
                            // realtime: response.data.datum[i].realtime ? '实时' : '非实时',
                            info: response.data.datum[i].info
                        };
                        this.tableData.push(obj);
                        this.total = response.data.datum.length;
                        this.tableDataLoading = false
                    }
                }).catch((res) => {
                    this.$message.error('哎哟～出错了～');
                });
            },
            editData(row) {
                this.axios.get("http://localhost:6993/getCockpitById?cockpitId=" + row.id).then(response => {
                    console.log(response);
                    let dataBody = response.data.datum;
                    console.log(dataBody);
                    this.$router.push({
                        path: "/mda/createCockpit",
                        query: {
                            data: dataBody.layoutconf,
                            // realtime: dataBody.realtime,
                            id: dataBody.id,
                            tableDashboard: dataBody.tabledashboard,
                            diagramids: dataBody.diagramids,
                            // realtime: dataBody.realtime
                            cockpitName: dataBody.name,
                            cockpitInfo: dataBody.info,
                        }
                    });
                });
            },
            checkData(row) {
                console.log("开始预览");
                this.axios.get("http://localhost:6993/getCockpitById?cockpitId=" + row.id).then(response => {
                    console.log(response);
                    let dataBody = response.data.datum;
                    let routeData = this.$router.resolve({
                        path: "/mda/previewCockpit",
                        query: {
                            data: dataBody.layoutconf,
                            // realtime: dataBody.realtime,
                            id: dataBody.id,
                            tableDashboard: dataBody.tabledashboard,
                            // realtime: dataBody.realtime
                        }
                    });
                    window.open(routeData.href, '_blank');
                }).catch((res) => {
                    this.$message.error('哎哟～出错了～');
                })
                // this.$router.push({"name": "cockpitFake" + row.id});
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
            createCockpit() {
                this.$router.push({"name": "createCockpit"});
            }
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
    #createCockpit {
        float: right;
        margin: 5px auto;
        background-color: #00a659;
        font-size: 16px;
    }
    .rightStyle{
        background-color: rgba(255, 255, 255, 0.64);
    }
</style>
