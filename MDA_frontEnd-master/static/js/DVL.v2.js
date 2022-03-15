var DVL = function (selector, data, index, fresh) {
    $selector = $(selector);
    fresh = fresh || false;
    index = parseInt(index);
    switch (index) {
        case 1:
            return setPie($selector, data, fresh); // 饼图
            break;
        case 2:
            return setLine($selector, data, fresh); // 折线
            break;
        case 3:
            return setBar($selector, data, fresh); // 柱形图
            break;
        case 8:
            return setMap($selector, data, fresh); //广东地图
            break;
        case 10:
            return setHorizBar($selector, data, fresh); // 横的柱状图
            break;
        case 11:
            return setAirMap($selector, data, fresh); //散点广东地图
            break;
        case 13:
            return setRadar($selector, data, fresh); //雷达图
            break;
        case 33:
            return setZebraBar($selector, data, fresh); //斑马柱状
            break;
        case 34:
            return setRing($selector, data, fresh); //环形图
            break;
        case 35:
            return setRose($selector, data, fresh); //玫瑰图
            break;
        case 36:
            return setSunburst($selector, data, fresh); //太阳图
            break;
        case 41:
            return setCHMap($selector, data, fresh); //中国地图
            break;
        case 37:
            return setRoseSort($selector, data, fresh); //旋转柱状图
            break;
        case 42:
            return setAirCHMap($selector, data, fresh); //散点中国地图
            break;
        case 38:
            return setBarMap($selector, data, fresh); //饼状地图
            break;
        case 44:
            return setTCHMap($selector, data, fresh); //动态中国地图
            break;
        case 46:
            return setBPdata($selector, data, fresh); //柱饼联动图
            break;
        case 39:
            return setStackedBar($selector, data, fresh); //堆积条形图
            break;
        case 20:
            return setBoxPlot($selector, data, fresh); //箱形图和柱状图
            break;
        case 47:
            return setDPie($selector, data, fresh); //太阳图
            break;
        case 48:
            return setArcBar($selector, data, fresh); //弧形柱图
            break;
        case 49:
            return setLineBar($selector, data, fresh); //折线柱图
            break;
        case 51:
            return setwordCloud($selector, data, fresh); //字符云
            break;
        case 66:
            return setPoint($selector, data, fresh); //散点图
            break;
        case 68:
            return setMutilRadar($selector, data, fresh); //多维雷达图
            break;
        case 69:
            return setArea($selector, data, fresh); //面积图
            break;

        default:
            console.log("default");
    }
};

function setPoint($selector, data, fresh) {
    // var pointdata = model.change(data, 66)
    var series = []
    var innerData = []
    oj = data.objects
    for (var i = 0; i < oj.length; i++) {
        var name = oj[i];
        series.push(data.relations[name][0][0]);
        innerData.push([
            oj[i], 
            data.relations[name][0][0]
        ]);
    }//[x,y]
    
    pointData = {
        title: data.title,
        describe: data.describe,
        objects: data.title,
        series: [{name: data.title, data: series}],
        property: data.objects,
        
    }
    if (data.color) pointData.color = data.color;

    var id = data.viewId || 'main';
    console.log(data)
    var html = '<div class="view-area-box" id="' + id + '" style=""></div>'
    $selector.html(html)
    var main = document.getElementById(id)
    
    // here is drawPoint
    var chart = echarts.init(main)
    var option = {
        // color: [
        //     '#fec42c'
        // ],
        title: {
            text: pointData.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '20%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [
                // {
                //     type: 'rect',
                //     left: 'center',
                //     top: 'center',
                //     z: 100,
                //     shape: {
                //         width: 300,
                //         height: 35
                //     },
                //     style: {
                //         fill: 'rgba(0,0,0,0.3)'
                //     }
                // },
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                    }
                }
            ]
        }],
        tooltip: {
            trigger: 'axis',
            formatter: '{b} : {c} ',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                color: '#fff'
            },
        },
        legend: {
            orient: 'vertical',
            right: '2%',
            top: 'center',
            width: 'auto',
            height: 'auto',
            data: pointData.objects,
            textStyle: {
                color: '#fff'
            },
        },
        calculable: true,
        xAxis: [{
            // type: 'category',
            data: pointData.property,
            axisLabel: {
                rotate: 0,
                interval: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false
            },
        }],
        yAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLabel: {
                formatter: '{value}'
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        series: [{
            symbolSize: 20,
            data: innerData,
            type: 'scatter'
            ,
            itemStyle:{
            normal: {
                color: '#fec42c'
            }
        }
    }
    ]
    }
    return option
}

function setMutilRadar($selector, data, fresh) {
    var series = []
    var innerData = []
    obj = data.objects
    for (i = 0; i<data.relations[obj[0]].length; i++) {series.push({"name": data.relations[obj[0]][i][0], "value": []})}

    for (var i = 0; i < obj.length; i++) {
        for (j = 0; j< series.length; j++) {
            series[j].value.push(data.relations[obj[i]][j][1])
        }
    }
    console.log("multiRadar", series)

    // var option = {
    //     title: {
    //         text: data.title
    //     },
    //     tooltip: {},
    //     legend: {
    //         data: obj 
    //     },
    //     radar: {
    //         // shape: 'circle',
    //         name: {
    //             textStyle: {
    //                 color: '#fff',
    //                 backgroundColor: '#999',
    //                 borderRadius: 3,
    //                 padding: [3, 5]
    //            }
    //         },
    //         indicator: obj.map(el => {return {"name": el}})
    //     },
    //     series: [{
    //         name: data.title,
    //         type: 'radar',
    //         // areaStyle: {normal: {}},
    //         data : series
    //     }]
    // }

    var option = {
        title: {
            text: data.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '20%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '30%',
            z: 100,
            children: [
                // {
                //     type: 'rect',
                //     left: 'center',
                //     top: 'center',
                //     z: 100,
                //     shape: {
                //         width: 300,
                //         height: 35
                //     },
                //     style: {
                //         fill: 'rgba(0,0,0,0.3)'
                //     }
                // },
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                    }
                }
            ]
        }],
        tooltip: {
            textStyle: {
                color: '#fff'
            },
        },
        legend: {
            // orient: 'vertical',
            // right: '2%',
            // top: 'center',
            // width: 'auto',
            // height: 'auto',
            data: obj,
            textStyle: {
                color: '#fff'
            },
        },
        calculable: true,
        // radar: {
        polar:[{
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
               }
            },
            center: ["50%", "60"],
            indicator: obj.map(el => {return {"name": el}})
        }],
        series: [{
            symbolSize: 20,
            data: series,
            type: 'radar'
        }]
    }
    return option;
}

function setArea($selector, data, fresh) {
    var linedata = model.change(data, 69);
    console.log(linedata);
    var id = data.viewId || 'main';
    if (linedata instanceof Array) {
        alert('here is Array')
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < linedata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + linedata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var lineData = linedata[index];
            return drawArea(main, lineData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        return drawArea(main, linedata);
    }
}

function drawArea(main, lineData) {
    // console.log(lineData);
    var series = lineData.series.map(function (item, index) {
        item.type = 'line';
        // item.smooth = true;
        item.areaStyle={};
        return item;
    });
    var chart = echarts.init(main);
    var option = {
        title: {
            text: lineData.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '20%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [
                // {
                //     type: 'rect',
                //     left: 'center',
                //     top: 'center',
                //     z: 100,
                //     shape: {
                //         width: 300,
                //         height: 35
                //     },
                //     style: {
                //         fill: 'rgba(0,0,0,0.3)'
                //     }
                // },
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                    }
                }
            ]
        }],
        //backgroundColor: '#2c343c',
        tooltip: {
            trigger: 'axis',
            formatter: '{b} : {c} ',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                color: '#fff'
            },
        },
        legend: {
            orient: 'vertical',
            // x: 'left',
            // y: 'top',
            right: '2%',
            top: 'center',
            width: 'auto',
            height: 'auto',
            data: lineData.objects,
            textStyle: {
                color: '#fff'
            },
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'top',
            // feature : {
            //     mark : {show: true},
            //     dataView : {show: true, readOnly: false},
            //     magicType : {show: true, type: ['line','stack','tiled', 'bar']},
            //     restore : {show: true},
            //     saveAsImage : {show: true}
            // }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: lineData.property,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                rotate: 0,
                interval: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLabel: {
                formatter: '{value}'
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        series: series
    };
    // chart.setOption(option, true);
    // return chart;
    return option;
}

function setDPie($selector, data, fresh) {
    var html = '<div class="view-area-box" id="main"></div>';
    $selector.html(html);
    var main = document.getElementById('main');
    if (match(data, 47)) {
        return drawDPie(main, data);
    }

};

function drawDPie(main, areaData) {

    var chart = echarts.init(main);
    console.log(areaData);
    var optionIm = {};
    var relationData1 = areaData.objects.map(function (elem, index) {
        return areaData.relations[elem];
    });
    var convertPie = function (Data) {
        var relation = [];
        for (var u = 0; u < Data.length; u++) {
            var res = [];
            var arr = [];
            // res[0].name = Data[u][0][0];
            // res[0].value.push({[name:Data[u][0][1],value:Data[u][0][2]]});
            for (var m = 0; m < Data[u].length; m++) {
                var flag = false;
                var t = 0;
                for (var n = 0; n < res.length; n++) {
                    if (Data[u][m][0] == res[n].name) {
                        flag = true;
                        t = n;
                    } else if (flag == false) {
                        t = res.length;
                    }
                }

                var demo1 = {
                    name: '',
                    value: []
                };
                if (((t == 0) && (res.length == 0)) || (t == res.length)) {
                    arr[t] = 0;
                    var demo = {
                        name: '',
                        value: []
                    };
                } else {
                    arr[t] += 1;
                }

                demo1.name = Data[u][m][1];
                demo1.value = Data[u][m][2];

                demo.name = Data[u][m][0];
                var length1 = demo.value.length;
                demo.value[arr[t]] = demo1;
                // console.log(t + "," + arr[t]);
                // console.log(demo1);  
                // console.log(demo.value);
                res[t] = demo;

            }
            relation[u] = res;
        }
        return relation;
    };
    var relationData2 = convertPie(relationData1);
    console.log(relationData2);

    var series = [{
        name: areaData.title,
        type: 'map',
        mapType: 'china', // 自定义扩展图表类型
        data: [],
        // symbolSize: function (val) {
        //     return val[2] / 300;
        // },
        label: {
            normal: {
                show: true,
                formatter: '{b}',
                position: 'right'

            },
            emphasis: {
                show: true
            }
        },
        itemStyle: {
            normal: {
                color: '#2694d5'
            }
        }
    }]
    var pieSeries = function (chart, data, option) {
        console.log(data);
        var op = chart.getOption();
        var res = option;
        var res0 = option.baseOption;
        var sd0 = res0.series;
        for (var j = 0; j < data[0].length; j++) {


            var randomValue = Math.round(Math.random() * 30);
            var radius = randomValue <= 10 ? 10 : randomValue;
            var geoCoord = geoCHMap[data[0][j].name];
            if (geoCoord) {
                var vr = [];
                (data[0][j].value).map(function (v, j) {
                    vr.push({
                        name: v.name,
                        value: v.value
                    });
                });
                // console.log(vr);

                // var p = convertGeo(chart,geoCoord);

                var p = chart.convertToPixel({
                    seriesIndex: '0'
                }, geoCoord);
                // console.log(p);
                // console.log(geoCoord);
                sd0.push({
                    name: data[0][j].name,
                    type: 'pie',
                    tooltip: {
                        formatter: function (params) {
                            return params.seriesName + "<br/>" + params.name + " : " + params.value;
                        }
                    },
                    radius: ['5%', '6.5%'],
                    center: p,
                    data: vr,
                    // zlevel:4,
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        mormal: {
                            opacity: -10
                        }
                    }
                });

            }
        }
        var res1 = option.options;
        console.log(res1);
        for (var m = 0; m < data.length; m++) {
            console.log(res1[m]);
            var op = chart.getOption();
            var sd = res1[m].series;
            for (var n = 0; n < data[m].length; n++) {


                var randomValue = Math.round(Math.random() * 30);
                var radius = randomValue <= 10 ? 10 : randomValue;
                var geoCoord = geoCHMap[data[m][n].name];
                if (geoCoord) {
                    var vr = [];
                    (data[m][n].value).map(function (v, j) {
                        vr.push({
                            name: v.name,
                            value: v.value
                        });
                    });
                    console.log(vr);
                    // var p = convertGeo(main,geoCoord);
                    var p = chart.convertToPixel({
                        seriesIndex: '0'
                    }, geoCoord);

                    sd.push({
                        name: data[m][n].name,
                        type: 'pie',
                        tooltip: {
                            formatter: function (params) {
                                return params.seriesName + "<br/>" + params.name + " : " + params.value;
                            }
                        },
                        radius: ['5%', '6.5%'],
                        center: p,
                        data: vr,
                        // zlevel:4,
                        label: {
                            normal: {
                                show: false,
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            mormal: {
                                opacity: -10
                            }
                        }
                    });

                }
            }

        }
        return res;
    };
    // var series1=pieSeries(relationData2);
    // console.log(series1);

    $.ajax({
        url: '../../static/json/china.json',
        async: false,
        type: "GET",
        success: function (geoJson) {

            echarts.registerMap('china', geoJson);
            var option = {
                baseOption: {
                    timeline: {
                        axisType: 'value',
                        // orient: 'vertical',
                        autoPlay: true,
                        inverse: true,
                        playInterval: 3000,
                        // left: 20%,
                        // right: 0,
                        // top: 20,
                        // bottom: 20,
                        width: "50%",
                        x: '30%',
                        x2: '30%',
                        // height: null,

                        label: {
                            normal: {
                                textStyle: {
                                    color: '#ffffff'
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        symbol: 'none',
                        lineStyle: {
                            color: '#ffffff'
                        },
                        checkpointStyle: {
                            color: '#bbb',
                            borderColor: '#777',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            normal: {
                                color: '#ffffff',
                                borderColor: '#ffffff'
                            },
                            emphasis: {
                                color: '#aaa',
                                borderColor: '#aaa'
                            }
                        },
                        data: areaData.objects
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '20%',
                        containLabel: true
                    },
                    graphic: [{
                        type: 'group',
                        // rotation: Math.PI / 4,
                        bounding: 'raw',
                        left: 100,
                        bottom: 20,
                        z: 100,
                        children: [{
                            type: 'text',
                            left: 'center',
                            top: 'center',
                            z: 100,
                            style: {
                                fill: '#fff',
                                text: [],
                                font: '10px Microsoft YaHei'
                            }
                        }]
                    }],
                    title: {
                        text: areaData.title,
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}<br/>{c} '
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        top: 'center',
                    },
                    geo: {
                        map: 'china',
                        geoIndex: 0,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series: [{
                        name: areaData.title,
                        type: 'map',
                        id: '1',
                        mapType: 'china', // 自定义扩展图表类型
                        data: [],
                        // symbolSize: function (val) {
                        //     return val[2] / 300;
                        // },
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}',
                                position: 'right'

                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#2694d5'
                            }
                        }
                    }]
                },
                options: []
            }
            var data = areaData;
            console.log(data);
            for (var n = 0; n < data.objects.length; n++) {
                option.options.push({
                    title: {
                        show: true,
                        'text': areaData.title
                    },

                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '20%',
                        containLabel: true
                    },
                    graphic: [{
                        type: 'group',
                        // rotation: Math.PI / 4,
                        bounding: 'raw',
                        left: 100,
                        bottom: 20,
                        z: 100,
                        children: [{
                            type: 'text',
                            left: 'center',
                            top: 'center',
                            z: 100,
                            style: {
                                fill: '#fff',
                                text: [],
                                font: '10px Microsoft YaHei'
                            }
                        }]
                    }],
                    series: [{
                        name: areaData.title,
                        type: 'map',
                        mapType: 'china', // 自定义扩展图表类型
                        data: [],
                        // symbolSize: function (val) {
                        //     return val[2] / 300;
                        // },
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}',
                                position: 'right'

                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#2694d5'
                            }
                        }
                    }]

                })
                // console.log(convertCHData(relationData[n]));
                if (areaData.color) {
                    var colorarr = areaData.color;
                    if (colorarr[0]) option.options[n].series[0].itemStyle.normal.color = colorarr[0];
                    if (colorarr[1]) option.options[n].series[1].itemStyle.normal.color = colorarr[1];
                }

            }
            if (areaData.color) {
                var colorarr = areaData.color;
                if (colorarr[0]) {
                    option.baseOption.series[0].itemStyle.normal.color = colorarr[0];
                }
                if (colorarr[1]) {
                    option.baseOption.series[1].itemStyle.normal.color = colorarr[1];
                }
                if (colorarr[2]) {
                    option.baseOption.geo.itemStyle.normal.areaColor = colorarr[2];
                }
                if (colorarr[3]) {
                    option.baseOption.geo.itemStyle.normal.borderColor = colorarr[3];
                }
            }
            chart.setOption(option);
            pieSeries(chart, relationData2, option);
            console.log(option);

            optionIm = option;
            console.log(optionIm);

            // console.log(optionIm);
            // return (option);
            // console.log(option);

            // return option;
            // console.log(option.options.series)
            // var myChart = echarts.init(main);
            // myChart.setOption(option, true);
            // return (option);
        }
    })

    // alert("lll00");
    console.log(optionIm);

    return optionIm;
}

function setBoxPlot($selector, data, fresh) {
    var boxdata = model.change(data, 20);
    var id = data.viewId || 'main';
    var html = '<div class="view-area-box" id="' + id + '"></div>';
    $selector.html(html);
    var main = document.getElementById(id);
    return drawBoxPlot(main, boxdata);
}
var drawBoxPlot = function (main, data) {
    var chart = echarts.init(main);
    var errorData = [];
    var barData = [];
    var valData = [];

    for (var a = 0; a < data.series[0].data.length; a++) {
        barData.push(echarts.number.round(data.series[0].data[a]));
    }
    for (var b = 0; b < data.series[0].data.length; b++) {
        valData.push(echarts.number.round(data.boxdata[b]));
    }
    for (var i = 0; i < barData.length; i++) {
        var val = barData[i];
        var bar = valData[i];
        errorData.push([
            i,
            echarts.number.round(Math.max(0, val - bar)),
            echarts.number.round(val + bar),
        ]);
    }

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '20%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        title: {
            text: data.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            orient: 'vertical',
            right: '2%',
            top: 'center',
            width: 'auto',
            height: 'auto',
            data: ['均值', '标准差'],
            textStyle: {
                color: '#fff'
            }
        },
        xAxis: [{
            type: 'category',
            data: data.property,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        series: [{
            type: 'bar',
            name: '均值',
            data: barData,
            itemStyle: {
                normal: {
                    color: '#77bef7'
                }
            }
        }, {
            type: 'custom',
            name: '标准差',
            itemStyle: {
                normal: {
                    borderWidth: 1.5
                }
            },
            renderItem: function renderItem(params, api) {
                var style = api.style({
                    stroke: api.visual('color'),
                    fill: null
                });
                return {
                    type: 'group',
                    children: [{
                        type: 'line',
                        shape: {
                            x1: api.coord([api.value(0), api.value(1)])[0] - api.size([1, 0])[0] * 0.1,
                            y1: api.coord([api.value(0), api.value(1)])[1],
                            x2: api.coord([api.value(0), api.value(1)])[0] + api.size([1, 0])[0] * 0.1,
                            y2: api.coord([api.value(0), api.value(1)])[1]
                        },
                        style: style
                    }, {
                        type: 'line',
                        shape: {
                            x1: api.coord([api.value(0), api.value(1)])[0],
                            y1: api.coord([api.value(0), api.value(1)])[1],
                            x2: api.coord([api.value(0), api.value(2)])[0],
                            y2: api.coord([api.value(0), api.value(2)])[1]
                        },
                        style: style
                    }, {
                        type: 'line',
                        shape: {
                            x1: api.coord([api.value(0), api.value(2)])[0] - api.size([1, 0])[0] * 0.1,
                            y1: api.coord([api.value(0), api.value(2)])[1],
                            x2: api.coord([api.value(0), api.value(2)])[0] + api.size([1, 0])[0] * 0.1,
                            y2: api.coord([api.value(0), api.value(2)])[1]
                        },
                        style: style
                    }]
                };
            },
            encode: {
                x: 0,
                y: [1, 2]
            },
            data: errorData,
            z: 100
        }]
    };
    return option;
}

