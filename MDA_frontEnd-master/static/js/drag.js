function deepCopy(p, c) {
    //克隆对象
    var c = c || {};
    for (var i in p) {
        if (!p.hasOwnProperty(i)) {
            continue;
        }
        if (typeof p[i] === "object") {
            c[i] = p[i].constructor === Array ? [] : {};
            deepCopy(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
    return c;
}
function save() {
    var connects = []; //存储连线的数组
    var mainArr = []; //存储元素的数组
    $.each(jsPlumb.getAllConnections(), function (idx, connection) {
        connects.push({
            ConnectionId: connection.id,
            start: $(connection.source).attr("data-index"),
            end: $(connection.target).attr("data-index"),
            originSign: $(connection.source).attr("data-sign"),
            destinationSign: $(connection.target).attr("data-sign")
        });
    });
    $("#main .item").each(function () {
        mainArr.push({
            offset: $(this).position(),
            text: $(this).text(),
            index: $(this).attr("data-index"),
            sign: $(this).attr("data-sign")
        });
    });
    console.log(connects);
    console.log(mainArr);
    sessionStorage.setItem(
        "flowsheet",
        JSON.stringify({ connects: connects, mainArr: mainArr })
    );
    console.log("flowsheet");  //后加的，从console看一下封装的json是什么样子
}
jsPlumb.ready(function () {
    //一定要加,否则老报错
    var connectorPaintStyle = {
        //基本连接线样式
        // lineWidth: 1, //连接线宽度
        // strokeStyle: "#62A8D1", //连接线颜色
        // joinstyle: "round",
        // // outlineColor: "white",
        // outlineWidth: 0
        stroke: "#62A8D1",
        strokeWidth: 2
    };
    var connectorHoverStyle = {
        // 鼠标悬浮在连接线上的样式
        // lineWidth: 4,
        // strokeStyle: "#62A8D1",
        // // outlineColor: "white",
        // outlineWidth: 0
        stroke: "#62A8D1",
        strokeWidth: 2
    };
    var origin = {
        //起点
        //                     endpoint: ["Dot", { radius: 8 }],  //端点的形状
        //                     connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
        //                     connectorHoverStyle: connectorHoverStyle,
        //                     paintStyle: {
        //                         strokeStyle: "#62A8D1",
        //                         // fillStyle: "transparent",
        //                         radius: 4,
        //                         lineWidth: 1
        //                     },        //端点的颜色样式
        // //                    anchor: "AutoDefault",
        //                     isSource: true,    //是否可以拖动（作为连线起点）
        //                     connector: ["Bezier", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        //                     isTarget: false,    //是否可以放置（连线终点）
        //                     maxConnections:-1,    // 设置连接点最多可以连接几条线,-1表示无限大
        //                     connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
        endpoint: ["Dot", { cssClass: "endpointcssClass" }], //端点形状
        connectorStyle: connectorPaintStyle,
        paintStyle: {
            fill: "#62A8D1",
            radius: 4
        }, //端点的颜色样式
        isSource: true, //是否可拖动（作为连接线起点）
        connector: [
            "Bezier",
            {
                stub: 30,
                gap: 0,
                coenerRadius: 0,
                alwaysRespectStubs: true,
                midpoint: 0.5
            }
        ],
        isTarget: true, //是否可以放置（连接终点）
        maxConnections: -1
    };
    var destination = {
        //终点
        // endpoint: ["Dot", { radius: 5 }], //端点的形状
        // connectorStyle: connectorPaintStyle, //连接线的颜色，大小样式
        // connectorHoverStyle: connectorHoverStyle,
        // paintStyle: { fillStyle: "#62A8D1" }, //端点的颜色样式
        // isSource: false, //是否可以拖动（作为连线起点）
        // connector: [
        //   "Bezier",
        //   { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }
        // ], //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        // isTarget: true, //是否可以放置（连线终点）
        // maxConnections: -1, // 设置连接点最多可以连接几条线,-1表示无限大
        // connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
        endpoint: ["Dot", { cssClass: "endpointcssClass" }], //端点形状
        connectorStyle: connectorPaintStyle,
        paintStyle: {
            fill: "#62A8D1",
            radius: 4
        }, //端点的颜色样式
        isSource: true, //是否可拖动（作为连接线起点）
        connector: [
            "Bezier",
            {
                stub: 30,
                gap: 0,
                coenerRadius: 0,
                alwaysRespectStubs: true,
                midpoint: 0.5
            }
        ],
        isTarget: true, //是否可以放置（连接终点）
        maxConnections: -1
    };
    // $("#left")
    //     .children()
    //     .draggable({
    //         helper: "clone",
    //         scope: "ss"
    //     });
    // $("#right")
    //     .children()
    //     .draggable({
    //         helper: "clone",
    //         scope: "ss"
    //     });
    // $("#model")
    //     .children()
    //     .draggable({
    //         helper: "clone",
    //         scope: "ss"
    //     });

    
    var elementSign = 0; //标志元素唯一性
    $("#main").droppable({
        scope: "ss",
        drop: function (event, ui) {
            //在目标(target)容器上释放鼠标 ,ui.draggable[0]为开始拖拽的元素
            elementSign++;
            var left = parseInt(ui.offset.left - $(this).offset().left);
            var top = parseInt(ui.offset.top - $(this).offset().top);
            var ele = $(
                '<div class="item" data-sign="' +
                elementSign +
                '" data-index="' +
                $(ui.draggable[0]).attr("data-index") +
                '" >' +
                $(ui.helper).html() +
                "</div>"
            ); //$(ui.helper).html()取第一个JQ元素的文本
            console.log(ele);
            ele.css({ left: left, top: top, position: "absolute", margin: 0 });
            $(this).append(ele);
            jsPlumb.addEndpoint(ele, { anchors: "BottomCenter" }, origin); //起点
            jsPlumb.addEndpoint(ele, { anchors: "TopCenter" }, destination); //终点
            jsPlumb.draggable(ele, { containment: "parent" }); //端点可以拖动设置,并且将端点限制在父级内

            $(ele).draggable({
                //设置拖动到main区域中的元素还可以拖拽
                // containment: "parent" //限制拖动不超过父级边框
            });
            //禁止重复拖拽
            if ($("#onOff").prop("checked")) {
                $(ui.draggable[0])
                    .addClass("theGrey")
                    .draggable("disable"); // 禁止其拖动功能
            }
        }
    });
    $("#main")
        .on("mouseenter", ".item", function () {
            var ele = $("<span class='span'>X</span>");
            ele.css({ position: "absolute", left: "160px", top: "-15px" });
            $(this).append(ele);
        })
        .on("mouseleave", ".item", function () {
            $(".span").remove();
        })
        .on("click", "span", function () {
            if (confirm("确定删除吗?")) {
                jsPlumb.removeAllEndpoints(
                    $(this)
                        .parent()
                        .attr("id")
                );
                var index = $(this)
                    .parent()
                    .attr("data-index");
                $(this)
                    .parent()
                    .remove();
                $("#left .item").each(function () {
                    if ($(this).attr("data-index") == index) {
                        $(this)
                            .removeClass("theGrey")
                            .draggable("enable"); // 当设置不可重复拖动之后，删除了此点，就要再次激活其拖动功能
                    }
                });
                $("#right .item").each(function () {
                    if ($(this).attr("data-index") == index) {
                        $(this)
                            .removeClass("theGrey")
                            .draggable("enable"); // 激活其拖动功能
                    }
                });
                $("#model .item").each(function () {
                    if ($(this).attr("data-index") == index) {
                        $(this)
                            .removeClass("theGrey")
                            .draggable("enable"); // 激活其拖动功能
                    }
                });
            }
        });
    jsPlumb.bind("click", function (conn, originalEvent) {
        //点击线段删除
        if (confirm("确定删除吗?")) jsPlumb.detach(conn);
    });
    jsPlumb.bind("connection", function (connInfo, originalEvent) {
        //管控自身的连接
        if (connInfo.connection.sourceId == connInfo.connection.targetId) {
            alert("不能连接自己！");
            setTimeout(function () {
                jsPlumb.detach(connInfo.connection);
            }, 100);
        }
    });
    if (sessionStorage.getItem("flowsheet")) {
        //判断是否有保存过
        var flowsheet = JSON.parse(sessionStorage.getItem("flowsheet"));
        var mainHTML = "";
        for (var i = 0; i < flowsheet.mainArr.length; i++) {
            if (elementSign < flowsheet.mainArr[i].sign) {
                //如果已经保存过,即将标记更新
                elementSign = flowsheet.mainArr[i].sign;
            }
            mainHTML +=
                '<div class="item" data-sign="' +
                flowsheet.mainArr[i].sign +
                '"  data-index="' +
                flowsheet.mainArr[i].index +
                '" style="left:' +
                flowsheet.mainArr[i].offset.left +
                "px;top:" +
                flowsheet.mainArr[i].offset.top +
                'px;position:absolute;margin:0" >' +
                flowsheet.mainArr[i].text +
                "</div>";
        }
        $("#main").append(mainHTML);
        $("#main .item").each(function () {
            jsPlumb.addEndpoint(
                this,
                { anchors: "BottomCenter" },
                deepCopy(origin, { uuid: $(this).attr("data-sign") + "origin" })
            ); //起点
            jsPlumb.addEndpoint(
                this,
                { anchors: "TopCenter" },
                deepCopy(destination, {
                    uuid: $(this).attr("data-sign") + "destination"
                })
            ); //终点
            jsPlumb.draggable(this, { containment: "parent" }); //端点可以拖动设置,并且将端点限制在父级内
            $(this).draggable({
                //设置拖动到main区域中的元素还可以拖拽
                containment: "parent" //限制拖动不超过父级边框
            });
        });
        //固定连线
        for (var i = 0; i < flowsheet.connects.length; i++) {
            jsPlumb.connect({
                uuids: [
                    flowsheet.connects[i].originSign + "origin",
                    flowsheet.connects[i].destinationSign + "destination"
                ]
            });
        }
    }
});