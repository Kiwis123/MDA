<template>
  <div style="width: 100%;padding:16px; box-sizing: border-box;">
    <a-row :gutter="20">
      <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="6">
        <div class="emptyCard" style="background: rgba(250, 250, 250, 0.5);">
          <div style="height:100%;width:100%;display:flex;justify-content:center;align-items:center;">
            <div class="card-button" @click="modal_state.create=true">
              <div class="card-button-inner">
                <icon type="plus" style="font-size:24px"></icon>
              </div>
              <div>新建项目</div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col v-for="(namespace,index) in namespaces" :key="index" :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="6">
        <projectCard :data="namespace" @deleteEvent="()=>deleteNameSpace(namespace.id)" @updateEvent="()=>openModalUpdate(namespace)" @initEvent="()=>openModalInit(namespace)" @enterIde="()=>enterIde(namespace.wsId)"></projectCard>
      </a-col>
    </a-row>
    <div v-if="loading" class="loading">
      <spin tip="加载中..."></spin>
    </div>
    <a-modal :bodyStyle="{'font-size':'12px'}" :visible="modal_state.create" @cancel="modal_state.create=false" @ok="addNameSpace" okText="提交" cancelText="取消" :confirmLoading="modal_state.modalLoading">
      <p style="padding:0;font-size:14px;margin:0" slot="title">新建项目</p>
      <a-form>
        <a-form-item label="项目名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <a-input v-model="new_namespace.name" placeholder="名称只能包含中英文大小写字母、数字、下划线" size="default" style="font-size:12px" />
        </a-form-item>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <a-textarea v-model="new_namespace.descr" :rows="2" style="font-size:12px" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :bodyStyle="{'font-size':'12px'}" :visible="modal_state.update" @cancel="modal_state.update=false" @ok="updateNameSpace" okText="提交" cancelText="取消" :confirmLoading="modal_state.modalLoading">
      <p style="padding:0;font-size:14px;margin:0" slot="title">编辑项目</p>
      <a-form>
        <a-form-item label="项目名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <a-input v-model="update_namespace.name" placeholder="名称只能包含中英文大小写字母、数字、下划线" size="default" style="font-size:12px" />
        </a-form-item>
        <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <a-textarea v-model="update_namespace.descr" :rows="2" style="font-size:12px" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :bodyStyle="{'font-size':'12px','max-height':'450px','overflow-y':'auto'}" :visible="modal_state.init" @cancel="modal_state.init=false" @ok="initNameSpace" okText="提交" cancelText="取消" :confirmLoading="modal_state.modalLoading">
      <p style="padding:0;font-size:14px;margin:0" slot="title">项目初始化</p>
      <a-form>
        <a-form-item label="数据仓库类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <a-select :defaultValue="1" :value="init_namespace.schemaType" style="width:100%;font-size:12px" disabled>
            <a-select-option :value="0">Mysql</a-select-option>
            <a-select-option :value="1">Hive</a-select-option>
            <a-select-option :value="2">Oracle</a-select-option>
          </a-select>
        </a-form-item>
        <div class="init-title">开发环境</div>
        <a-form-item label="选择计算引擎" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <a-select :defaultValue="1" style="width: 100%;font-size:12px">
            <a-select-option :value="1">默认离线引擎</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据库" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <div style="display:inline-block;width:60%;">
            <a-input v-model="init_namespace.dev.schemaName" placeholder="请输入数据库名称" size="default" style="font-size:12px;margin-right:10px" />
          </div>
          <div style="display:inline-block;width:40%;;text-align:right">
            <a-checkbox v-model="init_namespace.dev.isSchemaExist" style="font-size:12px">使用已有数据库</a-checkbox>
          </div>
        </a-form-item>
        <div class="init-title">生产环境</div>
        <a-form-item label="选择计算引擎" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <a-select :defaultValue="1" style="width:100%;font-size:12px">
            <a-select-option :value="1">默认离线引擎</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据库" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="form-item">
          <div style="display:inline-block;width:60%;">
            <a-input v-model="init_namespace.prd.schemaName" placeholder="请输入数据库名称" size="default" style="font-size:12px;margin-right:10px" />
          </div>
          <div style="display:inline-block;width:40%;;text-align:right">
            <a-checkbox v-model="init_namespace.prd.isSchemaExist" style="font-size:12px">使用已有数据库</a-checkbox>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