function setStackedBar($selector, data, fresh) {
    var bardata = model.change(data, 39);
    // alert(data.viewId);
    var id = data.viewId || 'main';
    //debugger;
    if (bardata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < bardata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + bardata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var barData = bardata[index];
            return drawBar(main, barData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        console.log(main);
        return drawStackedBar(main, bardata);
    }
}

function drawStackedBar(main, barData) {
    var series = barData.series.map(function (item, index) {
        item.type = 'bar';
        item.stack = '总量';
        return item;
    });

    var chart = echarts.init(main);
    var option = {
        title: {
            text: barData.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff'
            }
        },
        // grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '20%',
        //     containLabel: true
        // },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            y: 'top',
            data: barData.objects,
            textStyle: {
                color: '#fff'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'top',
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line', 'stack', 'tiled', 'bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        xAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        yAxis: [{
            type: 'category',
            data: barData.property,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        series: series
    };
    return option;
}

function setBPdata($selector, data, fresh) {
    var bardata = data;
    // console.log(bardata);
    var id = data.viewId || 'main';
    // debugger;
    // alert('000');

    var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
    $selector.html(html);
    var main = document.getElementById(id);
    // alert('here2');
    if (match(data, 46)) {
        return drawBPdata(main, bardata);
    }


};

function setAirCHMap($selector, data, fresh) {
    var html = '<div class="view-area-box" id="main"></div>';
    $selector.html(html);
    var main = document.getElementById('main');
    var mapData = model.change(data, 11);
    return drawAirCHMap(main, mapData);
};

function setTCHMap($selector, data, fresh) {
    var html = '<div class="view-area-box" id="main"></div>';
    $selector.html(html);
    var main = document.getElementById('main');
    var mapData = model.change(data, 11);
    return drawTCHMap(main, mapData);
};

function setBarMap($selector, data, fresh) {
    // debugger;
    var html = '<div class="view-area-box" id="main"></div>';
    $selector.html(html);
    var main = document.getElementById('main');
    var areaData = model.change(data, 38);
    return drawBarMapArea(main, areaData);
}
var drawBarMapArea = function (main, areaData) {
    // debugger;
    //数据定义区
    var typeArr = ["鲜花", "星星", "香蕉", "嫌弃"];
    var myChart = echarts.init(main);
    var typeIndex = 1;
    var selectedRange = null;
    var option = null;
    var str = "";
    var data = [];
    var geoCoordMap = {};
    var geoJson = {};
    var name = areaData.title;
    var mapName = 'china'
    // 地图特征
    $.ajax({
        url: '../../static/json/china.json',
        async: false,
        type: "GET",
        success: function (geoJsons) {
            echarts.registerMap('china', geoJsons);
            geoJson = geoJsons;
            return geoJson;
        }

    });

    console.log(geoJson);
    var mapFeatures = geoJson.features;
    console.log(geoJson.features);
    mapFeatures.forEach(function (v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
    });
    var relationData = areaData.relations;
    console.log(areaData.relations);

    for (var p in relationData) {
        var names = relationData[p];
        var datas = [];
        for (var a in names) {
            datas.push({
                name: names[a][0],
                value: names[a][1]
            });
        }
        data.push({
            name: p,
            value: datas
        });
    }
    // 地理坐标图(打印出来方便查看)
    console.log("===========geoCoordMap===============");
    for (var i in geoCoordMap) {
        console.log(geoCoordMap[i]);
    }
    console.log(geoCoordMap);
    console.log("==============data===============");
    console.log(data);
    /*变换地图数据（格式）：pie*/
    function convertMapDta(type, data) {
        var mapData = [];
        data.forEach(function (v) {
            v.value.forEach(function (v1) {
                if (String(v1.name) === String(type)) {
                    // 数据格式：data: [120, 200, 150, 80]
                    mapData.push({
                        "name": v.name,
                        "value": v1.value
                    })
                }
            })
        });
        return mapData;
    }

    console.log("================mapData==================")
    console.log(convertMapDta(typeArr[typeIndex], data))
    console.log("=========================================")

    /*resetPie*/
    function resetPie(myChart, params, geoCoordMap, typeIndex) {
        var op = myChart.getOption();
        var ops = op.series;
        ops.forEach(function (v, i) {
            if (i > 0) {
                var geoCoord = geoCoordMap[v.name];
                var p = myChart.convertToPixel({
                    seriesIndex: 0
                }, geoCoord);
                v.center = p;
                if (params != 0 && params.zoom) {
                    v.radius = v.radius * params.zoom;
                }
                if (params != 0 && params.selected) {
                    var rangeFirstNumber = params.selected[0];
                    var rangeSecondNumber = params.selected[1];
                    var pd = v.data[typeIndex].value;
                    if (pd < rangeFirstNumber || pd > rangeSecondNumber) {
                        v.itemStyle.normal.opacity = 0;
                    } else {
                        v.itemStyle.normal.opacity = 1;
                    }
                }
            }
        });
        myChart.setOption(op, true);
    }
    /*addPie*/
    function addPie(chart, data) {
        var op = chart.getOption();
        var sd = option.series;
        for (var i = 0; i < data.length; i++) {
            var randomValue = Math.round(Math.random() * 30);
            var radius = randomValue <= 10 ? 10 : randomValue;
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                var vr = [];
                (data[i].value).map(function (v, j) {
                    vr.push({
                        name: v.name,
                        value: v.value
                    });
                });
                var p = chart.convertToPixel({
                    seriesIndex: 0
                }, geoCoord);
                sd.push({
                    name: data[i].name,
                    type: 'pie',
                    tooltip: {
                        formatter: function (params) {
                            return params.seriesName + "<br/>" + params.name + " : " + params.value;
                        }
                    },
                    radius: ['5%', '6.5%'],
                    center: p,
                    data: vr,
                    // zlevel:4,
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        mormal: {
                            opacity: -10
                        }
                    }
                });
            }
        }
        return sd;
    };
    /* 指定图表的配置项和数据:pie*/
    var option = {
        title: {
            text: name,
            left: 'center',
            textStyle: {
                color: "#fff"
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (params.value) {
                    return params.name + "<br/>" + typeArr[typeIndex] + ": " + params.value;
                }
            }
        },

        series: [{
            name: 'china',
            type: 'map',
            mapType: mapName,
            // roam: true,
            label: {
                normal: {
                    show: true,
                    color: 'black',
                    fontSize: 13,
                    opacity: 100
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    label: {
                        show: true
                    },
                    areaColor: "#FDF5E6"
                },
                emphasis: {
                    label: {
                        show: true
                    },
                }
            },
            data: convertMapDta(typeArr[typeIndex], data),
            /*zlevel:3*/
        }]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

    /*pie*/
    addPie(myChart, data);
    /*bar*/
    // addBar(myChart,data);
    console.log("===========option=================");
    console.log(option);
    myChart.setOption(option, true);

    /*饼图跟着地图移动:pie*/
    myChart.on('georoam', function (params) {
        debugger;
        resetPie(myChart, params, geoCoordMap, typeIndex);
    });
    myChart.on('datarangeselected', function (params) {
        resetPie(myChart, params, geoCoordMap, typeIndex);
    });
    window.addEventListener("resize", function () {
        myChart.resize();
        resetPie(myChart, 0, geoCoordMap);
    })
    return option;

}

function setCHMap($selector, data, fresh) {
    var html = '<div class="view-area-box" id="main"></div>';
    $selector.html(html);
    var main = document.getElementById('main');
    var mapData = model.change(data, 8);
    console.log(mapData);
    return drawCHMap(main, mapData);
};

function setRoseSort($selector, data, fresh) {
    var pieData = model.change(data, 37);
    //console.log(pieData);
    if (pieData instanceof Array) {
        var frag = '<ul class="datalists">';
        for (var i = 0; i < pieData.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + pieData[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                <div class="view-area-box" id="main"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById('main');
            var pie = pieData[index];
            return drawRoseSort(main, pie);

        });
        $selector.find("li.datalist").eq(0).trigger("click");
    } else {
        var html = '<div class="view-area-box" id="main"></div>';
        $selector.html(html);
        var main = document.getElementById('main');
        return drawRoseSort(main, pieData);
    }
};

function setZebraBar($selector, data, fresh) {
    //把数据处理成柱状图所需要的数据格式
    var bardata = model.change(data, 33);
    if (bardata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < bardata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + bardata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="main"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById('main');

            var barData = bardata[index];
            return drawZebraBar(main, barData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="main"></div>';
        $selector.html(html);
        var main = document.getElementById('main');
        return drawZebraBar(main, bardata);
    }
};

function setRadar($selector, data, fresh) {
    var plData = model.change(data, 5);
    var id = data.viewId || 'main';
    if (plData instanceof Array) {
        var frag = '<ul class="datalists">';
        for (var i = 0; i < plData.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + plData[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                    <div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);
            var pie = plData[index];
            return drawRadar(main, pie);

        });

        $selector.find("li.datalist").eq(0).trigger("click");
        //console.log(plData);

    } else {

        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        console.log(main);
        var test = drawRadar(main, plData);
        console.log(test);
        return drawRadar(main, plData);
    }
}

function setSunburst($selector, data, fresh) {
    var sundata = model.change(data, 36);
    var id = data.viewId || 'main';

    var html = '<div class="view-area-box" id="' + id + '"></div>';
    $selector.html(html);
    var main = document.getElementById(id);

    console.log(sundata);
    return drawSunburst(main, sundata);
};

function drawSunburst(main, sunData) {
    var chart = echarts.init(main);
    var option = {
        title: {
            show: true,
            text: sunData.title,
            // top: 'center',
            left: 'center',
            textStyle: {
                fontWeight: 'lighter',
                color: 'white'
            }
        },
        toolbox: {
            show: true,
            // feature: {
            //     dataView:{
            //         show:true
            //     },
            //     restore:{
            //         show:true
            //     },
            //     dataZoom:{
            //         show:true
            //     },
            //     saveAsImage: {
            //         show: true
            //     }
            //     // ,
            //     // magicType: {
            //     //     type: ['line', 'bar']
            //     // }
            // }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a}<br/> {b} : {c} '
        },
        series: {
            name: sunData.property,
            type: 'sunburst',
            highlightPolicy: 'ancestor',
            data: sunData.series,
            radius: [0, '60%'],
            sort: null, //不排序，使用原始数据
            label: {
                rotate: 'radial',
                formatter: '{b} : {c}% '
            }
        }
    }
    console.log(option);
    return option;
}
// function setRadar($selector, data, fresh) {
//     var plData = model.change(data, 5);
//     var id = data.viewId || 'main';
//     if(data.property.length === 1){

//         //console.log(plData);
//         var html='<div class="view-area-box" id="'+id+'" style=""></div>';
//         $selector.html(html);
//         var main = document.getElementById(id);
//         var test =drawRadar(main, plData);
//         console.log(test);
//         return drawRadar(main, plData);
//     } else {

//         //console.log(plData);
//         var frag='<ul class="datalists">';
//         for(var i = 0; i < plData.length; i++){
//                 frag+='<li class="datalist"  data-index="'+ i +'">'+ plData[i].objects[0] +'</li>';
//         }
//         frag+='</ul>';
//         var html='<div class="dataproperty">' + frag +'</div>\
//                 <div class="view-area-box" id="'+id+'" style=""></div>';
//         $selector.html(html);
//         $selector.on("click", "li.datalist", function(){
//             $(this).addClass("active").siblings().removeClass("active");
//             var index = $(this).data('index');
//             var main = document.getElementById(id);
//             var pie = plData[index];
//             return drawRadar(main, pie);

//         });

//         $selector.find("li.datalist").eq(0).trigger("click");
//     }
// };
function drawBPdata(main, barData) {
    var chart = echarts.init(main);
    var pieS1 = [];
    var pieS = barData.objects.map(function (elem, index) {
        var t = [];
        for (var i = 0; i < barData.relations[elem].length; i++) {
            var d = {
                name: '',
                value: ''
            };
            d.name = barData.relations[elem][i][0];
            d.value = barData.relations[elem][i][1];
            t[i] = d;
        }
        pieS1[index] = t;
        console.log(pieS1)

        return pieS1;
    });
    console.log(pieS);
    var getseries = function (dataS) {

        var seriesData = {
            newSeries: [{
                data: [],
                type: '',
                name: ''
            }]
        };

        for (var i = 0; i < dataS.length; i++) {
            var sum = 0;
            for (var j = 0; j < dataS[i].length; j++) {
                console.log(dataS[i][j].value)
                sum += Number(dataS[i][j].value);

            };
            console.log(sum);
            seriesData.newSeries[0].data[i] = Number(sum);
        };
        seriesData.newSeries[0].type = 'bar';
        seriesData.newSeries[0].name = '';
        // console.log(seriesData);
        return seriesData;
    };
    var barS = getseries(pieS1).newSeries;
    console.log(barS);
    var devideBar = function (bar) {

        var Newdata = {
            series1: [],
            series2: []
        };

        for (var m = 0; m < bar.data.length; m++) {
            var arr = _deepCopy(bar.data);
            var newBar1 = {
                data: [],
                type: 'bar',
                name: '',
                stack: '总量',
                itemStyle: {}
            }
            var newBar2 = {
                data: arr,
                type: 'bar',
                stack: '总量',
                name: ''
            }
            newBar1.data[m] = bar.data[m],
                newBar1.itemStyle = {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                }
            newBar2.data[m] = '0';
            newBar2.itemStyle = {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            }
            Newdata.series1[m] = newBar1;
            Newdata.series2[m] = newBar2;
        }
        console.log(Newdata);
        return Newdata;
    }
    var barSer1 = devideBar(barS[0]).series1;
    var barSer2 = devideBar(barS[0]).series2;
    // console.log(convertCHData(relationData[0]));

    var option = {
        baseOption: {
            timeline: {
                // y: 0,
                axisType: 'category',
                // realtime: false,
                // loop: false,
                left: 30,
                right: 30,
                top: null,
                bottom: 0,
                width: null,
                height: 30,
                autoPlay: true,
                // currentIndex: 2,
                playInterval: 3000,
                // controlStyle: {
                //     position: 'left'
                // },
                data: barData.objects,
                label: {
                    normal: {
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                symbol: 'none',
                lineStyle: {
                    color: '#ffffff'
                },
                checkpointStyle: {
                    color: '#bbb',
                    borderColor: '#777',
                    borderWidth: 2
                },
                controlStyle: {
                    showNextBtn: false,
                    showPrevBtn: false,
                    normal: {
                        color: '#ffffff',
                        borderColor: '#ffffff'
                    },
                    emphasis: {
                        color: '#aaa',
                        borderColor: '#aaa'
                    }
                },
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true
            },
            graphic: [{
                type: 'group',
                // rotation: Math.PI / 4,
                bounding: 'raw',
                left: '30%',
                bottom: '10%',
                z: 100,
                children: [{
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                    }
                }]
            }],
            title: {
                text: barData.title,
                subtext: barData.objects[0],
                x: 'center',
                y: 'top',
                textStyle: {
                    color: '#fff'
                },
                subtextStyle: {
                    color: "#fff"
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: barData.objects[0]
            },
            calculable: true,
            xAxis: [{
                type: 'value',
                name: ' ',
                nameGap: 3,
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: '0',
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            }],
            yAxis: [{
                name: '',
                type: 'category',
                data: barData.objects,
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            }],
            series: [
                barSer2[0],
                barSer1[0],
                {
                    // name:barData.objects[0],
                    type: 'pie',
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    center: ['85% ', '15%'],
                    label: {
                        normal: {
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    radius: '13%',
                    // center: [document.getElementById('main').offsetWidth '-15%', '15%'],
                    // radius: ["1%", "8%"],
                    data: pieS1[0]
                }
            ]

        },
        options: []
    }
    for (var n = 0; n < barData.objects.length; n++) {
        option.options.push({
            title: {
                text: barData.title,
                subtext: barData.objects[n],
                x: 'center',
                y: 'top',
                textStyle: {
                    color: '#fff'
                },
                subtextStyle: {
                    color: "#fff"
                }
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true
            },
            graphic: [{
                type: 'group',
                // rotation: Math.PI / 4,
                bounding: 'raw',
                left: '30%',
                bottom: '10%',
                z: 100,
                children: [{
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                    }
                }]
            }],
            legend: {
                orient: 'vertical',
                left: 'left',
                data: barData.objects[n]
            },

            series: [
                barSer2[n],
                barSer1[n],
                {
                    // name: barData.objects[n],
                    type: "pie",
                    data: pieS1[n],
                    center: ['85% ', '15%'],
                    radius: '13%',
                    legend: {
                        // orient: 'vertical',
                        left: 'right',
                        data: pieS1[n]
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                }
            ]
        })


    }
    console.log(option.baseOption.timeline)
    console.log(option);

    optionIm = option;
    console.log(optionIm);
    console.log(optionIm);

    return optionIm;
}

function setAirMap($selector, data, fresh) {
    var id = data.viewId || 'main';
    var html = '<div class="view-area-box" id="' + id + '"></div>';
    $selector.html(html);
    var main = document.getElementById(id);
    var mapData = model.change(data, 11);
    // alert("1122");
    // alert(mapData);
    console.log("222" + mapData);
    var option1 = drawAirMap(main, mapData);
    // alert(option1);
    console.log(option1);
    return drawAirMap(main, mapData);
}

function setRing($selector, data, fresh) {
    var pieData = model.change(data, 1);
    //console.log(pieData);
    //判断数据是否是数组或者对象
    if (pieData instanceof Array) {
        var frag = '<ul class="datalists">';
        for (var i = 0; i < pieData.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + pieData[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                <div class="view-area-box" id="main"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById('main');
            var pie = pieData[index];
            return drawRing(main, pie);

        });
        $selector.find("li.datalist").eq(0).trigger("click");
    } else {
        //在html中定义一个main的容器生成图片
        var html = '<div class="view-area-box" id="main"></div>';
        $selector.html(html);
        var main = document.getElementById('main');
        return drawRing(main, pieData);
    }
}

function setRose($selector, data, fresh) {
    var pieData = model.change(data, 1);
    //console.log(pieData);
    if (pieData instanceof Array) {
        var frag = '<ul class="datalists">';
        for (var i = 0; i < pieData.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + pieData[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                <div class="view-area-box" id="main"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById('main');
            var pie = pieData[index];
            return drawRose(main, pie);

        });
        $selector.find("li.datalist").eq(0).trigger("click");
    } else {
        var html = '<div class="view-area-box" id="main"></div>';
        $selector.html(html);
        var main = document.getElementById('main');
        return drawRose(main, pieData);
    }
}

function setBar($selector, data, fresh) {
    // alert("1111");
    var bardata = model.change(data, 3);
    // alert(data.viewId);
    var id = data.viewId || 'main';
    //debugger;
    if (bardata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < bardata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + bardata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var barData = bardata[index];
            return drawBar(main, barData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        console.log(main);
        return drawBar(main, bardata);
    }
}

function setHorizBar($selector, data, fresh) {
    var bardata = model.change(data, 10);
    // console.log(bardata);
    var id = data.viewId || 'main';
    if (bardata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < bardata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + bardata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var barData = bardata[index];
            return drawHorizBar(main, barData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        return drawHorizBar(main, bardata);
    }
}

function setLine($selector, data, fresh) {
    var linedata = model.change(data, 2);
    console.log(linedata);
    var id = data.viewId || 'main';
    if (linedata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < linedata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + linedata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var lineData = linedata[index];
            return drawLine(main, lineData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        return drawLine(main, linedata);
    }
}

function setPie($selector, data, fresh) {
    var pieData = model.change(data, 1);
    var id = data.viewId || 'main';
    if (pieData instanceof Array) {
        var frag = '<ul class="datalists">';
        for (var i = 0; i < pieData.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + pieData[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                <div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {

            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);
            var pie = pieData[index];
            return drawPie(main, pie);

        });
        $selector.find("li.datalist").eq(0).trigger("click");
    } else {
        var html = '<div class="view-area-box" id="' + id + '"></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        return drawPie(main, pieData);
    }
}

function setLineBar($selector, data, fresh) {
    var linebardata = model.change(data, 49) // 参考二维柱状图
    var id = data.viewId || 'main';
    console.log(linebardata)
    //debugger;
    if (linebardata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < linebardata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + linebardata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var linebarData = linebardata[index];
            return drawBar(main, linebarData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        console.log(main);
        return drawLineBar(main, linebardata);
    }
}

function setArcBar($selector, data, fresh) {
    var arcbardata = model.change(data, 48) // 参考一维柱状图
    var id = data.viewId || 'main';
    console.log(arcbardata)
    //debugger;
    if (arcbardata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < arcbardata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + arcbardata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var arcbarData = arcbardata[index];
            return drawBar(main, arcbarData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        console.log(main);
        return drawArcBar(main, arcbardata);
    }
}

function setwordCloud($selector, data, fresh) {
    // var wordclouddata = model.change(data, 51) // 参考一维柱状图
    var wordclouddata = data;
    var id = data.viewId || 'main';
    console.log(wordclouddata)
    //debugger;
    if (wordclouddata instanceof Array) {
        //对象数组
        var frag = '<ul class="datalists">';
        for (var i = 0; i < wordclouddata.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + wordclouddata[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                        <div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);

            var wordcloudData = wordclouddata[index];
            return drawBar(main, wordcloudData);

        });
        $selector.find("li.datalist").eq(0).trigger("click");

    } else {
        var html = '<div class="view-area-box" id="' + id + '" style=""></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        console.log(main);
        return drawWordCloud(main, wordclouddata);
    }
}

function setTimeline($selector, data, fresh) {
    var tlData = model.change(data, 4); //对象数组
    var id = data.viewId || 'main';
    var html = '<div class="view-area-box" id="' + id + '"></div>';
    $selector.html(html);
    var main = document.getElementById(id);
    if (fresh == 'false') {
        drawTimeLine(main, tlData);
    } else {
        drawTimeLineD(main, tlData);
    }

}

function setParallel($selector, data, fresh) {
    var plData = model.change(data, 5);
    var id = data.viewId || 'main';
    if (data.property.length === 1) {
        var html = '<div class="view-area-box" id="' + id + '"></div>';
        $selector.html(html);
        var main = document.getElementById(id);
        drawParallel(main, plData);
    } else {
        var frag = '<ul class="datalists">';
        for (var i = 0; i < plData.length; i++) {
            frag += '<li class="datalist"  data-index="' + i + '">' + plData[i].objects[0] + '</li>';
        }
        frag += '</ul>';
        var html = '<div class="dataproperty">' + frag + '</div>\
                    <div class="view-area-box" id="' + id + '"></div>';
        $selector.html(html);
        $selector.on("click", "li.datalist", function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).data('index');
            var main = document.getElementById(id);
            var pie = plData[index];
            drawParallel(main, pie);

        });
        $selector.find("li.datalist").eq(0).trigger("click");
    }

}

function setTree($selector, data, fresh) {
    var id = data.viewId || 'main';
    var tree = model.change(data, 6);
    $selector.empty();
    var width = $selector.width() * 0.9;
    var height = 500;

    //边界空白
    var padding = {
        left: 80,
        right: 50,
        top: 20,
        bottom: 20
    };
    //创建svg容器
    var svg = d3.select('#' + id)
        .append("svg")
        .attr("id", "svgTree")
        .attr("width", width)
        .attr("height", height + padding.top + padding.bottom);
    var svgcontainer = svg.append("g")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    //保存图片标志
    //savePic(width-20,height,svg.attr("id"));
    // console.log(tree);
    drawTree(width, height, svgcontainer, tree);
    $('body').on("contextmenu", 'svg', function () {
        event.preventDefault();
        var svgid = document.getElementById('svgTree');
        //console.log(svgid);
        saveSvgAsPng(svgid, data.title + '.png');
    });
}

function setFord($selector, data, fresh) {
    var id = data.viewId || 'main';
    $selector.empty();
    var width = $selector.width(); //SVG绘制区域的宽度
    var height = 500; //SVG绘制区域的高度

    var svg = d3.select('#' + id) //选择<body>
        .append("svg").attr("id", "svgFord") //在<body>中添加<svg>
        .attr("width", width) //设定<svg>的宽度属性
        .attr("height", height); //设定<svg>的高度属性
    //savePic(width-20,height,svg.attr("id"));
    //1.确定初始数据
    var ford = model.change(data, 7);
    drawFord(svg, width, height, ford.nodes, ford.edges);
    $('body').on("contextmenu", 'svg', function () {
        event.preventDefault();
        var svgid = document.getElementById('svgFord');
        saveSvgAsPng(svgid, data.title + '.png');
    });
}
// function setMap($selector, data, fresh) {
//     var id = data.viewId || 'main';
//     var html='<div class="view-area-box" id="'+id+'"></div>';
//         $selector.html(html);
//         var main = document.getElementById(id);
//         var mapData = model.change(data, 8);
//         console.log(drawMapArea(main, mapData));
//         return drawMapArea(main, mapData);
// }
function setMap($selector, data, fresh) {
    var html = '<div class="view-area-box" id="main"></div>';
    $selector.html(html);
    var main = document.getElementById('main');
    var mapData = model.change(data, 8);
    return drawMapArea(main, mapData);
}

function setWord($selector, data, fresh) {
    var id = data.viewId || 'main';
    var html = '<div class="view-area-box" id="' + id + '"></div>';
    $selector.html(html);
    var main = document.getElementById(id);
    var wordData = model.change(data, 9);
    // console.log( wordData);
    drawWord(main, wordData);
    $('body').on("contextmenu", 'svg', function (event) {
        event.preventDefault();
        var svgid = document.getElementById('svgWord');
        saveSvgAsPng(svgid, data.title + '.png');
    });
}

function drawPie(main, pieData) {

    //var series = pieData.relations[pieData.objects][0].map(function(item, index){ return {name: pieData.property[index], value: item}  });
    //console.log(series);
    var chart = echarts.init(main);
    var option = {
        title: {
            text: pieData.title,
            x: 'center',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        //backgroundColor: '#2c343c',
        tooltip: {
            trigger: 'item',
            formatter: " {b} : {c}，百分比：{d}%"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            y: 'top',
            data: pieData.property,
            textStyle: {
                color: '#fff'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',

        },
        calculable: true,
        series: [{
            name: pieData.title,
            type: 'pie',
            label: {

                textStyle: {
                    fontSize: 12
                },
                show: true

            },
            labelLine: {

                show: true,
                length: 30,
                length2: 10

            },
            radius: '35%',
            center: ['50%', '60%'],
            data: pieData.series,
            // label: {
            //     normal: {
            //         formatter: '{b}:{d}%',
            //         textStyle: {
            //             fontWeight: 'normal',
            //             fontSize: 15
            //         }
            //     }
            // }
        }]
    };
    window.addEventListener("resize", function () {
        chart.resize();
    })
    return option;
    // chart.setOption(option, true); 
    // return chart;
}

function convertData(data) {
    var res = [];
    // var data=data[0];
    //  console.log(data)
    for (var i = 0; i < data.length; i++) {
        var geoCoord = GDcoorMap[data[i][0]];
        if (geoCoord) {
            res.push({
                name: data[i][0],
                value: geoCoord.concat(data[i][1])
            });
        }
    }
    return res;
};

function convertCHData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCHMap[data[i][0]];
        if (geoCoord) {
            res.push({
                name: data[i][0],
                value: geoCoord.concat(data[i][1])
            });
        }
    }
    return res;
};
var drawRadar = function (main, data) {
    console.log(data);
    // var series = data.series.map(function(item,index) {
    //     item.type = 'radar';
    //         return item;
    //     });
    // console.log(series);
    var chart = echarts.init(main);
    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.5
        }
    };


    var option = {
        // backgroundColor: '#161627',
        title: {
            text: data.title,
            //left: 'left',
            x: 'center',
            textStyle: {
                color: '#eee'
            }
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            y: 'top',
            //x : 'right',
            data: data.objects
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [
                // {
                //     type: 'rect',
                //     left: 'center',
                //     top: 'center',
                //     z: 100,
                //     shape: {
                //         width: 300,
                //         height: 35
                //     },
                //     style: {
                //         fill: 'rgba(0,0,0,0.3)'
                //     }
                // },
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                    }
                }
            ]
        }],
        tooltip: {
            trigger: 'item'
        },
        calculable: true,
        polar: [{
            indicator: (function () {

                var res = data.series;
                // console.log(res);
                var res1 = [];
                var res2 = data.property;
                var maxNum = null;
                for (var i = 0; i < res.length; i++) {
                    var maxN = Math.max.apply(null, res[i].value)
                    if (maxNum < maxN) {

                        maxNum = maxN;
                    };
                };
                // var maxNum=Math.max.apply(null, res)
                // console.log(maxNum);
                for (var i = 0; i < res2.length; i++) {
                    res1.push({
                        text: res2[i],
                        max: maxNum
                    })
                };
                return res1;
            })(),

            radius: 80
        }],
        series: [{
            // name: '完全实况球员数据',
            type: 'radar',
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    }
                }
            },
            data: data.series
        }]
    };

    // var option = {
    //      backgroundColor: '#161627',
    //      title: {
    //          text: data.title,
    //          left: 'center',
    //          textStyle: {
    //              color: '#eee'
    //          }
    //      },
    //      legend: {
    //          bottom: 5,
    //          data: data.objects,
    //          itemGap: 20,
    //          textStyle: {
    //              color: '#fff',
    //              fontSize: 14
    //          },
    //          selectedMode: 'single'
    //      },
    //      radar: {
    //          indicator: [
    //              {name: 'AQI' },
    //              {name: 'PM2.5'},
    //              {name: 'PM10'},
    //              {name: 'CO'},
    //              {name: 'NO2'},
    //              {name: 'SO2'}
    //          ],
    //          shape: 'circle',
    //          splitNumber: 5,
    //          name: {
    //              textStyle: {
    //                  color: 'rgb(238, 197, 102)'
    //              }
    //          },
    //          splitLine: {
    //              lineStyle: {
    //                  color: [
    //                      'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
    //                      'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
    //                      'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
    //                  ].reverse()
    //              }
    //          },
    //          splitArea: {
    //              show: false
    //          },
    //          axisLine: {
    //              lineStyle: {
    //                  color: 'rgba(238, 197, 102, 0.5)'
    //              }
    //          }
    //      },
    //      series: [
    //          {
    //              name: '北京',
    //              type: 'radar',
    //              lineStyle: lineStyle,
    //              data: dataBJ,
    //              symbol: 'none',
    //              itemStyle: {
    //                  normal: {
    //                      color: '#F9713C'
    //                  }
    //              },
    //              areaStyle: {
    //                  normal: {
    //                      opacity: 0.1
    //                  }
    //              }
    //          },
    //          {
    //              name: '上海',
    //              type: 'radar',
    //              lineStyle: lineStyle,
    //              data: dataSH,
    //              symbol: 'none',
    //              itemStyle: {
    //                  normal: {
    //                      color: '#B3E4A1'
    //                  }
    //              },
    //              areaStyle: {
    //                  normal: {
    //                      opacity: 0.05
    //                  }
    //              }
    //          },
    //          {
    //              name: '广州',
    //              type: 'radar',
    //              lineStyle: lineStyle,
    //              data: dataGZ,
    //              symbol: 'none',
    //              itemStyle: {
    //                  normal: {
    //                      color: 'rgb(238, 197, 102)'
    //                  }
    //              },
    //              areaStyle: {
    //                  normal: {
    //                      opacity: 0.05
    //                  }
    //              }
    //          }
    //      ]
    //  };

    // var chart = echarts.init(main);
    // chart.setOption(option, true);
    // imgdown.canvasAsPng(chart);
    console.log(option);
    return option;
};
var drawZebraBar = function (main, barData) {

    var PatternSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAVCAIAAAA8SdJPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDQyQTBBNTE1NjI5MTFFN0FEMUI5NEE3OUY1N0ZFRjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDQyQTBBNTI1NjI5MTFFN0FEMUI5NEE3OUY1N0ZFRjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NDEzOUJENjU2MjkxMUU3QUQxQjk0QTc5RjU3RkVGMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NDEzOUJENzU2MjkxMUU3QUQxQjk0QTc5RjU3RkVGMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr3x3AEAAACVSURBVHja7JRBCgMxDAMlO/vw/rAPiq06oZf25rLQhVaB3DLIihGVEySSMOJTCQlp3O42AQPBkHo4MT1dBm0rI7AAWoelph9bIAkbYThPZ7LGi+Vye0Vf3ezf5rhq9r/A+u/XF/9xlVhqT5fdx16pZJUXTdi3hZ7t3PaYOeXFiZW1OKpmqbkbku2d8MMiD3jhAnwIMAA1XUeDcEGmGgAAAABJRU5ErkJggg=='
    var PatternImg = new Image();
    PatternImg.src = PatternSrc;

    var y = barData.property;
    if (parseInt(y[0])) {

        var y = y.map(function (item, index) {
            return parseInt(item);
        })
    }

    var series = barData.series.map(function (item, index) {
        item.type = 'bar';
        item.z = 3;
        item.barWidth = '30%';
        return item;
    });

    var a = JSON.stringify(series);
    console.log(a);
    if (series.length == 1) {
        series[0].itemStyle = {
            normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: {
                    image: PatternImg,
                    repeat: 'repeat'
                }
            }
        };
        if (barData.color) {
            var colorarr = barData.color;
            series[0].itemStyle = {
                normal: {
                    barBorderRadius: [2, 2, 0, 0],
                    color: {
                        image: PatternImg,
                        repeat: 'repeat'
                    }
                }
            };
        }
    }
    if (series.length == 2) {
        series[0].itemStyle = {
            normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: {
                    image: PatternImg,
                    repeat: 'repeat'
                }
            }
        };
        series[1].itemStyle = {
            // normal:{color:'#00EAFE'}
            normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: {
                    image: PatternImg,
                    repeat: 'repeat'
                }
            }
        };

        if (barData.color) {
            var colorarr = barData.color;

            series[0].itemStyle = {
                normal: {
                    barBorderRadius: [2, 2, 0, 0],
                    color: {
                        image: PatternImg,
                        repeat: 'repeat'
                    }
                }
            };
            series[1].itemStyle = {
                // normal:{color:'#00EAFE'}
                normal: {
                    barBorderRadius: [2, 2, 0, 0],
                    color: {
                        image: PatternImg,
                        repeat: 'repeat'
                    }
                }
            };
        }
    }


    var chart = echarts.init(main);
    var option = {
        title: {
            text: barData.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff'
                //color:'#5F5F5F'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        //backgroundColor: '#F5F5F5',
        //backgroundColor: '#000',
        //color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                color: '#fff'
                //color:'#5F5F5F'
            }
        },
        legend: {
            // orient : 'horizontal',
            // x : 'center',
            // top:'16%',
            orient: 'vertical',
            x: 'left',
            y: 'top',
            data: barData.objects,
            textStyle: {
                color: '#fff'
                //color:'#5F5F5F'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'top',
            // feature : {
            // mark : {show: true},
            // dataView : {show: true, readOnly: false},
            // magicType : {show: true, type: ['line','stack','tiled', 'bar']},
            // restore : {show: true},
            //     saveAsImage : {show: true},
            //     myTool : {
            //         show : true,
            //         title : '删除',
            //         icon : 'image://http://echarts.baidu.com/images/favicon.png',
            //         onclick : function(){
            //             var el=$(main).parent().parent();
            //             el.empty();
            //             var txt='<div class="chart-con-add">+</div>';
            //             el.html(txt);
            //         }
            //     }
            // }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: y,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                    //color:'#5F5F5F'
                }
            },
            axisLabel: {
                rotate: 0,
                textStyle: {
                    color: '#fff'
                    //color:'#5F5F5F'
                },
                interval: 0
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                    //color:'#5F5F5F'
                }
            },
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                    //color:'#5F5F5F'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                    //color:'#5F5F5F'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                    //color:'#5F5F5F'
                }
            },
            splitLine: {
                show: false
            }
        }],
        // grid: {
        //     x: 40,
        //     y2: 35
        // },
        series: series
    };
    return option;


    // chart.setOption(option, true); 
    // //绑定上传图片
    // imgdown.canvasAsPng(chart);

    // return chart;
}

