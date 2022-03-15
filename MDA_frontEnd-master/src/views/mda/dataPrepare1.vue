<template>
    <a-row type="flex" justify="space-around">
        <a-col :xl="5" style="min-width: 190px">

            <a-card id="tablelist" title="数据表" style="background-color: white;width: 100%;height: 50%">
                <a-col draggable="true" @dragstart='drag($event)' @dragend="dragend($event)" v-for="hiveTable in hiveTables" :key="hiveTable.index" >
                    <a-icon :component="tableSvg" />
                    <span id="hive" class="tableName"> {{ hiveTable }}</span>
                </a-col>
            </a-card>

            <a-card class="" id="cubelist" title="数据立方体" style="background-color: white;width: 100%;height: 50%">
                <a-col v-for="cube in cubes" :key="cube.index" draggable="true" @dragstart='drag($event)' @dragend="dragend($event)">
                    <a-icon :component="cubeSvg"/>
                    <span id="cube" class="tableName"> {{ cube }}</span>
                </a-col>
            </a-card>
        </a-col>
        <a-col :xl="18" :md="17">
            <div :style="{ background: '#fff',padding: '24px', }">
                <a-row type="flex" justify="space-between">
                    <a-col :span="8">
                        <span style="font-size: 25px;font-weight: 400">数据视图</span>
                    </a-col>
                    <a-col :span="8">
<!--                        <a-input-search size="large" style="margin-bottom: 30px" placeholder="输入数据库名称" @search="onSearch" enterButton />-->
                    </a-col>
                </a-row>
                <!-- 分割线 -->
                <a-divider />
                <!-- 拖拽放置区域 -->
                <div id="target" @drop="drop($event)" @dragover="allowDrop($event)" style="height: 200px"></div>
            </div>

            <!-- 分割线 -->
            <a-divider />

            <div :style="{ background: '#fff',padding: '24px', }">
                <a-row type="flex" justify="space-between">
                    <a-col :span="8">
                        <span style="font-size: 25px;font-weight: 400">数据预览</span>
                    </a-col>
                    <a-col :span="8">
                        <!--                        <a-input-search size="large" style="margin-bottom: 30px" placeholder="输入数据库名称" @search="onSearch" enterButton />-->
                    </a-col>
                </a-row>
                <a-table :columns="columns" :dataSource="previewData" :scroll="{ x: '250%'}">
                    <a slot="id" slot-scope="text" href="javascript:;">{{text}}</a>
<!--                    <span slot="customTitle">-->
<!--                  <a-icon type="smile-o" />数据库名称-->
<!--                </span>-->
<!--                    <span slot="tags" slot-scope="tags">-->
<!--                  <a-tag v-for="tag in tags" :color="tag==='开发环境' ? 'geekblue' : 'green'" :key="tag">{{tag.toUpperCase()}}</a-tag>-->
<!--                </span>-->
<!--                    <span slot="action" slot-scope="text, record">-->
<!--                  <a href="javascript:;">Invite 一 {{record.id}}</a>-->
<!--                  <a-divider type="vertical" />-->
<!--                  <a href="javascript:;">Delete</a>-->
<!--                  <a-divider type="vertical" />-->
<!--                  <a href="javascript:;" class="ant-dropdown-link">-->
<!--                    More actions-->
<!--                    <a-icon type="down" />-->
<!--                  </a>-->
<!--                </span>-->
                </a-table>
            </div>

        </a-col>

    </a-row>
</template>

<script>
    import axios from "axios";
    import cubeSvg from '@/assets/assets_mda/svg/cangku-2.svg'; // path to your '*.svg' file.
    import tableSvg from '@/assets/assets_mda/svg/liebiao.svg'; // path to your '*.svg' file.
    import tableJoinPng from '@/assets/assets_mda/svg/tableJoin.png'; // path to your '*.svg' file.

    export default {
        id: "dataPrepare",
        data() {
            return {
                cubeSvg,
                tableSvg,
                tableJoinPng,
                previewData: [],
                searchText: '',
                searchInput: null,
                hiveTables: [],
                cubes: [],
                columns: [],
            };
        },
        created() {
            this.getHiveTables();
            this.getCubes();
        },
        methods: {
            handleSearch(selectedKeys, confirm) {
                confirm();
                this.searchText = selectedKeys[0];
            },

            handleReset(clearFilters) {
                clearFilters();
                this.searchText = '';
            },
            // 获取hive表名列表
            getHiveTables(){
                // 保留外层的this指向
                var that = this;
                axios
                    .get(
                        "http://localhost:6993/getHiveTables",
                    )
                    .then(function (response) {
                        var queryResult = response.data.datum;
                        for (let i = 0; i < queryResult.length; i++) {
                            that.hiveTables.push(queryResult[i].tab_name);
                        }
                    })
            },
            // 获取cube列表
            getCubes(){
                // 保留外层的this指向
                var that = this;
                axios
                    .get(
                        "http://localhost:6993/listCubes",
                    )
                    .then(function (response) {
                        var queryResult = response.data.datum;
                        for (let i = 0; i < queryResult.length; i++) {
                            that.cubes.push(queryResult[i].name);
                        }
                    })
            },
            //拖拽
            allowDrop(event) {
                event.preventDefault();
                let dt = event.dataTransfer;
                dt.effectAllowed = "copy";
                dt.dropEffect = "copy";
            },
            drag(event){
                this.dom = event.currentTarget.cloneNode(true);
            },
            drop(event) {
                event.preventDefault();
                let treeNode = event.target;
                if (treeNode){
                    treeNode.appendChild(this.dom);
                }
                // 获取hive、cube的表名，并去除空格
                var tableName = this.dom.getElementsByClassName("tableName").item(0).innerHTML;
                // 这个也可以获取到表名，暂时还没找到方法获取拖拽元素的id
                console.log(event.target.innerText);
                tableName = tableName.trim();
                var that = this;
                var url = "http://localhost:6993";
                if (this.dom.getElementsByClassName("tableName").item(0).id == "hive"){
                    url += "/previewHive";
                }else {
                    url += "/previewCube"
                }
                axios
                    .get(
                        url,
                        {
                            params: {
                                tableName: tableName
                            }
                        },
                    )
                    .then(function (response) {
                        that.previewData = response.data.datum;
                        console.log(that.previewData);
                        console.log(that.previewData[0]);

                        for (let key in that.previewData[0]){
                            var head = { title: '' , dataIndex: ''};
                            head.title = key;
                            head.dataIndex = key;
                            that.columns.push(head);
                        }
                        console.log(that.columns);
                    })
            },
            dragend(event){
                event.dataTransfer.clearData();
            }
        },
    }
</script>

<style scoped>
    .icon{
        font-size: 17px;
    }
    .highlight {
        background-color: rgb(255, 192, 105);
        padding: 0px;
    }
    .tableName{
        font-size: 17px;
        font-family: Arial;
        cursor: pointer;
    }
    .spin-content {
        border: 1px solid #91d5ff;
        background-color: #e6f7ff;
        padding: 30px;
    }

</style>
