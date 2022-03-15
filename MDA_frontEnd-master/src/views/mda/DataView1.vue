<template>
    <div>
        <div id="echarts"></div>
    </div>
</template>

<script>
    import echarts from "echarts";
    export default {
        data() {
            return {
                theme: "vintage",
                // nodes: [
                //     {
                //         name: 'disease',
                //         symbolSize: 90,
                //         category: 0,
                //     },
                //     {
                //         name: '药物',
                //         symbol: 'roundRect',
                //         symbolSize: [80, 55],
                //         category: 1,
                //         // 展开字段，true为已展开，false为被折叠
                //         unfold: true,
                //     },
                //     {
                //         name: '操作',
                //         symbol: 'roundRect',
                //         symbolSize: [80, 55],
                //         category: 2,
                //         unfold: true,
                //     },
                //     {
                //         name: '检查',
                //         symbol: 'roundRect',
                //         symbolSize: [80, 55],
                //         category: 3,
                //         unfold: true,
                //     },
                //     {
                //         name: 'med1',
                //         symbolSize: 50,
                //         category: 1,
                //         // 字段节点没有unfold字段，不可展开
                //     },
                //     {
                //         name: 'med2',
                //         symbolSize: 50,
                //         category: 1,
                //     },
                //     {
                //         name: 'med3',
                //         symbolSize: 50,
                //         category: 1,
                //     },
                //     {
                //         name: 'med4',
                //         symbolSize: 50,
                //         category: 1,
                //     },
                //     {
                //         name: 'op1',
                //         symbolSize: 50,
                //         category: 2,
                //     },
                //     {
                //         name: 'op2',
                //         symbolSize: 50,
                //         category: 2,
                //     },
                //     {
                //         name: 'op3',
                //         symbolSize: 50,
                //         category: 2,
                //     },
                //     {
                //         name: 'op4',
                //         symbolSize: 50,
                //         category: 2,
                //     },
                //     {
                //         name: 'op5',
                //         symbolSize: 50,
                //         category: 2,
                //     },
                // ],
                // links: [
                //     {
                //         source: 'disease',
                //         target: '药物',
                //     },
                //     {
                //         source: 'disease',
                //         target: '检查',
                //     },
                //     {
                //         source: 'disease',
                //         target: '操作',
                //     },
                //     {
                //         source: '药物',
                //         target: "med1",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '药物',
                //         target: "med2",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '药物',
                //         target: "med3",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '药物',
                //         target: "med4",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '操作',
                //         target: "op1",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '操作',
                //         target: "op2",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '操作',
                //         target: "op3",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '操作',
                //         target: "op4",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                //     {
                //         source: '操作',
                //         target: "op5",
                //         lineStyle: {
                //             width: 2,
                //         },
                //     },
                // ],
                // categories: ['disease', '药物', '操作', '检查'],
                texts: [],
                stashNodes: [], // node的暂存区，折叠时存储到这里，展开时再拿回来
                stashLinks: [], // link的暂存区，折叠时存储到这里，展开时再拿回来
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
                nodes: [],
                links: [],
                categories: [],
                count: 0, // 计数器，用于给node添加id（唯一标识），来解决node的name不能重名的问题
                idMap: [], // 设置了id以后，link就只能使用id作为source和target，所以需要idMap来进行对应的转换
            };
        },
        mounted() {
            // 注入假数据
            // 添加nodes
            // 为了解决node的name不能重复的问题，为node指定id（table：id与name保持一致，field：id为table.name）
            for (let i = 0; i < this.tables.length; i++) {
                // 添加表table
                if (i === 0) {
                    this.nodes.push({
                        name: this.tables[i].name,
                        symbolSize: 150,
                        category: i,
                        unfold: true,
                        id: this.tables[i].name,
                    })
                }else {
                    this.nodes.push({
                        name: this.tables[i].name,
                        symbolSize: [120, 80],
                        category: i,
                        unfold: true,
                        symbol: 'roundRect',
                        id: this.tables[i].name,
                    })
                }
                // 添加字段field
                for (let j = 0; j < this.tables[i].fields.length; j++) {
                    this.nodes.push({
                        name: this.tables[i].fields[j],
                        symbolSize: 50,
                        category: i,
                        id: this.tables[i].name + "." + this.tables[i].fields[j],
                    })
                }
                // 添加categories
                this.categories.push(this.tables[i].name);
            }
            // 添加links
            for (let i = 0; i < this.tables.length; i++) {
                // 添加表与其字段的link
                for (let j = 0; j < this.tables[i].fields.length; j++) {
                    this.links.push({
                        source: this.tables[i].name,
                        target: this.tables[i].name + "." + this.tables[i].fields[j],
                        lineStyle: {
                            width: 2,
                        },
                        value: '',
                    })
                }
            }
            this.addLink('prepregnancy_service', 'basic_info_detail');
            this.addLink('prepregnancy_service', 'pysical_exam_w');
            this.addLink('prepregnancy_service', 'bmod_result');
            this.addLink('prepregnancy_service', 'followup_record');
            this.addLink('prepregnancy_service', 'pregency_result');
            this.links.push({
                source: 'followup_record',
                target: 'pe_question',
                value: 'QUESTION_ID = ID',
            });
            this.links.push({
                source: 'followup_record',
                target: 'poison_expose',
                value: 'POISON_ID = ID',
            });
            this.links.push({
                source: 'pregency_result',
                target: 'baby_situation',
                value: 'ID = PREGENCY_RESULT_ID',
            });
            this.addLink('baby_situation', 'bad_baby_regist');
            // 假数据注入结束
            console.log("假数据注入结束");

            // 转换categoryies
            for (let i = 0; i < this.categories.length; i++) {
                this.texts.push({
                    name: this.categories[i]
                });
            }
            var worldMapContainer = document.getElementById('echarts');
            console.log(worldMapContainer);
            console.log("abc");
            //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
            var resizeWorldMapContainer = function () {
                // worldMapContainer.style.width = window.innerWidth-360 + 'px';
                // worldMapContainer.style.height = window.innerHeight + 'px';
                worldMapContainer.style.width = '1705px';
                worldMapContainer.style.height = '843px';
            };
            //设置容器高宽
            resizeWorldMapContainer();
            console.log(worldMapContainer);
            console.log(echarts);
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(worldMapContainer);
            console.log(myChart);
            //用于使chart自适应高度和宽度
            window.onresize = function () {
                //重置容器高宽
                resizeWorldMapContainer();
                myChart.resize();
            };
            // 处理点击事件（展开/收起）
            let that = this;
            myChart.on('click', function(params) {
                console.log("点击了click");
                console.log(params);
                if (params.data.unfold !== undefined) {
                    console.log("可以展开/折叠");
                    // 已经展开了，调用折叠函数
                    if (params.data.unfold === true) {
                        console.log("调用折叠foldNode");
                        that.foldNode(params.data.id);
                    } else { // 处于折叠状态，调用展开函数
                        console.log("调用展开unfoldNode");
                        that.unfoldNode(params.data.id);
                    }
                    that.redrawGraph(myChart);
                }else {
                    that.$message.info("该节点不能展开/折叠");
                }
            });

            this.drawCharts();
        },
        methods: {
            drawCharts() {
                console.log("开始drawCharts");
                var dom = document.getElementById("echarts");
                console.log(dom);
                var myChart = echarts.init(dom, this.theme);
                console.log(myChart);
                myChart.setOption({
                    title: {
                        text: '数据表关联视图 Graph',
                        left: 'auto'
                    },
                    tooltip: {
                        formatter: '{b}'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    legend: {
                        data: this.categories,
                        textStyle: {
                            color: '#000000'
                        },
                        icon: 'circle',
                        type: 'scroll',
                        orient: 'vertical',
                        left: 10,
                        top: 30,
                        bottom: 20,
                        itemWidth: 10,
                        itemHeight: 10
                    },
                    // backgroundColor: '#00000',
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            force: {
                                repulsion: 8000,
                                gravity: 0.1,
                                edgeLength: 150,
                                layoutAnimation: true,
                            },
                            // force: {
                            //     repulsion: 2500,
                            //     edgeLength: [10, 50]
                            // },
                            draggable: true,
                            focusNodeAdjacency: true,
                            roam: true,
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 12
                                    },
                                }
                            },
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 10
                                    },
                                    formatter: "{c}"
                                }
                            },
                            data: this.nodes,
                            // links: [],
                            links: this.links,
                            categories: this.texts,
                            lineStyle: {
                                opacity: 0.9,
                                width: 4,
                                curveness: 0,
                                color: 'target',
                            }
                        }
                    ]
                });
                console.log(myChart.getOption());
            },
            // 展开函数
            unfoldNode(nodeId) {
                console.log(this.stashNodes);
                console.log(this.stashLinks);
                // 倒序遍历stashLinks
                for (let i = this.stashLinks.length - 1; i >= 0 ; i--) {
                    // 如果link的source为nodeId
                    if (this.stashLinks[i].source === nodeId) {
                        // 1、将其添加至links中
                        this.links.push(this.stashLinks[i]);
                        // 2、找到stashNodes中的对应node（field），完成【2.1、添加， 2.2、删除】的操作
                        for (let j = this.stashNodes.length - 1; j >= 0 ; j--) {
                            if (this.stashNodes[j].id === this.stashLinks[i].target && this.stashNodes[j].id.indexOf(".") !== -1) {
                                this.nodes.push(this.stashNodes[j]);
                                this.stashNodes.splice(j, 1);
                            }
                        }
                        // 3、从stashLinks中删除该link
                        this.stashLinks.splice(i, 1);
                    }
                    // 将unfold字段改为true
                    for (let i = 0; i < this.nodes.length; i++) {
                        if (this.nodes[i].id === nodeId) {
                            this.nodes[i].unfold = true;
                        }
                    }
                }
            },
            // 折叠函数
            foldNode(nodeId) {
                // 倒序遍历links
                for (let i = this.links.length - 1; i >= 0 ; i--) {
                    // 如果link的source为nodeId
                    if (this.links[i].source === nodeId) {
                        // 1、将其添加至stashLinks中
                        this.stashLinks.push(this.links[i]);
                        // 2、找到对应的node（field），完成【2.1、添加， 2.2、删除】的操作
                        for (let j = this.nodes.length - 1; j >= 0 ; j--) {
                            if (this.nodes[j].id === this.links[i].target && this.nodes[j].id.indexOf(".") !== -1) {
                                this.stashNodes.push(this.nodes[j]);
                                this.nodes.splice(j, 1);
                                // 3、从links中删除该link
                                this.links.splice(i, 1);
                            }
                        }
                    }
                }
                // 将unfold字段改为false
                for (let i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].id === nodeId) {
                        this.nodes[i].unfold = false;
                    }
                }
            },
            // 根据更新后的option重新画图
            redrawGraph(myChart) {
                let currentOption = myChart.getOption();
                currentOption.series[0].data = this.nodes;
                currentOption.series[0].links = this.links;
                console.log(currentOption);
                myChart.setOption(currentOption);
            },

            // 注入假数据的link使用函数
            addLink(source, target) {
                this.links.push({
                    source: source,
                    target: target,
                    lineStyle: {
                        width: 4,
                    },
                    value: "ID = ID",
                })
            }
        }
    };
</script>
<style>
    #echarts {
        position: relative;
        overflow: hidden;
        width: 852px;
        height: 502px;
        padding: 0px;
        margin: 0px;
        border-width: 0px;
        cursor: default;
    }
</style>