function drawAirMap(main, areaData) {
    var chart = echarts.init(main);
    console.log(areaData);
    var min = [];
    var max = [];
    var optionIm = {};
    var relationData = areaData.timeline.map(function (elem, index) {
        return areaData.relations[elem];
    });
    console.log(relationData)

    var series = [{
            name: 'areaData.title',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(relationData[0]),
            // symbolSize: function (val) {
            //     return val[2] / 300;
            // },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {

                    color: '#2694d5'
                }
            }
        },
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(relationData[0].sort(function (a, b) {
                return b[1] - a[1];
            }).slice(0, 5)),
            // symbolSize: function (val) {
            //     return val[2] / 300;
            // },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {

                    color: '#38b3d5',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }
    ]

    $.ajax({
        url: '../../static/json/guangdong.json',
        async: false,
        type: "GET",
        success: function (geoJson) {

            echarts.registerMap('guangdong', geoJson);


            var option = {
                baseOption: {
                    timeline: {
                        axisType: 'value',
                        orient: 'vertical',
                        autoPlay: true,
                        inverse: true,
                        playInterval: 3000,
                        left: null,
                        right: 0,
                        top: 20,
                        bottom: 20,
                        width: 55,
                        height: null,
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#999'
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        symbol: 'none',
                        lineStyle: {
                            color: '#555'
                        },
                        checkpointStyle: {
                            color: '#bbb',
                            borderColor: '#777',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            normal: {
                                color: '#666',
                                borderColor: '#666'
                            },
                            emphasis: {
                                color: '#aaa',
                                borderColor: '#aaa'
                            }
                        },
                        data: []
                    },
                    title: {
                        text: 'areaData.title',
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        },
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        top: 'center',
                        // feature: {
                        //     dataView: {readOnly: false},
                        //     // restore: {}
                        //     myTool: {
                        //         show: true,
                        //         title: '删除',
                        //         icon: 'image://http://echarts.baidu.com/images/favicon.png',
                        //         onclick: function () {
                        //             var el = $(main).parent().parent();
                        //             el.empty();
                        //             var txt = '<div class="chart-con-add">+</div>';
                        //             el.html(txt);
                        //         }
                        //     }
                        // }
                    },
                    geo: {
                        map: 'guangdong',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        // roam: true,
                        itemStyle: {
                            normal: {
                                // areaColor: '#38b3d5',
                                areaColor: '#15214B',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series: series
                },
                options: []
            }
            var data = areaData;
            console.log(data);
            for (var n = 0; n < data.timeline.length; n++) {
                option.baseOption.timeline.data.push(data.timeline[n]);
                option.options.push({
                    title: {
                        show: true,
                        'text': parseInt(data.timeline[n]) + '年广东省各县市区出生人口'
                    },
                    series: [{
                        name: 'pm2.5',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(relationData[n]),
                        // symbolSize: function (val) {
                        //     return val[2] / 300;
                        // },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#38B3D5'
                            }
                        }
                    }, {
                        name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(relationData[n].sort(function (a, b) {
                            return b[1] - a[1];
                        }).slice(0, 5)),
                        // symbolSize: function (val) {
                        //     return val[2] / 300;
                        // },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#38B3D5',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 1
                    }]
                })
                if (areaData.color) {
                    var colorarr = areaData.color;
                    if (colorarr[0]) option.options[n].series[0].itemStyle.normal.color = colorarr[0];
                    if (colorarr[1]) option.options[n].series[1].itemStyle.normal.color = colorarr[1];
                }

            }
            if (areaData.color) {
                var colorarr = areaData.color;
                if (colorarr[0]) {
                    option.baseOption.series[0].itemStyle.normal.color = colorarr[0];
                }
                if (colorarr[1]) {
                    option.baseOption.series[1].itemStyle.normal.color = colorarr[1];
                }
                if (colorarr[2]) {
                    option.baseOption.geo.itemStyle.normal.areaColor = colorarr[2];
                }
                if (colorarr[3]) {
                    option.baseOption.geo.itemStyle.normal.borderColor = colorarr[3];
                }
            }
            console.log(option);

            optionIm = option;
            console.log(optionIm);

            // console.log(optionIm);
            // return (option);
            // console.log(option);

            // return option;
            // console.log(option.options.series)
            // var myChart = echarts.init(main);
            // myChart.setOption(option, true);
            // return (option);
        }
    })

    // alert("lll00");
    console.log(optionIm);

    return optionIm;

}

