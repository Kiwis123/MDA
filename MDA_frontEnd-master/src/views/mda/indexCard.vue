<template>
    <div style="width: 305px; height: 198px">
        <div class="card-title">
            <span>{{ card.title }}</span>
        </div>
        <div class="card-value">
            <span>{{ card.value }}</span>
        </div>
        <div class="card-change" v-if="card.changeType !== 'not-visable'">
            <span>月环比：</span>
            <div :class="card.changeType" style="display: inline">
                <i :class="changeClass(card.changeType)"></i>&nbsp;&nbsp;{{ card.changeValue }}
            </div>
        </div>
    </div>
</template>

<script>
    /*eslint-disable*/
    export default {
        data() {
            return {
            }
        },
        methods: {
            changeClass(changeType) { // 对比结果类型 {"change-up"、"change-down"、"not-change"、"not-visiable"} ("not-visiable"表示不可变，无需显示此div)
                if (changeType === "change-up") {
                    return "iconfont icontcarrow-up"
                }else {
                    return "iconfont icontcarrow-down"
                }
            }
        },
        // 接受父组件的传值
        props: ['card']
    }
</script>

<style>
    .card-title {
        text-align: center;
        padding-top: 20px;
        font-family: Arial;
        font-size: 30px;
    }
    .card-value {
        text-align: center;
        font-family: Arial;
        font-size: 50px;
        font-weight: bold;
    }
    .card-change {
        text-align: center;
        font-family: Arial;
        font-size: 20px;
    }
    .change-up {
        color: red;
    }
    .change-down {
        color: green;
    }
</style>
