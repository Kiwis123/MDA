<template>
  <div class="editor .no-selected" ref="editor">
    <div class="options">
      <div class="option" @click="submit">
        <a-icon :component="icon_begin"></a-icon>
        <span>运行</span>
      </div>
      <div class="option nonallow">
        <a-icon :component="icon_stop"></a-icon>
        <span>停止</span>
      </div>
      <div class="option">
        <a-icon :component="icon_save"></a-icon>
        <span>保存</span>
      </div>
      <div class="option" @click="format">
        <a-icon :component="icon_format"></a-icon>
        <span>格式化</span>
      </div>
      <div class="option">
        <a-dropdown placement="bottomCenter" :trigger="['click']">
          <span>
            风格
            <a-icon type="down" />
          </span>
          <div class="editor-theme-list" slot="overlay">
            <a-tag v-for="(theme,index) in themes" :key="index" :color="theme==cmOptions.theme?'blue':''" @click="()=>selectTheme(theme)">{{theme}}</a-tag>
          </div>
        </a-dropdown>
      </div>
    </div>

    <div class="scroll">
      <codemirror v-model="code" ref="cmMerge" :options="cmOptions"></codemirror>
    </div>
    <div class="log-panel" ref="log_panel" style="height:200px" :style="{height:showLog?'250px':'0px'}">
      <resizeLine direction="top" />
      <log :log="log" :results="results" />
    </div>
  </div>
</template>

<script>
/*eslint-disable */
import icon_save from './icon/save.svg'
import icon_stop from './icon/stop.svg'
import icon_begin from './icon/begin.svg'
import icon_format from './icon/format.svg'
import Log from './Log'
import ResizeLine from '../ResizeLine'

export default {
  props: {
    value: {
      default: 'const b = 22',
      type: String
    },
    submit: {
      type: Function,
      default: () => { }
    },
    format: {
      type: Function,
      default: () => { }
    },
    log: {
      type: String,
      default: ""
    },
    results: {
      type: Array,
      default() {
        return []
      }
    },
    mode: {
      type: String,
      default: "sql"
    },
    showLog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Log, ResizeLine
  },
  data() {
    return {
      code: '',
      cmOptions: {
        tabSize: 4,
        // mode: 'text/x-sql',
        theme: 'solarized dark',
        autoRefresh: true,
        lineNumbers: true,
        line: true,
        styleActiveLine: true
      },
      codemirror: undefined,
      themes: ['base16-dark', 'solarized dark', 'eclipse', 'isotope', 'monokai', 'idea'],
      theme_select: 'solarized dark',
      icon_save,
      icon_stop,
      icon_begin,
      icon_format,
    }
  },
  created() {
    var dict = { "sql": "text/x-sql", "scala-spark": "text/x-scala", "ddl": "text/x-hive" }
    this.cmOptions.mode = dict[this.mode]
  },
  mounted() {
    this.code = this.value
    this.codemirror = this.$refs.cmMerge.codemirror

  },

  watch: {
    code(n, o) {
      if (n != o) {
        this.$emit('input', n)
      }
    },
    value(n, o) {
      if (n != o) {
        this.code = n
      }
    }
  },
  methods: {
    selectTheme(theme) {
      this.cmOptions.theme = theme
    }
  }
}
</script>

<style scoped>
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.scroll {
  flex: 1;
  overflow-x: auto;
}
.options {
  background: #fff;
  width: 100%;
  height: 38px;
  line-height: 38px;
  box-shadow: -1px 1px 1px 0 #ccc;
  border-bottom: 1px solid rgba(204, 204, 204, 0.4);
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}
.option {
  margin-right: 15px;
  display: flex;
  padding: 8px;
  cursor: pointer;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  align-items: center;
}
.option:hover {
  color: #4376de;
}
.option > span {
  -webkit-user-select: none; /*Chrome/ Safari/ Opear新版本*/
  -moz-user-select: none; /*Foxfire */
  -ms-user-select: none; /*Internet Explorer/ Edge*/
  -o-user-select: none; /*Opear老版本*/
  -khtml-user-select: none; /* Konqueror */
  -webkit-touch-callout: none; /* iOS Safari */
  user-select: none;
}
.option > i {
  font-size: 18px;
  padding-right: 5px;
}
.editor-theme-list {
  width: 300px;
  padding: 10px;
  top: 0;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  min-height: 100px;
}
.nonallow {
  cursor: not-allowed !important;
  color: #aaa !important;
}
.log-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  border-top: 1px solid #dcdfe6;
}
.log-txt {
  flex: 1;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.65);
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
    monospace;
}
.no-selected {
  -webkit-user-select: none; /*Chrome/ Safari/ Opear新版本*/
  -moz-user-select: none; /*Foxfire */
  -ms-user-select: none; /*Internet Explorer/ Edge*/
  -o-user-select: none; /*Opear老版本*/
  -khtml-user-select: none; /* Konqueror */
  -webkit-touch-callout: none; /* iOS Safari */
  user-select: none;
  /* Nonprefixed version, currently not supported by any browser */
}
.scroll >>> .CodeMirror-scroll {
  user-select: none;
  font-family: inherit !important;
}
.editor-theme-list >>> .ant-tag {
  margin-bottom: 5px;
}
</style>
<style>
.code-mirror {
  font-size: 10px;
}
.vue-codemirror {
  height: 100%;
  margin: 0;
  font-size: 13px;
  line-height: 100%;

  font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.CodeMirror {
  height: 100%;
}
</style>