function drawRing(main, pieData) {
    var a = JSON.stringify(pieData);
    console.log(a);
    //var series = pieData.relations[pieData.objects][0].map(function(item, index){ return {name: pieData.property[index], value: item}  });
    //console.log(series);
    var myChart = echarts.init(main);
    var app = {};

    var option = {
        title: {
            text: pieData.title,
            x: 'center',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
                //color:'#5F5F5F'
                //color:'#01324C'

            }
        },
        //backgroundColor: '#F5F5F5',
        //backgroundColor: '#000',
        tooltip: {
            show: true,
            trigger: 'item',
            // formatter: "{a} <br/> {b} : ({c})"
            formatter: " {b} : {c}，百分比：{d}%"
        },
        // legend: {
        //     orient : 'vertical',
        //     x : 'left',
        //     y:'top',
        //     data: pieData.property,
        //     textStyle: {
        //      //color: '#fff'
        //         color:'#5F5F5F'
        //     }
        // },

        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            // feature : {
            //     mark : {show: true},
            //     dataView : {show: true, readOnly: false},
            //     magicType : {
            //         show: true,
            //         type: ['pie']
            //     },
            //     restore : {show: true},
            //     saveAsImage : {show: true},
            //     myTool : {
            //         show : true,
            //         title : '删除',
            //         icon : 'image://http://echarts.baidu.com/images/favicon.png',
            //         onclick : function(){
            //             var el=$(main).parent().parent();
            //             el.empty();
            //             var txt='<div class="chart-con-add">+</div>';
            //             el.html(txt);
            //         }
            //     }
            // }
        },
        calculable: true,
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        series: [{
            name: pieData.title,
            type: 'pie',
            radius: ['40', '60'],
            // avoidLabelOverlap: false,
            minAngle: 5,           　　 //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
            avoidLabelOverlap: true,   //是否启用防止标签重叠策略
            // label:{
            //     normal:{
            //         show:false,
            //         position:'center'
            //     },
            //     emphasis:{
            //         show:true,
            //         textStyle:{
            //             fontSize:'20',
            //             fontWeight:'bold'
            //         }
            //     }
            // },
            // labelLine:{
            //     normal:{
            //         show:false
            //     }
            // },
            //     itemStyle:{
            //     normal: {
            //         label: {
            //             show: true
            //         },
            //         labelLine:{
            //             show: true
            //         }
            //     },
            //         emphasis: {
            //             label:{
            //             show: true,
            //             position:'center',
            //             textStyle: {
            //                 fontSize: '20',
            //                 fontWeight: 'bold'
            //             }
            //         }
            //     }
            // },
            label: {

                textStyle: {
                    fontSize: 12
                },
                show: true

            },
            labelLine: {

                show: true,
                length: 30,
                length2: 10

            },
            data: pieData.series
        }],
        color: ['#06B9D1', '#228fbd', '#2a5caa', '#7bbfea', '#2A8FBD', '#426ab3', '#005A78']
    };
    app.currentIndex = -1;

    if (pieData.color) {
        option.color = pieData.color;
    }

    setInterval(function () {
        var dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        app.currentIndex = (app.currentIndex + 1) % dataLen;
        // 高亮当前图形
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        // 显示 tooltip
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
    }, 3000);;
    if (option && typeof option === "object") {
        // myChart.setOption(option, true);
        return option;
    }
    // chart.setOption(option, true);



    // return myChart;
}

function drawRose(main, pieData) {
    var a = JSON.stringify(pieData);
    console.log(a);
    //var series = pieData.relations[pieData.objects][0].map(function(item, index){ return {name: pieData.property[index], value: item}  });
    //console.log(series);
    var myChart = echarts.init(main);
    var app = {};

    var option = {
        title: {
            text: pieData.title,
            x: 'center',
            textStyle: {
                color: '#fff'
                //color:'#5F5F5F'
                //color:'#01324C'

            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        //backgroundColor: '#F5F5F5',
        //backgroundColor: '#000',
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        legend: {
            // orient : 'vertical',
            // x : 'left',
            // y:'top',
            // data: pieData.property,
            // textStyle: {
            //  //color: '#fff'
            //    color:'#5F5F5F'
            // }
            show: false
        },

        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            // feature : {
            // mark : {show: true},
            // dataView : {show: true, readOnly: false},
            // magicType : {
            //     show: true,
            //     type: ['pie']
            // },
            // restore : {show: true},
            //     saveAsImage : {show: true},
            //     myTool : {
            //         show : true,
            //         title : '删除',
            //         icon : 'image://http://echarts.baidu.com/images/favicon.png',
            //         onclick : function(){
            //             var el=$(main).parent().parent();
            //             el.empty();
            //             var txt='<div class="chart-con-add">+</div>';
            //             el.html(txt);
            //         }
            //     }
            // }
        },
        calculable: true,
        series: [{
            name: pieData.title,
            name: '面积模式',
            type: 'pie',
            label: {

                textStyle: {
                    fontSize: 12
                },
                show: true

            },
            labelLine: {

                show: true,
                length: 30,
                length2: 10

            },
            radius: [30, 110],
            roseType: 'area',
            data: pieData.series
        }],
        color: ['#06B9D1', '#228fbd', '#2a5caa', '#7bbfea', '#2A8FBD', '#426ab3', '#005A78']
    };
    app.currentIndex = -1;

    if (pieData.color) {
        option.color = pieData.color;
    }

    setInterval(function () {
        var dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        app.currentIndex = (app.currentIndex + 1) % dataLen;
        // 高亮当前图形
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        // 显示 tooltip
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
    }, 3000);;
    if (option && typeof option === "object") {
        return option;
        // myChart.setOption(option, true);
    }
    // chart.setOption(option, true);



    return myChart;
}

function drawRoseSort(main, pieData) {
    var a = JSON.stringify(pieData);
    console.log(a);
    //var series = pieData.relations[pieData.objects][0].map(function(item, index){ return {name: pieData.property[index], value: item}  });
    //console.log(series);
    var myChart = echarts.init(main);
    var app = {};

    var option = {
        title: {
            text: pieData.title,
            x: 'center',
            textStyle: {
                color: '#fff'
                //color:'#5F5F5F'
                //color:'#01324C'

            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: "30%",
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        //backgroundColor: '#F5F5F5',
        //backgroundColor: '#000',
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        legend: {
            // orient : 'vertical',
            // x : 'left',
            // y:'top',
            // data: pieData.property,
            // textStyle: {
            //  //color: '#fff'
            //    color:'#5F5F5F'
            // }
            show: false
        },

        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            // feature: {
            // mark : {show: true},
            // dataView : {show: true, readOnly: false},
            // magicType : {
            //     show: true,
            //     type: ['pie']
            // },
            // restore : {show: true},
            //     saveAsImage: { show: true },
            //     myTool: {
            //         show: true,
            //         title: '删除',
            //         icon: 'image://http://echarts.baidu.com/images/favicon.png',
            //         onclick: function () {
            //             var el = $(main).parent().parent();
            //             el.empty();
            //             var txt = '<div class="chart-con-add">+</div>';
            //             el.html(txt);
            //         }
            //     }
            // }
        },
        calculable: true,
        series: [{
            name: pieData.title,
            name: '面积模式',
            type: 'pie',
            label: {

                textStyle: {
                    fontSize: 12
                },
                show: true

            },
            labelLine: {

                show: true,
                length: 30,
                length2: 10

            },
            radius: [30, 110],
            roseType: 'area',
            data: pieData.series.sort(function (a, b) {
                return a.value - b.value;
            })
        }],
        color: ['#06B9D1', '#228fbd', '#2a5caa', '#7bbfea', '#2A8FBD', '#426ab3', '#005A78']
    };
    app.currentIndex = -1;

    if (pieData.color) {
        option.color = pieData.color;
    }

    setInterval(function () {
        var dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        app.currentIndex = (app.currentIndex + 1) % dataLen;
        // 高亮当前图形
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        // 显示 tooltip
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
    }, 3000);;
    if (option && typeof option === "object") {
        return option;
        // myChart.setOption(option, true);
    }
    // chart.setOption(option, true);



    return myChart;
};

function drawBar(main, barData) {
    console.log(barData);
    var series = barData.series.map(function (item, index) {
        item.type = 'bar';
        return item;
    });
    var chart = echarts.init(main);
    var option = {
        title: {
            text: barData.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '20%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            width: '50%',
            z: 100,
            children: [{
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                        // word-break:'break-all',
                        // word-wrap:'break-word'
                    }
                },
                //         {
                //             type: 'rect',
                //             z: 90,
                //             left: 'center',
                //             top: 'center',
                //             shape: {
                //                 width: 330,
                //                 height: 100
                //             },
                //             style: {
                //                 fill: '#4f515a'
                //             }
                // }
            ]
        }],
        //backgroundColor: '#2c343c',
        tooltip: {
            trigger: 'axis',
            // formatter: '{b} : {c} ', // 解决：多元分类+二元分类数据生成柱状图，每个多元分类项有应该两个对应二元分类的值，但是图中只显示二元分类其中的一个值
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            orient: 'vertical',
            // x: 'right',
            // y: 'center',
            // right:'5%',
            // right:'-2%',
            right: '2%',
            top: 'center',
            width: 'auto',
            height: 'auto',
            data: barData.objects,
            textStyle: {
                color: '#fff'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'top',

        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: barData.property,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                rotate: 0,
                interval: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        series: series
    };
    window.addEventListener("resize", function () {
        chart.resize();
    })
    console.log(chart.getWidth());
    console.log(chart.getHeight());
    return option;
    // chart.setOption(option, true); 
    // return chart;
}

function drawHorizBar(main, barData) {
    console.log(barData);
    var series = barData.series.map(function (item, index) {
        item.type = 'bar';
        return item;
    });
    console.log(series);
    var chart = echarts.init(main);
    var option = {
        title: {
            text: barData.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '20%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [{
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {
                    fill: '#fff',
                    text: [],
                    font: '10px Microsoft YaHei'
                }
            }]
        }],
        //backgroundColor: '#2c343c',
        tooltip: {
            trigger: 'axis',
            // formatter: '{b} : {c} ', // 解决：多元分类+二元分类数据生成柱状图，每个多元分类项有应该两个对应二元分类的值，但是图中只显示二元分类其中的一个值
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            orient: 'vertical',
            // x: 'left',
            // y: 'top',
            right: '2%',
            top: 'center',
            width: 'auto',
            height: 'auto',
            data: barData.objects,
            textStyle: {
                color: '#fff'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'top',

        },
        calculable: true,
        xAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                rotate: 0, //倾斜度 -90 至 90 默认为0 
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        yAxis: [{
            type: 'category',
            data: barData.property,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    interval: 0,
                    rotate: '40',
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        series: series
    };
    return option;
    // chart.setOption(option, true);

    // return chart;
}

function drawLine(main, lineData) {
    // console.log(lineData);
    var series = lineData.series.map(function (item, index) {
        item.type = 'line';
        item.smooth = true;
        return item;
    });
    var chart = echarts.init(main);
    var option = {
        title: {
            text: lineData.title,
            x: 'center',
            y: 'top',
            textStyle: {
                color: '#fff',
                fontWeight: 'lighter'
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '20%',
            bottom: '20%',
            containLabel: true
        },
        graphic: [{
            type: 'group',
            // rotation: Math.PI / 4,
            bounding: 'raw',
            left: '30%',
            bottom: '10%',
            z: 100,
            children: [
                // {
                //     type: 'rect',
                //     left: 'center',
                //     top: 'center',
                //     z: 100,
                //     shape: {
                //         width: 300,
                //         height: 35
                //     },
                //     style: {
                //         fill: 'rgba(0,0,0,0.3)'
                //     }
                // },
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#fff',
                        text: [],
                        font: '10px Microsoft YaHei'
                    }
                }
            ]
        }],
        //backgroundColor: '#2c343c',
        tooltip: {
            trigger: 'axis',
            formatter: '{b} : {c} ',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                color: '#fff'
            },
        },
        legend: {
            orient: 'vertical',
            // x: 'left',
            // y: 'top',
            right: '2%',
            top: 'center',
            width: 'auto',
            height: 'auto',
            data: lineData.objects,
            textStyle: {
                color: '#fff'
            },
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'top',
            // feature : {
            //     mark : {show: true},
            //     dataView : {show: true, readOnly: false},
            //     magicType : {show: true, type: ['line','stack','tiled', 'bar']},
            //     restore : {show: true},
            //     saveAsImage : {show: true}
            // }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: lineData.property,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                rotate: 0,
                interval: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            name: ' ',
            nameGap: 3,
            axisLabel: {
                formatter: '{value}'
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }],
        series: series
    };
    // chart.setOption(option, true);
    // return chart;
    return option;
}

function drawLineBar(main, linebarData) {
    var chart = echarts.init(main);
    var option = {
        backgroundColor: "#05224d",
        tooltip: {},
        grid: {
            top: "8%",
            left: "1%",
            right: "1%",
            bottom: "8%",
            containLabel: true
        },
        legend: {
            itemGap: 50,
            data: linebarData.objects,
            textStyle: {
                color: "#f9f9f9",
                borderColor: "#fff"
            }
        },
        xAxis: [{
            type: "category",
            boundaryGap: true,
            axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                    color: "#f9f9f9"
                }
            },
            axisLabel: {
                //坐标轴刻度标签的相关设置
                textStyle: {
                    color: "#d1e6eb",
                    margin: 15
                }
            },
            axisTick: {
                show: false
            },
            data: linebarData.property
        }],
        yAxis: [{
            type: "value",
            min: 0,
            // max: 140,
            splitNumber: 7,
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#0a3256"
                }
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                margin: 20,
                textStyle: {
                    color: "#d1e6eb"
                }
            },
            axisTick: {
                show: false
            }
        }],
        series: [{
                name: linebarData.objects[0],
                type: "line",
                // smooth: true, //是否平滑曲线显示
                //       symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                showAllSymbol: true,
                symbol: "emptyCircle",
                symbolSize: 6,
                lineStyle: {
                    normal: {
                        color: "#28ffb3" // 线条颜色
                    },
                    borderColor: "#f0f"
                },
                label: {
                    show: true,
                    position: "top",
                    textStyle: {
                        color: "#fff"
                    }
                },
                itemStyle: {
                    normal: {
                        color: "#28ffb3"
                    }
                },
                tooltip: {
                    show: false
                },
                areaStyle: {
                    //区域填充样式
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [{
                                    offset: 0,
                                    color: "rgba(0,154,120,1)"
                                },
                                {
                                    offset: 1,
                                    color: "rgba(0,0,0, 0)"
                                }
                            ],
                            false
                        ),
                        shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                },
                data: linebarData.series[0].data
            },
            {
                name: linebarData.objects[1],
                type: "bar",
                barWidth: 20,
                tooltip: {
                    show: false
                },
                label: {
                    show: true,
                    position: "top",
                    textStyle: {
                        color: "#fff"
                    }
                },
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                "#0ec1ff",
                                "#10cdff",
                                "#12daff",
                                "#15ebff",
                                "#17f8ff",
                                "#1cfffb",
                                "#1dfff1"
                            ];
                            return colorList[params.dataIndex];
                        }
                    }
                },
                data: linebarData.series[1].data
            }
        ]
    };
    window.addEventListener("resize", function () {
        chart.resize();
    })
    return option;
}

function drawArcBar(main, arcbarData) {
    var chart = echarts.init(main);

    function getData(percent) {
        return [{
                value: percent,
                name: percent,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#00B2EE"
                            },
                            {
                                offset: 1,
                                color: "#00DDE6"
                            }
                        ])
                    }
                }
            },
            {
                value: 1 - percent,
                itemStyle: {
                    normal: {
                        color: "transparent"
                    }
                }
            }
        ];
    }
    var placeHolderStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            }
        }
    };
    var sum = 0;
    var dataArr2 = arcbarData.series[0].data.map(item => Number(item))
    dataArr2.forEach(item => sum += item)
    if (!sum) {
        return false
    }
    var base = 80
    var seriesData = []
    dataArr2.map((item, index) => {
        seriesData.push({
            name: arcbarData.property[index],
            type: 'pie',
            clockWise: true, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [base, base + 20],
            itemStyle: placeHolderStyle,
            label: {
                normal: {
                    show: false
                }
            },
            data: getData((item/sum).toFixed(3))
        })
        base = base + 25
    })
    var option = {
        // backgroundColor: "#0E2A43",
        tooltip: {
            trigger: "item",
            formatter: function (params, ticket, callback) {
                return params.seriesName + ": " + params.name * 100 + "%";
            }
        },
        legend: {
            top: "25%",
            left: "40%",
            itemHeight: 18,
            data: arcbarData.property,
            textStyle: {
                color: "#fff"
            },

            selectedMode: true,
            orient: "vertical"
        },
        series: seriesData
    };
    window.addEventListener("resize", function () {
        chart.resize();
    })
    return option;

}

