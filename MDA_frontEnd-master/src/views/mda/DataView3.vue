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
                allDivDatas: [],
                // 下面为假数据
                tables: [
                    {
                        "name": "gd_prepregnancy_service",
                        "fields": ["ID", "FBIRTHDAY", "MBIRTHDAY", "ADDRESS_TOWN", "SERVICE_TIME"],
                    },
                    {
                        "name": "gd_basic_info_detail",
                        "fields": ["ID", "MNATIONALITY", 'MEDU_LEVEL', 'MJOB', 'FNATIONALTY', 'FEDU_LEVEL', 'FJOB', 'OUT_COME', 'MACCOUNT_TYPE',
                            'FACCOUNT_TYPE', 'ADDRESS_PROVINCE', 'ADDRESS_CITY', 'ADDRESS_COUNTY', 'ADDRESS_VILLAGE', 'complete', 'marry_time', 'danger_check_item'],
                    },
                    {
                        "name": 'gd_pysical_exam_w',
                        "fields": ['ID', 'HEIGHT', 'WEIGHT', 'BMI', 'HEART_RATE', 'HIGHT_BLOOD_PRESSURE', 'LOW_BLOOD_PRESSURE', 'SPECISAL_LOOK',
                            'RETARDATION', 'PUBES', 'BREAST', 'THYROID', 'LUNG', 'HEART_RHYTHM', 'HEARTMURMUR', 'VIVER', 'VERVIX'],
                    },
                    {
                        "name": 'gd_bmod_result',
                        "fields": ['ID', 'COMPLETE', 'BMOD_RESULT_TYPE'],
                    },
                    {
                        "name": 'gd_followup_record',
                        "fields": ['ID', 'POISON_ID', 'QUESTION_ID', 'COUNTYMEDICAL', 'YAOWU', 'FOLACIN', 'FOLA_METHOD', 'HUS_SMOKE_CHANGE',
                            'SMOKE_CHANGE', 'DRINK_CHANGE', 'APPRAISE', 'MEATEGGS', 'VEGETABLES', 'YNCOMPLETE', 'LOSEFOLLOWUP'],
                    },
                    {
                        "name": 'gd_pe_question',
                        "fields": ['ID', 'MUMPS', 'ORCHITIS', 'VARICOSE_VEINS', 'STERILITY', 'UTERINE', 'COLPORRHAGIA', 'FEVER', 'DIARRHEA', 'ABDOMINALPAIN', 'COMMON_COLD', 'CAH'],
                    },
                    {
                        "name": 'gd_poison_expose',
                        "fields": ['ID', 'RADIAL', 'NOISE', 'LEAD_HG', 'NEW_DECORATION', 'HIGH_TEMPERATURE', 'PESTICIDE', 'ENVIRONMENT', 'CATDOG', 'SMOKED', 'SHAKE'],
                    },
                    {
                        "name": 'gd_pregency_result',
                        "fields": ['ID', 'PREGENCY_END_TIME', 'BIRTH_NUM', 'BIRTH_PLACE', 'BIRTH_WEEK', 'BIRTH_PLACE_PROVICE', 'BIRTH_PLACE_TOWN',
                            'NORMALPRE', 'EARLYPRE', 'LOWER_WEIGHT', 'BORNFAULT', 'NATRUALPRE', 'MEDICINEPRE', 'TREATPRE', 'DIFFERENTPRE', 'DEATHPRE', 'YNCOMPLETE', 'LOSEFOLLOWUP'],
                    },
                    {
                        "name": 'gd_baby_situation',
                        "fields": ['ID', 'PREGENCY_RESULT_ID', 'BABY_SEX', 'BABY_WEIGHT', 'BIRTH_TYPE', 'BABY_LIVE', 'IS_ILL'],
                    },
                    {
                        "name": 'gd_bad_baby_regist',
                        "fields": ['ID', 'BABY_ID', 'PREGENCY_NUM', 'BIRTH_NUM', 'BABY_BIRTHDAY', 'BABY_SEX', 'BIRTH_PREGENCY_WEEK_NUM', 'BABY_WEIGHT', 'LITTERS', 'BABY_RESULT', 'DOWN_SYND', 'CONG_HEAR_DISE'],
                    },
                ],
                tables2: [
                    {
                        "name": "supplier_info",
                        "fields": ["ID", "NAME", "AREA", "TEL"],
                    },
                    {
                        "name": "supplier_products",
                        "fields": ["ID", "SUPPLIER_ID", "PRODUCT_NAME", "DESCRIPTION", "UNIT_PRICE", "DELIVERY_TYPE", "DELIVERY_CIRCLE"],
                    },
                ],
                tables3: [
                    {
                        "name": "supplier_info3",
                        "fields": ["ID", "NAME", "AREA", "TEL"],
                    },
                    {
                        "name": "supplier_products3",
                        "fields": ["ID", "SUPPLIER_ID", "PRODUCT_NAME", "DESCRIPTION", "UNIT_PRICE", "DELIVERY_TYPE", "DELIVERY_CIRCLE"],
                    },
                ],
                singleTables: [
                    {
                        "name": "gd_baby",
                        "fields": ["ID", "NAME"],
                    },
                    {
                        "name": "gd_pregency",
                        "fields": ["ID", "PREGENCY_AREA"],
                    },
                ]
            };
        },
        components: {
            "vue-draggable-resizable": VueDraggableResizable
        },
        created() {
            this.allDivDatas.push({"id": 1, "tables": this.tables, "style": "width: 1150px; height: 550px"});
            this.allDivDatas.push({"id": 2, "tables": this.tables2, "style": "width: 300px; height: 400px"});
            this.allDivDatas.push({"id": 3, "tables": this.tables3, "style": "width: 300px; height: 400px"});
            console.log(this.allDivDatas);
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
            // jsplumb初始化（装载假数据）
            console.log("开始jsplumbReady");
            this.jsplumbReady();
        },
        methods: {
            // jsplumb初始化函数（装载假数据）
            jsplumbReady() {
                // 设置各表格的初始位置
                this.setPosition("gd_prepregnancy_service", 147, 446);
                this.setPosition("gd_basic_info_detail", 9, 709);
                this.setPosition("gd_pysical_exam_w", 192, 819);
                this.setPosition("gd_bmod_result", 284, 228);
                this.setPosition("gd_followup_record", 92, 228);
                this.setPosition("gd_pe_question", 195, 15);
                this.setPosition("gd_poison_expose", 5, 16);
                this.setPosition("gd_pregency_result", 379, 446);
                this.setPosition("gd_baby_situation", 379, 666);
                this.setPosition("gd_bad_baby_regist", 379, 885);

                this.setPosition("supplier_info", 0, 50);
                this.setPosition("supplier_products", 230, 50);

                this.setPosition("supplier_info3", 0, 50);
                this.setPosition("supplier_products3", 230, 50);
                // 设置source、target以及锚点属性
                for (let i = 0; i < this.allDivDatas.length; i++) {
                    for (let j = 0; j < this.allDivDatas[i].tables.length; j++) {
                        console.log("i:" + i + "; " + "j: " + j);
                        let element = document.getElementById(this.allDivDatas[i].tables[j].name);
                        this.makeSourceElement(element);
                        this.makeTargetElement(element);
                        this.jsPlumb.draggable(element);
                    }
                }
                // 手动设置连线
                let ins = this.jsPlumb;
                ins.connect({source:"gd_prepregnancy_service", target:"gd_basic_info_detail"});
                ins.connect({source:"gd_prepregnancy_service", target:"gd_pysical_exam_w"});
                ins.connect({source:"gd_prepregnancy_service", target:"gd_bmod_result"});
                ins.connect({source:"gd_prepregnancy_service", target:"gd_followup_record"});
                ins.connect({source:"gd_prepregnancy_service", target:"gd_pregency_result"});
                ins.connect({source:"gd_followup_record", target:"gd_pe_question"});
                ins.connect({source:"gd_followup_record", target:"gd_poison_expose"});
                ins.connect({source:"gd_pregency_result", target:"gd_baby_situation"});
                ins.connect({source:"gd_baby_situation", target:"gd_bad_baby_regist"});

                ins.connect({source:"supplier_info", target:"supplier_products"});

                ins.connect({source:"supplier_info3", target:"supplier_products3"});
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
                console.log("成功调用makeSource函数");
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
            //返回
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
        height: 843px;
        left: 10px;
        right: 30px;
        bottom: 15px;
        top: 0px;
    }
    #divForest {
        position: relative;
        height: 70%;
        margin-bottom: 15px;
        /*border-bottom: thin dashed #e8eaed;*/
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        /*配合子元素的align-self: center实现竖直居中*/
        display: flex;
    }
    #divSingleTable {
        position: relative;
        overflow-x: scroll;
        overflow-y: hidden;
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
    svg.icon {
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
