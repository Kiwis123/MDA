<template>
    <fullscreen ref="fullscreen" @change="fullscreenChange">
        <div class="dashboard">
            <div class="style">
                <el-button class="button" type="text" @click="toggle">
              <span class="sum">
                <i class="iconfont icon-Shape"></i></span>
                </el-button>
                <div class="title">仪表盘模版三</div>
                <el-row :gutter="25">
                    <el-col :span="12">
                        <div class="grid bg-purple">
                            <div id="Charts1" style="">

                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid bg-purple">
                            <div id="Charts2">

                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="25">
                    <el-col :span="12">
                        <div class="grid bg-purple">
                            <div id="Charts3">

                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid bg-purple">
                            <div id="Charts4">

                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="25">
                    <el-col :span="12">
                        <div class="grid bg-purple">
                            <div id="Charts5">

                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid bg-purple">
                            <div id="Charts6">

                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </fullscreen>
</template>
<script>
    import echarts from "echarts";
    import fullscreen from "vue-fullscreen";
    export default {
        data() {
            return {};
        },
        mounted: function() {
            var option = [
                {
                    backgroundColor: "#FFFFFF",
                    title: {
                        text: "CAN-LAX的销售收入 2016-2017",
                        textStyle: {
                            fontSize: 14
                        }
                    },

                    tooltip: {
                        // 提示框组件
                        trigger: "axis",
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ["2016", "2017", "Growing Rate"],
                        top: "18"
                    },
                    grid: {
                        left: "3%",
                        right: "5%",
                        bottom: "3%",
                        containLabel: true,
                        show: false // 网格边框是否显示，上和右边框
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: false, readOnly: false }, // 数据试图是否在控件中显示
                            //magicType: {show: true, type: ['stack', 'tiled']},
                            //restore: {show: true},
                            saveAsImage: { show: true }
                        }
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: true, // 坐标轴两边留白
                        splitLine: {
                            // 网格线 x轴对应的是否显示
                            show: false
                        },
                        data: [
                            "1月",
                            "2月",
                            "3月",
                            "4月",
                            "5月",
                            "6月",
                            "7月",
                            "8月",
                            "9月",
                            "10月",
                            "11月",
                            "12月"
                        ]
                    },

                    yAxis: [
                        // 双y坐标轴
                        {
                            name: "Revenue(10k)",
                            type: "value",
                            splitLine: {
                                // 网格线 y轴对应的是否显示
                                show: false
                            },
                            axisLabel: {
                                formatter: "{value}"
                            }
                        },
                        {
                            name: "Growing\nRate (%)",
                            //nameLocation: 'start',
                            splitLine: {
                                // 网格线 y轴对应的是否显示
                                show: false
                            },
                            min: 0,
                            max: 300, // growing rate upper limit
                            type: "value",
                            //top:10,
                            inverse: false,
                            axisLine: {
                                lineStyle: {
                                    color: "#2f4554"
                                }
                            }
                        }
                    ],

                    series: [
                        {
                            name: "2016",
                            type: "bar",
                            color: "#00BFFF",
                            //stack: '总量',
                            markPoint: {
                                data: [
                                    { type: "max", name: "最大值" },
                                    { type: "min", name: "最小值" }
                                ]
                            },
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [
                                1741.9,
                                977,
                                1742.2,
                                1431.1,
                                1636.2,
                                1447,
                                1711.7,
                                1921.2,
                                2609.6,
                                3332.6,
                                3647.3,
                                2498.1
                            ]
                        },
                        {
                            name: "2017",
                            type: "bar",
                            color: "#DC143C",
                            //stack: '总量',
                            markPoint: {
                                data: [
                                    { type: "max", name: "最大值" },
                                    { type: "min", name: "最小值" }
                                ]
                            },
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [
                                2609,
                                1162.9,
                                2942.9,
                                5174.6,
                                5114.4,
                                5065.8,
                                3956.1,
                                3691.1,
                                4637.6,
                                4603.8,
                                6401.1,
                                4988.4
                            ]
                        },
                        {
                            name: "Growing Rate",
                            type: "line",
                            yAxisIndex: 1, // yAxisIndex 1 表示第二个y轴，默认为0
                            color: "#FFD700",
                            //stack: '总量',
                            markPoint: {
                                data: [
                                    { type: "max", name: "最大值" }
                                    //{type : 'min', name : '最小值'}
                                ]
                            },
                            data: [
                                49.8,
                                19,
                                68.9,
                                261.6,
                                212.6,
                                250.1,
                                131.1,
                                92.1,
                                77.7,
                                38.1,
                                75.5,
                                99.7
                            ]
                        }
                    ]
                },

                {
                    backgroundColor: "#FFFFFF", // 背景色
                    title: {
                        text: "货物装载系数-2016/2017",
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        data: ["CLF-2016", "CLF-2017"],
                        top: "18" // 距离容器顶端的距离
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: false, readOnly: false }, // 数据试图是否在控件中显示
                            saveAsImage: { show: true }
                        }
                    },

                    xAxis: {
                        type: "category",
                        boundaryGap: false, // 坐标轴两边留白策略
                        splitLine: {
                            // 网格线 x轴对应的是否显示
                            show: false
                        },
                        data: [
                            "1月",
                            "2月",
                            "3月",
                            "4月",
                            "5月",
                            "6月",
                            "7月",
                            "8月",
                            "9月",
                            "10月",
                            "11月",
                            "12月"
                        ]
                    },

                    yAxis: {
                        type: "value",
                        name: "CLF(%)",
                        min: 70,
                        max: 100,
                        interval: 10,
                        splitLine: {
                            // 网格线 y轴对应的是否显示
                            show: false
                        }
                    },

                    series: [
                        {
                            name: "CLF-2016",
                            type: "line",
                            data: [
                                88.29,
                                83.68,
                                89.64,
                                90.47,
                                90.21,
                                93.63,
                                94.07,
                                90.85,
                                90.32,
                                90.56,
                                86.69,
                                81.77
                            ]
                        },
                        {
                            name: "CLF-2017",
                            type: "line",
                            data: [
                                90.36,
                                86.21,
                                92.04,
                                89.91,
                                90.15,
                                90.38,
                                88.03,
                                88.99,
                                88.35,
                                87.18,
                                86.29,
                                81.23
                            ]
                        }
                    ]
                },

                {
                    backgroundColor: "#FFFFFF",
                    title: {
                        text: "CAN-LAX的销售结构 in 2016",
                        //left:'center',              // title位置
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: false, readOnly: false }, // 数据试图是否在控件中显示
                            //magicType: {show: true, type: ['stack', 'tiled']},
                            //restore: {show: true},
                            saveAsImage: { show: true }
                        }
                    },
                    legend: {
                        data: ["直达", "中转", "联程", "邮件"],
                        top: "18"
                    },
                    grid: {
                        left: "2%",
                        right: "9%",
                        bottom: "3%",
                        containLabel: true,
                        show: false // 网格边框是否显示，上和右边框
                    },

                    xAxis: [
                        {
                            type: "category",
                            splitLine: {
                                // 网格线 x轴对应的是否显示
                                show: false
                            },
                            data: [
                                "1月",
                                "2月",
                                "3月",
                                "4月",
                                "5月",
                                "6月",
                                "7月",
                                "8月",
                                "9月",
                                "10月",
                                "11月",
                                "12月"
                            ]
                        }
                    ],

                    yAxis: [
                        {
                            name: "Revenue(10k)",
                            type: "value",
                            splitLine: {
                                // 网格线 y轴对应的是否显示
                                show: false
                            },
                            axisLabel: {
                                formatter: "{value}"
                            }
                        }
                    ],

                    series: [
                        {
                            name: "直达",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#01949B" }
                            },

                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},

                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },

                            data: [
                                919,
                                455.7,
                                1074.8,
                                911.7,
                                1006.8,
                                1075.6,
                                1106.1,
                                1274.5,
                                1755.6,
                                2562.7,
                                2056.1,
                                1227.9
                            ]
                        },
                        {
                            name: "中转",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#EBA954" }
                            },
                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [
                                567.1,
                                261.4,
                                456.8,
                                387,
                                419.2,
                                227,
                                417,
                                413.1,
                                564,
                                583,
                                915.9,
                                666.3
                            ]
                        },
                        {
                            name: "联程",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#C23531" }
                            },
                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [
                                255.9,
                                259.8,
                                210.5,
                                118.2,
                                196.5,
                                140.6,
                                188.6,
                                204.4,
                                290,
                                186.9,
                                661.3,
                                468.2
                            ]
                        },
                        {
                            name: "邮件",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#6495ED" }
                            },
                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [0, 0, 0, 14.2, 13.7, 3.8, 0, 29.2, 0, 0, 14, 135.8]
                        }
                    ]
                },

                {
                    backgroundColor: "#FFFFFF",
                    title: {
                        text: "货物结构百分比",
                        subtext: "2016",
                        left: "center",
                        subtextStyle: {
                            fontSize: 18
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: false, readOnly: false }, // 数据试图是否在控件中显示
                            //magicType: {show: true, type: ['stack', 'tiled']},
                            //restore: {show: true},
                            saveAsImage: { show: true }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        // orient: 'vertical',
                        // top: 'middle',
                        bottom: 20,
                        left: "center",
                        data: ["直达", "中转", "联程", "邮件"],
                        show: false // legend 不显示
                    },
                    series: [
                        {
                            name: "Cargo Source",
                            type: "pie",
                            avoidLabelOverlap: false,
                            radius: "50%",
                            center: ["50%", "58%"],
                            selectedMode: "single",
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: "10"
                                        //fontWeight: 'bold'
                                    },
                                    formatter: "{b} : {d}%",
                                    position: "outer"
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: "25",
                                        fontWeight: "bold"
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            },
                            data: [
                                { name: "直达", value: 61.8 },
                                { name: "联程", value: 13.2 },
                                { name: "中转", value: 24.2 },
                                { name: "邮件", value: 0.8 }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                },

                {
                    backgroundColor: "#FFFFFF",
                    title: {
                        text: "CAN-LAX的销售结构 in 2017",
                        //left:'center',              // title位置
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: false, readOnly: false }, // 数据试图是否在控件中显示
                            //magicType: {show: true, type: ['stack', 'tiled']},
                            //restore: {show: true},
                            saveAsImage: { show: true }
                        }
                    },
                    legend: {
                        data: ["直达", "中转", "联程", "邮件"],
                        top: "18"
                    },
                    grid: {
                        left: "2%",
                        right: "9%",
                        bottom: "3%",
                        containLabel: true,
                        show: false // 网格边框是否显示，上和右边框
                    },

                    xAxis: [
                        {
                            type: "category",
                            splitLine: {
                                // 网格线 x轴对应的是否显示
                                show: false
                            },
                            data: [
                                "1月",
                                "2月",
                                "3月",
                                "4月",
                                "5月",
                                "6月",
                                "7月",
                                "8月",
                                "9月",
                                "10月",
                                "11月",
                                "12月"
                            ]
                        }
                    ],

                    yAxis: [
                        {
                            name: "Revenue(10k)",
                            type: "value",
                            splitLine: {
                                // 网格线 y轴对应的是否显示
                                show: false
                            },
                            axisLabel: {
                                formatter: "{value}"
                            }
                        }
                    ],

                    series: [
                        {
                            name: "直达",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#01949B" }
                            },

                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},

                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },

                            data: [
                                1504.2,
                                622.8,
                                2132,
                                3668.6,
                                3797.3,
                                3632.8,
                                2716,
                                2320.6,
                                3288.1,
                                3220,
                                3911.4,
                                2942
                            ]
                        },
                        {
                            name: "中转",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#EBA954" }
                            },
                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [
                                861.7,
                                196.6,
                                600.7,
                                836.2,
                                757.8,
                                804.2,
                                766.3,
                                797,
                                677.5,
                                734.2,
                                1363.5,
                                977.3
                            ]
                        },
                        {
                            name: "联程",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#C23531" }
                            },
                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [
                                240.6,
                                294.4,
                                202.6,
                                476.9,
                                308.3,
                                376.4,
                                334.7,
                                401,
                                514,
                                506.2,
                                766.2,
                                794.4
                            ]
                        },
                        {
                            name: "邮件",
                            type: "bar",
                            itemStyle: {
                                normal: { color: "#6495ED" }
                            },
                            //markPoint : {
                            //data : [
                            //{type : 'max', name : '最大值'},
                            //{type : 'min', name : '最小值'}
                            //]
                            //},
                            markLine: {
                                data: [{ type: "average", name: "平均值" }]
                            },
                            data: [
                                2.5,
                                49.1,
                                7.6,
                                192.9,
                                251,
                                252.3,
                                139.1,
                                172.5,
                                157.9,
                                143.4,
                                359.9,
                                274.7
                            ]
                        }
                    ]
                },

                {
                    backgroundColor: "#FFFFFF",
                    title: {
                        text: "货物结构百分比",
                        subtext: "2017",
                        left: "center",
                        subtextStyle: {
                            fontSize: 18
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: false, readOnly: false }, // 数据试图是否在控件中显示
                            //magicType: {show: true, type: ['stack', 'tiled']},
                            //restore: {show: true},
                            saveAsImage: { show: true }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        // orient: 'vertical',
                        // top: 'middle',
                        bottom: 20,
                        left: "center",
                        data: ["直达", "中转", "联程", "邮件"],
                        show: false // legend 不显示
                    },
                    series: [
                        {
                            name: "Cargo Source",
                            type: "pie",
                            avoidLabelOverlap: false,
                            radius: "50%",
                            center: ["50%", "58%"],
                            selectedMode: "single",
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: "10"
                                        //fontWeight: 'bold'
                                    },
                                    formatter: "{b} : {d}%",
                                    position: "outer"
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: "25",
                                        fontWeight: "bold"
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            },
                            data: [
                                { name: "直达", value: 66.1 },
                                { name: "联程", value: 11.1 },
                                { name: "中转", value: 19.1 },
                                { name: "邮件", value: 3.7 }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                }
            ];
            var chart1 = document.getElementById("Charts1");
            var Chart1 = echarts.init(chart1);
            Chart1.setOption(option[0]);
            var chart2 = document.getElementById("Charts2");
            var Chart2 = echarts.init(chart2);
            Chart2.setOption(option[1]);
            var chart3 = document.getElementById("Charts3");
            var Chart3 = echarts.init(chart3);
            Chart3.setOption(option[2]);
            var chart4 = document.getElementById("Charts4");
            var Chart4 = echarts.init(chart4);
            Chart4.setOption(option[3]);
            var chart5 = document.getElementById("Charts5");
            var Chart5 = echarts.init(chart5);
            Chart5.setOption(option[4]);
            var chart6 = document.getElementById("Charts6");
            var Chart6 = echarts.init(chart6);
            Chart6.setOption(option[5]);
        },
        methods:{
            toggle() {
                this.$refs["fullscreen"].toggle(); // recommended
                // this.fullscreen = !this.fullscreen // deprecated
            },
            fullscreenChange(fullscreen) {
                this.fullscreen = fullscreen;
            },
        }
    };
</script>
<style scoped>
    /* .el-row {
      margin-bottom: 10px;
    } */
    .fullscreen {
        background: #fff !important;
    }
    .el-row :last-child {
        margin-bottom: 0;
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #eff0f1;
    }
    .bg-purple {
        background: #fff;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 90px;
    }
    .grid-content-big {
        border-radius: 4px;
        min-height: 330px;
    }
    .grid {
        border-radius: 4px;
        min-height: 230px;
    }
    .grid-one {
        border-radius: 4px;
        min-height: 80px;
    }
    #Charts1,
    #Charts2,
    #Charts3,
    #Charts4,
    #Charts5,
    #Charts6 {
        height: 290px;
        width: 100%;
    }
    .title {
        font-size: 25px;
        color: #555574;
        font-weight: 500;
        padding-top: 20px;
        padding-bottom: 20px
    }
    .style{
        text-align: center;
        padding: 20px;
    }
    .button{
        float: right;
        margin-right: 10px;
    }
</style>