function drawWordCloud(main, wordcloudData) {
    var chart = echarts.init(main)
    var option = {
        title: {
            text: wordcloudData.title,
            // link: 'https://www.baidu.com/s?wd=' + encodeURIComponent('ECharts'),
            x: "center",
            textStyle: {
                fontSize: 23
            }
        },
        backgroundColor: "#F7F7F7",
        tooltip: {
            show: true
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    iconStyle: {
                        normal: {
                            color: "#FFFFFF"
                        }
                    }
                }
            }
        },
        series: [{
            name: wordcloudData.title,
            type: "wordCloud",
            // size: ['9%', '99%'],
            sizeRange: [6, 66],
            //textRotation: [0, 45, 90, -45],
            rotationRange: [-45, 90],
            //shape: 'circle',
            textPadding: 0,
            autoSize: {
                enable: true,
                minSize: 6
            },
            textStyle: {
                normal: {
                    color: function () {
                        return (
                            "rgb(" + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(",") +
                            ")"
                        );
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: "#333"
                }
            },
            data: []
        }]
    };

    var jsonList = [];

    Object.entries(wordcloudData.relations).map(item =>
        jsonList.push({
            'name': item[0],
            'value': item[1][0][0]
        })
    )

    option.series[0].data = jsonList;
    window.addEventListener('resize', function () {
        chart.resize();
    })
    return option
}

function drawTimeline(main, timeData) {
    var series = timeData.series.map(function (item, index) {
        item.type = 'line';
        item.smooth = true;
        item.symbol = 'none';
        item.sampling = 'average'; //折线图在数据量远大于像素点时候的降采样策略
        return item;
    });
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: timeData.title,
            textStyle: {
                color: '#fff'
            }
        },
        //backgroundColor: '#2c343c',
        toolbox: {
            show: true,
            // feature: {
            //     dataView: {show: true, readOnly: false},
            //     magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            //     restore: {show: true},
            //     saveAsImage: {show: true}
            // }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeData.property,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '50%'],
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#fff'
                }
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
        }, {
            start: 0,
            end: 10
        }],
        series: series
    };
    var myChart = echarts.init(main);
    myChart.setOption(option, true);

}

function drawTCHMap(main, areaData) {

    var chart = echarts.init(main);
    console.log(areaData);
    var min = [];
    var max = [];
    var optionIm = {};
    var getArr = function (seriesD) {
        var array0 = [];
        var lengthD = seriesD.length;
        var percent = 0.16;
        var len1 = 0;
        if (seriesD.length <= 6) {
            len1 = seriesD.length;
        } else {
            len1 = 6;
        }
        for (var i = 1; i < len1; i++) {
            var j0 = lengthD * percent * i;
            if (typeof j0 === 'number' && j0 % 1 === 0) {
                var ave = (parseFloat(seriesD[j0][1]) + parseFloat(seriesD[j0 + 1][1])) / 2
                array0[i] = parseFloat(ave);
            } else {
                array0[i] = parseFloat(seriesD[Math.ceil(j0)][1]);
            }
        };
        return array0;
    };


    var relationData = areaData.timeline.map(function (elem, index) {
        return areaData.relations[elem];
    });
    var arrOld = relationData[0].sort(function (a, b) {
        return a[1] - b[1];
    });;
    console.log(arrOld);
    var forVisual = getArr(arrOld);
    console.log(forVisual);
    console.log(relationData)

    var series = [{
        name: areaData.title,
        type: 'map',
        mapType: 'china', // 自定义扩展图表类型
        data: areaData.relations[areaData.objects[0]].map(function (elem, index) {
            // arr.push(elem[1]);
            return {
                name: elem[0],
                value: elem[1]
            };
        }),
        // symbolSize: function (val) {
        //     return val[2] / 300;
        // },
        label: {
            normal: {
                show: true,
                formatter: '{b}',
                position: 'right'

            },
            emphasis: {
                show: true
            }
        },
        itemStyle: {
            normal: {
                // areaColor: '#38b3d5',
                color: '#2694d5',
                areaColor: '#d8f5df'
            }

        }
    }]
    // console.log(convertCHData(relationData[0]));

    $.ajax({
        url: '../../static/json/china.json',
        async: false,
        type: "GET",
        success: function (geoJson) {

            echarts.registerMap('china', geoJson);

            var mapFeatures = geoJson.features;
            console.log(geoJson.features)
            // console.log(geoJson.features);
            mapFeatures.forEach(function (v) {
                // 地区名称
                var name = v.properties.name;
                // 地区经纬度
                geoCoordMap[name] = v.properties.cp;
            });

            var option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        // orient: 'vertical',
                        autoPlay: true,
                        // inverse: true,
                        playInterval: 3000,
                        // left: 20%,
                        // right: 0,
                        // top: 20,
                        // bottom: 20,
                        width: "50%",
                        x: '30%',
                        x2: '30%',
                        // height: null,

                        label: {
                            normal: {
                                textStyle: {
                                    color: '#ffffff'
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        symbol: 'none',
                        lineStyle: {
                            color: '#ffffff'
                        },
                        checkpointStyle: {
                            color: '#bbb',
                            borderColor: '#777',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            normal: {
                                color: '#ffffff',
                                borderColor: '#ffffff'
                            },
                            emphasis: {
                                color: '#aaa',
                                borderColor: '#aaa'
                            }
                        },
                        data: []
                    },
                    grid: {
                        top: '20%',
                        left: '3%',
                        right: '4%',
                        bottom: '20%',
                        containLabel: true
                    },
                    graphic: [{
                        type: 'group',
                        // rotation: Math.PI / 4,
                        bounding: 'raw',
                        left: '30%',
                        bottom: '10%',
                        z: 100,
                        children: [{
                            type: 'text',
                            left: 'center',
                            top: 'center',
                            z: 100,
                            style: {
                                fill: '#fff',
                                text: [],
                                font: '10px Microsoft YaHei'
                            }
                        }]
                    }],
                    title: {
                        text: areaData.title,
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}<br/>{c} '
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        top: 'center',
                        // feature: {
                        //     dataView: {readOnly: false},
                        //     // restore: {}
                        //     myTool: {
                        //         show: true,
                        //         title: '删除',
                        //         icon: 'image://http://echarts.baidu.com/images/favicon.png',
                        //         onclick: function () {
                        //             var el = $(main).parent().parent();
                        //             el.empty();
                        //             var txt = '<div class="chart-con-add">+</div>';
                        //             el.html(txt);
                        //         }
                        //     }
                        // }
                    },
                    visualMap: {
                        type: 'piecewise',
                        left: '5%',
                        bottom: '5%',
                        itemWidth: 16,
                        itemHeight: 11.2,
                        pieces: [{
                                gt: forVisual[5]
                            },
                            {
                                gt: forVisual[4],
                                lte: forVisual[5]
                            },
                            {
                                gt: forVisual[3],
                                lte: forVisual[4]
                            },
                            {
                                gt: forVisual[2],
                                lte: forVisual[3]
                            },
                            {
                                gt: forVisual[1],
                                lte: forVisual[2]
                            },
                            {
                                lte: forVisual[1]
                            }
                        ],
                        color: ['#147a29', '#299640', '#40ae57', '#57c16d', '#75d289', '#9be8ac'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    },
                    series: series
                },
                options: []
            }
            var data = areaData;
            console.log(data);
            for (var n = 0; n < data.timeline.length; n++) {
                option.baseOption.timeline.data.push(data.timeline[n]);
                var arrn = relationData[n].sort(function (a, b) {
                    return a[1] - b[1];
                });;
                console.log(arrn);
                var forVisualn = getArr(arrn);
                option.options.push({
                    title: {
                        show: true,
                        'text': areaData.title
                    },

                    grid: {
                        top: '20%',
                        left: '3%',
                        right: '4%',
                        bottom: '20%',
                        containLabel: true
                    },
                    graphic: [{
                        type: 'group',
                        // rotation: Math.PI / 4,
                        bounding: 'raw',
                        left: '30%',
                        bottom: '10%',
                        z: 100,
                        children: [{
                            type: 'text',
                            left: 'center',
                            top: 'center',
                            z: 100,
                            style: {
                                fill: '#fff',
                                text: [],
                                font: '10px Microsoft YaHei'
                            }
                        }]
                    }],
                    series: [{
                        name: '',
                        type: 'map',
                        mapType: 'china', // 自定义扩展图表类型
                        data: areaData.relations[areaData.objects[n]].map(function (elem, index) {
                            // arr.push(elem[1]);
                            return {
                                name: elem[0],
                                value: elem[1]
                            };
                        }),
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}',
                                position: 'right'


                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: '#d8f5df',
                                color: '#38B3D5'
                            }
                        }
                    }],
                    visualMap: {
                        type: 'piecewise',
                        left: '5%',
                        bottom: '5%',
                        itemWidth: 16,
                        itemHeight: 11.2,
                        pieces: [{
                                gt: forVisual[5]
                            },
                            {
                                gt: forVisual[4],
                                lte: forVisual[5]
                            },
                            {
                                gt: forVisual[3],
                                lte: forVisual[4]
                            },
                            {
                                gt: forVisual[2],
                                lte: forVisual[3]
                            },
                            {
                                gt: forVisual[1],
                                lte: forVisual[2]
                            },
                            {
                                lte: forVisual[1]
                            }
                        ],
                        color: ['#147a29', '#299640', '#40ae57', '#57c16d', '#75d289', '#9be8ac'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    }
                })
                // console.log(convertCHData(relationData[n]));
                if (areaData.color) {
                    var colorarr = areaData.color;
                    if (colorarr[0]) option.options[n].series[0].itemStyle.normal.color = colorarr[0];
                    if (colorarr[1]) option.options[n].series[1].itemStyle.normal.color = colorarr[1];
                }

            }
            if (areaData.color) {
                var colorarr = areaData.color;
                if (colorarr[0]) {
                    option.baseOption.series[0].itemStyle.normal.color = colorarr[0];
                }
                if (colorarr[1]) {
                    option.baseOption.series[1].itemStyle.normal.color = colorarr[1];
                }
                if (colorarr[2]) {
                    option.baseOption.geo.itemStyle.normal.areaColor = colorarr[2];
                }
                if (colorarr[3]) {
                    option.baseOption.geo.itemStyle.normal.borderColor = colorarr[3];
                }
            }
            console.log(option);

            optionIm = option;
            console.log(optionIm);

            // console.log(optionIm);
            // return (option);
            // console.log(option);

            // return option;
            // console.log(option.options.series)
            // var myChart = echarts.init(main);
            // myChart.setOption(option, true);
            // return (option);
        }
    })

    // alert("lll00");
    console.log(optionIm);

    return optionIm;
}

function drawAirCHMap(main, areaData) {

    var chart = echarts.init(main);
    console.log(areaData);
    var min = [];
    var max = [];
    var optionIm = {};
    var getArr = function (seriesD) {
        console.log(seriesD);
        var array0 = [];
        var lengthD = seriesD.length;
        var percent = 0.16;
        var len1 = 0;
        if (seriesD.length <= 6) {
            len1 = seriesD.length;
        } else {
            len1 = 6
        }
        for (var i = 1; i < len1; i++) {
            var j0 = lengthD * percent * i;

            if (typeof j0 === 'number' && j0 % 1 === 0) {
                var ave = (parseFloat(seriesD[j0][1]) + parseFloat(seriesD[j0 + 1][1])) / 2
                array0[i] = parseFloat(ave);
            } else {
                console.log(i);
                var u = Math.ceil(j0);
                console.log(seriesD[u][1]);
                array0[i] = parseFloat(seriesD[Math.ceil(j0)][1]);
            }

        };
        return array0;
    };


    var relationData = areaData.timeline.map(function (elem, index) {
        return areaData.relations[elem];
    });
    var arrOld = relationData[0].sort(function (a, b) {
        return a[1] - b[1];
    });;
    console.log(arrOld);
    var forVisual = getArr(arrOld);
    console.log(forVisual);
    console.log(relationData)

    var series = [{
        name: 'areaData.title',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertCHData(relationData[0]),
        // symbolSize: function (val) {
        //     return val[2] / 300;
        // },
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            },
            emphasis: {
                show: true
            }
        },
        itemStyle: {
            normal: {
                color: '#2694d5'
            }
        }
    }]
    // console.log(convertCHData(relationData[0]));

    $.ajax({
        url: '../../static/json/china.json',
        async: false,
        type: "GET",
        success: function (geoJson) {

            echarts.registerMap('china', geoJson);


            var option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        // orient: 'vertical',
                        autoPlay: true,
                        // inverse: true,
                        playInterval: 3000,
                        // left: 20,
                        // right: 20,
                        // top: null,
                        // bottom: 0,
                        // width: 55,
                        // height: null,
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#ffffff'
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        symbol: 'none',
                        lineStyle: {
                            color: '#ffffff'
                        },
                        checkpointStyle: {
                            color: '#bbb',
                            borderColor: '#777',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            normal: {
                                color: '#ffffff',
                                borderColor: '#ffffff'
                            },
                            emphasis: {
                                color: '#aaa',
                                borderColor: '#aaa'
                            }
                        },
                        data: []
                    },
                    title: {
                        text: 'areaData.title',
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}<br/>{c} '
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        top: 'center',
                        // feature: {
                        //     dataView: {readOnly: false},
                        //     // restore: {}
                        //     myTool: {
                        //         show: true,
                        //         title: '删除',
                        //         icon: 'image://http://echarts.baidu.com/images/favicon.png',
                        //         onclick: function () {
                        //             var el = $(main).parent().parent();
                        //             el.empty();
                        //             var txt = '<div class="chart-con-add">+</div>';
                        //             el.html(txt);
                        //         }
                        //     }
                        // }
                    },
                    visualMap: {
                        type: 'piecewise',
                        left: '5%',
                        bottom: '5%',
                        itemWidth: 16,
                        itemHeight: 11.2,
                        pieces: [{
                                gt: forVisual[5]
                            },
                            {
                                gt: forVisual[4],
                                lte: forVisual[5]
                            },
                            {
                                gt: forVisual[3],
                                lte: forVisual[4]
                            },
                            {
                                gt: forVisual[2],
                                lte: forVisual[3]
                            },
                            {
                                gt: forVisual[1],
                                lte: forVisual[2]
                            },
                            {
                                lte: forVisual[1]
                            }
                        ],
                        color: ['#0ec93a', '#30c954', '#4acc68', '#6acf81', '#87cf98', '#aacfb2'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        // roam: true,
                        itemStyle: {
                            normal: {
                                // areaColor: '#38b3d5',
                                areaColor: '#ccffcc',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series: series
                },
                options: []
            }
            var data = areaData;
            console.log(data);
            for (var n = 0; n < data.timeline.length; n++) {
                option.baseOption.timeline.data.push(data.timeline[n]);
                var arrn = relationData[n].sort(function (a, b) {
                    return a[1] - b[1];
                });;
                console.log(arrn);
                var forVisualn = getArr(arrn);
                option.options.push({
                    title: {
                        show: true,
                        'text': areaData.title
                    },

                    series: [{
                        name: '',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertCHData(relationData[n]),
                        // symbolSize: function (val) {
                        //     return val[2] / 300;
                        // },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#38B3D5'
                            }
                        }
                    }],
                    visualMap: {
                        type: 'piecewise',
                        left: '10%',
                        bottom: '10%',
                        itemWidth: 16,
                        itemHeight: 11.2,
                        pieces: [{
                                gt: forVisual[5]
                            },
                            {
                                gt: forVisual[4],
                                lte: forVisual[5]
                            },
                            {
                                gt: forVisual[3],
                                lte: forVisual[4]
                            },
                            {
                                gt: forVisual[2],
                                lte: forVisual[3]
                            },
                            {
                                gt: forVisual[1],
                                lte: forVisual[2]
                            },
                            {
                                lte: forVisual[1]
                            }
                        ],
                        color: ['#0ec93a', '#30c954', '#4acc68', '#6acf81', '#87cf98', '#aacfb2'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    },
                })
                // console.log(convertCHData(relationData[n]));
                if (areaData.color) {
                    var colorarr = areaData.color;
                    if (colorarr[0]) option.options[n].series[0].itemStyle.normal.color = colorarr[0];
                    if (colorarr[1]) option.options[n].series[1].itemStyle.normal.color = colorarr[1];
                }

            }
            if (areaData.color) {
                var colorarr = areaData.color;
                if (colorarr[0]) {
                    option.baseOption.series[0].itemStyle.normal.color = colorarr[0];
                }
                if (colorarr[1]) {
                    option.baseOption.series[1].itemStyle.normal.color = colorarr[1];
                }
                if (colorarr[2]) {
                    option.baseOption.geo.itemStyle.normal.areaColor = colorarr[2];
                }
                if (colorarr[3]) {
                    option.baseOption.geo.itemStyle.normal.borderColor = colorarr[3];
                }
            }
            console.log(option);

            optionIm = option;
            console.log(optionIm);

            // console.log(optionIm);
            // return (option);
            // console.log(option);

            // return option;
            // console.log(option.options.series)
            // var myChart = echarts.init(main);
            // myChart.setOption(option, true);
            // return (option);
        }
    })

    // alert("lll00");
    console.log(optionIm);

    return optionIm;
}

