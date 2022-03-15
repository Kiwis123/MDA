<template>
  <div class="card" :class="{'uninit':data.status==1}">
    <div class="card-main">
      <div class="title">
        <span style="flex:1">{{data.name}}</span>
        <div class="status-info">
          <span class="badge"></span>
          <span style="font-size:12px;margin-left:5px">{{data.status==2?"开发中":"未初始化"}}</span>
        </div>
      </div>
      <div class="content">
        <div class="label">
          <span style="margin-right:15px">创建者: {{data.user}}</span>
          <span>创建时间:{{data.create_time}}</span>
        </div>
        <div class="descr">
          <span>{{data.descr}}</span>
        </div>
      </div>
    </div>
    <div class="card-option" v-if="data.status==2">
      <span @click="enterIde">进入项目</span>
      <span class="split">|</span>
      <span @click="updateEvent">编辑</span>
      <span class="split">|</span>
      <span @click="deleteEvent">删除</span>
    </div>
    <div class="card-option" v-if="data.status==1">
      <span @click="initEvent">初始化</span>
      <span class="split">|</span>
      <span @click="updateEvent">编辑</span>
      <span class="split">|</span>
      <span @click="deleteEvent">删除</span>
    </div>
  </div>
</template>
<script>
/*eslint-disable */
export default {
  props: {
    data: {
      type: Object,
      default: {
      }
    }
  },
  methods: {
    deleteEvent() {
      this.$emit('deleteEvent')
    },
    updateEvent() {
      this.$emit('updateEvent')
    },
    initEvent() {
      this.$emit('initEvent')
    },
    enterIde() {
      this.$emit('enterIde')
    }
  }

}
</script>
<style scoped>
.card {
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
.card:hover {
  background: rgba(250, 250, 250, 0.5);
}
.card-main {
  flex: 1;
}
.title {
  display: flex;
  flex-direction: row;
  font-size: 16px;
}
.content {
  margin-top: 16px;
  font-size: 12px;
  color: #999;
  overflow: hidden;
}
.uninit > .card-main > .title {
  color: rgba(0, 0, 0, 0.7);
}
.uninit > .card-main > .title > .status-info > .badge {
  background: rgba(0, 0, 0, 0.5);
}
.uninit > .card-main > .title > .status-info > .badge::after {
  border: none;
  animation: none;
}
.descr {
  margin-top: 10px;
}
.card-option {
  height: 30px;
  line-height: 30px;
}
.card-option > span {
  cursor: pointer;
}
.card-option > .split {
  color: rgba(0, 0, 0, 0.25);
  margin: 0 8px;
}

.badge {
  background: #1890ff;
  /* background: rgb(67, 117, 222); */

  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
  position: relative;
  line-height: inherit;
  vertical-align: baseline;
  top: -1px;
}
.badge::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgb(67, 117, 222);
  content: "";
  animation: processing 1.2s infinite ease-in-out;
  box-sizing: border-box;
}
@keyframes processing {
  0% {
    transform: scale(0.8);
    opacity: 0.65;
  }
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
}
</style>
