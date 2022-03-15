<template>
    <div class="header">
        <div class="analysis" v-show=true>
            <div class="left-bar" ref="leftBar">
                <div class="left-bar-content">
                    <div class="table-list-wrapper">

                        <div class="olap-item item-title">工作表</div>
                        <ul>
                            <!-- <li class="item table-list-item"><a>外勤工作表</a></li> -->
                            <!-- <div v-for="tableName in tableNameList"> -->
                            <!-- <li class="olap-item table-list-item" @click="selectTable($event)"><a>{{tableName}}</a></li> -->
                            <div class="field-wrapper">
                                <!-- <div class="olap-item item-title2">字段</div> -->
                                <div class="dimension-wrapper">
                                    <div class="olap-item dimension-name">维度</div>
                                    <li class="olap-item dimension-item" draggable="true" @dragstart='drag1($event)' v-for="dimension in dimensionList" :key="dimension">
                                        <a :data-column="dimension" :data-eg="dimension" :data-table="dimension">{{dimension}}</a>
                                    </li>
                                </div>
                                <div class="measure-wrapper">
                                    <div class="olap-item measure-name">度量</div>
                                    <li class="olap-item measure-item" draggable="true" @dragstart='drag2($event)' v-for="measure in measureList" :key="measure"><a :data-column="measure" :data-eg="measure" :data-table="measure" class="measure-name">{{measure}}</a>
                                    </li>
                                </div>
                            </div>
                            <!-- </div> -->
                        </ul>
                    </div>

                </div>
            </div>
            <div class="main-content" ref="mainContent">
                <div class="drag-wrapper">
                    <div class="drag-item border-1px" @drop='drop1($event)' @dragover='allowDrop($event)'><label class="drag-title-label">行</label>
                    </div>
                    <!-- <div class="drag-item border-1px" @drop='drop2($event)' @dragover='allowDrop($event)' @dragleave='dragleave2($event)'><label class="drag-title-label">对比</label></div> -->
                    <div class="drag-item border-1px" id="measure-list" @drop='drop3($event)' @dragover='allowDrop($event)'><label class="drag-title-label">列</label></div>
                    <div class="drag-item border-1px" @drop='drop4($event)' @dragover='allowDrop($event)'><label class="drag-title-label">次轴</label></div>
                    <div class="drag-item border-1px" @drop='drop5($event)' @dragover='allowDrop($event)'><label class="drag-title-label">筛选器</label></div>
                    <div class="drag-item border-1px" @drop='drop6($event)' @dragover='allowDrop($event)'>
                        <label class="drag-title-label">颜色</label>
                        <!-- <colorPicker v-model="color" @change="headleChangeColor"></colorPicker> -->
                    </div>
                </div>
                <div class="graph-wrapper">
                    <div class="graph">
                        <!-- <v-column @optionConfig="_initOption" :optionUpdate="optionUpdate"></v-column> -->
                        <div id="graph" style="width:500px;height:350px"></div>
                    </div>
                    <!--  <div class="graph">
                     <img src="../assets/close.png" style="{width: 900px;height: 400px;}">
                   </div> -->
                </div>
            </div>
            <div class="right-bar" ref="rightBar">
                <v-rightbar :baseUrl="baseUrl" :option="option" :type="type" :tableName="itemNameShow" :searchmeasure="searchmeasure" :searchdimension="searchdimension" :searchmethods="searchmethods" @update-type="update" @update-option="updateOption"></v-rightbar>
            </div>
            <MyDialog :isShow="isShowFilter" @on-close="closeFilterDialog">
                <div class="dialog dialog-content">
                    筛选器
                    <div class="filter-content">
                        筛选条件：
                        <div class="filter-detail">
                            <div>
                                <select class="form-select" v-model="selected" @change="updateFilter">
                                    <option value="0">区间</option>
                                    <option value="=">等于</option>
                                    <option value="!=">不等于</option>
                                    <option value=">">大于</option>
                                    <option value="<">小于</option>
                                    <option value=">=">大于等于</option>
                                    <option value="<=">小于等于</option>
                                </select>
                                <input type="" name="" class="select-input" v-show="commonSelect" v-model="filterCount">
                                <div class="section-content" v-show="sectionSelect">
                                    <input type="" name="" v-model="filterCount">
                                    <span>~</span>
                                    <input type="" name="" v-model="filterCount1">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="button-content">
                        <span @click="filterSelect">确定</span><span>取消</span>
                    </div>
                </div>
            </MyDialog>
            <MyDialog :isShow="isShow" @on-close="closeColorDialog">
                <div class="dialog dialog-content">
                    <div class="color-select-content">
                        <div class="color-left">
                            <span>{{dragColorItem}}</span>
                        </div>
                        <div class="color-right">
                            <colorPicker v-model="color" @change="headleChangeColor"></colorPicker>
                        </div>
                    </div>
                </div>
            </MyDialog>

        </div>
    </div>