var drawCHMap = function (main, areaData) {
    console.log(areaData);
    var color = ['#D8D8DD', '#8FC591', '#13A439'];
    var colorarr = [];
    var optionIm = {};
    if (areaData.color) {
        colorarr = areaData.color;
    } else {
        colorarr = color;
    }
    var arr = [];
    var series = areaData.objects.map(function (elem, index) {
        // alert(index);
        //  alert(elem);
        var oj = {
            name: areaData.title,
            type: 'map',
            mapType: 'china', // 自定义扩展图表类型
            itemStyle: {
                normal: {
                    label: {
                        show: true
                    },
                    // areaColor: '#38b3d5',
                    areaColor: '#d8f5df'
                },
                emphasis: {
                    label: {
                        show: true
                    },
                }
            },
            data: areaData.relations[elem].map(function (elem, index) {
                arr.push(elem[1]);
                return {
                    name: elem[0],
                    value: elem[1]
                };
            })
        };
        return oj;
    });
    var getArr = function (seriesD) {
        var array0 = [];
        var lengthD = seriesD.length;
        var percent = 0.16;
        for (var i = 1; i < 6; i++) {
            var j0 = lengthD * percent * i;
            if (typeof j0 === 'number' && j0 % 1 === 0) {
                var ave = (parseFloat(seriesD[j0]) + parseFloat(seriesD[j0 + 1])) / 2
                array0[i] = parseFloat(ave);
            } else {
                array0[i] = parseFloat(seriesD[Math.ceil(j0)]);
            }
        };
        return array0;
    };



    var arr2 = arr.sort(function (a, b) {
        return a - b;
    });
    var forVisual = getArr(arr2);
    var length = arr2.length - 1;
    // console.log('hello'+arr2[length]);
    // var a = JSON.stringify(series);
    // console.log('hello' + a);
    $.ajax({
        url: '../../static/json/china.json',
        async: false,
        type: "GET",
        success: function (geoJson) {



            echarts.registerMap('china', geoJson);
            var mapChart = echarts.init(main);
            var option = {
                title: {
                    text: areaData.title,
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c} '
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                graphic: [{
                    type: 'group',
                    // rotation: Math.PI / 4,
                    bounding: 'raw',
                    left: '30%',
                    bottom: '10%',
                    z: 100,
                    children: [{
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        z: 100,
                        style: {
                            fill: '#fff',
                            text: [],
                            font: '10px Microsoft YaHei'
                        }
                    }]
                }],
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',

                },
                visualMap: {
                    type: 'piecewise',
                    left: '5%',
                    bottom: '5%',
                    itemWidth: 16,
                    itemHeight: 11.2,
                    pieces: [{
                            gt: forVisual[5]
                        },
                        {
                            gt: forVisual[4],
                            lte: forVisual[5]
                        },
                        {
                            gt: forVisual[3],
                            lte: forVisual[4]
                        },
                        {
                            gt: forVisual[2],
                            lte: forVisual[3]
                        },
                        {
                            gt: forVisual[1],
                            lte: forVisual[2]
                        },
                        {
                            lte: forVisual[1]
                        }
                    ],
                    color: ['#147a29', '#299640', '#40ae57', '#57c16d', '#75d289', '#9be8ac'],
                    textStyle: {
                        color: '#fff',
                        fontSize: 10
                    }
                },
                series: series
            };
            optionIm = option;
        }

    });
    return optionIm;
}
var drawMapArea = function (main, areaData) {
    // var b = JSON.stringify(areaData);
    // console.log(b);
    var color = ['#D8D8DD', '#8FC591', '#13A439'];
    var colorarr = [];
    var optionIm = {};
    if (areaData.color) {
        colorarr = areaData.color;
    } else {
        colorarr = color;
    }
    var arr = [];
    var series = areaData.objects.map(function (elem, index) {
        //alert(index,elem);
        var oj = {
            name: areaData.title,
            type: 'map',
            mapType: 'guangdong', // 自定义扩展图表类型
            itemStyle: {
                normal: {
                    label: {
                        show: true
                    },
                    // areaColor: '#38b3d5',
                    areaColor: '#d8f5df'
                },
                emphasis: {
                    label: {
                        show: true
                    },
                }
            },
            // itemStyle:{
            //     normal:{label:{show:true}},
            //     emphasis:{label:{show:true}}
            // },
            data: areaData.relations[elem].map(function (elem, index) {
                arr.push(elem[1]);
                return {
                    name: elem[0],
                    value: elem[1]
                };
            })
        };
        return oj;
    });
    var arr2 = arr.sort(function (a, b) {
        return a - b;
    });

    var length = arr2.length - 1;
    console.log('hello' + arr2[length]);
    // var a = JSON.stringify(series);
    // console.log('hello' + a);
    $.ajax({
        url: '../../static/json/guangdong.json',
        async: false,
        type: "GET",
        success: function (geoJson) {



            echarts.registerMap('guangdong', geoJson);
            var mapChart = echarts.init(main);
            option = {
                title: {
                    text: areaData.title,
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    },
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                graphic: [{
                    type: 'group',
                    // rotation: Math.PI / 4,
                    bounding: 'raw',
                    left: '30%',
                    bottom: '10%',
                    z: 100,
                    children: [{
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        z: 100,
                        style: {
                            fill: '#fff',
                            text: [],
                            font: '10px Microsoft YaHei'
                        }
                    }]
                }],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c} '
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    // feature: {
                    //     dataView: {readOnly: false},
                    //     restore: {},
                    //     saveAsImage: {}
                    // }
                },
                visualMap: {
                    min: Number(arr2[0]),
                    max: Number(arr2[length]),
                    text: ['高', '低'],
                    calculable: true,
                    inRange: {
                        // color: ['#87C4ED', '#58C3E0','#0079BA']
                        color: colorarr
                    },
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: series
            };
            optionIm = option;
        }

    });
    console.log(optionIm);
    return optionIm;

}

function drawParallel(main, paraData) {
    // Schema:
    // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.5
        }
    };
    var series = paraData.objects.map(function (item, index) {
        return {
            name: item,
            type: 'parallel',
            lineStyle: lineStyle,
            data: paraData.relations[item]
        };
    });
    //console.log(series);
    var schema = paraData.property.map(function (item, index) {
        return {
            'name': item,
            'index': index,
            'text': item
        };
    });
    var axis = paraData.property.map(function (item, index) {
        return {
            dim: index,
            name: item
        };
    });
    //console.log(axis);

    var option = {
        //backgroundColor: '#2c343c',
        legend: {
            bottom: 30,
            data: paraData.objects,
            itemGap: 20,
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1
        },
        // dataZoom: {
        //     show: true,
        //     orient: 'vertical',
        //     parallelAxisIndex: [0]
        // },
        parallelAxis: axis,
        visualMap: {
            show: true,
            min: 0,
            max: 150,
            dimension: 2,
            inRange: {
                color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
                // colorAlpha: [0, 1]
            }
        },
        parallel: {
            left: '5%',
            right: '18%',
            bottom: 100,
            parallelAxisDefault: {
                type: 'value',
                name: '',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#777'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        },
        series: series
    };
    var chart = echarts.init(main);
    chart.setOption(option, true);
}

function drawTree(width, height, svg, data) {
    //树状图布局
    var tree = d3.layout.tree()
        .size([height, width]);

    //对角线生成器
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var root = data;

    //给第一个节点添加初始坐标x0和x1
    root.x0 = height / 2 + 50;
    root.y0 = 0;

    //以第一个节点为起始节点，重绘
    redrawTree(root);

    //重绘函数
    function redrawTree(source) {

        /*
        （1） 计算节点和连线的位置
        */

        //应用布局，计算节点和连线
        var nodes = tree.nodes(root);
        var links = tree.links(nodes);

        //重新计算节点的y坐标
        nodes.forEach(function (d) {
            d.y = d.depth * 180;
        });

        /*
        （2） 节点的处理
        */

        //获取节点的update部分
        var nodeUpdate = svg.selectAll(".node")
            .data(nodes, function (d) {
                return d.name;
            });

        //获取节点的enter部分
        var nodeEnter = nodeUpdate.enter();

        //获取节点的exit部分
        var nodeExit = nodeUpdate.exit();

        //1. 节点的 Enter 部分的处理办法
        var enterNodes = nodeEnter.append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", function (d) {
                toggle(d);
                redrawTree(d);
            });

        enterNodes.append("circle")
            .attr("r", 0)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        enterNodes.append("text")
            .attr("x", function (d) {
                return d.children || d._children ? -14 : 14;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                return d.name;
            })
            .style("fill-opacity", 0);


        //2. 节点的 Update 部分的处理办法
        var updateNodes = nodeUpdate.transition()
            .duration(500)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        updateNodes.select("circle")
            .attr("r", 8)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        updateNodes.select("text")
            .style("fill-opacity", 1);

        //3. 节点的 Exit 部分的处理办法
        var exitNodes = nodeExit.transition()
            .duration(500)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        exitNodes.select("circle")
            .attr("r", 0);

        exitNodes.select("text")
            .style("fill-opacity", 0);

        /*
        （3） 连线的处理
        */

        //获取连线的update部分
        var linkUpdate = svg.selectAll(".link")
            .data(links, function (d) {
                return d.target.name;
            });

        //获取连线的enter部分
        var linkEnter = linkUpdate.enter();

        //获取连线的exit部分
        var linkExit = linkUpdate.exit();

        //1. 连线的 Enter 部分的处理办法
        linkEnter.insert("path", ".node")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .transition()
            .duration(500)
            .attr("d", diagonal);

        //2. 连线的 Update 部分的处理办法
        linkUpdate.transition()
            .duration(500)
            .attr("d", diagonal);

        //3. 连线的 Exit 部分的处理办法
        linkExit.transition()
            .duration(500)
            .attr("d", function (d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();


        /*
        （4） 将当前的节点坐标保存在变量x0、y0里，以备更新时使用
        */
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    }

    //切换开关，d 为被点击的节点
    function toggle(d) {
        if (d.children) { //如果有子节点
            d._children = d.children; //将该子节点保存到 _children
            d.children = null; //将子节点设置为null
        } else { //如果没有子节点
            d.children = d._children; //从 _children 取回原来的子节点 
            d._children = null; //将 _children 设置为 null
        }
    }
}

function drawFord(svg, width, height, nodes, edges) {
    //2.转换数据
    var force = d3.layout.force()
        .nodes(nodes) //设定顶点数组
        .links(edges) //设定边数组
        .size([width, height]) //设定作用范围
        .linkDistance(90) //设定边的距离
        .charge(function (d) {
            return Math.random() * (-1000);
        }); //设定顶点的电荷数

    force.start(); //开启布局计算

    // console.log(nodes); //输出转换后的数据
    // console.log(edges);

    //3.绘制
    var color = d3.scale.category20();

    var drag = force.drag()
        .on("dragstart", function (d) {
            //拖拽开始后设定被拖拽对象为固定
            d.fixed = true;
        })
        .on("dragend", function (d, i) {
            //拖拽结束后变为原来的颜色
            d3.select(this).style("fill", color(i));
        })
        .on("drag", function (d) {
            //拖拽中对象变为黄色
            d3.select(this).style("fill", "yellow");
        });

    //绘制连线
    var lineupdate = svg.selectAll(".forceLine")
        .data(edges);
    var lineenter = lineupdate.enter().append("line")
        .attr("class", "forceLine");;
    var lineexit = svg.selectAll(".forceLine")
        .data(edges)
        .exit().remove();

    //绘制节点
    var circlesupdate = svg.selectAll(".forceCircle")
        .data(nodes);
    var circlesenter = circlesupdate.enter()
        .append("circle")
        .attr("class", "forceCircle")
        .attr("r", 20)
        .style("fill", function (d, i) {
            return color(i);
        })
        .call(force.drag);
    var circlesexit = circlesupdate.exit().remove;

    //绘制文字
    var textsupdate = svg.selectAll(".forceText")
        .data(nodes);
    var textsenter = textsupdate.enter()
        .append("text")
        .attr("class", "forceText")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("dy", ".3em")
        .text(function (d) {
            return d.name;
        });
    var textsexit = textsupdate.exit().remove();
    //tick事件的监听器
    force.on("tick", function () {

        //更新边
        lineenter.attr("x1", function (d) {
            return d.source.x;
        });
        lineenter.attr("y1", function (d) {
            return d.source.y;
        });
        lineenter.attr("x2", function (d) {
            return d.target.x;
        });
        lineenter.attr("y2", function (d) {
            return d.target.y;
        });

        //更新顶点
        circlesenter.attr("cx", function (d) {
            return d.x;
        });
        circlesenter.attr("cy", function (d) {
            return d.y;
        });

        //更新顶点文字
        textsenter.attr("x", function (d) {
            return d.x;
        });
        textsenter.attr("y", function (d) {
            return d.y;
        });

    });


    //力学图运动开始时
    force.on("start", function () {
        console.log("运动开始");
    });

    //力学图运动结束时
    force.on("end", function () {
        console.log("运动结束");
    });
}

function _deepCopy(obj) {
    let str, newobj;
    str = newobj = obj instanceof Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj) // 系列化对象
        newobj = JSON.parse(str) // 还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? _deepCopy(obj[i]) : obj[i];
        }
    }
    return newobj;
}

function drawWord(main, wordData) {

    var fill = d3.scale.category20();
    d3.layout.cloud().size([500, 500])
        .words(wordData)
        .padding(5)
        .rotate(function () {
            return ~~(Math.random() * 2) * 90;
        })
        //.font("Impact")
        .fontSize(function (d) {
            return d.value;
        })
        .on("end", draw)
        .start();

    function draw(words) {
        var svg = d3.select(main).append("svg").attr('id', 'svgWord')
            .attr("width", 500)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(180,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size + "px";
            })
            //.style("font-family", "Impact")
            .style("fill", function (d, i) {
                return fill(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                //return "translate("+[d.x,d.y]+")";
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.name;
            });
    }
}

function match(data, index) {

    // relationtype 数据类型，index 布局类型
    // relationtype 1 yiwei 2 2wei  7 map 
    // index 1 pie  2: Line 3: bar 4: Timeline 5 Parallel 6: Tree 7: Ford 8: map 9:Word 10 horizBar
    relationtype = parseInt(data.relationtype);
    index = parseInt(index);
    //console.log(relationtype+ '' +index);
    if (relationtype === 1 && (index === 8 || index === 11 || index === 41 || index === 42 || index === 38 || index === 44 || index === 46 || index === 47)) {

        createPop();
        return false;
    }
    if (relationtype === 2 && (index === 1 || index === 13 || index === 34 || index === 35 || index === 37 || index === 47)) {
        // alert(123)
        createPop();
        return false;
    }
    if (relationtype === 7 && (index === 1 || index === 13 || index === 34 || index === 35 || index === 37 || index === 47)) {

        createPop();
        return false;
    }
    if (relationtype === 3 && (index !== 47)) {

        createPop();
        return false;
    }
    return true;

    function createPop() {
        // alert(456)
        var pop = '<div class="popup">\
                        <span class="popup-info">数据类型与布局不匹配</span>\
                        <div class="popup-close"></div>\
                       </div>';
        $('body').append(pop);
        $('body').on('click', '.popup-close', function () {
            $('.popup').remove();
        });
        setTimeout(function () {
            $('.popup').remove();
        }, 5000);
    }
}