/*eslint-disable */
import { Row, Col, Icon, Spin } from 'ant-design-vue'
import ProjectCard from '../../components/dev/ProjectCard'
export default {
  components: {
    ProjectCard, 'a-row': Row, 'a-col': Col, Icon, Spin
  },
  data() {
    return {
      namespaces: [],
      loading: true,
      modal_state: {
        create: false,
        update: false,
        delete: false,
        init: false,
        modalLoading: false
      },
      new_namespace: {
        name: '',
        descr: ''
      },
      update_namespace: {
        name: '',
        descr: ''
      },
      init_namespace: {
        schemaType: 1,
        dev: {
          engineId: 1,
          schemaName: '',
          isSchemaExist: false,
          isDev: true,
          schemaType: 1,
          yarnQueue: 'dev'
        },
        prd: {
          engineId: 1,
          schemaName: '',
          isSchemaExist: false,
          isDev: false,
          schemaType: 1,
          yarnQueue: 'prd'
        }
      }
    }
  },
  mounted() {
    this.getNameSpaces()
  },
  methods: {
    enterIde(id) {
      this.$router.push({ 'name': 'ide', query: { wsId: id } })
    },
    addNameSpace() {
      var params = new URLSearchParams();
      var name = this.new_namespace.name
      var descr = this.new_namespace.descr
      if (name == '' || descr == '') {
        return;
      }
      params.append("name", this.new_namespace.name);
      params.append("descr", this.new_namespace.descr)
      params.append("createuser_id", 1)
      this.modal_state.modalLoading = true
      this.axios.post("/api/dev/namespace", params).then(res => {
        this.modal_state.modalLoading = false
        if (res.data.code == 200) {
          this.$notification.success({ message: '项目创建成功' })
          this.modal_state.create = false
          this.new_namespace.name = ''
          this.new_namespace.descr = ''
          this.getNameSpaces()
        } else {
          this.$notification.error({ message: '项目创建失败', description: '项目名称重复' })
        }
      }).catch(err => {
        this.modal_state.modalLoading = false
      })
    },
    getNameSpaces() {
      this.loading = true
      this.axios.get("/api/dev/namespace/list").then(res => {
        if (res.data.code == 200) {
          this.namespaces = res.data.data
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    deleteNameSpace(id) {
      var that = this;
      this.$confirm({
        title: '项目被删除后不可恢复，确定删除？',
        onOk() {
          that.axios.delete("/api/dev/namespace/" + id).then(res => {
            if (res.data.code == 200) {
              that.getNameSpaces()
              that.$message.success('删除成功')
            } else {
              that.$message.error('删除失败')
            }
          }).catch(err => {
            that.$message.error('删除失败')
          })
        },
        cancelText: '取消',
        okText: '确定',
      })
    },
    openModalUpdate(namespace) {
      this.update_namespace.id = namespace.id
      this.update_namespace.name = namespace.name
      this.update_namespace.descr = namespace.descr
      this.modal_state.update = true
    },
    updateNameSpace() {
      var params = new URLSearchParams();
      var id = this.update_namespace.id
      var name = this.update_namespace.name
      var descr = this.update_namespace.descr
      params.append('id', id)
      params.append("name", name);
      params.append("descr", descr)
      this.modal_state.modalLoading = true
      this.axios.put("/api/dev/namespace", params).then(res => {
        this.modal_state.modalLoading = false
        if (res.data.code == 200) {
          this.notification('success', '项目更新成功')
          this.modal_state.update = false
          this.getNameSpaces()
        } else {
          this.notification('error', '项目更新失败', res.data.msg)
        }
      }).catch(err => {
        this.modal_state.modalLoading = false
      })
    },
    openModalInit(namespace) {
      this.modal_state.init = true
      this.init_namespace.id = namespace.id
    },
    //初始化项目
    initNameSpace() {

      this.modal_state.modalLoading = true
      var params = []
      this.init_namespace.dev.schemaType = this.init_namespace.schemaType
      this.init_namespace.prd.schemaType = this.init_namespace.schemaType


      params.push(this.init_namespace.dev)
      params.push(this.init_namespace.prd)

      this.axios({
        method: 'post',
        url: `/api/dev/namespace/init/${this.init_namespace.id}`,
        data: params,
        headers: { 'content-type': 'application/json' }
      }).then(res => {
        this.modal_state.modalLoading = false
        if (res.data.code == 200) {
          this.modal_state.init = false
          this.getNameSpaces()
          this.notification('success', '项目初始化成功')
          this.init_namespace.dev = this.clearWorkspace(true)
          this.init_namespace.prd = this.clearWorkspace(false)
        } else {
          this.notification('error', '项目初始化失败', res.data.msg)
        }
      }).catch(err => {
        this.modal_state.modalLoading = false
      })
    },
    //清空上一次的初始化信息
    clearWorkspace(isDev) {
      var workSpace = {
        engineId: 1,
        schemaName: '',
        isSchemaExist: false,
        isDev: true,
        schemaType: 1,
        yarnQueue: 'dev'
      }
      workSpace.isDev = isDev
      if (!isDev)
        workSpace.yarnQueue = 'prd'
      return workSpace
    },
    //通知
    notification(type, msg, descr) {
      if (type == 'error') {
        this.$notification.error({ message: msg, description: descr })
      } else if (type == 'success') {
        this.$notification.success({ message: msg })
      }
    }
  }
}
</script>

<style scoped>
.emptyCard {
  height: 200px;
  margin-bottom: 16px;
  transition: background 0.2s;
  background: #fff;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-weight: 380;
  overflow: hidden;
  color: rgb(67, 117, 222);
  font-size: 12px;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.card-button {
  cursor: pointer;
  color: rgb(67, 117, 222);
  font-size: 12px;
  font-weight: 400;
}
.card-button-inner {
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 24px;
  margin-bottom: 8px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  margin: auto 0;
  height: 350px;
  width: 100%;
}
.init-title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  box-sizing: border-box;
  margin-bottom: 5px;
}
</style>
<style>
.form-item > .ant-form-item-label > label {
  font-size: 12px !important;
  color: rgba(0, 0, 0, 0.5);
}
.form-item > .ant-form-item-label {
  text-align: left;
}
</style>
