<template>
    <div style="background-color: white">
        <!-- 页面头部框框 -->
        <div class="prehd">
            <a>
                <i class="iconfont icon-fanhui" @click="back()"></i>
            </a>
            <span class="pretitle">Cube优化设置</span>
        </div>
        <el-row>
            <!-- 左侧分区：全局优化设置 -->
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <el-tabs type="border-card">
                        <el-tab-pane label="全局优化设置">
                            <div class="firstClass">
                                <i class="el-icon-caret-right">聚合组：</i>
                                <el-switch
                                        style="display: block; margin-left: 300px"
                                        v-model="globalOptimize.aggregationGroupPrefer"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="低膨胀率"
                                        inactive-text="低时延">
                                </el-switch>
                            </div>
                            <div class="firstClass">
                                <i class="el-icon-caret-right">Rowkey：</i>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">查询次数（query_count）权重</i>
                                <template>
                                    <div class="block">
                                        <el-slider
                                                v-model="globalOptimize.queryCountWeight"
                                                show-input>
                                        </el-slider>
                                    </div>
                                </template>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">基数（cardinality）权重</i>
                                <template>
                                    <div class="block">
                                        <el-slider
                                                v-model="globalOptimize.cardinalityWeight"
                                                show-input>
                                        </el-slider>
                                    </div>
                                </template>
                            </div>
                            <div class="firstClass">
                                <i class="el-icon-caret-right">自动构建触发器：</i>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">时间：</i>
                                <span>每</span>
                                <el-input v-model="globalOptimize.gapDay"></el-input>
                                <span>天</span>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">同Model查询未命中率：</i>
                                <span> ></span>
                                <el-input v-model="globalOptimize.missRate"></el-input>
                                <span>%</span>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">平均查询时延：</i>
                                <span> ></span>
                                <el-input v-model="globalOptimize.queryLatency"></el-input>
                                <span>s</span>
                            </div>
                            <el-button type="success" round @click="saveGlobalSettings" style="float: right; margin-right: 20px;">确认</el-button>
                            <el-button round @click="globalReset" style="float: right; margin-right: 20px;">重置</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            <!-- 右侧分区：Cube个性化优化设置 & Cube配置项 -->
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-tabs type="border-card">
                        <el-select v-model="cubeName" placeholder="请选择Cube" @change="getOptimizeSetting(cubeName), getDimensionList(cubeName)" style="width: 600px; margin-bottom: 20px; left: 30px;">
                            <el-option
                                    v-for="item in options"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-tab-pane label="Cube个性化优化设置">
                            <div class="firstClass">
                                <i class="el-icon-caret-right">聚合组：</i>
                                <el-switch
                                        style="display: block; margin-left: 300px"
                                        v-model="cubeOptimize.aggregationGroupPrefer"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="低膨胀率"
                                        inactive-text="低时延">
                                </el-switch>
                            </div>
                            <div class="firstClass">
                                <i class="el-icon-caret-right">Rowkey：</i>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">查询次数（query_count）权重</i>
                                <template>
                                    <div class="block">
                                        <el-slider
                                                v-model="cubeOptimize.queryCountWeight"
                                                show-input>
                                        </el-slider>
                                    </div>
                                </template>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">基数（cardinality）权重</i>
                                <template>
                                    <div class="block">
                                        <el-slider
                                                v-model="cubeOptimize.cardinalityWeight"
                                                show-input>
                                        </el-slider>
                                    </div>
                                </template>
                            </div>
                            <div class="firstClass">
                                <i class="el-icon-caret-right">自动构建触发器：</i>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">时间：</i>
                                <span>每</span>
                                <el-input v-model="cubeOptimize.gapDay"></el-input>
                                <span>天</span>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">同Model查询未命中率：</i>
                                <span> ></span>
                                <el-input v-model="cubeOptimize.missRate"></el-input>
                                <span>%</span>
                            </div>
                            <div class="secondClass">
                                <i class="el-icon-caret-right">平均查询时延：</i>
                                <span> ></span>
                                <el-input v-model="cubeOptimize.queryLatency"></el-input>
                                <span>s</span>
                            </div>
                            <el-button type="success" round @click="saveCubeSettings" style="float: right; margin-right: 20px;">确认</el-button>
                            <el-button round @click="cubeReset" style="float: right; margin-right: 20px;">重置</el-button>
                        </el-tab-pane>
                        <el-tab-pane label="Cube优化项">
                            <div style="overflow-y: scroll">
                                <div class="firstClass" v-for="(aggregation_group, index) in cubeAggregationGroup">
                                    <i class="el-icon-caret-right">聚合组{{ index + 1 }}：</i>
                                    <div class="secondClass">
                                        <i class="el-icon-caret-right">维度列表：</i>
                                        <el-select
                                                v-model="aggregation_group.dimension_list"
                                                multiple
                                                filterable
                                                default-first-option
                                                placeholder="请选择维度">
                                            <el-option
                                                    v-for="item in dimensions"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="secondClass">
                                        <i class="el-icon-caret-right">联合维度：</i>
                                        <el-select
                                                v-model="aggregation_group.joint_dimensions"
                                                multiple
                                                filterable
                                                default-first-option
                                                placeholder="请选择维度">
                                            <el-option
                                                    v-for="item in aggregation_group.dimension_list"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="secondClass">
                                        <i class="el-icon-caret-right">必要维度：</i>
                                        <el-select
                                                v-model="aggregation_group.mandatory_dimension"
                                                filterable
                                                default-first-option
                                                placeholder="请选择维度">
                                            <el-option
                                                    v-for="item in aggregation_group.dimension_list"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="secondClass">
                                        <i class="el-icon-caret-right">层级维度：</i>
                                        <el-select
                                                v-model="aggregation_group.hierarchy_dimensions"
                                                multiple
                                                filterable
                                                default-first-option
                                                placeholder="请选择维度">
                                            <el-option
                                                    v-for="item in aggregation_group.dimension_list"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <el-button type="success" round @click="saveCubeSettings" style="float: right; margin-right: 20px; margin-top: 20px">确认</el-button>
                            <el-button round @click="cubeReset" style="float: right; margin-right: 20px; margin-top: 20px">重置</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
        <el-dialog
                title="构建时间"
                :visible.sync="dialogVisible"
                width="30%">
            <el-radio-group v-model="next_build">
                <el-radio :label="1">立即构建</el-radio>
                <el-radio :label="2">尽快在闲时构建</el-radio>
                <el-radio :label="3">按构建触发器的设置进行构建</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import axios from "axios";

    export default {
        name: "optimizeSetting",
        data() {
            return {
                cubeName: "", // 个性化设置针对的cubeName
                options: ["GD_PREGENCY_RESULT2GD_BAD_BABY_REGIST", "GD_PREGENCY_RESULT2GD_BASIC_INFO_DETAIL2GD_PHYSICAL_EXAM_W", "DupTest4babyS_badR", "2cube"], // cube选择框建议项
                globalOptimize: { // 全局优化设置
                    // aggregationGroupPrefer: true, // 聚合组选择倾向 {true：低膨胀率，false：低时延}
                    // queryCountWeight: 70, // 查询次数权重
                    // cardinalityWeight: 50, // 基数权重
                    // gapDay: 7, // 每N天构建一次
                    // missRate: 20, // 同Model查询未命中率
                    // queryLatency: 2.5, // 查询时延
                },
                cubeOptimize: { // cube个性化优化设置
                    // aggregationGroupPrefer: false, // 聚合组选择倾向 {true：低膨胀率，false：低时延}
                    // queryCountWeight: 62, // 查询次数权重
                    // cardinalityWeight: 50, // 基数权重
                    // gapDay: 3, // 每N天构建一次
                    // missRate: 25, // 同Model查询未命中率
                    // queryLatency: 2.5, // 查询时延
                },
                globalOptimize_backup: {}, // 全局优化设置项的备份
                cubeOptimize_backup: {}, // cube优化设置的备份
                cubeAggregationGroup_backup: {}, // cube优化设置的备份
                dialogVisible: false, // 保存设置的弹窗
                next_build: 3, // 下一次构建时间 {1: 立即构建，2：尽快在闲时构建，3：按构建触发器的设置进行构建}
                dimensions: ["BABY_WEIGHT", "PREGENCY_TYPE", "MEDU_LEVEL", "MJOB", "MACCOUNT_TYPE", "BIRTH_NUM", "BABY_SEX"], // 备选维度列表（Cube中包含的所有维度）
                cubeAggregationGroup: [ // 所有聚合组的数据（包括：维度列表、必要维度、联合维度、层级维度）
                    // {dimension_list: ["BABY_WEIGHT", "PREGENCY_TYPE", "MEDU_LEVEL"], joint_dimensions: ["BABY_WEIGHT", "PREGENCY_TYPE"], mandatory_dimension: "", hierarchy_dimensions: []},
                    // {dimension_list: ["MACCOUNT_TYPE", "BIRTH_NUM", "BABY_SEX"], joint_dimensions: ["BIRTH_NUM", "BABY_SEX"], mandatory_dimension: "BIRTH_NUM", hierarchy_dimensions: []},
                ],
            }
        },
        mounted() {
            this.cubeName = this.$route.query.cubeName;
            // 向后台查询优化设置
            this.getOptimizeSetting("global");
            if (this.cubeName != null && this.cubeName != "" && this.cubeName != undefined) {
                this.getOptimizeSetting(this.cubeName);
            }
            // 查询cube列表
            this.getCubeList();
        },
        created() {

        },
        methods: {
            //返回
            back() {
                this.$router.go(-1);
            },
            // 深拷贝
            copySetting(setting) {
                let objString = JSON.stringify(setting);
                return  JSON.parse(objString);
            },
            // 重置设置项global
            globalReset() {
                this.globalOptimize = this.copySetting(this.globalOptimize_backup);
            },
            // 重置设置项cube
            cubeReset() {
                this.cubeOptimize = this.copySetting(this.cubeOptimize_backup);
            },
            // 保存全局设置
            saveGlobalSettings() {
                let params = new URLSearchParams();
                params.append("cubeName", "global");
                params.append("aggregationGroupPrefer", this.globalOptimize.aggregationGroupPrefer);
                params.append("queryCountWeight", this.globalOptimize.queryCountWeight);
                params.append("cardinalityWeight", this.globalOptimize.cardinalityWeight);
                params.append("gapDay", this.globalOptimize.gapDay);
                params.append("missRate", this.globalOptimize.missRate);
                params.append("queryLatency", this.globalOptimize.queryLatency);

                let that = this;
                axios
                    .post("http://localhost:6993/optimizeSetting/saveOptimizeSetting", params)
                        .then(function (response) {
                    if (response.data.result == true) {
                        that.$message.success("保存全局优化设置成功，请选择下一次构建的时间");
                        that.dialogVisible = true;
                    }else {
                        that.$message.error("保存设置失败");
                    }
                });
            },
            // 保存cube设置
            saveCubeSettings() {
                let params = new URLSearchParams();
                params.append("cubeName", this.cubeName);
                params.append("aggregationGroupPrefer", this.cubeOptimize.aggregationGroupPrefer);
                params.append("queryCountWeight", this.cubeOptimize.queryCountWeight);
                params.append("cardinalityWeight", this.cubeOptimize.cardinalityWeight);
                params.append("gapDay", this.cubeOptimize.gapDay);
                params.append("missRate", this.cubeOptimize.missRate);
                params.append("queryLatency", this.cubeOptimize.queryLatency);
                params.append("cubeAggregationGroup", JSON.stringify(this.cubeAggregationGroup)); // 将一个JavaScript值(对象或者数组)转换为一个 JSON字符串，避免后台接收到[Object, Object]

                let that = this;
                axios
                    .post("http://localhost:6993/optimizeSetting/saveOptimizeSetting", params)
                    .then(function (response) {
                        if (response.data.result == true) {
                            that.$message.success("保存Cube优化设置成功，请选择下一次构建的时间");
                            that.dialogVisible = true;
                        }else {
                            that.$message.error("保存设置失败");
                        }
                    });
            },
            // 向后台查询优化设置（全局 or cube）
            getOptimizeSetting(cubeName){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/optimizeSetting/getOptimizeSetting",
                        {
                            params: {
                                cubeName: cubeName,
                            }
                        },
                    )
                    .then(function (response) {
                        var optimizeSetting = response.data.datum;
                        if (cubeName == "global" || cubeName == "" || cubeName == undefined) {
                            that.globalOptimize = optimizeSetting;
                            // 备份所有设置项（深拷贝）
                            that.globalOptimize_backup = that.copySetting(that.globalOptimize);
                        }else {
                            that.cubeOptimize.aggregationGroupPrefer = optimizeSetting.aggregationGroupPrefer;
                            that.cubeOptimize.queryCountWeight = optimizeSetting.queryCountWeight;
                            that.cubeOptimize.cardinalityWeight = optimizeSetting.cardinalityWeight;
                            that.cubeOptimize.gapDay = optimizeSetting.gapDay;
                            that.cubeOptimize.missRate = optimizeSetting.missRate;
                            that.cubeOptimize.queryLatency = optimizeSetting.queryLatency;
                            // 接收cube基础设置
                            // that.cubeOptimize = optimizeSetting;
                            // 接收cube详细设置
                            that.cubeAggregationGroup = JSON.parse(optimizeSetting.cubeAggregationGroup);
                            // 备份所有设置项（深拷贝）
                            that.cubeOptimize_backup = that.copySetting(that.cubeOptimize);
                            that.cubeAggregationGroup_backup = that.copySetting(that.cubeAggregationGroup);
                        }
                    })
            },
            // 查询cube的维度列表
            getDimensionList(cubeName){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/optimizeSetting/getDimensionListByCube",
                        {
                            params: {
                                cubeName: cubeName,
                            }
                        },
                    )
                    .then(function (response) {
                        that.$nextTick(() => {
                            that.dimensions = response.data.datum;
                        })

                    })
            },
            // 查询Cube列表
            getCubeList(){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/optimizeSetting/getCubeList",
                    )
                    .then(function (response) {
                        that.$nextTick(() => {
                            that.options = response.data.datum;
                        })

                    })
            }
        }
    }
