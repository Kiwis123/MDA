<template>
    <div>
        <div id="containerJsplumb">
            <el-card class="box-card"
                     v-for="(table, index) in tables" :key="index"
                     :id="table.name"
                     :w="180"
                     :h="240"
                     :parent="true"
                     style="position: absolute;"
            >
                <div slot="header" class="clearfix">
                    <a-icon :component="tableSvg" />
                    <el-button style="margin-left: 4px; font-size: 15px; color: black" type="text">{{ table.name }}</el-button>
<!--                        <el-button style="float: right; padding: 3px 0; color: black" type="text">x</el-button>-->
                </div>
                <div v-for="(field, index1) in tables[index].fields" :key="index1" class="text item">
                    {{ field }}
                </div>
            </el-card>
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
                // 下面为假数据
                tables: [
                    {
                        name: "prepregnancy_service",
                        fields: ["ID", "FBIRTHDAY", "MBIRTHDAY", "ADDRESS_TOWN", "SERVICE_TIME"],
                    },
                    {
                        name: "basic_info_detail",
                        fields: ["ID", "MNATIONALITY", 'MEDU_LEVEL', 'MJOB', 'FNATIONALTY', 'FEDU_LEVEL', 'FJOB', 'OUT_COME', 'MACCOUNT_TYPE',
                            'FACCOUNT_TYPE', 'ADDRESS_PROVINCE', 'ADDRESS_CITY', 'ADDRESS_COUNTY', 'ADDRESS_VILLAGE', 'complete', 'marry_time', 'danger_check_item'],
                    },
                    {
                        name: 'pysical_exam_w',
                        fields: ['ID', 'HEIGHT', 'WEIGHT', 'BMI', 'HEART_RATE', 'HIGHT_BLOOD_PRESSURE', 'LOW_BLOOD_PRESSURE', 'SPECISAL_LOOK',
                            'RETARDATION', 'PUBES', 'BREAST', 'THYROID', 'LUNG', 'HEART_RHYTHM', 'HEARTMURMUR', 'VIVER', 'VERVIX'],
                    },
                    {
                        name: 'bmod_result',
                        fields: ['ID', 'COMPLETE', 'BMOD_RESULT_TYPE'],
                    },
                    {
                        name: 'followup_record',
                        fields: ['ID', 'POISON_ID', 'QUESTION_ID', 'COUNTYMEDICAL', 'YAOWU', 'FOLACIN', 'FOLA_METHOD', 'HUS_SMOKE_CHANGE',
                            'SMOKE_CHANGE', 'DRINK_CHANGE', 'APPRAISE', 'MEATEGGS', 'VEGETABLES', 'YNCOMPLETE', 'LOSEFOLLOWUP'],
                    },
                    {
                        name: 'pe_question',
                        fields: ['ID', 'MUMPS', 'ORCHITIS', 'VARICOSE_VEINS', 'STERILITY', 'UTERINE', 'COLPORRHAGIA', 'FEVER', 'DIARRHEA', 'ABDOMINALPAIN', 'COMMON_COLD', 'CAH'],
                    },
                    {
                        name: 'poison_expose',
                        fields: ['ID', 'RADIAL', 'NOISE', 'LEAD_HG', 'NEW_DECORATION', 'HIGH_TEMPERATURE', 'PESTICIDE', 'ENVIRONMENT', 'CATDOG', 'SMOKED', 'SHAKE'],
                    },
                    {
                        name: 'pregency_result',
                        fields: ['ID', 'PREGENCY_END_TIME', 'BIRTH_NUM', 'BIRTH_PLACE', 'BIRTH_WEEK', 'BIRTH_PLACE_PROVICE', 'BIRTH_PLACE_TOWN',
                            'NORMALPRE', 'EARLYPRE', 'LOWER_WEIGHT', 'BORNFAULT', 'NATRUALPRE', 'MEDICINEPRE', 'TREATPRE', 'DIFFERENTPRE', 'DEATHPRE', 'YNCOMPLETE', 'LOSEFOLLOWUP'],
                    },
                    {
                        name: 'baby_situation',
                        fields: ['ID', 'PREGENCY_RESULT_ID', 'BABY_SEX', 'BABY_WEIGHT', 'BIRTH_TYPE', 'BABY_LIVE', 'IS_ILL'],
                    },
                    {
                        name: 'bad_baby_regist',
                        fields: ['ID', 'BABY_ID', 'PREGENCY_NUM', 'BIRTH_NUM', 'BABY_BIRTHDAY', 'BABY_SEX', 'BIRTH_PREGENCY_WEEK_NUM', 'BABY_WEIGHT', 'LITTERS', 'BABY_RESULT', 'DOWN_SYND', 'CONG_HEAR_DISE'],
                    },
                ],
            };
        },
        components: {
            "vue-draggable-resizable": VueDraggableResizable
        },
        created() {
            // jsplumb
            this.jsPlumb = this.$jsPlumb.getInstance({
                Container:"containerJsplumb",   //选择器id
                EndpointStyle: { radius: 1, fill: "#ffffff"},  //端点样式
                PaintStyle: { stroke: '#000000',strokeWidth:4},// 绘画样式，默认8px线宽  #456
                HoverPaintStyle: { stroke: '#1E90FF' }, // 默认悬停样式  默认为null
                EndpointHoverStyle: { fill: '#F00', radius:6 }, // 端点悬停样式
                ConnectionOverlays:[
                    // ["Arrow",{
                    //     location:1,
                    //     paintStyle: {
                    //         stroke: '#00688B',
                    //         fill: '#00688B',
                    //     }
                    // }]
                    ["PlainArrow",{
                        location:1,
                        width: 10,
                        length: 10,
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
            jsplumbReady(tables) {
                // 设置各表格的初始位置
                this.setPosition("prepregnancy_service", 266, 687);
                this.setPosition("basic_info_detail", 9, 1000);
                this.setPosition("pysical_exam_w", 266, 1126);
                this.setPosition("bmod_result", 570, 284);
                this.setPosition("followup_record", 116, 359);
                this.setPosition("pe_question", 281, 32);
                this.setPosition("poison_expose", 10, 32);
                this.setPosition("pregency_result", 570, 687);
                this.setPosition("baby_situation", 570, 992);
                this.setPosition("bad_baby_regist", 570, 1288);
                // 设置source、target以及锚点属性
                for (let i = 0; i < this.tables.length; i++) {
                    let element = document.getElementById(this.tables[i].name);
                    this.makeSourceElement(element);
                    this.makeTargetElement(element);
                    this.jsPlumb.draggable(element);
                }
                // 手动设置连线
                let ins = this.jsPlumb;
                ins.connect({source:"prepregnancy_service", target:"basic_info_detail"});
                ins.connect({source:"prepregnancy_service", target:"pysical_exam_w"});
                ins.connect({source:"prepregnancy_service", target:"bmod_result"});
                ins.connect({source:"prepregnancy_service", target:"followup_record"});
                ins.connect({source:"prepregnancy_service", target:"pregency_result"});
                ins.connect({source:"followup_record", target:"pe_question"});
                ins.connect({source:"followup_record", target:"poison_expose"});
                ins.connect({source:"pregency_result", target:"baby_situation"});
                ins.connect({source:"baby_situation", target:"bad_baby_regist"});
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
                    filter: ":not(.el-button el-button--text)"
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
        }
    }
</script>

<style>
    #containerJsplumb {
        position: absolute;
        height: 100%;
        width: 1705px;
        left: 200px;
        background: #eee !important;
    }
    svg.icon {
        font-size: 15px;
    }
    /*card设置*/
    .el-card {
        border-style:solid;
        border-width:2px;
        border-color: black;
    }
    .el-card__header {
        padding: 10px 20px;
        background-color: #48bfff;
    }
    .el-card__body {
        padding: 10px 20px;
        /*必须设置height才能使用overflow，height的值无所谓*/
        height: 180px;
        /*只上下滚动，不允许左右滚动*/
        overflow: auto;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .text {
        font-size: 14px;
    }
    .item {
        margin: 5px 0px 5px 6px;
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
        height: 240px;
    }
    /*jsplumb的连线样式*/
    /*宽度 4 --> 2*/
    path {
        stroke-width: 2;
    }
</style>
