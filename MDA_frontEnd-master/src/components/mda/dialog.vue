<template>
    <div class="dialog" v-show="showMask">
        <div class="dialog-container">
            <div class="dialog-title">{{title}}</div>
            <!-- 分割线 -->
            <a-divider />
            <!-- 表单 -->
            <el-form :model="form">
                <!-- 表格（禁止选择） 显示table1和table2 -->
                <el-form-item style="margin: 30px 20px 30px 40px">
                    <el-col :span="10">
                        <el-select class="table" disabled :placeholder="table1"></el-select>
                    </el-col>
                    <el-col :span="2" align="center" style="color: #67C23A; font-weight: bold">join</el-col>
                    <el-col :span="10">
                        <el-select class="table" disabled :placeholder="table2"></el-select>
                    </el-col>
                </el-form-item>
                <!-- 选择连接方式 -->
                <el-form-item style="margin: 30px 0px 30px 80px">
                    <el-col :span="4" style="font-weight: bold; color: #409EFF">联接方式：</el-col>
                    <el-radio-group v-model="joinType">
                        <el-radio-button label="内部"></el-radio-button>
                        <el-radio-button label="左侧"></el-radio-button>
                        <el-radio-button label="右侧"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <!-- 显示联接字段 -->
                <el-form-item style="margin: 30px 20px 30px 40px">
                    <el-col :span="10">
                        <el-select v-model="column1" filterable placeholder="请选择联接字段">
                            <el-option
                                    v-for="item in table1Columns"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                                <span style="float: left; z-index: 999">{{ item.name }}</span>
                                <span style="float: right; z-index: 999; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2" align="center" style="font-weight: bold">=</el-col>
                    <el-col :span="10">
                        <el-select v-model="column2" filterable placeholder="请选择联接字段">
                            <el-option
                                    v-for="item in table2Columns"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                                <span style="float: left; z-index: 999">{{ item.name }}</span>
                                <span style="float: right; z-index: 999; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
            <!-- 分割线 -->
            <a-divider />
            <!-- 按钮 -->
            <div class="btns">
                <div v-if="type == 'confirm'" class="default-btn" @click="closeBtn">
                    {{cancelText}}
                </div>
                <div v-if="type == 'danger'" class="danger-btn" @click="dangerBtn">
                    {{dangerText}}
                </div>
                <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">
                    {{confirmText}}
                </div>
            </div>
            <div class="close-btn" @click="closeMask"><i class="iconfont icon-close"></i></div>
        </div>
    </div>
</template>
<script>
/*eslint-disable*/
export default {
    props: {
        value: {},
        // 类型包括 defalut 默认， danger 危险， confirm 确认，
        type:{
            type: String,
            default: 'default'
        },
        content: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        dangerText: {
            type: String,
            default: '删除'
        },
        confirmText: {
            type: String,
            default: '确认'
        },
        table1: {
            type: String,
            default: '表格1'
        },
        table2: {
            type: String,
            default: '表格2'
        },
        table1Columns: {
            type: Array,
            default: []
        },
        table2Columns: {
            type: Array,
            default: []
        },
        column1: {
            type: String,
            default: ''
        },
        column2: {
            type: String,
            default: ''
        },
    },
    data(){
        return{
            showMask: false,
            // el-form
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',
            joinType: "内部",
        }
    },
    methods:{
        closeMask(){
            this.showMask = false;
        },
        closeBtn(){
            this.$emit('cancel');
            this.closeMask();
        },
        dangerBtn(){
            this.$emit('danger');
            this.closeMask();
        },
        confirmBtn(){
            console.log(this.joinType);
            // 将连接条件整理成 "xxx=yyy" 的格式传递
            let joinCondition = this.column1 + "=" + this.column2;
            // 将column1和column2还原为空字符串，防止弹窗默认显示上一次的选择
            this.column1 = this.column2 = "";
            console.log(joinCondition);
            this.$emit('confirm', this.joinType, joinCondition);
            this.closeMask();
        }
    },
    mounted(){
        this.showMask = this.value;
    },
    watch:{
        value(newVal, oldVal){
            this.showMask = newVal;
        },
        showMask(val) {
            this.$emit('input', val);
        }
    },
}
</script>
<style lang="less" scoped>
    .dialog{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 998;
        .dialog-container{
            width: 500px;
            height: 380px;
            background: #ffffff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            position: relative;
            .dialog-title{
                width: 100%;
                height: 60px;
                font-size: 18px;
                color: #696969;
                font-weight: 600;
                padding: 16px 50px 0 20px;
                box-sizing: border-box;
            }
            .content{
                color: #797979;
                line-height: 26px;
                padding: 0 20px;
                box-sizing: border-box;
            }
            .inp{
                margin: 10px 0 0 20px;
                width: 200px;
                height: 40px;
                padding-left: 4px;
                border-radius: 4px;
                border: none;
                background: #efefef;
                outline: none;
                &:focus{
                    border: 1px solid #509EE3;
                }
            }
            .btns{
                width: 100%;
                height: 60px;
                // line-height: 60px;
                position: absolute;
                bottom: 0;
                left: 0;
                text-align: right;
                padding: 0 16px;
                box-sizing: border-box;
                & > div{
                    display: inline-block;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 14px;
                    color: #ffffff;
                    background: #f1f1f1;
                    border-radius: 8px;
                    margin-right: 12px;
                    cursor: pointer;
                }
                .default-btn{
                    color: #787878;
                    &:hover{
                        color: #509EE3;
                    }
                }
                .danger-btn{
                    background: #EF8C8C;
                    &:hover{
                        background: rgb(224, 135, 135);
                    }
                    &:active{
                        background: #EF8C8C;
                    }
                }
                .confirm-btn{
                    color: #ffffff;
                    background: #509EE3;
                    &:hover{
                        background: #6FB0EB;
                    }
                }
            }
            .close-btn{
                position: absolute;
                top: 16px;
                right: 16px;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 18px;
                cursor: pointer;
                &:hover{
                    font-weight: 600;
                }
            }
        }
    }
    /*设置分割线的格式*/
    .ant-divider-horizontal{
        margin: auto;
    }
</style>
