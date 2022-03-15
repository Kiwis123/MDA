<template>
  <!-- eslint-disable -->
  <div class>
    <!-- 页面头部框框 -->
    <div class="prehd">
      <a>
        <i class="iconfont icon-fanhui" @click="back()"></i>
      </a>
      <span class="pretitle">多维分析</span>
      <a class="save">
        <el-button type="text" @click="releaseGraph">
          <span class="pretitles">
            <i class="iconfont icon-fabu1"></i>&nbsp;&nbsp;发布到大屏
          </span>
        </el-button>
      </a>
      <a class="save">
        <el-button type="text" @click="saveDialogVisible = true">
          <span class="pretitles">
            <i class="iconfont icon-baocun"></i>&nbsp;&nbsp;保存
          </span>
        </el-button>
      </a>
      <a class="save">
        <el-button type="text" @click="dialogVisible = true">
          <span class="pretitles">
            <i class="iconfont icon-xinjian"></i>&nbsp;&nbsp;新建
          </span>
        </el-button>
      </a>
    </div>
    <!-- 头部的各种按钮 -->
    <div>
      <div class="preheader">
        <span class="btn-layer iconfont">
          <a>
            <el-button type="text" @click="sortVisible = true">
              <span class="sum">
                <i class="icon-paixu"></i>&nbsp;&nbsp;排序
              </span>
            </el-button>
          </a>
          <a>
            <el-button type="text" @click="dialogVisible = true">
              <span class="sum">
                <i class="icon-zhuanhuan"></i>&nbsp;&nbsp;交换行列
              </span>
            </el-button>
          </a>
          <a>
            <el-button type="text" @click="computedVisible = true">
              <span class="sum">
                <i class="icon-jisuanqi"></i>&nbsp;&nbsp;计算字段
              </span>
            </el-button>
          </a>
          <a>
            <el-button type="text" @click="statisticVisible = true">
              <span class="sum">
                <i class="icon-tongji1"></i>&nbsp;&nbsp;统计扩展
              </span>
            </el-button>
          </a>
          <a>
            <el-button type="text" @click="pictureSettingVisible = true">
              <span class="sum">
                <i class="icon-wode-tubiao_shezhi"></i>&nbsp;&nbsp;图表设置
              </span>
            </el-button>
          </a>
          <a>
            <el-button type="text" @click="copy">
              <span class="sum">
                <i class="icon-fuzhi"></i>&nbsp;&nbsp;复制
              </span>
            </el-button>
          </a>
          <a>
            <el-button type="text" @click="toggle">
              <span class="sum">
                <i class="icon-Shape"></i>&nbsp;&nbsp;全屏
              </span>
            </el-button>
          </a>
          <a>
            <el-button type="text" @click="show = !show">
              <span class="sum" id="mylb">
                <i class="icon-tubiao"></i>&nbsp;&nbsp;智能显示
              </span>
            </el-button>
          </a>
          <!-- 智能显示展开折叠 -->
          <div class="coll">
            <el-collapse-transition>
              <div v-show="show">
                <div class="transition-box">
                  <v-rightbar
                    :baseUrl="baseUrl"
                    :option="option"
                    :type="type"
                    :tableName="itemNameShow"
                    :searchmeasure="searchmeasure"
                    :searchdimension="searchdimension"
                    :searchmethods="searchmethods"
                    @update-type="update"
                    @update-option="updateOption"
                  ></v-rightbar>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </span>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="containerContent">
      <div v-if="modelView == 3" class="left-bar" ref="leftBar">
        <div class="left-bar-content">
          <div class="table-list-wrapper">
            <div class="olap-item item-title" id="excelNames" @mouseover="excelNames">{{excelName}}</div>
            <ul>
              <div class="field-wrapper">
                <div class="dimension-wrapper">
                  <div class="olap-item dimension-name">维度</div>
                  <!-- <div class="dimension-content"> -->
                  <li
                    class="olap-item dimension-item"
                    draggable="true"
                    @dragstart="drag1($event)"
                    v-for="(dimension,index) in dimensionList"
                  >
                    <a
                      :data-column="dimension"
                      :data-eg="dimension"
                      :data-table="dimension"
                      :id="'dimen'+index"
                      @mouseover="showDimen(index,dimension)"
                    >{{dimension}}</a>
                  </li>
                  <!-- </div> -->
                </div>
                <div class="measure-wrapper">
                  <div class="olap-item measure-name">度量</div>
                  <!-- <div class="dimension-content"> -->
                  <li
                    class="olap-item measure-item"
                    draggable="true"
                    @dragstart="drag2($event)"
                    v-for="(measure,index) in measureList"
                  >
                    <a
                      :data-column="measure"
                      :data-eg="measure"
                      :data-table="measure"
                      :id="'meas'+index"
                      @mouseover="showMeas(index,measure)"
                      class="measure-name"
                    >{{measure}}</a>
                  </li>
                  <!-- </div> -->
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div v-else-if="modelView == 1" class="left-bar" ref="leftBar">
        <div class="left-bar-content">
          <div class="table-list-wrapper">
            <div class="table-list-wrapper">
              <div class="olap-item item-title">模型</div>
              <ul>
                <li class="olap-item">
                  <a>{{fileName}}</a>
                </li>
              </ul>
            </div>
            <div class="olap-item item-title">工作表</div>
            <ul>
              <div v-for="(tableName,index) in tableNameList">
                <li class="olap-item table-list-item" @click="selectTable($event)">
                  <a
                    :id="'tableName'+index"
                    @mouseover="showTableName(index,tableName)"
                  >{{tableName}}</a>
                </li>
                <div class="field-wrapper">
<!--                  <div class="olap-item item-title2">字段</div>-->
                  <div class="dimension-wrapper">
                    <div class="olap-item dimension-name">字符型</div>
                    <li
                      class="olap-item dimension-item"
                      draggable="true"
                      @dragstart="drag1($event)"
                      v-for="(dimension,index) in dimensionList"
                    >
                      <a
                        :data-column="dimension[0]"
                        :data-eg="dimension[0]"
                        :data-table="dimension[1]"
                        :id="'dimen'+index"
                        @mouseover="showDimen(index,dimension[0])"
                      >{{dimension[0]}}</a>
                    </li>
                  </div>
                  <div class="measure-wrapper">
                    <div class="olap-item measure-name">数值型</div>
                    <li
                      class="olap-item measure-item"
                      draggable="true"
                      @dragstart="drag2($event)"
                      v-for="(measure,index) in measureList"
                    >
                      <a
                        :data-column="measure[0]"
                        :data-eg="measure[0]"
                        :data-table="measure[1]"
                        :id="'meas'+index"
                        @mouseover="showMeas(index,measure[0])"
                        class="measure-name"
                      >{{measure[0]}}</a>
                    </li>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div v-else-if="modelView == 2" class="left-bar" ref="leftBar">
        <div class="left-bar-content">
          <div class="table-list-wrapper">
            <div class="table-list-wrapper">
              <div class="olap-item item-title">模型</div>
              <ul>
                <li class="olap-item">
                  <a @click="showCube()">{{fileName}}</a>
                </li>
              </ul>
            </div>
            <div class="olap-item item-title">工作表</div>
            <ul>
              <div v-for="(tableName,index) in tableNameList">
                <li class="olap-item table-list-item" @click="selectTable($event)">
                  <a
                    :id="'tableName'+index"
                    @mouseover="showTableName(index,tableName)"
                  >{{tableName}}</a>
                </li>
                <div class="field-wrapper">
