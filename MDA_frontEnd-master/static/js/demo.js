/**
 *模型分析
 */

/**模型计数器*/
var modelCounter = 0;
/**
 * 初始化一个jsPlumb实例
 */
var instance = jsPlumb.getInstance({
	DragOptions: { cursor: "pointer", zIndex: 2000 },
	ConnectionOverlays: [
		["Arrow", {
			location: 1,
			visible: true,
			width: 11,
			length: 11,
			direction: 1,
			id: "arrow_forwards"
		}],

		["Label", {
			location: 0.5,
			id: "label",
			cssClass: "aLabel"
		}]
	],
	Container: "containers"
});
instance.importDefaults({
	ConnectionsDetachable: true,
	ReattachConnections: true
});
/**
 * 设置左边菜单
 * @param Data
 */
function setLeftMenu() {

	$("#leftMenu li").draggable({
		helper: "clone",
		scope: "plant"
	});
	$("#containers").droppable({
		scope: "plant",
		drop: function (event, ui) {
			CreateModel(ui, $(this));
		}
	});
}
/**
 * 添加模型
 * @param ui
 * @param selector
 */
function CreateModel(ui, selector) {
	var modelId = $(ui.draggable).attr("id");
	var id = modelId + "_model_" + modelCounter++;
	var dataId = modelId + "_model";
	var type = $(ui.draggable).attr("model_type");
/*	if (modelId == 'node1' || modelId == 'node2' || modelId == 'node3') {
		$(selector).append('<a href="#/prepro/conndata"><div class="model model1" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div></a>');
	}*/
    if (modelId == 'node1') {
        $(selector).append('<div data-toggle="modal" data-target="#myModalcsv" class="model model1" id="' + id
            + '" modelType="' + type +'"data-id="'+dataId+ '">'
            + getModelElementStr(type) + '</div>');

	}
	if (modelId == 'node2') {
		$(selector).append('<div data-toggle="modal" data-target="#myModalexcel" class="model model1" id="' + id +
			'" modelType="' + type + '">' +
			getModelElementStr(type) + '</div>');

	}
	if (modelId == 'node3') {
		$(selector).append('<div data-toggle="modal" data-target="#myModalhive" class="model model1" id="' + id +
			'" modelType="' + type + '">' +
			getModelElementStr(type) + '</div>');

	}
	if (modelId == 'node25') {
		$(selector).append('<div data-toggle="modal" data-target="#myModalall" class="model model1" id="' + id +
			'" modelType="' + type + '">' +
			getModelElementStr(type) + '</div>');

	}

/*	if (modelId == 'node4' || modelId == 'node5' || modelId == 'node6' || modelId == 'node7' || modelId == 'node8') {
		$(selector).append('<a href="#/prepro/transform"><div class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div></a>');
	}*/
  
	if (modelId == 'node4' || modelId == 'node5') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node6') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans6" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node7') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans7" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node8' ) {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans8" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node11') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans11" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node12') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans12" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node13') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans13" class="model model2" id="' + id +
			'" modelType="' + type + '">' +
			getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node14') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans14" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node15') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans15" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node16') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans16" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node17') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans17" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node18') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans18" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node19') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans19" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node20') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans20" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node21') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans21" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node22') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans22" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node23') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans23" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node24') {
		$(selector).append('<div data-toggle="modal" data-target="#myModaltrans24" class="model model2" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div>');
	}