var model = {

    'change': function (data, index) {
        var $this = this;
        if (data) {
            // alert(123)
            index = parseInt(index);
            relationtype = parseInt(data.relationtype);
            //console.log(data);
            //console.log(match(data, index));
            if (index !== 0 && match(data, index)) {

                // relationtype 1 yiwei 2 2wei  3 duowei 4 shijian 5 cengci 6 wangluo 7 map 8 zi
                // index 1 pie  2: Line 3: basicbar 4: Timeline 5 Parallel 6: Tree 7: Ford 8: map 9:Word 10 Horizbar 11 AirMap
                if (index === 1 || index === 14 || index === 37) {
                    switch (relationtype) {
                        case 1:
                            return $this.pieData(data);
                            break;
                        case 2:
                        case 4:
                        case 7:
                        case 8:
                            return $this.comToPie(data);
                            break;
                    }
                }
                if (index === 2 || index===69 || index === 21 || index === 31 || index === 3 || index === 33 || index === 4 || index === 10 || index === 13 || index === 39) {
                    switch (relationtype) {
                        case 1:
                            return $this.pieToCom(data);
                            break;
                        case 2:
                        case 4:
                        case 7:
                        case 8:
                            return $this.comLData(data);
                            break;
                    }
                }
                if (index === 32) {
                    switch (relationtype) {
                        case 2:
                        case 4:
                        case 7:
                        case 8:
                            return $this.pointData(data);
                            break;
                    }
                }
                if (index === 5) {
                    switch (relationtype) {
                        case 1:
                            return $this.radar(data);
                            break;
                        case 2:
                        case 4:
                        case 7:
                        case 8:
                            return $this.radarData(data);
                            break;
                    }


                }

                if (index === 6) {
                    return $this.treeData(data);
                }
                if (index === 7) {
                    return $this.fordData(data);
                }
                if (index === 8) {
                    console.log(index);
                    return $this.mapData(data);
                }
                if (index === 11) {
                    console.log(index)
                    return $this.timeMapData(data);
                }
                if (index === 9) {
                    return $this.wordData(data);
                }
                if (index === 20) {
                    return $this.boxPlotData(data);
                }
                if (index === 12) {
                    return $this.liquidfill(data);
                }
                if (index === 38) {
                    console.log(index);
                    return $this.barMapData(data);
                }

                if (index === 36) {
                    switch (relationtype) {
                        case 1:
                            return $this.SunData1(data);
                            break;
                        case 2:
                        case 7:
                            return $this.SunData2(data);
                            break;
                    }
                }
                if (index === 48 || (index === 51 && relationtype === 1)) {
                    return $this.pieToCom(data);
                }
                if (index === 49) {
                    return $this.comLData(data);
                }
                // if(index === 13){
                //  return $this.radar(data);
                // }
                // if(index === 14){
                //  return $this.funnel(data);
                // }

            } //if(index)
        } //if(data)
    },
    'addColor': function (color, data, index) {
        var $this = this;
        var doj = $this.change(data, index);
        doj.color = color;
        return doj;
    },
    'boxPlotData': function (data) {
        console.log(data);
        if (data) {
            var oj = data.objects;
            var series = [];
            var boxdata = [];
            for (var i = 0; i < oj.length; i++) {
                var name = oj[i];
                series.push(data.relations[name][0][0]);
            }
            for (var i = 0; i < oj.length; i++) {
                var name = oj[i];
                boxdata.push(data.relations[name][0][1]);
            }
            var obj = {
                title: data.title,
                describe: data.describe,
                objects: data.title,
                series: [{
                    name: data.title,
                    data: series
                }],
                property: data.objects,
                boxdata: boxdata,
            }
            if (data.color) obj.color = data.color;
            return obj;
        }
    },
    'barMapData': function (data) {
        if (parseInt(data.relationtype) == 7 || parseInt(data.relationtype) == 2) {
            var barMapData = {};
            barMapData.describe = data.describe;
            barMapData.title = data.title;
            barMapData.relationtype = data.relationtype;
            barMapData.relations = data.relations;
            console.log(barMapData);
            return barMapData;
        }
    },

    'liquidfill': function (data) {

        var dobj = {};
        if (data.objects.length > 0) {
            var i;
            var oj = data.objects;
            var series = [];
            // for(i = 0; i < 1; i++) {
            //     var name = oj[i];
            //     series.push(data.relations[name][0][0]);
            // }
            var name = oj[1];
            series.push(data.relations[name][0][0]);
            series.push(data.relations[name][0][0] * 0.5 / 0.6);
            series.push(data.relations[name][0][0] * 0.4 / 0.6);
            series.push(data.relations[name][0][0] * 0.3 / 0.6);
            dobj.title = data.title;
            dobj.property = data.property[0];
            dobj.describe = data.describe;
            dobj.series = series;
        }
        if (data.color) dobj.color = data.color;
        return dobj;
    },
    'radar': function (data) {
        if (data) {
            var oj = data.objects;
            var series = [];
            // for(var name in data.relations){
            //     series.push(data.relations[name][0][0]);
            // }
            for (var i = 0; i < oj.length; i++) {
                var name = oj[i];
                series.push(data.relations[name][0][0]);
            }
            var obj = {
                title: data.title,
                describe: data.describe,
                objects: data.title,
                series: [{
                    name: data.title,
                    value: series
                }],
                property: data.objects
            }
            if (data.color) obj.color = data.color;
            return obj;
        };

    },
    'radarData': function (data) {
        var propertyArr = [];
        var series = [];
        var property;
        for (var i = 0; i < data.objects.length; i++) {
            var name = data.objects[i];
            var arr = _.unzip(data.relations[name]);
            propertyArr.push(arr[0]);
            series.push({
                name: name,
                value: arr[1]
            });
        }
        //debugger
        //&& propertyArr[0].length !== propertyArr[1].length
        if (data.property.length > 1) {
            var objArr = [];
            for (var i = 0; i < propertyArr.length; i++) {
                var obj = {
                    title: data.title,
                    objects: data.objects.slice(i, i + 1),
                    describe: data.describe,
                    series: series.slice(i, i + 1),
                    property: propertyArr[i]
                };
                objArr.push(obj);
            }
            return objArr; //f返回对象数组
        } else {
            var obj = {
                title: data.title,
                describe: data.describe,
                objects: data.objects,
                series: series,
                property: propertyArr[0]
            };
            if (data.color) obj.color = data.color;
            return obj; //对象
        }

        //console.log(data);

    },
    'funnel': function (data) {
        return data
    },
    'pieData': function (data) {
        /*返回饼图数据格式
        {
            title:'',
            property:[],
            series:[{name:'',value:''}],
            describe:''
            ]
        }
        */
        //console.log(data);
        var dobj = {};
        if (data.objects.length > 0) {
            var i;
            var oj = data.objects;
            var series = [];
            for (i = 0; i < oj.length; i++) {
                var name = oj[i];
                series.push({
                    name: name,
                    value: data.relations[name][0][0]
                });
            }
            dobj.title = data.title;
            dobj.property = data.property[0];
            dobj.describe = data.descrizzzsAbe;
            dobj.series = series;
        }
        if (data.color) dobj.color = data.color;
        return dobj;
    },
    'pieToCom': function (data) {
        if (data) {
            var oj = data.objects;
            var series = [];
            // for(var name in data.relations){
            //     series.push(data.relations[name][0][0]);
            // }
            for (var i = 0; i < oj.length; i++) {
                var name = oj[i];
                series.push(data.relations[name][0][0]);
            }
            var obj = {
                title: data.title,
                describe: data.describe,
                objects: data.title,
                series: [{
                    name: data.title,
                    data: series
                }],
                property: data.objects
            }
            if (data.color) obj.color = data.color;
            return obj;
        }
    },
    'comLData': function (data) {
        //{
        // title:'',
        // property:[],
        // describe: '',
        // objects:[],
        // series:[{name:object, data:[]}]
        // }
        //
        // }
        var propertyArr = [];
        var series = [];
        var property;
        for (var i = 0; i < data.objects.length; i++) {
            var name = data.objects[i];
            var arr = _.unzip(data.relations[name]);
            propertyArr.push(arr[0]);
            series.push({
                name: name,
                data: arr[1]
            });
        }
        //debugger
        //&& propertyArr[0].length !== propertyArr[1].length
        if (data.property.length > 1) {
            var objArr = [];
            for (var i = 0; i < propertyArr.length; i++) {
                var obj = {
                    title: data.title,
                    objects: data.objects.slice(i, i + 1),
                    describe: data.describe,
                    series: series.slice(i, i + 1),
                    property: propertyArr[i]
                };
                objArr.push(obj);
            }
            return objArr; //f返回对象数组
        } else {
            var obj = {
                title: data.title,
                describe: data.describe,
                objects: data.objects,
                series: series,
                property: propertyArr[0]
            };
            if (data.color) obj.color = data.color;
            return obj; //对象
        }

        //console.log(data);

    },
    'pointData': function (data) {

        var series = [];
        var property;
        for (var i = 0; i < data.objects.length; i++) {
            var name = data.objects[i];
            var arr = data.relations[name];
            series.push({
                name: name,
                data: arr
            });
        }
        //debugger
        //&& propertyArr[0].length !== propertyArr[1].length

        var obj = {
            title: data.title,
            describe: data.describe,
            objects: data.objects,
            series: series,
        };

        if (data.color) obj.color = data.color;
        return obj; //对象


        //console.log(data);

    },
    'comToPie': function (data) {
        if (data) {
            var objArr = [];
            for (var i = 0; i < data.objects.length; i++) {
                var name = data.objects[i];
                var arr = _.unzip(data.relations[name]);
                var series = data.relations[name].map(function (item, index) {
                    //console.log(item, index);
                    return {
                        name: item[0],
                        value: item[1]
                    };
                });
                var obj = {
                    title: data.title,
                    property: arr[0],
                    describe: data.describe,
                    objects: [name],
                    series: series
                }
                if (data.color) obj.color = data.color;
                objArr.push(obj);
            }
            return objArr;
        }
    },
    'comData': function (data) { //data.property.length === 1 返回对象 2 返回数组
        console.log(data);
        var i;
        var array = [];
        var dataobj = {};
        if ((data.property.length === 1 && data.objects.length > 0) || (data.objects.length == 1)) {
            var i, oj = data.objects;
            //alert(1);
            dataobj.title = data.title;
            dataobj.objects = data.objects;
            dataobj.property = data.property[0];
            dataobj.relations = data.relations;
            if (data.color) dataobj.color = data.color;
            return dataobj;
        }

        if ((data.property.length > 1) || (data.property.length === 1 && data.objects.length === 1)) {
            for (i = 0; i < data.objects.length; i++) {
                dataobj = {};
                dataobj.title = data.title;
                dataobj.objects = [];
                dataobj.objects.push(data.objects[i]);
                dataobj.property = data.property[i];
                dataobj.relations = {};
                dataobj.relations[data.objects[i]] = data.relations[data.objects[i]];
                if (data.color) dataobj.color = data.color;
                array.push(dataobj);
            }
            console.log(array);
            return array;
        }

    },

    'treeData': function (data) {
        var dataobj = {
            'name': '如何学习D3',
            'children': [{
                    'name': '预备知识',
                    'children': [{
                            'name': 'HTML & CSS'
                        },
                        {
                            'name': 'JavaScript'
                        },
                        {
                            'name': 'DOM'
                        },
                        {
                            'name': 'SVG'
                        }
                    ]
                },
                {
                    'name': '安装',
                    'children': [{
                            'name': '记事本软件',
                            'children': [{
                                    'name': 'Notepad++'
                                },
                                {
                                    'name': 'EditPlus'
                                },
                                {
                                    'name': 'Sublime Text'
                                }
                            ]
                        },
                        {
                            'name': '服务器软件',
                            'children': [{
                                    'name': 'Apache Http Server'
                                },
                                {
                                    'name': 'Tomcat'
                                }
                            ]
                        },
                        {
                            'name': '下载D3.js'
                        }
                    ]
                }
            ]
        };
        if (data) {
            return data.relations;
        }
        if (data.color) dataobj.color = data.color;
        return dataobj;
    },
    'fordData': function (data) {
        var dataobj = {
            'nodes': [{
                    id: 1234,
                    name: '中国',
                    value: 123
                },
                {
                    id: 1234,
                    name: '保定',
                    value: 123
                },
                {
                    id: 1234,
                    name: '北京',
                    value: 123
                },
                {
                    id: 1234,
                    name: '上海',
                    value: 123
                },
                {
                    id: 1234,
                    name: '天津',
                    value: 123
                },
                {
                    id: 1234,
                    name: '河北',
                    value: 123
                },
                {
                    id: 1234,
                    name: '海淀区',
                    value: 123
                },
                {
                    id: 1234,
                    name: '西城区',
                    value: 123
                }
            ],
            'edges': [{
                    source: 0,
                    target: 2,
                    weight: 2
                }, //source,target为node的索引号
                {
                    source: 0,
                    target: 3,
                    weight: 2
                },
                {
                    source: 0,
                    target: 4,
                    weight: 2
                },
                {
                    source: 0,
                    target: 5,
                    weight: 2
                },
                {
                    source: 2,
                    target: 6,
                    weight: 2
                },
                {
                    source: 2,
                    target: 7,
                    weight: 2
                },
                {
                    source: 5,
                    target: 1,
                    weight: 2
                }
            ]
        };
        if (data) {
            if (data.objects.length > 0) {
                var objects = {};
                dataobj.nodes = data.objects.map(function (item) {
                    objects[item] = 0;
                    return {
                        name: item
                    };
                });
                dataobj.edges = [];
                data.relations.map(function (item, index) {
                    var oj = item;
                    var targetlist = item.target.map(function (item, index) {
                        objects[oj.source]++;
                        objects[item]++;
                        // console.log(item);
                        return {
                            source: data.objects.indexOf(oj.source),
                            target: data.objects.indexOf(item)
                        };
                    })
                    $.merge(dataobj.edges, targetlist);
                });
                dataobj.objects = objects;
                console.log(dataobj);
            }
            if (data.color) dataobj.color = data.color;
        }

        return dataobj;
    },
    'timeMapData': function (data) {
        if (parseInt(data.relationtype) == 7 || parseInt(data.relationtype) == 2) {
            var dj = {};
            dj.describe = data.describe;
            dj.title = data.title;
            dj.objects = data.objects;
            dj.relationtype = data.relationtype;
            dj.relations = data.relations;
            dj.property = data.property[0];
            dj.timeline = [];
            for (var item in data.relations) {
                dj.timeline.push(item)
            }
            if (data.color) dj.color = data.color;
            console.log(dj);
            return dj;
        }
    },
    'mapData': function (data) {
        if (parseInt(data.relationtype) == 7 || parseInt(data.relationtype) == 2) {
            var dj = {};
            dj.describe = data.describe;
            dj.title = data.title;
            dj.objects = data.objects;
            dj.relationtype = data.relationtype;
            dj.relations = data.relations;
            dj.property = data.property[0];
            if (data.color) dj.color = data.color;
            console.log(dj);
            return dj;
        }
    },
    'map2Com': function (data) {
        if (parseInt(data.relationtype) === 7 || parseInt(data.relationtype) == 2) {
            var dj = {};
            dj.describe = data.describe;
            dj.title = data.title;
            dj.objects = data.objects;
            dj.relationtype = data.relationtype
            dj.relations = {};
            dj.property = [];
            var subproperty = {};
            for (var it in data.relations) {

                var value = [];
                data.relations[it].map(function (item, index) {
                    subproperty[item[0]] = item[0];
                    value.push(item[1]);
                });
                dj.relations[it] = [];
                dj.relations[it].push(value);
            }
            for (var i in subproperty) {
                dj.property.push(i);
            }
            if (data.color) dj.color = data.color;
            console.log(dj);
            return dj;
        }
    },
    'wordData': function (data) {
        var arr = [];
        for (var i in data.relations) {
            var o = data.relations[i];
            var a = o.map(function (item, index) {
                return {
                    name: item[0],
                    value: item[1]
                };
            });
            console.log(a);
            arr = arr.concat(a);
        }
        if (data.color) arr.color = data.color;
        return arr;
    },
    'SunData1': function (data) {
        if (data) {
            var oj = data.objects; //array
            var series = [];
            for (var i = 0; i < oj.length; i++) {
                var name = oj[i];
                series.push({
                    name: name,
                    value: parseFloat(data.relations[name][0][0])
                });
            }
            var obj = {
                title: data.title,
                describe: data.describe,
                series: series,
                property: data.property[0][0]
                // series: [{name:data.title, data: series}],
                // property: data.objects
            }
            // if(data.color) obj.color=data.color;
            return obj;
        }
    },
    'SunData2': function (data) {
        if (data) {
            var oj = data.objects; //array
            var series = [];
            for (var i = 0; i < oj.length; i++) {
                var children = [];
                var name = oj[i];
                console.log(data.relations[name].length);
                for (var j = 0; j < data.relations[name].length; j++) {
                    var name2 = data.relations[name][j][0];
                    children.push({
                        name: name2,
                        value: parseInt(data.relations[name][j][1])
                    });
                }
                series.push({
                    name: name,
                    children: [{
                        name: data.property[0][0],
                        children: children
                    }]
                });
            }
            var obj = {
                title: data.title,
                describe: data.describe,
                series: series,
                property: data.property[0][0]
                // objects: data.title,
                // series: [{name:data.title, data: series}],
                // property: data.objects
            }
            // if(data.color) obj.color=data.color;
            return obj;

        }
    }
};
var geoCHMap = {
    "北京": [116.40, 39.90],
    "天津": [117.20, 39.12],
    "河北": [114.52, 38.05],
    "山西": [112.55, 37.87],
    "内蒙古": [111.73, 40.83],
    "辽宁": [123.43, 41.80],
    "吉林": [125.32, 43.90],
    "黑龙江": [126.53, 45.80],
    "上海": [121.47, 31.23],
    "江苏": [118.78, 32.07],
    "浙江": [120.15, 30.28],
    "安徽": [117.25, 31.83],
    "福建": [119.30, 26.08],
    "江西": [115.85, 28.68],
    "山东": [116.98, 36.67],
    "河南": [113.62, 34.75],
    "湖北": [114.30, 30.60],
    "湖南": [112.93, 28.23],
    "广东": [113.27, 23.13],
    "广西": [108.37, 22.82],
    "海南": [110.32, 20.03],
    "重庆": [106.55, 29.57],
    "四川": [104.07, 30.67],
    "贵州": [106.63, 26.65],
    "云南": [102.72, 25.05],
    "西藏": [91.13, 29.65],
    "陕西": [108.93, 34.27],
    "甘肃": [103.82, 36.07],
    "青海": [101.78, 36.62],
    "宁夏": [106.28, 38.47],
    "新疆": [87.62, 43.82],
    "香港": [114.08, 22.20],
    "澳门": [113.33, 22.13],
    "台湾": [121.50, 25.03]
};
var geoCoordMap = {
    '海门': [121.15, 31.89],
    '鄂尔多斯': [109.781327, 39.608266],
    '招远': [120.38, 37.35],
    '舟山': [122.207216, 29.985295],
    '齐齐哈尔': [123.97, 47.33],
    '盐城': [120.13, 33.38],
    '赤峰': [118.87, 42.28],
    '青岛': [120.33, 36.07],
    '乳山': [121.52, 36.89],
    '金昌': [102.188043, 38.520089],
    '泉州': [118.58, 24.93],
    '莱西': [120.53, 36.86],
    '日照': [119.46, 35.42],
    '胶南': [119.97, 35.88],
    '南通': [121.05, 32.08],
    '拉萨': [91.11, 29.97],
    '云浮': [112.02, 22.93],
    '梅州': [116.1, 24.55],
    '文登': [122.05, 37.2],
    '上海': [121.48, 31.22],
    '攀枝花': [101.718637, 26.582347],
    '威海': [122.1, 37.5],
    '承德': [117.93, 40.97],
    '厦门': [118.1, 24.46],
    '汕尾': [115.375279, 22.786211],
    '潮州': [116.63, 23.68],
    '丹东': [124.37, 40.13],
    '太仓': [121.1, 31.45],
    '曲靖': [103.79, 25.51],
    '烟台': [121.39, 37.52],
    '福州': [119.3, 26.08],
    '瓦房店': [121.979603, 39.627114],
    '即墨': [120.45, 36.38],
    '抚顺': [123.97, 41.97],
    '玉溪': [102.52, 24.35],
    '张家口': [114.87, 40.82],
    '阳泉': [113.57, 37.85],
    '莱州': [119.942327, 37.177017],
    '湖州': [120.1, 30.86],
    '汕头': [116.69, 23.39],
    '昆山': [120.95, 31.39],
    '宁波': [121.56, 29.86],
    '湛江': [110.359377, 21.270708],
    '揭阳': [116.35, 23.55],
    '荣成': [122.41, 37.16],
    '连云港': [119.16, 34.59],
    '葫芦岛': [120.836932, 40.711052],
    '常熟': [120.74, 31.64],
    '东莞': [113.75, 23.04],
    '河源': [114.68, 23.73],
    '淮安': [119.15, 33.5],
    '泰州': [119.9, 32.49],
    '南宁': [108.33, 22.84],
    '营口': [122.18, 40.65],
    '惠州': [114.4, 23.09],
    '江阴': [120.26, 31.91],
    '蓬莱': [120.75, 37.8],
    '韶关': [113.62, 24.84],
    '嘉峪关': [98.289152, 39.77313],
    '广州': [113.23, 23.16],
    '延安': [109.47, 36.6],
    '太原': [112.53, 37.87],
    '清远': [113.01, 23.7],
    '中山': [113.38, 22.52],
    '昆明': [102.73, 25.04],
    '寿光': [118.73, 36.86],
    '盘锦': [122.070714, 41.119997],
    '长治': [113.08, 36.18],
    '深圳': [114.07, 22.62],
    '珠海': [113.52, 22.3],
    '宿迁': [118.3, 33.96],
    '咸阳': [108.72, 34.36],
    '铜川': [109.11, 35.09],
    '平度': [119.97, 36.77],
    '佛山': [113.11, 23.05],
    '海口': [110.35, 20.02],
    '江门': [113.06, 22.61],
    '章丘': [117.53, 36.72],
    '肇庆': [112.44, 23.05],
    '大连': [121.62, 38.92],
    '临汾': [111.5, 36.08],
    '吴江': [120.63, 31.16],
    '石嘴山': [106.39, 39.04],
    '沈阳': [123.38, 41.8],
    '苏州': [120.62, 31.32],
    '茂名': [110.88, 21.68],
    '嘉兴': [120.76, 30.77],
    '长春': [125.35, 43.88],
    '胶州': [120.03336, 36.264622],
    '银川': [106.27, 38.47],
    '张家港': [120.555821, 31.875428],
    '三门峡': [111.19, 34.76],
    '锦州': [121.15, 41.13],
    '南昌': [115.89, 28.68],
    '柳州': [109.4, 24.33],
    '三亚': [109.511909, 18.252847],
    '自贡': [104.778442, 29.33903],
    '吉林': [126.57, 43.87],
    '阳江': [111.95, 21.85],
    '泸州': [105.39, 28.91],
    '西宁': [101.74, 36.56],
    '宜宾': [104.56, 29.77],
    '呼和浩特': [111.65, 40.82],
    '成都': [104.06, 30.67],
    '大同': [113.3, 40.12],
    '镇江': [119.44, 32.2],
    '桂林': [110.28, 25.29],
    '张家界': [110.479191, 29.117096],
    '宜兴': [119.82, 31.36],
    '北海': [109.12, 21.49],
    '西安': [108.95, 34.27],
    '金坛': [119.56, 31.74],
    '东营': [118.49, 37.46],
    '牡丹江': [129.58, 44.6],
    '遵义': [106.9, 27.7],
    '绍兴': [120.58, 30.01],
    '扬州': [119.42, 32.39],
    '常州': [119.95, 31.79],
    '潍坊': [119.1, 36.62],
    '重庆': [106.54, 29.59],
    '台州': [121.420757, 28.656386],
    '南京': [118.78, 32.04],
    '滨州': [118.03, 37.36],
    '贵阳': [106.71, 26.57],
    '无锡': [120.29, 31.59],
    '本溪': [123.73, 41.3],
    '克拉玛依': [84.77, 45.59],
    '渭南': [109.5, 34.52],
    '马鞍山': [118.48, 31.56],
    '宝鸡': [107.15, 34.38],
    '焦作': [113.21, 35.24],
    '句容': [119.16, 31.95],
    '北京': [116.46, 39.92],
    '徐州': [117.2, 34.26],
    '衡水': [115.72, 37.72],
    '包头': [110, 40.58],
    '绵阳': [104.73, 31.48],
    '乌鲁木齐': [87.68, 43.77],
    '枣庄': [117.57, 34.86],
    '杭州': [120.19, 30.26],
    '淄博': [118.05, 36.78],
    '鞍山': [122.85, 41.12],
    '溧阳': [119.48, 31.43],
    '库尔勒': [86.06, 41.68],
    '安阳': [114.35, 36.1],
    '开封': [114.35, 34.79],
    '济南': [117, 36.65],
    '德阳': [104.37, 31.13],
    '温州': [120.65, 28.01],
    '九江': [115.97, 29.71],
    '邯郸': [114.47, 36.6],
    '临安': [119.72, 30.23],
    '兰州': [103.73, 36.03],
    '沧州': [116.83, 38.33],
    '临沂': [118.35, 35.05],
    '南充': [106.110698, 30.837793],
    '天津': [117.2, 39.13],
    '富阳': [119.95, 30.07],
    '泰安': [117.13, 36.18],
    '诸暨': [120.23, 29.71],
    '郑州': [113.65, 34.76],
    '哈尔滨': [126.63, 45.75],
    '聊城': [115.97, 36.45],
    '芜湖': [118.38, 31.33],
    '唐山': [118.02, 39.63],
    '平顶山': [113.29, 33.75],
    '邢台': [114.48, 37.05],
    '德州': [116.29, 37.45],
    '济宁': [116.59, 35.38],
    '荆州': [112.239741, 30.335165],
    '宜昌': [111.3, 30.7],
    '义乌': [120.06, 29.32],
    '丽水': [119.92, 28.45],
    '洛阳': [112.44, 34.7],
    '秦皇岛': [119.57, 39.95],
    '株洲': [113.16, 27.83],
    '石家庄': [114.48, 38.03],
    '莱芜': [117.67, 36.19],
    '常德': [111.69, 29.05],
    '保定': [115.48, 38.85],
    '湘潭': [112.91, 27.87],
    '金华': [119.64, 29.12],
    '岳阳': [113.09, 29.37],
    '长沙': [113, 28.21],
    '衢州': [118.88, 28.97],
    '廊坊': [116.7, 39.53],
    '菏泽': [115.480656, 35.23375],
    '合肥': [117.27, 31.86],
    '武汉': [114.31, 30.52],
    '大庆': [125.03, 46.58]
};