</template>
<script>
    // import $ from "jquery";
    import echarts from "echarts";
    // import rightBar from "./graph-right";
    // import colorPicker from "./plugin/vue-color-picker/colorPicker";
    // import MyDialog from "./plugin/base/dialog.vue";
    import axios from "axios";
    import qs from "qs";
    // import "../../../static/js/macarons.js";
    // import "../../../static/js/roma.js";
    // import "../../../static/js/vintage.js";
    // import "../../../static/js/infographic.js";

    var BASE_URL = "http://localhost:8088/";
    export default {
        data() {
            return {
                isActive: true,
                showFlag: true,
                baseUrl: BASE_URL,
                clientHeight:
                    document.documentElement.clientHeight - 60 ||
                    document.body.clientHeight - 60,
                dimension: "",
                measure: "",
                dragContent: "",
                chartDate: {},
                // tableName: 'worker',
                tableName: "",
                cubeName: "",
                itemName: "",
                sitemName: "",
                itemNameShow: "",
                // tableName: 'GD_BABY_SITUATION',
                myChart: {},
                option: {
                    series: []
                }, //
                // optionUpdate: {},
                dimensionList: ["data", "people", "time", "rate"],
                measureList: ["data", "people", "time", "rate"],
                info: [],
                searchdimension: [],
                searchdimCh: [],
                searchdimTable: [],
                searchmeasure: [],
                searchmeasureCh: [],
                searchmeasureTable: [],
                searchmeasure2: [],
                // searchmeasureCh: [],
                // searchmeasureTable: [],
                searchmethods: [],
                searchadmethods: [],
                searchmethods2: [],
                searchadmethods2: [],
                searchcolor: [],
                colors: [],
                color: "#f00",
                isShow: false,
                isDisplay: false,
                isShowFilter: false,
                tableShow: false,
                itemShow: false,
                tableNameList: [],
                itemList: {},
                itemNameList: [],
                sitemNameList: [],
                stabNameList: [],
                dragColorItem: "",
                sectionSelect: true,
                commonSelect: false,
                selected: 0,
                filterName: "",
                filterTableName: "",
                filterCount: 0,
                filterCount1: 0,
                filterCondition: "",
                filterNameList: [],
                filterList: [],
                filterTable: [],
                type: 0 //0柱状图，1堆叠柱状图，2条形图，3条形堆叠图，4折现图，5饼图，6堆叠面积图，7雷达图，10笛卡尔积热力图（两个维度一个度量），13漏斗图（一个维度一个度量），11:词云图
            };
        },
        mounted() {
            var fileUrl = sessionStorage.getItem("fileUrl");
            var fileName = sessionStorage.getItem("fileName");
            this.$http.get("analysis/getDim?fileUrl=" + fileUrl+"&fileName="+fileName).then(response => {
                // var data = response;
                this.dimensionList = response.body.datum.dims;
                this.measureList = response.body.datum.meas;
            });
        },
        methods: {
            update(utype) {
                //根据左边修改图表type
                this.type = utype;
            },
            updateOption(newOption) {
                this.option = newOption;
                console.log(this.option);
                this.myChart.setOption(this.option, true); //true表示和之前的option合并
                this.init();
            },
            updateFilter() {
                if (this.selected === "0") {
                    this.sectionSelect = true;
                    this.commonSelect = false;
                } else {
                    this.sectionSelect = false;
                    this.commonSelect = true;
                }
            },
            //向后台传参数
            getData(
                type,
                dimension,
                dimCh,
                dimTable,
                measure,
                measureCh,
                measureTable,
                methods,
                colors,
                measure2,
                measure2Ch,
                measure2Table,
                methods2,
                filterList,
                admethods,
                admethods2,
                filterTable,
                filterNameList,
                cubeName,
                tableFlag
            ) {
                //获取拖拽后的数据，并生成图表
                console.log("------------------------------------");
                console.log(
                    type +
                    dimension +
                    dimCh +
                    dimTable +
                    measure +
                    measureCh +
                    measureTable +
                    methods +
                    colors +
                    measure2 +
                    measure2Ch +
                    measure2Table +
                    methods2 +
                    admethods +
                    admethods2 +
                    filterNameList +
                    filterList +
                    filterTable +
                    cubeName +
                    tableFlag
                );
                console.log("------------------------------------");
                //   this.$http
                //     .get(
                //       BASE_URL +
                //         "chart/query?dimension=" +
                //         dimension +
                //         "&dimCh=" +
                //         dimCh +
                //         "&dimTable=" +
                //         dimTable +
                //         "&type=" +
                //         type +
                //         "&values=" +
                //         measure +
                //         "&valueCh=" +
                //         measureCh +
                //         "&valueTable=" +
                //         measureTable +
                //         "&methods=" +
                //         methods +
                //         "&colors=" +
                //         colors +
                //         "&values2=" +
                //         measure2 +
                //         "&values2Ch=" +
                //         measure2Ch +
                //         "&values2Table=" +
                //         measure2Table +
                //         "&methods2=" +
                //         methods2 +
                //         "&havingValue=" +
                //         filterNameList +
                //         "&having=" +
                //         filterList +
                //         "&havingTable=" +
                //         filterTable +
                //         "&ad_methods=" +
                //         admethods +
                //         "&ad_methods2=" +
                //         admethods2 +
                //         "&cubeName=" +
                //         cubeName +
                //         "&tableFlag=" +
                //         tableFlag
                //     )
                //     .then(response => {
                //       var data = response.body;
                //       console.log(data);
                //       this.option = this._deepCopy(data);
                //       console.log(this.option);
                //       this.myChart.setOption(this.option, true); //true表示和之前的option合并
                //       this.init();
                //     });
                var dims = [];
                // console.log(dimension);
                dims.push(dimension[0]);
                if (measure == "") {
                    measure = [""];
                }
                // for(var i = 0 ;i<dimension.length;i++){
                //   var obj = {
                //     dimension[i]
                //   }
                // }
                // alert(measure);
                // var meas = measure;
                // meas.push(measure);
                // alert(sessionStorage.getItem("fileName"));
                axios
                    .post(
                        "analysis/sparkSQL",
                        qs.stringify({
                            dims: dimension[0],
                            meas: measure[measure.length - 1],
                            fileUrl: sessionStorage.getItem("fileUrl"),
                            tableName: sessionStorage.getItem("fileName"),
                        })
                    )
                    .then(function(response) {
                        console.log(response.data.datum);
                        var xData = [];
                        var yData = [];
                        for (var i = 0; i < response.data.datum.length; i++) {
                            xData.push(response.data.datum[i].Date);
                            yData.push(response.data.datum[i].Transaction);
                        }
                        let option = {
                            xAxis: {
                                type: "category",
                                data: xData
                            },
                            yAxis: {
                                type: "value"
                            },
                            series: [
                                {
                                    data: yData,
                                    type: "bar"
                                }
                            ]
                        };
                        // this.option = option;
                        console.log(option);
                        var chart = document.getElementById("graph");
                        var Chart = echarts.init(chart, "macarons");
                        Chart.setOption(option);
                        // this.myChart.setOption(option, true); //true表示和之前的option合并
                        // this.init();
                    });
            },
            filterSelect() {
                this.filterCondition = "";
                if (this.selected === 0) {
                    this.filterCondition += ">" + this.filterCount;
                    this.filterCondition += "," + "<" + this.filterCount1;
                } else {
                    this.filterCondition = this.selected + this.filterCount;
                }
                this.filterNameList.push(this.filterName);
                this.filterList.push(this.filterCondition);
                this.filterTable.push(this.filterTableName);
                if (this.isActive) {
                    this.getData(
                        this.type,
                        this.searchdimension,
                        this.searchdimCh,
                        this.searchdimTable,
                        this.searchmeasure,
                        this.searchmeasureCh,
                        this.searchmeasureTable,
                        this.searchmethods,
                        this.colors,
                        this.searchmeasure2,
                        this.searchmeasure2Ch,
                        this.searchmeasure2Table,
                        this.searchmethods2,
                        this.filterList,
                        this.searchadmethods,
                        this.searchadmethods2,
                        this.filterTable,
                        this.filterNameList,
                        this.cubeName,
                        !this.isActive
                    );
                } else {
                    this.getData(
                        this.type,
                        this.searchdimension,
                        this.searchdimCh,
                        this.searchdimTable,
                        this.searchmeasure,
                        this.searchmeasureCh,
                        this.searchmeasureTable,
                        this.searchmethods,
                        this.colors,
                        this.searchmeasure2,
                        this.searchmeasure2Ch,
                        this.searchmeasure2Table,
                        this.searchmethods2,
                        this.filterList,
                        this.searchadmethods,
                        this.searchadmethods2,
                        this.filterTable,
                        this.filterNameList,
                        this.cubeName,
                        this.isActive
                    );
                }

                this.isShowFilter = false;
            },
            headleChangeColor(color) {
                // this.color = color;
                // var series = this.option.series;

                // if (series == null || series.length == 0) {
                //   return;
                // }

                // for( let item in series ){
                //   console.log(series[item]);
                //   if(series[item].name == this.dragColorItem){
                //     series[item].color = [color];
                //   }
                // }

                let hasSet = false;
                //非首次改变颜色，只需把原来数组中对应元素的颜色进行改变，无需再push
                for (let i in this.colors) {
                    if (this.colors[i].indexOf(this.dragColorItem) >= 0) {
                        this.colors[i] =
                            this.dragColorItem + ":" + color.substr(1, color.length);
                        hasSet = true;
                    }
                }
                //首次改变颜色
                if (!hasSet) {
                    //去掉#
                    var t = this.dragColorItem + ":" + color.substr(1, color.length);
                    this.colors.push(t);
                }

                // console.log(this.colors);
                if (this.isActive) {
                    this.getData(
                        this.type,
                        this.searchdimension,
                        this.searchdimCh,
                        this.searchdimTable,
                        this.searchmeasure,
                        this.searchmeasureCh,
                        this.searchmeasureTable,
                        this.searchmethods,
                        this.colors,
                        this.searchmeasure2,
                        this.searchmeasure2Ch,
                        this.searchmeasure2Table,
                        this.searchmethods2,
                        this.filterList,
                        this.searchadmethods,
                        this.searchadmethods2,
                        this.filterTable,
                        this.filterNameList,
                        this.cubeName,
                        false
                    );
                } else {
                    this.getData(
                        this.type,
                        this.searchdimension,
                        this.searchdimCh,
                        this.searchdimTable,
                        this.searchmeasure,
                        this.searchmeasureCh,
                        this.searchmeasureTable,
                        this.searchmethods,
                        this.colors,
                        this.searchmeasure2,
                        this.searchmeasure2Ch,
                        this.searchmeasure2Table,
                        this.searchmethods2,
                        this.filterList,
                        this.searchadmethods,
                        this.searchadmethods2,
                        this.filterTable,
                        this.filterNameList,
                        this.cubeName,
                        true
                    );
                }

                //this.myChart.setOption(this.option,true);//true表示和之前的option合并
                //this._init();
            },
            closeColorDialog() {
                this.isShow = false;
            },
            closeFilterDialog() {
                this.isShowFilter = false;
            },
            closeTableDialog() {
                this.tableShow = false;
            },
            closeItemDialog() {
                this.itemShow = false;
            },
            //拖拽
            allowDrop(event) {
                event.preventDefault();
                // let dt = event.dataTransfer;
                // dt.effectAllowed = "copy";
                // dt.dropEffect = "copy";
            },
            drag1(event) {
                this.dimension = event.currentTarget;
                //通过复制被拖拽节点，使原来的位置上仍保存节点
                this.dragContent = this.dimension.cloneNode(true);
                this.dragContent.setAttribute("draggable", "false");
            },
            drag2(event) {
                this.measure = event.currentTarget;
                //通过复制被拖拽节点，使原来的位置上仍保存节点
                this.dragContent = this.measure.cloneNode(true);
                // let dt = event.dataTransfer;
                // dt.setData("Text", event.target.id);
                // dt.effectAllowed = "copy";
                this.dragContent.setAttribute("draggable", "false");
            }
        },
        // components: {
        //     "v-rightbar": rightBar,
        //     colorPicker: colorPicker,
        //     MyDialog: MyDialog
        // }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
    /*@import '../../../static/css/mixin.styl';*/

    .header {
        background-color: #eee;
        width: 100%;
        height: 800px;
    }

    .analysis {
        position: fixed;
        top: 85px;
        width: 73%;
        height: 100%;
        margin-bottom: 50px;

        // display: flex;
        .left-bar {
            // flex: 0 0 200px;
            width: 150px;
            height: 100%;
            float: left;
            // background-color: #F5F5F5;
            // color: #000;
            overflow-y: auto;

            // overflow-x: hidden;
            .olap-item {
                min-height: 40px;
                line-height: 40px;
                list-style: none;
                text-align: center;

                a {
                    color: #7E8C8D;
                }

                a:hover {
                    display: block;
                    min-height: 40px;
                    line-height: 40px;
                    color: #fff;
                    // background-color: rgba(255,255,255,0.3);
                    background-color: #3b8dbc;
                }
            }

            .item-title {
                padding-left: 10px;
                text-align: left;
            }

            .table-list-item {
                display: block;
                min-height: 40px;
                line-height: 40px;
                // background-color: rgba(255,255,255,0.3);
                background-color: #3b8dbc;
                border-bottom: 1px solid #fff;

                a {
                    color: #fff;
                }
            }

            .field-wrapper {
                // display: none;
                .item-title2 {
                    border-right: 1px solid #ddd;
                    padding-left: 10px;
                    text-align: left;
                }

                .dimension-wrapper {
                    border-right: 1px solid #ddd;

                    a:hover {
                        display: block;
                        min-height: 40px;
                        line-height: 40px;
                        color: #468fca;
                        background-color: #bbe9ff;
                    }
                }

                .measure-wrapper {
                    border-right: 1px solid #ddd;

                    a:hover {
                        display: block;
                        min-height: 40px;
                        line-height: 40px;
                        color: #468fca;
                        background-color: #bbe9ff;
                    }
                }
            }
        }

        .main-content {
            // flex: 1;
            position: absolute;
            top: 0px;
            left: 400px;
            right: 0px;
            height: 760px;
            padding: 5px 15px;
            background-color: #fff;
            text-align: left;
            overflow: auto;

            // overflow-x: auto;
            .drag-wrapper {
                .drag-item {
                    height: 40px;
                    min-width: 530px;
                    line-height: 40px;
                    border-1px(#868686);

                    .drag-title-label {
                        padding-right: 10px;
                        // color: #000;
                    }

                    .measure-item, .dimension-item {
                        // background-color: #29A2E6;
                        position: relative;
                        background-color: #3b8dbc;
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        border-radius: 3px;
                        cursor: pointer;
                        margin: 0 5px;
                        padding: 0px 10px;

                        a {
                            color: #fff;
                            font-weight: 700;

                            .computed {
                                position: absolute;
                                border: 1px solid #eee;
                                top: 30px;
                                // display: none;
                                Width: 100%;
                                margin-left: -10px;
                                background-color: #fff;
                                z-index: 50;

                                .measure-compute {
                                    display: none;

                                    .scomputed {
                                        display: none;
                                        position: absolute;
                                        border: 1px solid #eee;
                                        Width: 100px;
                                        background-color: #fff;
                                        z-index: 50;
                                        top: 0px;
                                        right: -100px;

                                        a {
                                            display: block;
                                            width: 100%;
                                            color: #314871;
                                        }

                                        a:hover {
                                            background-color: #F5F5F5;
                                        }
                                    }
                                }

                                a {
                                    display: block;
                                    width: 100%;
                                    color: #314871;
                                }

                                a:hover {
                                    background-color: #F5F5F5;
                                }

                                .senior:hover > .scomputed {
                                    display: block;
                                }
                            }

                            .fa {
                                margin-left: 5px;
                                display: none;
                            }
                        }
                    }
                }
            }

            .graph-wrapper {
                min-width: 530px;
                min-height: 450px;
                width: 100%;
                padding: 0px 30px;

                .graph {
                    // min-width: 500px;
                    // min-height: 400px;
                    width: 100%;
                    height: 400px;
                    padding: 30px 55px 50px;
                    margin-top: 30px;
                    border: 1px solid #868686;
                }
            }
        }

        .right-bar {
            // flex: 0 0 200px;
            width: 0px;
            height: 100%;
            float: right;
            padding: 5px 5px 20px 5px;
            // background-color: #F5F5F5;
            // color: #000;
            overflow-y: auto;
            // overflow-x: hidden;
        }

        .dialog-content {
            position: relative;
            min-height: 300px;
            min-width: 400px;
            width: 30%;

            // color: #000;
            .color-select-content {
                margin: 25px 40px;

                .color-left {
                    float: left;
                    margin-right: 30px;
                    padding-right: 30px;
                    min-height: 300px;
                    border-right: 5px solid #F5F5F5;
                }

                .color-right {
                    margin-left: 10px;
                }
            }

            .filter-content {
                margin: 10px 40px;
                border: 5px solid #F5F5F5;
                padding: 10px;

                .filter-detail {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 180px;

                    .form-select {
                        border: 0px;
                        border-bottom: solid 1px #868686;
                        background-color: transparent;
                        border-radius: 0px;
                        min-width: 60px;
                        text-align: center;
                        appearance: none;
                    }

                    input {
                        display: inline-block;
                        border: 0px;
                        border-bottom: 1px solid #868686;
                        background-color: transparent;
                        color: #000;
                        text-align: center;
                        margin: 5px;
                    }

                    .select-input {
                        min-width: 180px;
                    }

                    .section-content {
                        display: inline-block;

                        input {
                            display: inline-block;
                            max-width: 80px;
                        }
                    }
                }
            }

            .button-content {
                text-align: right;
                color: #3b8dbc;

                span {
                    display: inline-block;
                    margin-right: 45px;
                    cursor: pointer;
                }
            }

            .table-title {
                margin-bottom: 20px;

                .table-title-l {
                    font-size: 20px;
                    float: left;
                    padding: 10px 20px 0px 20px;
                    cursor: pointer;
                }

                .table-tb {
                    border: 2px solid #2F4574;
                    border-bottom: none;
                }

                .table-title-r {
                    font-size: 20px;
                    float: left;
                    padding: 10px 20px 0px 20px;
                    cursor: pointer;
                }

                .table-tbb {
                    border-bottom: 2px solid #2F4574;
                }
            }

            ul {
                padding: 10px;

                .table-list {
                    cursor: pointer;
                    padding: 5px 0;
                }
            }

            .common-btn {
                position: absolute;
                bottom: 15px;
                right: 20px;
                padding: 5px 15px;
                cursor: pointer;
                background-color: #2F4574;
                color: #fff;
            }
        }
    }
</style>