/*	if (modelId == 'node9' || modelId == 'node10') {
		$(selector).append('<a href="#/prepro/dataoutput"><div class="model model3" id="' + id
			+ '" modelType="' + type + '">'
			+ getModelElementStr(type) + '</div></a>');
	}*/
    if (modelId == 'node9') {
        $(selector).append('<div data-toggle="modal" data-target="#myModalout" class="model model3" id="' + id
            + '" modelType="' + type + '">'
            + getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node10') {
		$(selector).append('<div data-toggle="modal" data-target="#myModalout2" class="model model3" id="' + id +
			'" modelType="' + type + '">' +
			getModelElementStr(type) + '</div>');
	}
	if (modelId == 'node26') {
		$(selector).append('<div data-toggle="modal" data-target="#myModalout" class="model model3" id="' + id +
			'" modelType="' + type + '">' +
			getModelElementStr(type) + '</div>');
	}
	var left = parseInt(ui.offset.left - $(selector).offset().left);
	var top = parseInt(ui.offset.top - $(selector).offset().top);

	$("#" + id).css("position", "absolute").css("left", left).css("top", top);
	//添加连接点
	instance.addEndpoint(id, { anchors: "RightMiddle" }, hollowCircle);
	instance.addEndpoint(id, { anchors: "LeftMiddle" }, hollowCircle);
	instance.addEndpoint(id, { anchors: "TopCenter" }, hollowCircle);
	instance.addEndpoint(id, { anchors: "BottomCenter" }, hollowCircle);
	
	//注册实体可draggable
	$("#" + id).draggable({
		containment: "parent",
		drag: function (event, ui) {
			instance.repaintEverything();
		},
		stop: function () {
			instance.repaintEverything();
		}
	});
}
//端点样式设置
var hollowCircle = {
	endpoint: ["Dot", { cssClass: "endpointcssClass" }], //端点形状
	connectorStyle: connectorPaintStyle,
	paintStyle: {
		fill: "#62A8D1",
		radius: 4
	},		//端点的颜色样式
	isSource: true, //是否可拖动（作为连接线起点）
	connector: ["Bezier", { stub: 30, gap: 0, coenerRadius: 0, alwaysRespectStubs: true, midpoint: 0.5 }],
	isTarget: true, //是否可以放置（连接终点）
	maxConnections: -1
};
//基本连接线样式
var connectorPaintStyle = {
	stroke: "#62A8D1",
	strokeWidth: 2
};
/**
 * 创建模型内部元素
 * @param type
 * @returns {String}
 */
function getModelElementStr(type) {
	
	var list = '';
	for (var data in metadata) {
		for (var data_type in metadata[data]) {
			var model_data = metadata[data][data_type];
			if (type == model_data.type) {
				
				list += '<h4><span index="'
					+ model_data.index + '">'
					+ model_data.name
					+ '</span><a href="javascript:void(0)" class="pull-right" onclick="removeElement(this,event);">X</a>'
					+ '</h4>';
				list += '<ul>'
				var properties = model_data.properties;
				list += parseProperties(properties);
				list += '</ul>';
			}
		}
	}
	return list;
}
/**
 * 循环遍历properties
 * @param obj
 * @returns {String}
 */
function parseProperties(obj) {
	var str = "";
	for (var v in obj) {
		if (obj[v].properties == undefined) {
			str += '<li><input type="checkbox" name="'
				+ v + '" value="'
				+ v + '">'
				+ obj[v].des + '</li>';
		} else {
			str += arguments.callee(obj[v].properties);
		}
	}
	return str;
}
//设置连接Label的label
function init(conn) {
	var label_text;
	$("#select_sourceList").empty();
	$("#select_targetList").empty();
	var sourceName = $("#" + conn.sourceId).attr("modelType");
	var targetName = $("#" + conn.targetId).attr("modelType");
	for (var i = 0; i < metadata.length; i++) {
		for (var obj in metadata[i]) {
			if (obj == sourceName) {
				var optionStr = getOptions(metadata[i][obj].properties, metadata[i][obj].name);
				$("#select_sourceList").append(optionStr);
			} else if (obj == targetName) {
				var optionStr = getOptions(metadata[i][obj].properties, metadata[i][obj].name);
				$("#select_targetList").append(optionStr);
			}
		}
	}
	$("#submit_label").unbind("click");
	$("#submit_label").on("click", function () {
		setlabel(conn);
	});
	// $("#myModal").modal();
}
/**
 * 获取option
 * @param obj
 * @returns {String}
 */
function getOptions(obj, head) {
	var str = "";
	for (var v in obj) {
		if (obj[v].properties == undefined) {
			var val = head + '.' + obj[v].des;
			str += '<option value="' + val + '">'
				+ val
				+ '</option>';
		} else {
			str += arguments.callee(obj[v].properties, head);
		}
	}
	return str;
}
//setlabel
function setlabel(conn) {
	conn.getOverlay("label").setLabel($("#select_sourceList").val()
		+ ' '
		+ $("#select_comparison").val()
		+ ' '
		+ $("#select_targetList").val());
	if ($("#twoWay").val() == "true") {
		conn.setParameter("twoWay", true);
	} else {
		conn.setParameter("twoWay", false);
		conn.hideOverlay("arrow_backwards");
	}
}
//删除节点
function removeElement(obj,event) {
	event.stopPropagation();
	var element = $(obj).parents(".model");
	console.log(element);
	if (confirm("确定删除该模型？"))
		instance.remove(element);
}


