<template>
    <div class="scroll">
        <div id="echarts"></div>
    </div>
</template>

<script>
    // import "static/js/macarons.js";
    // import "static/js/roma.js";
    // import "static/js/vintage.js";
    // import "static/js/infographic.js";
    import echarts from "echarts";
    export default {
        data() {
            return {
                theme: "vintage",
                fx: ["01、03", "02", "04", "05", "06", "07", "08"],
                fxdata: [],
                data: {
                    同济大学: [
                        [26, 17, 7, 0, 17, 7, 2],
                        [10, 8, 1, 2, 12, 7, 0],
                        [
                            [
                                252.0,
                                245.0,
                                251.0,
                                262.0,
                                249.0,
                                253.0,
                                255.0,
                                228.0,
                                229.0,
                                246.0,
                                253.0,
                                225.0,
                                237.0,
                                243.0,
                                234.0,
                                231.0,
                                235.0,
                                223.0,
                                230.0,
                                233.0,
                                228.0,
                                243.0,
                                229.0,
                                237.0,
                                223.0,
                                226.0
                            ],
                            [
                                249.8,
                                257.5,
                                252.5,
                                256.5,
                                243.3,
                                241.8,
                                251.8,
                                249.8,
                                248.0,
                                253.2,
                                249.3,
                                255.0,
                                247.2,
                                251.3,
                                249.5,
                                240.2,
                                248.2
                            ],
                            [304.0, 286.0, 291.0, 295.0, 281.0, 271.0, 277.0],
                            [],
                            [
                                293.5,
                                256.8,
                                267.5,
                                294.5,
                                277.6,
                                273.5,
                                296.0,
                                264.7,
                                276.6,
                                267.5,
                                264.2,
                                262.2,
                                268.9,
                                266.7,
                                290.0,
                                298.0,
                                256.0
                            ],
                            [265.0, 292.0, 271.0, 265.0, 284.0, 261.0, 274.0],
                            [263.3, 285.5]
                        ]
                    ],
                    中南大学: [
                        [3, 4, 3, 0, 1, 1, 0],
                        [1, 6, 2, 0, 7, 3, 0],
                        [
                            [233.0, 236.0, 225.0],
                            [244.7, 240.8, 245.5, 255.0],
                            [279.0, 287.0, 274.0],
                            [],
                            [260.0],
                            [265.0],
                            []
                        ]
                    ],
                    郑州大学: [
                        [3, 1, 1, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[231.0, 240.0, 242.0], [242.5], [285.0], [], [], [], []]
                    ],
                    哈尔滨工业大学: [
                        [2, 0, 0, 0, 0, 0, 0],
                        [2, 0, 0, 0, 0, 0, 0],
                        [[253.0, 233.0], [], [], [], [], [], []]
                    ],
                    东南大学: [
                        [0, 1, 0, 0, 2, 2, 0],
                        [1, 0, 2, 0, 2, 0, 0],
                        [[], [243.7], [], [], [283.2, 265.7], [272.0, 264.0], []]
                    ],
                    西南交通大学: [
                        [2, 2, 2, 3, 6, 4, 1],
                        [0, 3, 3, 2, 6, 2, 2],
                        [
                            [225.0, 238.0],
                            [240.2, 242.7],
                            [276.0, 269.0],
                            [244.0, 231.0, 253.0],
                            [303.0, 279.6, 258.0, 263.9, 271.2, 255.5],
                            [261.0, 279.0, 265.0, 269.0],
                            [263.1]
                        ]
                    ],
                    湖南大学: [
                        [2, 0, 0, 0, 0, 0, 0],
                        [1, 0, 1, 0, 0, 0, 0],
                        [[226.0, 223.0], [], [], [], [], [], []]
                    ],
                    吉林大学: [
                        [2, 0, 3, 0, 1, 0, 0],
                        [4, 0, 1, 0, 2, 1, 1],
                        [[236.0, 231.0], [], [278.0, 293.0, 268.0], [], [276.7], [], []]
                    ],
                    长安大学: [
                        [6, 0, 0, 0, 2, 0, 0],
                        [5, 1, 0, 0, 3, 0, 0],
                        [
                            [227.0, 245.0, 251.0, 230.0, 237.0, 247.0],
                            [],
                            [],
                            [],
                            [255.0, 256.0],
                            [],
                            []
                        ]
                    ],
                    西北工业大学: [
                        [1, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[250.0], [], [], [], [], [], []]
                    ],
                    沈阳建筑大学: [
                        [1, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[227.0], [], [], [], [], [], []]
                    ],
                    华中科技大学: [
                        [1, 0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[223.0], [], [], [], [300.0], [], []]
                    ],
                    重庆交通大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    山东大学: [
                        [0, 1, 1, 0, 0, 0, 1],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[], [244.7], [276.0], [], [], [], [262.5]]
                    ],
                    宁波大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    大连理工大学: [
                        [1, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[244.0], [], [], [], [], [], []]
                    ],
                    东北林业大学: [
                        [0, 0, 0, 0, 1, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [], [258.0], [], []]
                    ],
                    石河子大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    中国矿业大学: [
                        [1, 2, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[225.0], [252.8, 247.0], [], [], [], [], []]
                    ],
                    中国民航大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    内蒙古大学: [
                        [1, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[227.0], [], [], [], [], [], []]
                    ],
                    "中国地质大学（北京）": [
                        [0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    重庆大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    武汉理工大学: [
                        [0, 0, 0, 0, 0, 1, 0],
                        [0, 1, 0, 0, 1, 0, 0],
                        [[], [], [], [], [], [265.0], []]
                    ],
                    北京交通大学: [
                        [0, 1, 0, 1, 1, 1, 0],
                        [0, 0, 0, 0, 2, 1, 0],
                        [[], [245.2], [], [234.0], [263.6], [261.0], []]
                    ],
                    华南理工大学: [
                        [0, 0, 2, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[], [], [273.0, 270.0], [], [], [], []]
                    ],
                    "哈尔滨工业大学（威海）": [
                        [0, 0, 1, 0, 2, 0, 0],
                        [0, 0, 0, 1, 2, 0, 0],
                        [[], [], [270.0], [], [263.4, 261.0], [], []]
                    ],
                    中山大学: [
                        [0, 0, 1, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[], [], [287.0], [], [], [], []]
                    ],
                    中国农业大学: [
                        [0, 0, 1, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[], [], [268.0], [], [], [], []]
                    ],
                    南京理工大学: [
                        [0, 0, 1, 2, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0, 0],
                        [[], [], [268.0], [244.0, 246.0], [], [], []]
                    ],
                    苏州大学: [
                        [0, 0, 0, 1, 1, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [243.0], [259.6], [], []]
                    ],
                    厦门大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    扬州大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    上海海事大学: [
                        [0, 0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [[], [], [], [230.0], [], [], []]
                    ],
                    北京林业大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    北京工业大学: [
                        [0, 0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 1, 0, 0, 0],
                        [[], [], [], [], [292.0], [], []]
                    ],
                    南京工业大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    新疆大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 1, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    大连海事大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 2, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    兰州交通大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 1, 0, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    华东交通大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 1, 0],
                        [[], [], [], [], [], [], []]
                    ],
                    四川大学: [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 1],
                        [[], [], [], [], [], [], []]
                    ]
                },
                nodedata: [],
                university: "同济大学",
                alldata: []
            };
        },
        mounted() {
            var worldMapContainer = document.getElementById('echarts');
            console.log(worldMapContainer);
            console.log("abc");
            //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
            var resizeWorldMapContainer = function () {
                worldMapContainer.style.width = window.innerWidth-360 + 'px';
                worldMapContainer.style.height = window.innerHeight + 'px';
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
            console.log(this.fx);
            for (var i = 0; i < this.fx.length; i++) {
                this.fxdata.push({
                    name: this.fx[i],
                    max: 20
                });
            }
            var tempdata;
            for (let key in this.data) {
                tempdata = this.data[key][2];
                for (let i = 0; i < tempdata.length; i += 1) {
                    for (let j = 0; j < tempdata[i].length; j += 1) {
                        this.alldata.push([this.fx[i], tempdata[i][j]]);
                    }
                }
            }

            for (let key in this.data) {
                let totalnum =
                    this.data[key][0].reduce(function(a, b) {
                        return a + b;
                    }, 0) +
                    this.data[key][1].reduce(function(a, b) {
                        return a + b;
                    }, 0);
                if (key == this.university) {
                    this.nodedata.push({
                        name: key,
                        symbolSize: Math.max(totalnum, 7),
                        value: this.data[key][2],
                        label: {
                            color: "rgba(193,56,52,1)"
                        },
                        itemStyle: {
                            normal: {
                                color: "rgba(193,56,52,1)"
                            }
                        }
                    });
                } else {
                    this.nodedata.push({
                        name: key,
                        symbolSize: Math.max(totalnum, 3),
                        value: this.data[key][2],
                        label: {
                            color: "black"
                        },
                        itemStyle: {
                            normal: {
                                color: "rgba(51,71,85,1)"
                            }
                        }
                    });
                }
            }
            this.drawCharts();
        },
        methods: {

            getscoredata(university, tempdata) {
                var result = [];
                for (var i = 0; i < tempdata.length; i += 1) {
                    for (var j = 0; j < tempdata[i].length; j += 1) {
                        result.push([this.fx[i], tempdata[i][j]]);
                    }
                }
                return result;
            },
            drawCharts() {
                var university = this.university;
                var fx = this.fx;
                var data = this.data;
                var nodedata = this.nodedata;
                var alldata = this.alldata;
                console.log(fx);
                console.log(data);
                console.log(nodedata);
                console.log(alldata);
                console.log(this.fx);
                var dom = document.getElementById("echarts");
                console.log(dom);
                var myChart = echarts.init(dom, this.theme);
                console.log(myChart);
                myChart.setOption({
                    title: {
                        text: "18同济交通夏令营录取情况",
                        subtext: university,
                        x: "center"
                    },
                    backgroundColor: "#eee",
                    legend: {
                        data: ["录取", "不录取"],
                        align: "left",
                        left: 10
                    },
                    toolbox: {
                        feature: {
                            magicType: {
                                type: ["stack", "tiled"]
                            },
                            dataView: {}
                        }
                    },
                    tooltip: {},
                    xAxis: [
                        {
                            data: fx,
                            name: "方向",
                            silent: false,
                            axisLine: {
                                onZero: true
                            },
                            splitLine: {
                                show: false
                            },
                            splitArea: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            data: fx,
                            name: "方向",
                            silent: false,
                            axisLine: {
                                onZero: true
                            },
                            splitLine: {
                                show: false
                            },
                            splitArea: {
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            max: 35,
                            name: "人数",
                            inverse: false,
                            splitArea: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            name: "复试总分",
                            max: 300,
                            min: 210,
                            inverse: false,
                            splitArea: {
                                show: false
                            }
                        }
                    ],
                    grid: [
                        {
                            left: 50,
                            name: "人数",
                            top: "10%",
                            height: "40%",
                            width: "40%"
                        },
                        {
                            left: 50,
                            name: "人数",
                            top: "60%",
                            height: "35%",
                            width: "40%"
                        }
                    ],
                    series: [
                        {
                            name: "录取",
                            type: "bar",
                            stack: "one",
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            data: data[university][0],
                            label: {
                                normal: {
                                    show: true,
                                    position: "inside"
                                }
                            }
                        },
                        {
                            name: "不录取",
                            type: "bar",
                            stack: "one",
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            data: data[university][1],
                            label: {
                                normal: {
                                    show: true,
                                    position: "inside"
                                }
                            }
                        },

                        {
                            type: "graph",
                            layout: "force",
                            left: "40%",
                            right: "0%",
                            top: "10%",
                            bottom: "50%",

                            focusNodeAdjacency: true, //鼠标覆盖高亮显示节点及关系名称
                            roam: "move", //是否开启滚轮缩放和拖拽漫游,默认为false（关闭），其他有效输入为true（开启），'scale'（仅开启滚轮缩放），'move'（仅开启拖拽漫游）
                            data: nodedata,
                            label: {
                                normal: {
                                    position: "top",
                                    show: true,
                                    textStyle: {
                                        color: "rgba(18,89,147,1)",
                                        fontSize: 12
                                    }
                                }
                            },
                            force: {
                                repulsion: 70
                            },
                            links: [],
                            tooltip: {
                                formatter: function(d) {
                                    var temp = data[d.data.name];
                                    var totalnum =
                                        temp[0].reduce(function(a, b) {
                                            return a + b;
                                        }, 0) +
                                        temp[1].reduce(function(a, b) {
                                            return a + b;
                                        }, 0);

                                    return d.name + "参加人数:" + totalnum;
                                }
                            }
                        },

                        {
                            type: "pie",
                            radius: [0, "30%"],
                            center: ["70%", "75%"],
                            data: [
                                {
                                    name: "录取",
                                    value: data[university][0].reduce(function(a, b) {
                                        return a + b;
                                    }, 0)
                                },
                                {
                                    name: "不录取",
                                    value: data[university][1].reduce(function(a, b) {
                                        return a + b;
                                    }, 0)
                                }
                            ],
                            label: {
                                normal: {
                                    formatter: "{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
                                    backgroundColor: "#eee",
                                    borderColor: "#aaa",
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    // shadowBlur:3,
                                    // shadowOffsetX: 2,
                                    // shadowOffsetY: 2,
                                    // shadowColor: '#999',
                                    // padding: [0, 7],
                                    rich: {
                                        a: {
                                            color: "#999",
                                            lineHeight: 22,
                                            align: "center"
                                        },
                                        // abg: {
                                        //     backgroundColor: '#333',
                                        //     width: '100%',
                                        //     align: 'right',
                                        //     height: 22,
                                        //     borderRadius: [4, 4, 0, 0]
                                        // },
                                        hr: {
                                            borderColor: "#aaa",
                                            width: "100%",
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                        per: {
                                            color: "#eee",
                                            backgroundColor: "#334455",
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            }
                        },
                        {
                            name: "初选全部",
                            type: "scatter",

                            symbolSize: 8,
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: alldata,
                            label: {
                                normal: {
                                    show: false,
                                    position: "inside"
                                }
                            }
                        },
                        {
                            name: "录取",
                            type: "scatter",
                            symbol: "arrow",
                            symbolSize: 7,
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: this.getscoredata(university, data[university][2]),
                            label: {
                                normal: {
                                    show: false,
                                    position: "inside"
                                }
                            }
                        }
                    ]
                });

                myChart.on("click", function(p) {
                    // var self = this;
                    console.log(fx);
                    console.log(p);
                    if (p.seriesType == "graph") {
                        var university = p.name;
                        var nodedata = [];
                        var piedata = [];
                        var scatterdata = [];
                        for (var key in data) {
                            var totalnum =
                                data[key][0].reduce(function(a, b) {
                                    return a + b;
                                }, 0) +
                                data[key][1].reduce(function(a, b) {
                                    return a + b;
                                }, 0);

                            if (key == university) {
                                nodedata.push({
                                    name: key,
                                    symbolSize: Math.max(totalnum, 7),
                                    value: data[key][2],
                                    label: {
                                        color: "rgba(193,56,52,1)"
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: "rgba(193,56,52,1)"
                                        }
                                    }
                                });
                                piedata = [
                                    {
                                        name: "录取",
                                        value: data[university][0].reduce(function(a, b) {
                                            return a + b;
                                        }, 0)
                                    },
                                    {
                                        name: "不录取",
                                        value: data[university][1].reduce(function(a, b) {
                                            return a + b;
                                        }, 0)
                                    }
                                ];
                                var getscoredata = function(university, tempdata) {
                                    var result = [];
                                    for (var i = 0; i < tempdata.length; i += 1) {
                                        for (var j = 0; j < tempdata[i].length; j += 1) {
                                            result.push([fx[i], tempdata[i][j]]);
                                        }
                                    }
                                    return result;
                                };
                                scatterdata = getscoredata(university, data[university][2]);
                            } else {
                                nodedata.push({
                                    name: key,
                                    symbolSize: Math.max(totalnum, 3),
                                    value: data[key][2],
                                    label: {
                                        color: "black"
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: "rgba(51,71,85,1)"
                                        }
                                    }
                                });
                            }
                        }
                        myChart.setOption({
                            title: {
                                subtext: university
                            },
                            series: [
                                {
                                    data: data[university][0]
                                },
                                {
                                    data: data[university][1]
                                },
                                {
                                    data: nodedata
                                },
                                {
                                    data: piedata
                                },
                                {},
                                {
                                    data: scatterdata
                                }
                            ]
                        });
                    }
                });
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