var GDcoorMap = {
    '广州市': [113.27, 23.13],
    '荔湾区': [113.23, 23.13],
    '越秀区': [113.27, 23.13],
    '海珠区': [113.25, 23.1],
    '天河区': [113.35, 23.12],
    '白云区': [113.27, 23.17],
    '黄埔区': [113.45, 23.1],
    '番禺区': [113.35, 22.95],
    '花都区': [113.22, 23.4],
    '增城市': [113.83, 23.3],
    '从化市': [113.58, 23.55],
    '南沙区': [113.6, 22.77],
    '萝岗区': [113.52, 23.07],
    '韶关市': [113.6, 24.82],
    '武江区': [113.57, 24.8],
    '浈江区': [113.6, 24.8],
    '曲江区': [113.6, 24.68],
    '始兴县': [114.07, 24.95],
    '仁化县': [113.75, 25.08],
    '翁源县': [114.13, 24.35],
    '乳源瑶族自治县': [113.27, 24.78],
    '新丰县': [114.2, 24.07],
    '乐昌市': [113.35, 25.13],
    '南雄市': [114.3, 25.12],
    '深圳市': [114.05, 22.55],
    '罗湖区': [114.12, 22.55],
    '福田区': [114.05, 22.53],
    '南山区': [113.92, 22.52],
    '宝安区': [113.9, 22.57],
    '龙岗区': [114.27, 22.73],
    '盐田区': [114.22, 22.55],
    '珠海市': [113.57, 22.27],
    '香洲区': [113.55, 22.27],
    '斗门区': [113.28, 22.22],
    '金湾区': [113.4, 22.07],
    '汕头市': [116.68, 23.35],
    '濠江区': [116.73, 23.29],
    '龙湖区': [116.72, 23.37],
    '金平区': [116.7, 23.37],
    '潮阳区': [116.6, 23.27],
    '潮南区': [116.43, 23.25],
    '澄海区': [116.77, 23.48],
    '南澳县': [117.02, 23.42],
    '佛山市': [113.12, 23.02],
    '南海区': [113.15, 23.03],
    '顺德区': [113.3, 22.8],
    '三水区': [112.87, 23.17],
    '高明区': [112.88, 22.9],
    '禅城区': [113.11, 23.05],
    '江门市': [113.08, 22.58],
    '新会区': [113.03, 22.47],
    '台山市': [112.78, 22.25],
    '开平市': [112.67, 22.38],
    '鹤山市': [112.97, 22.77],
    '江海区': [113.11, 22.56],
    '蓬江区': [113.08, 22.58],
    '恩平市': [112.3, 22.18],
    '湛江市': [110.35, 21.27],
    '赤坎区': [110.37, 21.27],
    '霞山区': [110.4, 21.2],
    '坡头区': [110.47, 21.23],
    '麻章区': [110.32, 21.27],
    '遂溪县': [110.25, 21.38],
    '徐闻县': [110.17, 20.33],
    '廉江市': [110.27, 21.62],
    '雷州市': [110.08, 20.92],
    '吴川市': [110.77, 21.43],
    '茂名市': [110.92, 21.67],
    '茂南区': [110.92, 21.63],
    '茂港区': [111.02, 21.47],
    '电白县': [111, 21.5],
    '高州市': [110.85, 21.92],
    '化州市': [110.63, 21.67],
    '信宜市': [110.95, 22.35],
    '肇庆市': [112.47, 23.05],
    '端州区': [112.48, 23.05],
    '鼎湖区': [112.57, 23.17],
    '广宁县': [112.43, 23.63],
    '怀集县': [112.18, 23.92],
    '封开县': [111.5, 23.43],
    '德庆县': [111.77, 23.15],
    '高要市': [112.45, 23.03],
    '四会市': [112.68, 23.33],
    '惠州市': [114.42, 23.12],
    '惠城区': [114.4, 23.08],
    '惠阳区': [114.47, 22.8],
    '博罗县': [114.28, 23.18],
    '惠东县': [114.72, 22.98],
    '龙门县': [114.25, 23.73],
    '梅州市': [116.12, 24.28],
    '梅江区': [116.12, 24.32],
    '梅县': [116.05, 24.28],
    '大埔县': [116.7, 24.35],
    '丰顺县': [116.18, 23.77],
    '五华县': [115.77, 23.93],
    '平远县': [115.88, 24.57],
    '蕉岭县': [116.17, 24.67],
    '兴宁市': [115.73, 24.15],
    '汕尾市': [115.37, 22.78],
    '海丰县': [115.33, 22.97],
    '陆河县': [115.65, 23.3],
    '陆丰市': [115.65, 22.95],
    '河源市': [114.7, 23.73],
    '源城区': [114.7, 23.73],
    '紫金县': [115.18, 23.63],
    '龙川县': [115.25, 24.1],
    '连平县': [114.48, 24.37],
    '和平县': [114.93, 24.45],
    '东源县': [114.77, 23.82],
    '阳江市': [111.98, 21.87],
    '江城区': [111.95, 21.87],
    '阳西县': [111.62, 21.75],
    '阳东县': [112.02, 21.88],
    '阳春市': [111.78, 22.18],
    '清远市': [113.03, 23.7],
    '清城区': [113.02, 23.7],
    '佛冈县': [113.53, 23.88],
    '阳山县': [112.63, 24.48],
    '连山壮族瑶族自治县': [112.08, 24.57],
    '连南瑶族自治县': [112.28, 24.72],
    '清新县': [112.98, 23.73],
    '英德市': [113.4, 24.18],
    '连州市': [112.38, 24.78],
    '东莞市': [113.75, 23.05],
    '中山市': [113.38, 22.52],
    '潮州市': [116.62, 23.67],
    '湘桥区': [116.63, 23.68],
    '潮安县': [116.68, 23.45],
    '饶平县': [117, 23.67],
    '揭阳市': [116.37, 23.55],
    '榕城区': [116.38, 23.55],
    '揭东县': [116.42, 23.57],
    '揭西县': [115.83, 23.43],
    '惠来县': [116.28, 23.03],
    '普宁市': [116.18, 23.3],
    '云浮市': [112.03, 22.92],
    '云城区': [112.03, 22.93],
    '新兴县': [112.23, 22.7],
    '郁南县': [111.53, 23.23],
    '云安县': [112, 23.08],
    '罗定市': [111.57, 22.77]
};
(function () {

    // Baseline setup
    // --------------

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeCreate = Object.create;

    // Naked function reference for surrogate-prototype-swapping.
    var Ctor = function () {};

    // Create a safe reference to the Underscore object for use below.
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `_` as a global object.
    // (`nodeType` is checked to ensure that `module`
    // and `exports` are not HTML elements.)
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.8.3';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
                // The 2-parameter case has been omitted only because no current consumers
                // made use of it.
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    var builtinIteratee;

    // An internal function to generate callbacks that can be applied to each
    // element in a collection, returning the desired result — either `identity`,
    // an arbitrary callback, a property matcher, or a property accessor.
    var cb = function (value, context, argCount) {
        if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };

    // External wrapper for our callback generator. Users may customize
    // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
    // This abstraction hides the internal-only argCount argument.
    _.iteratee = builtinIteratee = function (value, context) {
        return cb(value, context, Infinity);
    };

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    var restArgs = function (func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function () {
            var length = Math.max(arguments.length - startIndex, 0),
                rest = Array(length),
                index = 0;
            for (; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
                case 2:
                    return func.call(this, arguments[0], arguments[1], rest);
            }
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++) {
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    };

    // An internal function for creating a new object that inherits from another.
    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object.
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Create a reducing function iterating left or right.
    var createReduce = function (dir) {
        // Wrap code that reassigns argument variables in a separate function than
        // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
        var reducer = function (obj, iteratee, memo, initial) {
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            if (!initial) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        };

        return function (obj, iteratee, memo, context) {
            var initial = arguments.length >= 3;
            return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
        };
    };

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = createReduce(1);

    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = createReduce(-1);

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, predicate, context) {
        var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
        var key = keyFinder(obj, predicate, context);
        if (key !== void 0 && key !== -1) return obj[key];
    };

    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    // Determine if the array or object contains a given item (using `===`).
    // Aliased as `includes` and `include`.
    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = restArgs(function (obj, method, args) {
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        });
    });

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    // Return the maximum element (or element-based computation).
    _.max = function (obj, iteratee, context) {
        var result = -Infinity,
            lastComputed = -Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (v, index, list) {
                computed = iteratee(v, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Return the minimum element (or element-based computation).
    _.min = function (obj, iteratee, context) {
        var result = Infinity,
            lastComputed = Infinity,
            value, computed;
        if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value != null && value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (v, index, list) {
                computed = iteratee(v, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Shuffle a collection.
    _.shuffle = function (obj) {
        return _.sample(obj, Infinity);
    };

    // Sample **n** random values from a collection using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
        var length = getLength(sample);
        n = Math.max(Math.min(n, length), 0);
        var last = length - 1;
        for (var index = 0; index < n; index++) {
            var rand = _.random(index, last);
            var temp = sample[index];
            sample[index] = sample[rand];
            sample[rand] = temp;
        }
        return sample.slice(0, n);
    };

    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function (obj, iteratee, context) {
        var index = 0;
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function (value, key, list) {
            return {
                value: value,
                index: index++,
                criteria: iteratee(value, key, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function (behavior, partition) {
        return function (obj, iteratee, context) {
            var result = partition ? [
                [],
                []
            ] : {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key].push(value);
        else result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function (result, value, key) {
        result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key]++;
        else result[key] = 1;
    });

    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
    // Safely create a real, live array from anything iterable.
    _.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (_.isString(obj)) {
            // Keep surrogate pair characters together
            return obj.match(reStrSymbol);
        }
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function (obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = group(function (result, value, pass) {
        result[pass ? 0 : 1].push(value);
    }, true);

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function (array, n, guard) {
        if (array == null || array.length < 1) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function (array) {
        return _.filter(array, Boolean);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function (input, shallow, strict, output) {
        output = output || [];
        var idx = output.length;
        for (var i = 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                // Flatten current level of array or arguments object.
                if (shallow) {
                    var j = 0,
                        len = value.length;
                    while (j < len) output[idx++] = value[j++];
                } else {
                    flatten(value, shallow, strict, output);
                    idx = output.length;
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = restArgs(function (array, otherArrays) {
        return _.difference(array, otherArrays);
    });

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null) iteratee = cb(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
                if (!i || seen !== computed) result.push(value);
                seen = computed;
            } else if (iteratee) {
                if (!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (!_.contains(result, value)) {
                result.push(value);
            }
        }
        return result;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = restArgs(function (arrays) {
        return _.uniq(flatten(arrays, true, true));
    });

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) continue;
            var j;
            for (j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
        }
        return result;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = restArgs(function (array, rest) {
        rest = flatten(rest, true, true);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    });

    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices.
    _.unzip = function (array) {
        var length = array && _.max(array, getLength).length || 0;
        var result = Array(length);

        for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = restArgs(_.unzip);

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function (list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    // Generator function to create the findIndex and findLastIndex functions.
    var createPredicateIndexFinder = function (dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                if (predicate(array[index], index, array)) return index;
            }
            return -1;
        };
    };

    // Returns the first index on an array-like that passes a predicate test.
    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0,
            high = getLength(array);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1;
            else high = mid;
        }
        return low;
    };

    // Generator function to create the indexOf and lastIndexOf functions.
    var createIndexFinder = function (dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0,
                length = getLength(array);
            if (typeof idx == 'number') {
                if (dir > 0) {
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                }
            } else if (sortedIndex && idx && length) {
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item) return idx;
            }
            return -1;
        };
    };

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }
        if (!step) {
            step = stop < start ? -1 : 1;
        }

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    };

    // Split an **array** into several arrays containing **count** or less elements
    // of initial array.
    _.chunk = function (array, count) {
        if (count == null || count < 1) return [];

        var result = [];
        var i = 0,
            length = array.length;
        while (i < length) {
            result.push(slice.call(array, i, i += count));
        }
        return result;
    };

    // Function (ahem) Functions
    // ------------------

    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments.
    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
    };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = restArgs(function (func, context, args) {
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        var bound = restArgs(function (callArgs) {
            return executeBound(func, bound, context, this, args.concat(callArgs));
        });
        return bound;
    });

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder by default, allowing any combination of arguments to be
    // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
    _.partial = restArgs(function (func, boundArgs) {
        var placeholder = _.partial.placeholder;
        var bound = function () {
            var position = 0,
                length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
                args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return executeBound(func, bound, this, this, args);
        };
        return bound;
    });

    _.partial.placeholder = _;

    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = restArgs(function (obj, keys) {
        keys = flatten(keys, false, false);
        var index = keys.length;
        if (index < 1) throw new Error('bindAll must be passed function names');
        while (index--) {
            var key = keys[index];
            obj[key] = _.bind(obj[key], obj);
        }
    });

    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
        var memoize = function (key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = restArgs(function (func, wait, args) {
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    });

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = _.partial(_.delay, _, 1);

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function (func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function () {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
        var timeout, result;

        var later = function (context, args) {
            timeout = null;
            if (args) result = func.apply(context, args);
        };

        var debounced = restArgs(function (args) {
            if (timeout) clearTimeout(timeout);
            if (immediate) {
                var callNow = !timeout;
                timeout = setTimeout(later, wait);
                if (callNow) result = func.apply(this, args);
            } else {
                timeout = _.delay(later, wait, this, args);
            }

            return result;
        });

        debounced.cancel = function () {
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };

    // Returns a negated version of the passed-in predicate.
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    };

    // Returns a function that will only be executed on and after the Nth call.
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
        };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);

    _.restArgs = restArgs;

    // Object Functions
    // ----------------

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{
        toString: null
    }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'
    ];

    var collectNonEnumProps = function (obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

        // Constructor is a special case.
        var prop = 'constructor';
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    };

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj)
            if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve all the property names of an object.
    _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    // Returns the results of applying the iteratee to each element of the object.
    // In contrast to _.map it returns an object.
    _.mapObject = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = {};
        for (var index = 0; index < length; index++) {
            var currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`.
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    // An internal function for creating assigner functions.
    var createAssigner = function (keysFunc, defaults) {
        return function (obj) {
            var length = arguments.length;
            if (defaults) obj = Object(obj);
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!defaults || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = createAssigner(_.allKeys);

    // Assigns a given object with all the own properties in the passed-in object(s).
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    _.extendOwn = _.assign = createAssigner(_.keys);

    // Returns the first key on an object that passes a predicate test.
    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj),
            key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
        }
    };

    // Internal pick helper function to determine if `obj` has key `key`.
    var keyInObj = function (value, key, obj) {
        return key in obj;
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = restArgs(function (obj, keys) {
        var result = {},
            iteratee = keys[0];
        if (obj == null) return result;
        if (_.isFunction(iteratee)) {
            if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
            keys = _.allKeys(obj);
        } else {
            iteratee = keyInObj;
            keys = flatten(keys, false, false);
            obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    });

    // Return a copy of the object without the blacklisted properties.
    _.omit = restArgs(function (obj, keys) {
        var iteratee = keys[0],
            context;
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
            if (keys.length > 1) context = keys[1];
        } else {
            keys = _.map(flatten(keys, false, false), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    });

    // Fill in a given object with default properties.
    _.defaults = createAssigner(_.allKeys, true);

    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.
    _.create = function (prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs),
            length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };


    // Internal recursive comparison function for `isEqual`.
    var eq, deepEq;
    eq = function (a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
    };

    // Internal recursive comparison function for `isEqual`.
    deepEq = function (a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
                // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN.
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor,
                bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                    _.isFunction(bCtor) && bCtor instanceof bCtor) &&
                ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = _.keys(a),
                key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (_.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
        return eq(a, b);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
    };

    // Is a given value a DOM element?
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    // Is a given variable an object?
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return _.has(obj, 'callee');
        };
    }

    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
    var nodelist = root.document && root.document.childNodes;
    if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }

    // Is a given object a finite number?
    _.isFinite = function (obj) {
        return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`?
    _.isNaN = function (obj) {
        return _.isNumber(obj) && isNaN(obj);
    };

    // Is a given value a boolean?
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function (obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function (obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iteratees.
    _.identity = function (value) {
        return value;
    };

    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    _.noop = function () {};

    _.property = property;

    // Generates a function for a given object that returns a given property.
    _.propertyOf = function (obj) {
        return obj == null ? function () {} : function (key) {
            return obj[key];
        };
    };

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        return function (obj) {
            return _.isMatch(obj, attrs);
        };
    };

    // Run a function **n** times.
    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function () {
        return new Date().getTime();
    };

    // List of HTML entities for escaping.
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped.
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function (object, prop, fallback) {
        var value = object == null ? void 0 : object[prop];
        if (value === void 0) {
            value = fallback;
        }
        return _.isFunction(value) ? value.call(object) : value;
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function (match) {
        return '\\' + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function (text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offset.
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';

        var render;
        try {
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function (data) {
            return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var chainResult = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return chainResult(this, func.apply(_, args));
            };
        });
        return _;
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return chainResult(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return chainResult(this, method.apply(this._wrapped, arguments));
        };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function () {
        return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
        return String(this._wrapped);
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define == 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        });
    }
}());

var load = function (api, fn) {
    //console.log(1);
    $.ajax({
        type: 'get',
        //http://10.108.215.140:8888/springmvc/view/viewaction
        //http://localhost:8080/springmvcdemo/rest/user/gethbasedata?type=1
        url: api,
        async: true,
        data: '',
        dataType: "json",
        jsonp: 'callback',
        crossDomain: true,
        success: function (data) {
            if (typeof fn === 'function') fn(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log(data);
            console.log(XMLHttpRequest.status);
            //  alert(XMLHttpRequest.readyState);
            //  alert(textStatus);
        }
    });
}