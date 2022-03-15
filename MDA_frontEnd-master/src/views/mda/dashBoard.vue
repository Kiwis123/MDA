<template>
    <div>
        <grid-layout
                :layout.sync="layout"
                :col-num="30"
                :row-height="12"
                :is-draggable="false"
                :is-resizable="false"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[30, 50]"
                :use-css-transforms="true"
        >
            <grid-item v-for="item in layout" style="background-color: white"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.i"
                       :key="item.i">
                <div v-if="item.i < 5">
                    <index-card :card="cards[item.i]"></index-card>
                </div>
                <div v-if="item.i == 5" id="pie" style="width: 417px; height: 446px"></div>
                <div v-if="item.i == 6" id="bar" style="width: 584px; height: 446px"></div>
                <div v-if="item.i == 7" id="line" style="width: 584px; height: 446px"></div>
            </grid-item>
        </grid-layout>
    </div>
</template>

<script>

    import VueGridLayout from 'vue-grid-layout';
    import IndexCard from './indexCard';
    import echarts from "echarts";
    import axios from "axios";

    export default {
        components: {
            'index-card': IndexCard,
        },
        data() {
            return {
                // 布局
                layout: [
                    // 上半区5个指标卡
                    {"x":0,"y":0,"w":6,"h":4,"i":"0"},
                    {"x":6,"y":0,"w":6,"h":4,"i":"1"},
                    {"x":12,"y":0,"w":6,"h":4,"i":"2"},
                    {"x":18,"y":0,"w":6,"h":4,"i":"3"},
                    {"x":24,"y":0,"w":6,"h":4,"i":"4"},
                    // 下半区三个图
                    {"x":0,"y":4,"w":8,"h":8,"i":"5"},
                    {"x":8,"y":4,"w":11,"h":8,"i":"6"},
                    {"x":19,"y":4,"w":11,"h":8,"i":"7"},
                ],
                pieOption: {}, // 饼图option
                barOption: {}, // 柱状图option
                lineOption: {}, // 折线图option

                // 指标卡数据
                cards: [
                    {title: "总查询次数", value: "3048", changeType: "not-visable", changeValue: ""},
                    {title: "平均查询时延", value: "2.63s", changeType: "change-down", changeValue: "0.42s"},
                    {title: "Cube个数", value: "8", changeType: "change-up", changeValue: "1"},
                    {title: "Cube体积", value: "882.3GB", changeType: "change-up", changeValue: "64GB"},
                    {title: "Cube平均膨胀率", value: "214%", changeType: "change-down", changeValue: "19%"},
                ],
            }
        },
        mounted() {

            // 饼图数据
            this.pieOption = {
                title: {
                    text: '各引擎总查询次数占比',
                        left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                        left: 'left',
                        data: ['Kylin', 'Spark SQL', 'Impala', 'MapReduce']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 1677, name: 'Kylin'},
                            {value: 685, name: 'Spark SQL'},
                            {value: 417, name: 'Impala'},
                            {value: 269, name: 'MapReduce'},
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            var pieChart = echarts.init(document.getElementById("pie"));


            // 柱状图数据
            this.barOption = {
                title: {
                    text: '各引擎查询次数&平均查询时延',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['查询次数', '平均查询时延'],
                    top: 30
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: ['Kylin', 'Spark SQL', 'Impala', 'Map Reduce']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '查询次数',
                        position: 'left',
                        axisLabel: {
                            formatter: '{value} 次'
                        }
                    },
                    {
                        type: 'value',
                        name: '平均查询时延',
                        position: 'right',
                        axisLabel: {
                            formatter: '{value} 秒'
                        }
                    }
                ],
                series: [
                    {
                        name: '查询次数',
                        type: 'bar',
                        data: [1677, 685, 417, 269]
                    },
                    {
                        name: '平均查询时延',
                        type: 'bar',
                        yAxisIndex: 1,
                        data: [1.51, 5.44, 2.73, 127.96]
                    }
                ]
            };
            var barChart = echarts.init(document.getElementById("bar"));
            barChart.setOption(this.barOption);

            // 折线图数据（使用dataZoom）
            this.lineOption = {
                title: {
                    text: 'Cubep膨胀率&Kylin查询时延变化 ',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['Cube膨胀率', 'Kylin查询时延'],
                    top: 30
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: ['2020.2', '2020.3', '2020.4', '2020.5', '2020.6']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Cube膨胀率',
                        position: 'left',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    },
                    {
                        type: 'value',
                        name: 'Kylin查询时延',
                        position: 'right',
                        axisLabel: {
                            formatter: '{value} 秒'
                        }
                    }
                ],
                series: [
                    {
                        name: 'Cube膨胀率',
                        type: 'line',
                        data: [351, 288, 323, 256, 214]
                    },
                    {
                        name: 'Kylin查询时延',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [1.12, 2.03, 1.75, 1.59, 1.51]
                    }
                ]
            };
            var lineChart = echarts.init(document.getElementById("line"));
            lineChart.setOption(this.lineOption);

            // 修改数据：指标卡1、饼图
            this.queryCount(pieChart);
            // 修改数据：指标卡2
            this.getQueryLatencyByMonth();
            // 修改数据：指标卡3、4、5
            this.getCubeStatusByMonth();
            // 修改数据：折线图
            this.getExpansionAndLatencyByMultipleMonth(lineChart);
            // 修改数据：柱状图
            this.getQueryCountAndLatencyByQueryEngine(barChart);
        },
        methods: {
            // 从后台获取：总查询次数&各引擎查询次数
            queryCount(pieChart){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/dashboard/queryCount",
                        {
                            params: {
                                projectId: 1,
                            }
                        },
                    )
                    .then(function (response) {
                        let queryCount = response.data.datum;
                        // 给1号指标卡赋值
                        that.cards[0].value = queryCount.total;
                        // 给饼图赋值
                        let xaxis = [];
                        let seriesData = [];
                        for (let key in queryCount) {
                            if (key != "total") {
                                xaxis.push(key);
                                seriesData.push({value: queryCount[key], name: key});
                            }
                        }
                        that.pieOption.legend.data = xaxis;
                        that.pieOption.series[0].data = seriesData;
                        pieChart.setOption(that.pieOption);
                    })
            },
            // 从后台获取：按月统计的平均查询时延，月环比增长率
            getQueryLatencyByMonth(){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/dashboard/getQueryLatencyByMonth",
                        {
                            params: {
                                projectId: 1,
                            }
                        },
                    )
                    .then(function (response) {
                        let queryLatencyByMonth = response.data.datum;
                        // 给2号指标卡赋值
                        that.cards[1].value = queryLatencyByMonth.value;
                        that.cards[1].changeType = queryLatencyByMonth.changeType;
                        that.cards[1].changeValue = queryLatencyByMonth.changeValue;
                    })
            },
            // 从后台获取：按月统计的Cube个数、大小、平均膨胀率，并计算环比增长【当前状态与近一个月的比较】
            getCubeStatusByMonth(){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/dashboard/getCubeStatusByMonth",
                        {
                            params: {
                                projectId: 1,
                            }
                        },
                    )
                    .then(function (response) {
                        let cubeStatusByMonth = response.data.datum;
                        // 给3、4、5号指标卡赋值
                        for (let i = 0; i < 3; i++) {
                            that.cards[i + 2].value = cubeStatusByMonth[i].value;
                            that.cards[i + 2].changeType = cubeStatusByMonth[i].changeType;
                            that.cards[i + 2].changeValue = cubeStatusByMonth[i].changeValue;
                        }
                    })
            },
            // 从后台获取：多个月份的膨胀率、平均查询时延
            getExpansionAndLatencyByMultipleMonth(lineChart){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/dashboard/getExpansionAndLatencyByMultipleMonth",
                        {
                            params: {
                                projectId: 1,
                            }
                        },
                    )
                    .then(function (response) {
                        let expansionAndLatencyByMultipleMonth = response.data.datum;
                        // 给折线图赋值
                        that.lineOption.xAxis[0].data = expansionAndLatencyByMultipleMonth.month;
                        that.lineOption.series[0].data = expansionAndLatencyByMultipleMonth.expansionRate;
                        that.lineOption.series[1].data = expansionAndLatencyByMultipleMonth.queryLatency;
                        lineChart.setOption(that.lineOption);
                    })
            },
            // 从后台获取：各查询引擎对应的查询次数、平均查询时延
            getQueryCountAndLatencyByQueryEngine(barChart){
                // 保留外层的this指向
                let that = this;
                axios
                    .get(
                        "http://localhost:6993/dashboard/getQueryCountAndLatencyByQueryEngine",
                        {
                            params: {
                                projectId: 1,
                            }
                        },
                    )
                    .then(function (response) {
                        let queryCountAndLatencyByQueryEngine = response.data.datum;
                        console.log(queryCountAndLatencyByQueryEngine);
                        // 给折线图赋值
                        that.barOption.xAxis[0].data = queryCountAndLatencyByQueryEngine.queryEngine;
                        that.barOption.series[0].data = queryCountAndLatencyByQueryEngine.queryCount;
                        that.barOption.series[1].data = queryCountAndLatencyByQueryEngine.queryLatency;
                        console.log(that.barOption);
                        barChart.setOption(that.barOption);
                    })
            },
        }
    }
</script>

<style scoped>

</style>