<!--                  <div class="olap-item item-title2">字段</div>-->
                  <div class="dimension-wrapper">
                    <div class="olap-item dimension-name">维度:(字符型)</div>
                    <li
                      class="olap-item dimension-item"
                      draggable="true"
                      @dragstart="drag1($event)"
                      v-for="(dimension,index) in dimensionList"
                    >
                      <a
                        :data-column="dimension[0]"
                        :data-eg="dimension[0]"
                        :data-table="dimension[1]"
                        :id="'dimen'+index"
                        @mouseover="showDimen(index,dimension[0])"
                      >{{dimension[0]}}</a>
                    </li>
                  </div>
                  <div class="measure-wrapper">
                    <div class="olap-item measure-name">度量:(数值型)</div>
                    <li
                      class="olap-item measure-item"
                      draggable="true"
                      @dragstart="drag2($event)"
                      v-for="(measure,index) in measureList"
                    >
                      <a
                        :data-column="measure[0]"
                        :data-eg="measure[0]"
                        :data-table="measure[1]"
                        :id="'meas'+index"
                        @mouseover="showMeas(index,measure[0])"
                        class="measure-name"
                      >{{measure[0]}}</a>
                    </li>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <!-- 中间内容 -->
      <div>
        <div class="contentOne">
          <div
            class="filter drag-item border-1px"
            @drop="drop8($event)"
            @dragover="allowDrop($event)"
          >筛选器</div>
        </div>
        <div class="contentTwo">
          <div class="filter">
            <span>标记</span>
            <div style="margin:10px 0px">
              <el-select v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in shapeList"
                  class="iconfont"
                  :class="item.icon"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <img src="../../../static/img/color.png" style="width:24px;height:24px">
                  <div
                    class="drag-item border-1px"
                    @drop="drop6($event)"
                    @dragover="allowDrop($event)"
                  >
                    <p>颜色</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <i class="iconfont icon-ziduankuangduiyingtubiao_qipaodaxiao"></i>
                  <p>大小</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <img src="../../../static/img/label.png" style="width:22px;height:22px">
                  <div
                    class="drag-item border-1px"
                    @drop="drop7($event)"
                    @dragover="allowDrop($event)"
                  >
                    <p>标签</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <img
                    src="../../../static/img/message.png"
                    style="width:22px;height:22px;margin-top:2px"
                  >
                  <p>信息</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <i class="iconfont icon-liaotianqipao_"></i>
                  <p>提示</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="contentThree">
          <div class="picture">
            <v-rightbar
              :baseUrl="baseUrl"
              :option="option"
              :type="type"
              :tableName="itemNameShow"
              :searchmeasure="searchmeasure"
              :searchdimension="searchdimension"
              :searchmethods="searchmethods"
              @update-type="update"
              @update-option="updateOption"
            ></v-rightbar>
          </div>
        </div>
      </div>
    </div>

    <!-- 右边内容 -->
    <div class="main-content" ref="mainContent">
      <div class="drag-wrapper">
        <div class="drag-item border-1px" @drop="drop1($event)" @dragover="allowDrop($event)">
          <label class="drag-title-label">维度</label>
        </div>
        <div
          class="drag-item border-1px"
          id="measure-list"
          @drop="drop3($event)"
          @dragover="allowDrop($event)"
        >
          <label class="drag-title-label">度量</label>
          <div v-if="!addy" class="y_operate" @click="addY">
            <img src="../../../static/img/cizhou.png" style="width:22px;height:22px">
            <span>添加行</span>
          </div>
        </div>
        <div
          v-if="addy"
          class="drag-item border-1px"
          @drop="drop4($event)"
          @dragover="allowDrop($event)"
        >
          <label class="drag-title-label">行</label>
          <div class="y_operate" @click="removeY">
            <img src="../../../static/img/cizhou.png" style="width:22px;height:22px">
            <span>移除行</span>
          </div>
        </div>
        <!-- <div class="drag-item border-1px" @drop='drop5($event)' @dragover='allowDrop($event)'><label class="drag-title-label">筛选器</label></div>
        <div class="drag-item border-1px" @drop='drop6($event)' @dragover='allowDrop($event)'>
          <label class="drag-title-label">颜色</label>
        </div>-->
      </div>
      <fullscreen ref="fullscreen" @change="fullscreenChange">
        <div v-show="type != 16" class="graph-wrapper" id="graph-wrapper">
          <div v-if="drillflag == true">
            <el-button class="scrollGraph" size="mini" @click="scorllGraph()">返回</el-button>
          </div>
          <div
            class="graph"
            v-loading="graphLoading"
            element-loading-text="正在加载中"
            element-loading-spinner="el-icon-loading"
          ></div>
        </div>
        <div v-if="type == 16" class="headStyle">
          <el-popover
            placement="right"
            width="500"
            trigger="hover"
            content="表格默认只显示前十行，如果增加请前往图表设置进行配置！！！"
          >
            <i class="el-icon-warning" slot="reference" style="margin-left:-40px"></i>
          </el-popover>
          <el-table
            :data="muchDimTableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            border
            style="width: 100%;"
          >
            <el-table-column
              v-for="(item2,index) in tabHeaderQian"
              :label="item2.name"
              :prop="item2.name"
            ></el-table-column>
            <el-table-column v-for="(item,index) in tabHeaderHou" :label="item.name">
              <el-table-column
                v-for="(item1,index1) in item.last"
                :label="item1.name"
                :prop="item.name+'_'+item1.name"
              ></el-table-column>
            </el-table-column>
          </el-table>
          <el-row v-if="isPage == false">
            <div class="pages">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pagesize"
                layout="total, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </el-row>
        </div>
      </fullscreen>
    </div>
    <!-- 以下都是弹窗 -->
    <!-- 第一个排序弹窗 -->
    <el-dialog title="排序" :visible.sync="sortVisible" width="35%" center>
      <div class="sort">
        <span>排序字段</span>
        <div class="sortOrder sortFiled">
          <el-checkbox-group v-model="sortFiled">
            <el-checkbox v-for="filed in searchmeasure" :label="filed" :key="filed">{{filed}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <span>排序顺序</span>
        <div class="sortOrder">
          <el-radio class="upOrder" v-model="sortOrder" label="1">升序</el-radio>
          <br>
          <el-radio class="upOrder" v-model="sortOrder" label="2">降序</el-radio>
        </div>
        <span>排序依据</span>
        <div class="sortBy">
          <el-radio v-model="sortBy" label="1">数据源顺序</el-radio>
          <el-radio v-model="sortBy" label="2">字母</el-radio>
          <el-radio v-model="sortBy" label="3">手动</el-radio>
          <div class="filedSortList" style="display:none">
            <draggable v-model="filedSortList" class="block__list block__list_words dragStyle">
              <div v-for="(table,index) in filedSortList" class="fileds">{{table}}</div>
            </draggable>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="sortVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="sort">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 第四个图表设置弹窗 -->
    <el-dialog title="图表设置" :visible.sync="pictureSettingVisible" width="35%" center>
      <div>
        <div>
          <div class="right-title">
            图表标题&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" style="width:70%" v-model="graphTitle">
          </div>
        </div>
        <br>
        <div v-if="type == 16">
          <!-- <div class="right-title">
            显示条目&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="text"
              name="axis-title"
              style="width:70%"
              v-model="showNum"
              value="showNum"
            >
          </div>-->
          <div class="right-title">是否分页&nbsp;&nbsp;&nbsp;&nbsp;
            <el-switch v-model="isPage" active-text="是" inactive-text="否"></el-switch>
          </div>
        </div>
        <div v-if="type != 16">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="X坐标轴" name="1">
              <div class="right-title">
                标题&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  name="axis-title"
                  style="width:70%"
                  v-model="xaxisTitle"
                  value="axisTitle"
                >
              </div>
              <div class="right-title">
                单位&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  name="unit"
                  style="width:70%"
                  v-model="xaxisUnit"
                >
              </div>
            </el-collapse-item>
            <el-collapse-item title="Y坐标轴" name="2">
              <div class="right-title">
                标题&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  name="axis-title"
                  style="width:70%"
                  v-model="yaxisTitle"
                  value="axisTitle"
                >
              </div>
              <div class="right-title">
                单位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  name="unit"
                  style="width:70%"
                  v-model="yaxisUnit"
                >
              </div>
              <div class="right-title">
                最大值&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  name="max"
                  style="width:70%"
                  v-model="max"
                >
              </div>
              <div class="right-title">
                最小值&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  name="min"
                  style="width:70%"
                  v-model="min"
                >
              </div>
            </el-collapse-item>
            <el-collapse-item title="功能设置" name="3">
              <div class="right-title">添加辅助线</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="pictureSettingVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="graphSetting">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表名称" :visible.sync="saveDialogVisible" width="20%" center="">
      <div>
        <el-input v-model="graphName"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="saveDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveGraph">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 颜色弹窗 -->
    <el-dialog
      title="设置颜色"
      :visible.sync="colorVisible"
      :before-close="handleClose"
      width="35%"
      class="colorDialog"
    >
      <div class="dialog dialog-content">
        <div class="color-select-content">
          <div class="color-left">
            <span>{{dragColorItem}}</span>
          </div>
          <div class="color-right">
            <colorPicker v-model="color" @change="headleChangeColor"></colorPicker>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!-- 确定切换图表类型的弹窗 -->
    <el-dialog
      title="更换图表类型"
      :visible.sync="changeTypeVisible"
      :before-close="handleClose"
      width="35%"
    >
      <div>
        <span>点击切换图表类型，图表设置操作会消失，如果设置好图表请先保存再更改图表类型</span>
      </div>
      <div slot="footer" class="footer">
        <el-button size="mini" @click="changeTypeVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="changeType">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 统计扩展的弹窗 -->
    <el-dialog
      title="选择统计扩展类型"
      :visible.sync="statisticVisible"
      :before-close="handleClose"
      width="35%"
    >
      <div>
        <el-radio v-model="statisticRadio" label="1">直方图</el-radio>
        <br>
        <el-radio v-model="statisticRadio" label="2">聚类分析</el-radio>
        <br>
        <el-radio v-model="statisticRadio" label="3">线性回归分析</el-radio>
        <br>
        <el-radio v-model="statisticRadio" label="4">指数回归分析</el-radio>
        <br>
        <el-radio v-model="statisticRadio" label="5">对数回归分析</el-radio>
        <br>
        <el-radio v-model="statisticRadio" label="6">多项式回归分析</el-radio>
      </div>
      <div slot="footer" class="footer">
        <el-button size="mini" @click="statisticVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="statistic">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择cube主题弹窗 -->
<!--    <el-dialog :visible.sync="itemShow" @on-close="closeItemDialog">-->
<!--      <div class="dialog dialog-content">-->
<!--        <div class="table-title" style="height:40px;">-->
<!--          <div class="table-title-l">选择主题立方体</div>-->
<!--          &lt;!&ndash; <div class="table-title-r" :class="{'table-tb': !isActive, 'table-tbb': isActive }" @click="showTab()">选择主题单表</div> &ndash;&gt;-->
<!--        </div>-->
<!--        <el-radio-group class="table-list" v-model="cubeRadio" v-for="(ele,index) in cubeRadioData">-->
<!--          <el-radio :label="index" @click="showSitem()">{{ele}}</el-radio>-->
<!--        </el-radio-group>-->
<!--        <div slot="footer" class="cubeClass">-->
<!--          <el-button size="mini" type="primary" @click="selectItem">切换主题</el-button>-->
<!--        </div>-->
<!--        &lt;!&ndash; <div class="common-btn conn-btn" @click="selectTab " v-if="!isActive">切换表格</div> &ndash;&gt;-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>
<script>
/*eslint-disable*/
import $ from "jquery";
import rightBar from "./graph-rightNew";
import fullscreen from "vue-fullscreen";
import draggable from "vuedraggable";
import echarts from "echarts";
import colorPicker from "./plugin/vue-color-picker/colorPicker";
import MyDialog from "./plugin/base/dialog.vue";
import axios from "axios";
import qs from "qs";
import "../../../static/js/macarons.js";
import "../../../static/js/roma.js";
import "../../../static/js/vintage.js";
import "../../../static/js/infographic.js";
import "../../../static/js/drillDown.js"
var BASE_URL = "http://127.0.0.1:8088/";
export default {
  data() {
    return {
      dimensionList: [],
      measureList: [],
      //拖的维度
      dimension: "",
      //拖的度量
      measure: "",
      //展开智能显示
      show: false,
      //智能显示里面的图标类型需要的字段
      //接口地址
      baseUrl: "",
      //图表的option
      option: {
        // series: []
      },
      //图标类型
      type: 2, //16表格 0柱状图，14指标卡，6条形图，7折线图，3饼图，8计量图，1堆积图，2面积图，4雷达图，12散点图，13漏斗图（一个维度一个度量）
      //工作表名称
      itemNameShow: "",
      //拖拽的度量
      searchmeasure: [],
      //拖拽的维度
      searchdimension: [],
      //方法？？
      searchmethods: [],
      //形状下拉框
      shapeList: [
        {
          value: "选项1",
          label: "线",
          icon: "icon-xiaobiao-"
        },
        {
          value: "选项2",
          label: "方形",
          icon: "icon-cub"
        },
        {
          value: "选项3",
          label: "圆形",
          icon: "icon-02-copy"
        },
        {
          value: "选项4",
          label: "文本",
          icon: "icon-wenben"
        },
        {
          value: "选项5",
          label: "条形",
          icon: "icon-icon_fr"
        }
      ],
      value: "",
      //全屏
      fullscreen: false,
      //拖拽的内容
      dragContent: "",
      info: [],
      searchdimCh: [],
      searchdimTable: [],
      searchmeasureTable: [],
      searchmeasure2: [],
      searchmeasureCh: [],
      searchadmethods: [],
      searchmethods2: [],
      searchadmethods2: [],
      searchcolor: [],
      //次轴的内容
      searchmeasure2Ch: [],
      searchmeasure2Table: [],
      //排序弹窗
      sortVisible: false,
      //排序依据
      sortBy: "1",
      //排序顺序
      sortOrder: "1",
      //排序字段
      filedSortList: [],
      //传过来的url
      fileUrl: sessionStorage.getItem("fileUrl"),
      //传过来的数据表名称
      fileName: sessionStorage.getItem("modelName"),
      //画图
      myChart: {},
      //颜色弹窗是否打开
      isShow: false,
      //颜色选择器选择的颜色
      color: "",
      //颜色的弹窗
      colorVisible: false,
      //工作表名称,调用画图接口穿的参数
      excelName: sessionStorage.getItem("fileName"),
      classificaion: "",
      dataSourceId: "",
      diagramId: '',
      diagramName: '',
      tableId: sessionStorage.getItem("id"),
      //cube视图显示主题弹窗的
      itemShow: false,
      //主题列表
      itemNameList: [],
      //每个主题下面的子列表
      sitemNameList: [],
      //是否显示cube主题
      isActive: true,
      //数据选择传过来的模型视图
      modelView: 2,
      // modelView: sessionStorage.getItem("modelView"),
      //一个cube里面包含的工作表
      tableNameList: [],
      //高度
      clientHeight: (document.documentElement.clientHeight - 60) || (document.body.clientHeight - 60),
      //颜色
      dragColorItem: "",
      colors: [],
      color: '#f00',
      //标识是否添加次轴
      addy: false,
      //图表设置弹窗
      pictureSettingVisible: false,
      //计算字段
      computedVisible: false,
      //图表设置展开面板
      activeNames: ['1'],
      //图表设置需要传的值
      graphTitle: '',
      xaxisTitle: '',
      xaxisUnit: '',
      yaxisTitle: '',
      yaxisUnit: '',
      max: '',
      min: '',
      //切换图表
      changeTypeVisible: false,
      //统计扩展
      statisticVisible: false,
      //统计扩展的值
      statisticRadio: '1',
      //排序选择的字段
      sortFiled: [],
      //图表加载
      graphLoading: false,
      dimValue: '',
      // 选择的是哪个cube主题
      cubeRadio: 0,
      cubeRadioData: [],
      //多维表格
      muchDimTableData: [],
      //显示多少条目，表格限制10行
      showNum: 100,
      //是否分页
      isPage: true,
      currentPage: 1, //当前页
      pagesize: 10, //每页条数
      total: 0, //总条数
      tabHeaderQian: [],
      tabHeaderHou: [],
      tabContent: [],
      tabContentHou: [],
      //多维表格增加行
      tableColumn: [],
      // 上卷下钻维度
      objdims: [],
      // 上卷下钻度量
      obj: [],
      //上卷下钻年季度月日
      drillYear: -1,
      drillMonth: -1,
      drillDay: -1,
      drillSeason: -1,
      drillDatum: '',
      // 判断是不是上卷下钻图形
      drillflag: false,
      // 图表名称
      graphName: '',
      saveDialogVisible: false,
      // 接收dataPrepare的传参
      modelType: sessionStorage.getItem("modelType"),
      cubeName: sessionStorage.getItem("cubeName"),
      factTable: sessionStorage.getItem("factTable"),
      lookupTables: sessionStorage.getItem("lookupTables"),
    };
  },
  created() {

  },
  mounted() {
    this.modelDesc();
    this.myChart = echarts.init(
      document.querySelector(".graph-wrapper .graph"),
      "macarons"
    );
    this.myChart.setOption(this.option);
    setInterval(() => {
      var self = this;
      // self.init();
    }, 1000);
    if (this.modelView == 3) {
      $('.field-wrapper').css('display', 'inline');
      //  $('.olap-item').css('text-align','center');
    } else {
      $('.field-wrapper').css('display', 'none');
      //  $('.olap-item').css('text-align','left');
    }
  },
  methods: {
    //多维表格的合并
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   console.log(row, column, rowIndex, columnIndex)
    //   if (columnIndex === 0) {
    //     if (rowIndex % 2 === 0) {
    //       return {
    //         rowspan: 2,
    //         colspan: 1
    //       };
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       };
    //     }
    //   }
    // },
    //分页切换
    handleCurrentChange(val) {
      //切换页面时触发
      this.currentPage = val;
    },
    //鼠标移入显示所有文字
    excelNames() {
      $("#excelNames").attr("title", this.excelName);
    },
    //初始化
    // init() {
    //   window.addEventListener(
    //     "resize",
    //     function () {
    //       if(this.myChart != null){
    //         this.myChart.resize();
    //       }
    //     }.bind(this)
    //   );
    // },
    //返回
    back() {
      this.$router.go(-1);
    },
    //拖拽维度
    drag1(event) {
      this.dimension = event.currentTarget;
      //通过复制被拖拽节点，使原来的位置上仍保存节点
      this.dragContent = this.dimension.cloneNode(true);
      this.dragContent.setAttribute("draggable", "false");
    },
    //拖拽度量
    drag2(event) {
      this.measure = event.currentTarget;
      //通过复制被拖拽节点，使原来的位置上仍保存节点
      this.dragContent = this.measure.cloneNode(true);
      this.dragContent.setAttribute("draggable", "false");
    },
    //根据左边修改图表type
    update(utype) {
      this.changeTypeVisible = true;
      this.type = utype;
    },
    _deepCopy(obj) {
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
    },
    //修改option并重新画图
    updateOption(newOption) {
      this.option = newOption;
      console.log(this.option);
      this.myChart.setOption(this.option, true); //true表示和之前的option合并
      // this.init();
    },
    //全屏
    toggle() {
      this.$refs["fullscreen"].toggle(); // recommended
      // this.fullscreen = !this.fullscreen // deprecated
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
      $("#graph-wrapper").css("height", window.innerHeight + "px");
      document.querySelector(".graph-wrapper .graph").style.height =
        window.innerHeight + "px";
      // this.init();
    },
    //拖拽放到哪里
    allowDrop(event) {
      event.preventDefault();
    },
    //放维度
    drop1(event) {
      this.graphLoading = true;
      event.preventDefault();
      if (this.dragContent) {
        var i = this.dragContent.getElementsByTagName("span");
        if (i.length != 0) {
          i[0].remove();
        }
        let closeButton = document.createElement("i");
        closeButton.className = "fa fa-times-circle";
        closeButton.setAttribute("aria-hidden", "true");
        this.dragContent.getElementsByTagName("a")[0].appendChild(closeButton);
        event.target.appendChild(this.dragContent);
      }
      this.dragContent
        .getElementsByTagName("a")[0]
        .addEventListener("mouseover", function () {
          var cb = this.getElementsByTagName("i")[0];
          cb.style.display = "inline";
        });
      this.dragContent
        .getElementsByTagName("a")[0]
        .addEventListener("mouseout", function () {
          var cb = this.getElementsByTagName("i")[0];
          cb.style.display = "none";
        });
      let dimensionDragList = event.target.getElementsByTagName("a");
      console.log(dimensionDragList);
      var dimensionValues = [];
      var dimensionTable = [];
      var dimensionEg = [];
      for (let i in dimensionDragList) {
        if (dimensionDragList[i].innerText != undefined) {
          var chdata = dimensionDragList[i].getAttribute("data-column");
          console.log(chdata);
          dimensionValues.push(
            dimensionDragList[i].getAttribute("data-column")
          );
          dimensionTable.push(dimensionDragList[i].getAttribute("data-table"));
          dimensionEg.push(dimensionDragList[i].getAttribute("data-eg"));
        }
      }
      console.log(dimensionValues);
      this.searchdimCh = dimensionValues;
      this.searchdimension = dimensionEg;
      this.searchdimTable = dimensionTable;
      console.log("a" + this.searchdimCh);
      console.log("b" + this.searchdimension);
      console.log("c" + this.searchdimTable);
      //删掉了if else
      this.getData(this.searchdimension, this.searchmeasure, this.searchmethods, this.searchdimTable, this.searchmeasureTable, this.tableColumn);
      var that = this;
      $(".fa").on("click", function (event) {
        that.graphLoading = true;
        event.stopPropagation();
        let dom = event.target.parentNode.parentNode;
        if (dom.nodeName.toLowerCase() == "li") {
          $(dom).remove();

          var dimch = dom.children[0].getAttribute("data-column");
          var dimension = dom.children[0].getAttribute("data-eg");
          var dimtable = dom.children[0].getAttribute("data-table");

          function removeByValue(arr, arr1, arr2, val, val1, val2) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == val && arr1[i] == val1 && arr2[i] == val2) {
                arr.splice(i, 1);
                arr1.splice(i, 1);
                arr2.splice(i, 1);
                break;
              }
            }
          }

          removeByValue(
            that.searchdimCh,
            that.searchdimension,
            that.searchdimTable,
            dimch,
            dimension,
            dimtable
          );
          //删掉了if else
          that.getData(that.searchdimension, that.searchmeasure, that.searchmethods, that.searchdimTable, that.searchmeasureTable, that.tableColumn);
        }
      })
    },
    drop3(event) {
      console.log(this.measureList);
      this.graphLoading = true;
      //放度量
      event.preventDefault();
      //申明方法DOM
      let computeDisplay = document.createElement("span");
      computeDisplay.innerText = "(求和)";
      let computeSelect = document.createElement("div");
      let div = document.createElement("span");
      let div1 = document.createElement("span");
      var searchMethodsSelect = this.searchmethods;
      var searchadMethodsSelect = this.searchadmethods;
      let closeButton = document.createElement("i");
      closeButton.className = "fa fa-times-circle";
      closeButton.setAttribute("aria-hidden", "true");

      computeSelect.setAttribute("class", "computed");
      computeSelect.innerHTML =
        "<ul index=" +
        searchMethodsSelect.length +
        ' class="measure-compute"><li><a data-method="sum">求和</a></li><li><a data-method="avg">平均数</a></li><li><a data-method="count">计数</a></li><li><a data-method="max">最大值</a></li><li><a data-method="min">最小值</a></li><li class="senior" style="position:relative"><a data-method="senior">高级计算</a><div class="scomputed"><ul><li><a data-method="rate">百分比</a></li><li><a data-method="krate">知晓率</a></li><li><a data-method="rate">检出率</a></li></ul><div></li></ul>';
      //将methods DOM加入拖拽DOM元素中

      if (this.dragContent.getElementsByTagName("span").length == 0) {
        searchMethodsSelect.push("sum");
        searchadMethodsSelect.push("default");
        var chdata = this.dragContent
          .getElementsByTagName("a")[0]
          .getAttribute("data-column");
        var egdata = this.dragContent
          .getElementsByTagName("a")[0]
          .getAttribute("data-eg");
        var tabledata = this.dragContent
          .getElementsByTagName("a")[0]
          .getAttribute("data-table");
        this.searchmeasure.push(egdata);
        this.searchmeasureCh.push(chdata);
        this.searchmeasureTable.push(tabledata);
        this.dragContent
          .getElementsByTagName("a")[0]
          .appendChild(computeDisplay);
        this.dragContent.getElementsByTagName("a")[0].appendChild(div);
        this.dragContent.getElementsByTagName("a")[0].appendChild(div1);
        this.dragContent.getElementsByTagName("a")[0].appendChild(closeButton);
        this.dragContent
          .getElementsByTagName("a")[0]
          .appendChild(computeSelect);
      }
      console.log(this.dragContent)
      this.dragContent
        .getElementsByTagName("a")[0]
        .addEventListener("click", function () {
          var lc = this.lastChild.lastChild;
          console.log(lc)
          lc.style.display = "block";
        });
      this.dragContent
        .getElementsByTagName("a")[0]
        .addEventListener("mouseover", function () {
          var cb = this.getElementsByTagName("i")[0];
          cb.style.display = "inline";
        });
      this.dragContent
        .getElementsByTagName("a")[0]
        .addEventListener("mouseout", function () {
          var cb = this.getElementsByTagName("i")[0];
          cb.style.display = "none";
        });
      if (this.dragContent) {
        event.target.appendChild(this.dragContent);
      }
      var that = this;
      //点击显示哪种计算
      $(".measure-compute li").on("click", function () {
        that.graphLoading = true;
        // alert(JSON.stringify($(this)));
        if (
          $(this)
            .parent()
            .parent()
            .parent()
            .attr("class") != "senior"
        ) {
          if ($(this).attr("class") == "senior") {
          } else {
            var index = $(this)
              .parent()
              .attr("index");
            //更新显示文字
            let selectMethodText = $(this)
              .find("a")
              .text();
            //如果此元素等于span的话，再更改
            $(this)
              .parents("div")
              .prev()
              .prev()
              .prev()
              .prev()
              .text("(" + selectMethodText + ")");
            //保存对应methods
            let selectMethod = $(this)
              .find("a")
              .attr("data-method");
            $(this)
              .parent()
              .hide();
            searchMethodsSelect[index] = selectMethod;
            searchadMethodsSelect[index] = "default";
            // alert("aaaa"+searchMethodsSelect);
          }
        } else {
          var index = $(this).parent().parent().parent().parent().attr("index");
          //更新显示文字
          let selectMethodText = $(this).find("a").text();
          $(this).parents("div").prev().prev().prev().prev().text("(" + selectMethodText + ")");
          //保存对应methods
          let selectMethod = $(this)
            .find("a")
            .attr("data-method");
          $(this)
            .parent()
            .parent()
            .parent()
            .parent()
            .css("display", "none");
          searchadMethodsSelect[index] = selectMethod;
          console.log("bbb" + searchadMethodsSelect);
        }
        console.log(that.searchmeasureTable);
        that.getData(that.searchdimension, that.searchmeasure, that.searchmethods, that.searchdimTable, that.searchmeasureTable, that.tableColumn);
        //删掉了if else
        return false;
      });

      this.searchmethods = searchMethodsSelect;
      this.searchadmethods = searchadMethodsSelect;
      console.log(this.searchmeasure);
      console.log(this.searchmethods);
      var that = this;
      //点击❌删除
      $(".fa").on("click", function (event) {
        that.graphLoading = true;
        event.stopPropagation();
        let dom = event.target.parentNode.parentNode;
        if (dom.nodeName.toLowerCase() == "li") {
          $(dom).remove();

          var measure = dom.children[0].getAttribute("data-column");
          var measure2 = dom.children[0].getAttribute("data-eg");
          var measure3 = dom.children[0].getAttribute("data-table");
          function removeByValue(arr, arr2, arr3, arr4, arr5, val, val2, val3) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == val && arr2[i] == val2 && arr3[i] == val3) {
                arr.splice(i, 1);
                arr2.splice(i, 1);
                arr3.splice(i, 1);
                arr4.splice(i, 1);
                arr5.splice(i, 1);
                break;
              }
            }
          }

          removeByValue(
            that.searchmeasureCh,
            that.searchmeasure,
            that.searchmeasureTable,
            that.searchmethods,
            that.searchadmethods,
            measure,
            measure2,
            measure3
          );
          //删掉了if else
          // that.getData(this.searchdimension, this.searchmeasure);
          that.getData(that.searchdimension, that.searchmeasure, that.searchmethods, that.searchdimTable, that.searchmeasureTable, that.tableColumn);
        }
      });
      console.log(this.searchmeasureTable);
      //删掉了if else
      this.getData(this.searchdimension, this.searchmeasure, this.searchmethods, this.searchdimTable, this.searchmeasureTable, this.tableColumn);
    },
    //增加次轴
    drop4(event) {
      this.graphLoading = true;
      event.preventDefault();
      console.log(event);
      if (this.dragContent) {
        var i = this.dragContent.getElementsByTagName("span");
        if (i.length != 0) {
          i[0].remove();
        }
        let closeButton = document.createElement("i");
        closeButton.className = "fa fa-times-circle";
        closeButton.setAttribute("aria-hidden", "true");
        this.dragContent.getElementsByTagName("a")[0].appendChild(closeButton);
        event.target.appendChild(this.dragContent);
      }
      this.dragContent
        .getElementsByTagName("a")[0]
        .addEventListener("mouseover", function () {
          var cb = this.getElementsByTagName("i")[0];
          cb.style.display = "inline";
        });
      this.dragContent
        .getElementsByTagName("a")[0]
        .addEventListener("mouseout", function () {
          var cb = this.getElementsByTagName("i")[0];
          cb.style.display = "none";
        });
      let dimensionDragList = event.target.getElementsByTagName("a");
      console.log(dimensionDragList);
      var dimensionValues = [];
      var dimensionTable = [];
      var dimensionEg = [];
      for (let i in dimensionDragList) {
        if (dimensionDragList[i].innerText != undefined) {
          var chdata = dimensionDragList[i].getAttribute("data-column");
          // console.log(chdata);
          dimensionValues.push(
            dimensionDragList[i].getAttribute("data-column")
          );
          dimensionTable.push(dimensionDragList[i].getAttribute("data-table"));
          dimensionEg.push(dimensionDragList[i].getAttribute("data-eg"));
        }
      }
      // console.log(dimensionValues);
      // this.searchdimCh = dimensionValues;
      // this.searchdimension = dimensionEg;
      // this.searchdimTable = dimensionTable;
      // console.log("a" + this.searchdimCh);
      // console.log("b" + this.searchdimension);
      // console.log("c" + this.searchdimTable);
      this.tableColumn = dimensionEg;
      // console.log("b" + this.tableColumn);
      //删掉了if else
      this.getData(this.searchdimension, this.searchmeasure, this.searchmethods, this.searchdimTable, this.searchmeasureTable, this.tableColumn);
      var that = this;
      $(".fa").on("click", function (event) {
        that.graphLoading = true;
        event.stopPropagation();
        let dom = event.target.parentNode.parentNode;
        if (dom.nodeName.toLowerCase() == "li") {
          $(dom).remove();

          var dimch = dom.children[0].getAttribute("data-column");
          var dimension = dom.children[0].getAttribute("data-eg");
          var dimtable = dom.children[0].getAttribute("data-table");
          // console.log(dimch);
          // console.log(dimension);
          // console.log(dimtable);
          function removeByValue(arr, val) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == val) {
                arr.splice(i, 1);
                break;
              }
            }
          }
          removeByValue(
            that.tableColumn,
            dimch
          );
          // console.log(that.tableColumn)
          //删掉了if else
          that.getData(that.searchdimension, that.searchmeasure, that.searchmethods, that.searchdimTable, that.searchmeasureTable, that.tableColumn);
        }
      })
    },
    //拖拽颜色
    drop6(event) {
      this.colorVisible = true;
    },
    //拖拽到标签
    drop7(event) {
      var label = {
        show: true, //开启显示
        position: 'top', //在上方显示
        textStyle: { //数值样式
          color: 'black',
          fontSize: 10,
          fontWeight: 300
        }
      }
      this.option.series[0]['label'] = label;
      this.resizeGraph();
    },
    drop8(event) {

    },
    //关闭颜色弹窗
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    //图表设置展开面板
    handleChange(val) {
      console.log(val);
    },
    initChart: function (myChart, datum, dom) {
      // console.log(datum)
      // console.log(myChart)
      myChart.setOption(datum.option, true);
      var self = this
      myChart.on('click', function (object) {
        // 销毁之前的echarts实例
        echarts.dispose(dom);
        // 初始化一个新的实例
        var myChart = echarts.init(dom, 'macarons');
        // object为当前的这个echart对象，大家可以自己打印出来看看
        // console.dir(object);
        // 我们可以看到name属性即为当前点击点的对应月份值，那么我们可以通过这个值去接口查询对应201609月份下的每一天的值.
        var drillName = object.name.slice(-1)
        if (drillName == '年') {
          self.drillYear = object.name.slice(0, -1)
        } else if (drillName == '月') {
          self.drillMonth = object.name.slice(0, -1)
        } else if (drillName == '日') {
          self.drillDay = object.name.slice(0, -1)
        } else {
          self.drillSeason = object.name.slice(0, -2)
        }
        console.log(self.drillSeason)
        axios
          .post(
            "http://localhost:6993/DataScrollDrill",
            qs.stringify({
              dataSourceId: self.tableId,
              userId: 1,
              dim: self.objdims.slice(0, -1),
              mea: self.obj.slice(0, -1),
              tableName: sessionStorage.getItem("fileName"),
              year: self.drillYear,
              season: self.drillSeason,
              month: self.drillMonth,
              day: self.drillDay,
              chartType: self.type
            })
          )
          .then(function (response) {
            var drillOption = response.data.datum.option
            var dom = document.querySelector(".graph-wrapper .graph")
            var myChart = echarts.init(dom, 'macarons');
            myChart.setOption(drillOption,true)
            self.initChart(myChart, response.data.datum, dom);
            // self.init();
          })
      });
    },
    scorllGraph() {
      if (this.drillYear != -1 && this.drillSeason != -1 && this.drillMonth != -1 && this.drillDay != -1) {
        this.drillDay = -1
      } else if (this.drillYear != -1 && this.drillSeason != -1 && this.drillMonth != -1) {
        this.drillMonth = -1
      } else if (this.drillYear != -1 && this.drillSeason != -1) {
        this.drillSeason = -1
      } else {
        this.drillYear = -1
      }
      var self = this
      axios
        .post(
          "http://localhost:6993/DataScrollDrill",
          qs.stringify({
            dataSourceId: self.tableId,
            userId: 1,
            dim: self.objdims.slice(0, -1),
            mea: self.obj.slice(0, -1),
            tableName: sessionStorage.getItem("fileName"),
            year: self.drillYear,
            season: self.drillSeason,
            month: self.drillMonth,
            day: self.drillDay,
            chartType: self.type
          })
        )
        .then(function (response) {
          var drillOption = response.data.datum.option
          var dom = document.querySelector(".graph-wrapper .graph")
          self.myChart = echarts.init(dom, "macarons")
          self.myChart.setOption(drillOption, true)
          //返回的图形还可以下钻
          self.initChart(self.myChart, response.data.datum, dom);
          // self.init();
        })
    },
    getData(dims, meas, methods, searchDimTable, searchMeasureTable, tableColumn) {
      this.tabHeaderQian = []
      this.tabHeaderHou = []
      this.tabContentHou = []
      if (this.modelView == 3) {
        this.option = { series: [] };
        var self = this;
        self.objdims = [];
        if (dims.length == 0) {
          self.objdims = [""].toString();
        } else {
          for (var i = 0; i < dims.length; i++) {
            self.objdims = self.objdims + dims[i].toString().trim() + ",";
          }
        }
        self.obj = [];
        if (meas.length == 0) {
          self.obj = [""].toString();
        }
        if (methods != undefined) {
          for (var i = 0; i < methods.length; i++) {
            self.obj = self.obj + methods[i].toString().trim() + '.' + meas[i].toString().trim() + ",";
          }
        }
        var tab = [];
        if (tableColumn.length == 0) {
          tab = [''].toString();
        } else {
          for (var i = 0; i < tableColumn.length; i++) {
            tab = tab + tableColumn[i].toString().trim() + ",";
          }
        }
        axios
          .post(
            "http://localhost:6993/initDiagram",
            qs.stringify({
              dataSourceId: this.tableId,
              userId: 1,
              dims: this.objdims,
              meas: this.obj,
              fileUrl: sessionStorage.getItem("fileUrl"),
              tableName: sessionStorage.getItem("fileName"),
              fileType: sessionStorage.getItem("fileType"),
              // 此处先将tableName、fileUrl和fileType写死以便调通接口，后续再进行更改
              // tableName: "DupTest4babyS_badR",
              // fileUrl: "select gd_baby_situation.BABY_SEX as BABY_SEX, gd_baby_situation.BIRTH_TYPE as BIRTH_TYPE, gd_baby_situation.BABY_LIVE as BABY_LIVE, gd_baby_situation.IS_ILL as IS_ILL, gd_bad_baby_regist.PREGENCY_NUM as PREGENCY_NUM, gd_bad_baby_regist.DOWN_SYND as DOWN_SYND, gd_bad_baby_regist.CONG_HEAR_DISE as CONG_HEAR_DISE, gd_baby_situation.BABY_WEIGHT as BABY_WEIGHT from gd_baby_situation left join gd_bad_baby_regist on gd_baby_situation.ID = gd_bad_baby_regist.ID",
              // fileType: "KYLIN",
              rows: tab,
              limit: this.showNum,
            })
          )
          .then(function (response) {
            console.log(response.data);
            self.classificaion = response.data.datum.classificaion;
            self.dataSourceId = response.data.datum.dataSourceId;
            self.diagramId = response.data.datum.diagramId;
            self.diagramName = response.data.datum.diagramName;
            self.drillflag = response.data.datum.drillflag;
            var domInit = document.querySelector(".graph-wrapper .graph")
            domInit.style.width = "760px"
            domInit.style.height = '64vh'
            self.type = 2
            if (self.drillflag == true) {
              $(".dimValue").remove()
              $(".cardValue").remove()
              // self.type = 2
              self.drillYear = -1
              self.drillMonth = -1
              self.drillDay = -1
              self.drillSeason = -1
              self.$notify({
                title: '上卷下钻图',
                message: '此图为上卷下钻图例，您可点击图中任意点查看下钻情况，点击返回回溯上一级',
                type: 'success'
              });

              var dom = document.querySelector(".graph-wrapper .graph")
              self.myChart = echarts.init(
                document.querySelector(".graph-wrapper .graph"),
                "macarons"
              );
              console.log(dom)
              self.myChart = echarts.init(document.querySelector(".graph-wrapper .graph"), "macarons")
              self.option = self._deepCopy(response.data.datum);
              self.myChart.setOption(self.option.option,true)
              self.initChart(self.myChart, self.option, dom);
            } else {
              // 多维表格
              if (self.classificaion == '-3') {
                self.option = response.data.datum.option
                self.type = 16;
                function extend(target, source) {
                  for (var obj in source) {
                    target[obj] = source[obj];
                  } return target;
                }
                self.tabHeaderHou = response.data.datum.option.cows;
                console.log(self.tabHeaderHou)
                var data = response.data.datum.option.rows;
                self.tabHeaderQian = [];
                if (tableColumn.length != 0) {
                  var tabhead = { name: '' }
                  for (var i = 0; i < tableColumn.length; i++) {
                    tabhead.name = tableColumn[i]
                    self.tabHeaderQian.push(tabhead);
                    self.muchDimTableData = [];
                    for (var j = 0; j < data.length; j++) {
                      var cowHead = {}
                      cowHead[tableColumn[i]] = data[j].name
                      var bind = extend(cowHead, data[j].value);
                      console.log(bind);
                      self.muchDimTableData.push(bind);
                    }
                  }
                }
                console.log(self.tabHeaderQian)
                console.log(self.muchDimTableData);
                console.log(cowHead);
              } else {
                // self.type = 2;
                console.log('进入指标卡')
                if (response.data != '') {
                  console.log(response.data);
                  console.log(self.graphLoading);
                  self.dataSourceId = response.data.datum.dataSourceId;
                  self.diagramId = response.data.datum.diagramId;
                  self.diagramName = response.data.datum.diagramName;

                  self.option = self._deepCopy(response.data.datum.option);
                  if (self.option.title != undefined) {
                    self.myChart.dispose()
                    self.myChart = echarts.init(
                      document.querySelector(".graph-wrapper .graph"),
                      "macarons"
                    );
                    console.log(self.myChart);
                    self.myChart.setOption(self.option, true);
                    // self.init();
                  } else {
                    var newdiv = document.querySelector(".graph-wrapper .graph")
                    newdiv.innerHTML = "<div class=\"dimValue\">" + self.option.name + "</div><div class=\"cardValue\">" + self.option.value + "</div>";
                  }
                } else {
                  $(".dimValue").remove()
                  $(".cardValue").remove()
                  console.log($(".dimValue"));
                  self.option = self._deepCopy({})
                  self.myChart = echarts.init(
                    document.querySelector(".graph-wrapper .graph"),
                    "macarons"
                  );
                  self.myChart.setOption(self.option, true);
                  // self.init();
                }
              }
              self.option = self._deepCopy(response.data.datum.option)
              self.myChart = echarts.init(
                document.querySelector(".graph-wrapper .graph"),
                "macarons"
              );
              self.myChart.setOption(self.option, true);
            }
            self.graphLoading = false;
          }).catch((res) => {
            this.tableDatasLoading = false;
            // this.$message.error('哎哟～出错了～');
          });
      } else {  // 执行的是这个initDiagram（因为暂时把modelView写死成2了）
        console.log(searchDimTable);
        console.log(searchMeasureTable);
        this.option = { series: [] };
        var self = this;
        var dimsObj = [];
        console.log(dims)
        if (dims.length == 0) {
          dimsObj = [""].toString();
        } else {
          for (var i = 0; i < dims.length; i++) {
            dimsObj = dimsObj + searchDimTable[i] + '.' + dims[i].toString().trim() + ",";
          }
        }
        console.log(dimsObj);
        var obj = [];
        if (meas.length == 0) {
          obj = [""].toString();
        }
        if (methods != undefined) {
          for (var i = 0; i < methods.length; i++) {
            obj = obj + methods[i].toString().trim() + '.' + searchMeasureTable[i] + '.' + meas[i].toString().trim() + ",";
          }
        }
        console.log(obj);
        axios
          .post(
            "http://localhost:6993/initDiagram",
            qs.stringify({
              dataSourceId: this.tableId,
              userId: 1,
              dims: dimsObj,
              meas: obj,
              fileUrl: sessionStorage.getItem("fileUrl"),
              tableName: sessionStorage.getItem("fileName"),
              fileType: sessionStorage.getItem("modelType"),
              tableName: this.fileName,
              // 此处先将tableName、fileUrl和fileType写死以便调通接口，后续再进行更改
              // tableName: "DupTest4babyS_badR",
              // fileUrl: "select gd_baby_situation.BABY_SEX as BABY_SEX, gd_baby_situation.BIRTH_TYPE as BIRTH_TYPE, gd_baby_situation.BABY_LIVE as BABY_LIVE, gd_baby_situation.IS_ILL as IS_ILL, gd_bad_baby_regist.PREGENCY_NUM as PREGENCY_NUM, gd_bad_baby_regist.DOWN_SYND as DOWN_SYND, gd_bad_baby_regist.CONG_HEAR_DISE as CONG_HEAR_DISE, gd_baby_situation.BABY_WEIGHT as BABY_WEIGHT from gd_baby_situation left join gd_bad_baby_regist on gd_baby_situation.ID = gd_bad_baby_regist.ID",
              // fileType: "KYLIN",
            })
          )
          .then(function (response) {
            if (response.data != '') {
              console.log(response.data);
              console.log(self.graphLoading);
              self.classificaion = response.data.datum.classificaion;
              self.dataSourceId = response.data.datum.dataSourceId;
              self.diagramId = response.data.datum.diagramId;
              self.diagramName = response.data.datum.diagramName;

              self.option = self._deepCopy(response.data.datum.option);
              if (self.option.title != undefined) {
                self.myChart.dispose()
                self.myChart = echarts.init(
                  document.querySelector(".graph-wrapper .graph"),
                  "macarons"
                );
                console.log(self.myChart);
                self.myChart.setOption(self.option, true);
                // self.init();
              } else {
                var newdiv = document.querySelector(".graph-wrapper .graph")
                newdiv.innerHTML = "<div class=\"dimValue\">" + self.option.name + "</div><div class=\"cardValue\">" + self.option.value + "</div>";
              }
            } else {
              $(".dimValue").remove()
              $(".cardValue").remove()
              console.log($(".dimValue"));
              self.option = self._deepCopy({})
              self.myChart = echarts.init(
                document.querySelector(".graph-wrapper .graph"),
                "macarons"
              );
              self.myChart.setOption(self.option, true);
              // self.init();
            }
            self.graphLoading = false;
          }).catch((res) => {
            self.graphLoading = false;
            this.$message.error('哎哟～出错了～');
          });
      }
    },
    changeType() {
      var self = this;
      self.graphLoading = true;
      self.changeTypeVisible = false;
      if (this.type == 16) {

      } else {
        axios
          .post(
            "http://localhost:6993/newupdateDiagram",
            qs.stringify({
              userId: '1',
              diagramId: this.diagramId,
              diagramName: this.diagramName,
              diagramType: this.type,
            })
          )
          .then(function (response) {
            self.option = self._deepCopy(response.data.datum.option);
            $(".dimValue").remove()
            $(".cardValue").remove()
            if (self.drillflag == true) {
              self.drillYear = -1
              self.drillMonth = -1
              self.drillDay = -1
              self.drillSeason = -1
              self.$notify({
                title: '上卷下钻图',
                message: '此图为上卷下钻图例，您可点击图中任意点查看下钻情况，点击返回回溯上一级',
                type: 'success'
              });
              var dom = document.querySelector(".graph-wrapper .graph")
              self.myChart = echarts.init(dom, "macarons")
              var option = response.data.datum;
              self.initChart(self.myChart, option, dom);
            } else {
              if (self.option.value == undefined) {
                self.myChart.dispose()
                self.myChart = echarts.init(
                  document.querySelector(".graph-wrapper .graph"),
                  "macarons"
                );
                console.log(self.myChart);
                self.myChart.setOption(self.option, true);
                // self.init();
              } else {
                console.log(self.option)
                var newdiv = document.querySelector(".graph-wrapper .graph")
                newdiv.innerHTML = "<div class=\"dimValue\">" + self.option.name + "</div><div class=\"cardValue\">" + self.option.value + "</div>";
              }
            }
            self.graphLoading = false;
          }).catch((res) => {
            this.tableDatasLoading = true;
            this.$message.error('哎哟～出错了～');
          });
      }
    },
    //更新颜色
    colorUpdate() {
    },
    // 保存
    saveGraph() {
      var that = this;
      axios
        .post(
          "http://localhost:6993/saveDiagram",
          qs.stringify({
            // 暂时写死projectId和wordId
            projectId: '0',
            workId: '0',
            userId: '1',
            diagramId: this.diagramId,
            diagramName: this.graphName,
            dataSourceId: this.dataSourceId,
            classificaion: this.classificaion,
            option: JSON.stringify(this.option),
          })
        )
        .then(function (response) {
          console.log("获取response");
          console.log(response);
          if (response.data.result == true){
            that.$message.success('恭喜你，保存成功！');
            that.saveDialogVisible = false
          }else {
            that.$message.error('保存失败');
          }
          that.graphName = ''
        })
    },
    //统计扩展
    statistic() {

    },
    //图表设置
    graphSetting() {
      if (this.classificaion == '-3') {
        this.total = this.muchDimTableData.length
        this.isPage = false
        this.pictureSettingVisible = false
      } else {
        this.option.title.text = this.graphTitle;
        this.pictureSettingVisible = false;
        this.resizeGraph();
      }
    },
    // 发布到大屏
    releaseGraph() {
      var that = this;
      axios
        .post(
          "graph/user/addnewChart",
          qs.stringify({
            userId: 1,
            chart: JSON.stringify(this.option),
          })
        )
        .then(function (response) {
          if (response.data.SUCCESS == true) {
            that.$message({
              message: '恭喜你，发布成功！',
              type: 'success'
            });
          };
        }).catch((res) => {
          this.tableDatasLoading = true;
          this.$message.error('哎哟～出错了～');
        });
    },
    // //cube主题弹窗关闭
    // closeItemDialog() {
    //   this.itemShow = false;
    // },
    // //切换主题（选择cube的弹窗被注释掉了，需要重新调用该函数）
    // selectItem() {
    //   axios.get('http://localhost:6993/getCubeTables?cubeName=' + this.cubeRadioData[this.cubeRadio]).then((response) => {
    //     var data = response.body.datum;
    //     console.log(data);
    //     // this.info = data;
    //     this.tableNameList = [];
    //     for (let i in data) {
    //       this.tableNameList.push(data[i]);
    //     }
    //     console.log(this.tableNameList)
    //   });
    //   this.itemShow = false;
    // },
    // //显示主题
    // showCube() {
    //   this.itemShow = true;
    // },
    // //显示主题，可点击
    // showSitem() {
    //   $('.sitem').css('display', 'none');
    //   var $this = $(event.target);
    //   $this.parent().find('ul').css('display', 'block');
    //   var item = event.target.getAttribute('data-value');
    //
    //   var sitem = this.itemList[item];
    //   //alert(JSON.stringify(sitem));
    //   this.sitemNameList = [];
    //   for (var key in sitem) {
    //     if (key != "") {
    //       this.sitemNameList.push(key);
    //     }
    //   }
    // },
    // //切换主题
    // changItem() {
    //   this.itemShow = true;
    // },
    showDimen(index, name) {
      $("#dimen" + index).attr("title", name);
    },
    showMeas(index, name) {
      $("#meas" + index).attr("title", name);
    },
    showTableName(index, name) {
      $("#tableName" + index).attr("title", name);
    },
    //展开主题里面的工作表
    selectTable(event) {
      $('.field-wrapper').css('display', 'none');
      console.log(event.target);
      this.tableName = event.target.innerText;
      console.log(this.tableName);
      this.measureList = [];
      this.dimensionList = [];

      if (this.modelType == "hive") { // 获取hive的维度、度量
        axios
          .get("http://localhost:6993/getDimsAndMeasByTableName?tableName=" + this.tableName)
          .then((response) => {
            let data = response.data.datum;
            console.log(data);

            for (let i in data.dimensions) { // 这里的i还是index，并非dimension
              this.dimensionList.push([data.dimensions[i], this.tableName]);
            }
            for (let i in data.measures) {
              this.measureList.push([data.measures[i], this.tableName]);
            }
          })
      }else if (this.modelType == "kylin") { // 获取cube中每个表的维度、度量
        axios
          .get("http://localhost:6993/getCubeTableDims?cubeName=" + this.cubeName + "&tableName=" + this.tableName)
          .then((response) => {
            let data = response.data.datum;
            console.log(data);
            for (let i in data.meas) {
              this.measureList.push([data.meas[i], this.tableName]);
            }
            for (var j in data.dims) {
              this.dimensionList.push([data.dims[j], this.tableName]);
            }
        });
      }

      this.isDisplay = !this.isDisplay;
      console.log(this.isDisplay);
      var dom = event.target.parentNode.nextElementSibling;

      console.log(dom);
      if (dom.style.display == "block") {
        $(dom).slideUp(1000);

      } else {
        $(dom).slideDown(1000);
      }
    },
    headleChangeColor(color) {
      let hasSet = false;
      //非首次改变颜色，只需把原来数组中对应元素的颜色进行改变，无需再push
      for (let i in this.colors) {
        if (this.colors[i].indexOf(this.dragColorItem) >= 0) {
          this.colors[i] = this.dragColorItem + "#" + color.substr(1, color.length);
          hasSet = true;
        }
      }
      //首次改变颜色
      if (!hasSet) {//去掉#
        var t = this.dragColorItem + "#" + color.substr(1, color.length);
        this.colors.push(t);
      }

      console.log(this.colors);
      this.picSetting(this.colors);
      // if(this.isActive) {
      //   this.getData(this.type, this.searchdimension,this.searchdimCh,this.searchdimTable, this.searchmeasure,this.searchmeasureCh,this.searchmeasureTable, this.searchmethods,this.colors, this.searchmeasure2, this.searchmeasure2Ch,this.searchmeasure2Table,this.searchmethods2, this.filterList,this.searchadmethods,this.searchadmethods2,this.filterTable,this.filterNameList,this.cubeName,false);
      // }else{
      //   this.getData(this.type, this.searchdimension,this.searchdimCh,this.searchdimTable, this.searchmeasure,this.searchmeasureCh,this.searchmeasureTable, this.searchmethods,this.colors, this.searchmeasure2, this.searchmeasure2Ch,this.searchmeasure2Table,this.searchmethods2, this.filterList,this.searchadmethods,this.searchadmethods2,this.filterTable,this.filterNameList,this.cubeName,true);
      // }
    },
    sort() {
      // if (this.sortOrder == '1' && this.sortBy == '1') {
      //   this.option.series[0].data = this.option.series[0].data.sort(this.sortOrderNumber);
      //   this.resizeGraph();
      // } else if (this.sortOrder == '2' && this.sortBy == '1') {
      //   this.option.series[0].data = this.option.series[0].data.sort(this.sortByNumber);
      //   this.resizeGraph();
      // } else if (this.sortBy == '3') {
      //   this.option.series[0].data = this.filedSortList;
      //   this.resizeGraph();
      // }
      console.log(this.sortFiled);
      this.sortVisible = false;
    },
    resizeGraph() {
      this.myChart = echarts.init(document.querySelector(".graph-wrapper .graph"));
      this.myChart.setOption(this.option);
      // this.init();
    },
    sortOrderNumber(a, b) {
      return a - b;
    },
    sortByNumber(a, b) {
      return b - a;
    },
    //图表设置
    picSetting(color) {
      if (color != "") {
        this.option.series[0].color = color;
        this.resizeGraph();
      }
    },
    //添加次轴
    addY() {
      this.addy = true;
    },
    //移除次轴
    removeY() {
      this.addy = false;
      this.searchmeasure2Ch = [];
      this.searchmeasure2Table = [];
    },
    //复制
    copy() {

    },
    // 获取左侧栏的数据（表名列表tableNameList）
    modelDesc(){
      console.log("执行modelDesc函数");
      if (this.modelType == "kylin") { // 获取表名列表（cube）
        axios
          .get('http://localhost:6993/getCubeTables?cubeName=' + this.cubeName)
          .then((response) => {
            console.log("调用后台接口");
            console.log(response);
            let data = response.data.datum;
            console.log(data);
            // this.info = data;
            this.tableNameList = [];
            for (let i in data) {
              this.tableNameList.push(data[i]);
            }
            console.log(this.tableNameList)
        });
      }else if (this.modelType == "hive") { // 获取表名列表（hive：宽表或单表）
        this.tableNameList.push(this.factTable);
        this.lookupTables = JSON.parse(this.lookupTables);
        for (let i = 0; i < this.lookupTables.length; i++) {
          console.log(this.lookupTables[i]);
          this.tableNameList.push(this.lookupTables[i].lookupTable);
        }
        console.log(this.tableNameList);
      }
    },
  },
  //组件
  components: {
    "v-rightbar": rightBar,
    draggable,
    colorPicker: colorPicker,
    MyDialog: MyDialog
  },
  watch: {
    sortBy: {
      handler: function () {
        if (this.sortBy == "3") {
          $(".filedSortList").css("display", "inline");
          this.filedSortList = this.option.series[0].data;
          $(".upOrder").attr("disabled", true);
        } else {
          $(".filedSortList").css("display", "none");
        }
      },
      //深度观察
      deep: true
    },
    fullscreen: {
      handler: function () {
        if (this.fullscreen == false) {
          $("#graph-wrapper").css("height", "55vh");
          document.querySelector(".graph-wrapper .graph").style.height = "50vh";
        }
      },
      //深度观察
      deep: true
    },
    searchdimension: {
      handler: function () {
        console.log(typeof (this.searchdimension))
        console.log("weidu" + this.searchdimension)
      },
      deep: true
    },
    searchmeasure: {
      handler: function () {
        console.log(typeof (this.searchmeasure))
        console.log("duliang" + this.searchmeasure)
      },
      deep: true
    },
    searchmethods: {
      handler: function () {
      },
      //深度观察
      deep: true
    }
  }
};
</script>
<style scoped>
.fullscreen {
  background: #fff !important;
}
/* 头部样式 */
.prehd {
  width: 100%;
  height: 55px;
  line-height: 45px;
  padding: 5px 20px;
  background-color: #f5f7fa;
  box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.98),
    0 10px 12px 0 rgba(170, 182, 206, 0.2),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);
}
.pretitle {
  font-size: 22px;
  font-family: 微软雅黑;
  color: rgb(71, 172, 253);
  margin-left: 30px;
}
.pretitles {
  font-size: 15px;
  font-family: 微软雅黑;
  color: rgb(71, 172, 253);
  margin-left: 30px;
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
  top: 10;
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
.containerContent {
  position: absolute;
  width: 31%;
  height: 100%;
  /*add by tc*/
  background: white;
  top: 150px;
}
.left-bar {
  position: absolute;
  top: 80px;
  width: 45%;
  height: 100%;
  float: left;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.olap-item {
  /* min-height: 40px; */
  line-height: 40px;
  list-style: none;
  text-align: center;
}
.olap-item a {
  color: #7e8c8d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* margin: 0px 10px; */
}
.left-bar .olap-item a:hover {
  display: block;
  min-height: 40px;
  line-height: 40px;
  color: #fff;
  background-color: #82cdff;
}
.left-bar .table-list-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  min-height: 40px;
  line-height: 40px;
  background-color: #82cdff;
  border-bottom: 1px solid #fff;
}
.left-bar .table-list-item a {
  color: #fff !important;
}
.item-title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 700;
  margin: 0px 10px;
  /* padding-bottom: 15px; */
  text-align: left;
}
.dimension-name,
.measure-name {
  font-weight: 700;
  text-align: center;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.field-wrapper .item-title2 {
  border-right: 1px solid #ddd;
  padding-left: 10px;
  text-align: left;
}
.left-bar .field-wrapper {
  display: none;
}
.field-wrapper .dimension-wrapper a:hover {
  display: block;
  min-height: 40px;
  line-height: 40px;
  color: #468fca;
  background-color: #bbe9ff;
}
.dimension-content {
  height: 270px;
  overflow-y: scroll;
}
.field-wrapper .measure-wrapper a:hover {
  display: block;
  min-height: 40px;
  line-height: 40px;
  color: #468fca;
  background-color: #bbe9ff;
}
/* 中间样式 */
.contentOne {
  width: 50%;
  height: 100px;
  top: 100px;
  position: absolute;
  right: 10px;
  border: 1px solid #a8acb0;
  border-radius: 3px;
  background: white;
}
.contentTwo {
  width: 50%;
  height: 250px;
  top: 220px;
  position: absolute;
  right: 10px;
  border: 1px solid #a8acb0;
  border-radius: 3px;
}
.contentThree {
  width: 50%;
  height: 250px;
  top: 490px;
  position: absolute;
  right: 10px;
  border: 1px solid #a8acb0;
  border-radius: 3px;
}
/* 上面筛选器样式 */
.filter {
  padding: 7px;
  font-weight: 500;
}
/* 下面标记样式 */
.el-row {
  margin-bottom: 5px;
}
.el-col {
  border-radius: 2px;
}
.bg-purple-dark {
  background: white;
}
.bg-purple {
  background: white;
  font-size: 1px;
  border: 1px solid #e4e7ed;
  border-radius: 2px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 2px;
  min-height: 45px;
  margin-bottom: 10px;
  text-align: center;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-select-dropdown__item span {
  margin-left: 5px;
}
/* 右边样式 */
.main-content {
  position: absolute;
  top: 150px;
  right: 20px;
  width: 57%;
  padding: 5px 15px;
  background-color: #fff;
  text-align: left;
  overflow: auto;
}
.main-content .drag-wrapper .drag-item {
  height: 40px;
  min-width: 530px;
  line-height: 40px;
  position: relative;
  border-bottom: 1px solid #868686;
}
.drag-title-label {
  padding-right: 10px;
}
.drag-item .measure-item,
.drag-item .dimension-item {
  /* background-color: #3b8dbc; */
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  margin: 5px;
}
.left-bar .olap-item a {
  padding-left: 5px;
  color: #7e8c8d;
  font-weight: 700;
}
.main-content .drag-wrapper .drag-item .measure-item a,
.main-content .drag-wrapper .drag-item .dimension-item a {
  font-weight: 700;
  color: #fff;
}
.main-content .drag-wrapper .drag-item .dimension-item,
.main-content .drag-wrapper .drag-item .measure-item {
  position: relative;
  background-color: #00cde2d1;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 5px;
  padding: 0px 10px;
}
.main-content .drag-wrapper .drag-item .measure-item .measure-name .computed,
.main-content .drag-wrapper .drag-item .dimension-item .measure-name .computed {
  position: absolute;
  border: 1px solid #eee;
  top: 30px;
  width: 100%;
  margin-left: -10px;
  background-color: #fff;
  z-index: 50;
}
.main-content .drag-wrapper .drag-item .dimension-item a .computed a {
  display: block;
  width: 100%;
  color: #314871;
}
.main-content
  .drag-wrapper
  .drag-item
  .measure-item
  a
  .computed
  .measure-compute,
.main-content
  .drag-wrapper
  .drag-item
  .dimension-item
  a
  .computed
  .measure-compute {
  display: none;
  position: relative;
  z-index: 9999;
}
.main-content
  .drag-wrapper
  .drag-item
  .measure-item
  a
  .computed
  .measure-compute
  .scomputed,
.main-content
  .drag-wrapper
  .drag-item
  .dimension-item
  a
  .computed
  .measure-compute
  .scomputed {
  display: none;
  position: absolute;
  border: 1px solid #eee;
  width: 100px;
  background-color: #fff;
  z-index: 50;
  top: 0px;
  right: -100px;
}

.main-content
  .drag-wrapper
  .drag-item
  .measure-item
  a
  .computed
  .measure-compute
  .scomputed
  a:hover,
.main-content
  .drag-wrapper
  .drag-item
  .dimension-item
  a
  .computed
  .measure-compute
  .scomputed
  a:hover {
  background-color: #f5f5f5;
}

.main-content
  .drag-wrapper
  .drag-item
  .measure-item
  a
  .computed
  .senior:hover
  > .scomputed,
.main-content
  .drag-wrapper
  .drag-item
  .dimension-item
  a
  .computed
  .senior:hover
  > .scomputed {
  display: block;
}

.fa {
  margin-left: 5px;
  display: none;
}

.graph-wrapper {
  min-width: 530px;
  height: 64vh;
  width: 100%;
  padding: 0px 20px;
}
.graph-wrapper .graph {
  width: 100%;
  height: 100%;
  padding: 20px 10px 10px;
  margin-top: 30px;
  border: 1px solid #868686;
}
.headStyle {
  width: 100%;
  height: 64vh;
  overflow: scroll;
  padding: 10px 45px 50px;
  margin-top: 30px;
  border: 1px solid #868686;
}
/* 展开智能显示样式 */
.transition-box {
  margin-bottom: 10px;
  width: 182px;
  height: 100%;
  border-radius: 4px;
  background-color: #ddd;
  color: lightslategray;
  padding: 10px 10px;
  box-sizing: border-box;
  margin-right: 20px;
}
.coll {
  position: absolute;
  right: -20px;
  height: 450px;
  float: right;
}
/* 下面智能显示样式 */
.picture {
  margin-left: 3px;
}
/* 排序顺序 */
.sortOrder,
.sortBy {
  border: 1px solid #eee;
  border-radius: 5px;
  background: #f1f1f1;
  margin: 10px;
}
.el-radio {
  margin: 10px;
}
/* 排序字段样式 */
.el-checkbox-group {
  margin: 10px;
}
/* 手动排序样式 */
.dragStyle {
  height: 30vh;
  overflow: scroll;
  width: 90%;
  margin: 5px 16px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
}
.fileds {
  margin: 5px 10px;
}
/* 颜色弹窗样式 */
.colorDialog .el-dialog {
  height: 590px;
}
.color-right {
  margin-left: 130px;
}
.dialog-footer {
  margin-top: 370px;
}
/* 显示cube主题的弹窗样式 */
.dialog-content ul {
  padding: 10px 50px;
}
.table-list {
  padding: 7px 0px;
}
.table-title {
  font-size: 20px;
}
.footer {
  float: right;
  margin-top: -20px;
}
/* 次轴的样式 */
.y_operate {
  position: absolute;
  right: 5px;
  bottom: 0px;
  color: #409eff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
input {
  border-top: 0px;
  border-right: 0px;
  border-bottom: 1px solid #2fc8e0e3;
  border-left: 0px;
  background-color: transparent;
  color: #000;
  text-align: center;
}
.right-title {
  margin-top: 15px;
  margin-left: 25px;
}
.cubeClass {
  margin-left: 550px;
}
.pages {
  float: right;
  margin: 5px;
}
.dimension-wrapper {
  height: 300px;
  overflow: scroll;
}
.scrollGraph {
  position: absolute;
  margin-top: 10px;
  margin-left: 580px;
  z-index: 999;
}
  .icon-paixu{
    font-style: normal;
  }
i{
  font-style: normal;
}
</style>