</script>

<style scoped>
    /* 头部样式 */
    .prehd {
        width: 100%;
        height: 55px;
        line-height: 45px;
        padding: 5px 20px;
        background-color: #f5f7fa;
        box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.98),
        0 10px 12px 0 rgba(170, 182, 206, 0.2),
        inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);
    }
    .pretitle {
        font-size: 22px;
        font-family: 微软雅黑;
        color: rgb(71, 172, 253);
        margin-left: 30px;
    }
    .pretitles {
        font-size: 15px;
        font-family: 微软雅黑;
        color: rgb(71, 172, 253);
        margin-left: 30px;
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
        top: 10;
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
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        margin: 20px;
        background: #99a9bf;
    }
    .bg-purple {
        margin: 20px;
        background: #d3dce6;
    }
    .bg-purple-light {
        margin: 20px;
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    /*树形组件*/
    .firstClass {
        font-size: 18px;
        font-weight: bold;
        padding-top: 24px;
        margin-left: 15px;
    }
    .secondClass {
        margin-left: 37px;
        font-size: 16px;
        padding-top: 18px;
    }
    .thirdClass {
        margin-left: 59px;
        font-size: 14px;
        padding-top: 12px;
    }
    .el-icon-caret-right:before {
        margin-right: 10px;
    }
    .el-input {
        display: inline-block;
        margin: 0 10px;
        width: 55px;
    }
    .el-select {
        width: 600px;
    }
</style>
