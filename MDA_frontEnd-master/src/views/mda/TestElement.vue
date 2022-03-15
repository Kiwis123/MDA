<template>
    <div ref="item" :id="newId" class="chart-con">
    </div>
</template>
<style>
.chart-con {
  height: 100%;
  width: 100%;
}
</style>
<script>
import echarts from "echarts";
import "../../../static/js/macarons.js";
import "../../../static/js/roma.js";
import "../../../static/js/vintage.js";
import "../../../static/js/infographic.js";
export default {
  name: "TestElement",
  props: {
    option: {
      type: Object
    },
    fx: {
      type: Array
    },
    fxdata: {
      type: Array
    },
    data: {
      type: Object
    },
    nodedata: {
      type: Array
    },
    university: {
      type: String
    },
    alldata: {
      type: Array
    },

    id: {
      type: String
    },
    h: {
      type: Number,
      default: 230
    },
    w: {
      type: Number,
      default: 372
    }
  },
  data: function() {
    return {
      objlll: {},
      myChart: {},
      newOption: this.option,
      newFx: ["01、03", "02", "04", "05", "06", "07", "08"],
      newData: {
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
      newNodedata: this.nodedata,
      newAlldata: this.alldata,
      newUniversity: this.university,
      newId: this.id,
      containerWidth: 100,
      rowHeight: 30,
      margin: [10, 10]
    };
  },
  mounted: function() {
    this.drawcharts();
  },
  methods: {
    drawcharts() {
      console.log("### " + this.newOption + " ready!");
      var graphContainer = document.getElementById(this.newId);
      var html =
        '<div class="view-area-box" id="view' + this.newId + '"></div>';
      graphContainer.innerHTML = html;
      var graphContent = document.getElementById("view" + this.newId);
      var width = this.w + "px";
      var height = this.h + "px";
      console.log("b" + height);
      graphContent.style.height = height;
      graphContent.style.width = width;
      this.newOption = this._deepCopy(this.newOption);
      // html += '<div class="graph-content-list-"'+i+'style="width:450px;height:400px;"></div>';
      // var a = JSON.stringify(this.option);
      // console.log('hello'+a);
      this.newOption.grid = {};
      this.newOption.grid.x = 60;
      console.log(this.newOption);
      this.myChart = echarts.init(graphContent, "roma");

      this.myChart.setOption(this.newOption);
      var _self = this;
      this.myChart.on("click", function(p) {
        // var university = _self.newUniversity;
        var fx = _self.newFx;
        var data = _self.newData;
        // var nodedata = _self.newNodedata;
        // var alldata = _self.newAlldata;
        console.log("新的数据" + JSON.stringify(fx));
        if (p.seriesType == "graph") {
          var university = p.name;
          var nodedata = [];
          var piedata = [];
          var scatterdata = [];
          console.log(data);
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
          console.log(nodedata);
          console.log(piedata);
          console.log(data[university][0]);
          var data1 = data[university][0];
          var data2 = data[university][1];
          _self.objlll = {
            nodedata: nodedata,
            piedata: piedata,
            data1: data1,
            data2: data2,
            university: university
          };
        }
        _self.$emit("headCallBack", _self.objlll);
      });
    },
    _deepCopy(obj) {
      let str, newobj;
      str = newobj = obj instanceof Array ? [] : {};
      if (typeof obj !== "object") {
        return;
      } else if (window.JSON) {
        str = JSON.stringify(obj); // 系列化对象
        newobj = JSON.parse(str); // 还原
      } else {
        for (var i in obj) {
          newobj[i] = typeof obj[i] === "object" ? _deepCopy(obj[i]) : obj[i];
        }
      }
      return newobj;
    },
    resize() {
      var graphContent = document.getElementById("view" + this.newId);
      var graphContainer = graphContent.parentNode.parentNode;
      console.log(graphContainer);
      var width = graphContainer.style.width;
      console.log("hello" + width);
      var height = graphContainer.style.height;
      console.log("hello" + height);
      graphContent.style.height = height;
      graphContent.style.width = width;
      console.log(this.myChart);
      this.myChart.resize();
    }
  },
  watch: {
    option: {
      handler: function() {
        this.newOption = this.option;
        this.drawcharts();
        // alert("option变化" + JSON.stringify(this.option));
      },
      //深度观察
      deep: true
    },
    h: {
      handler: function() {
        console.log("haha");
        this.resize();
      },

      //深度观察
      deep: true
    },
    w: {
      handler: function() {
        console.log("haha");
        this.resize();
      },
      deep: true
    }
  }
};
</script>