<template>
  <div class="drag_line" :style="style" id="drag_line" ref="line" @mousedown="drag_mousedown" @mouseup="drag_mouseup"></div>
</template>
<script>
/*eslint-disable*/
export default {
  props: {
    direction: {
      type: String,
      default: 'top'
    }

  },
  data() {
    return {
      styles: [
        { 'width': '100%', 'height': '10px', 'top': '-5px', 'left': '0', 'cursor': 'ns-resize' },
        { 'width': '100%', 'height': '10px', 'bottom': '-5px', 'left': '0', 'cursor': 'ns-resize' },
        { 'width': '10px', 'height': '100%', 'top': '0', 'left': '-5px', 'cursor': 'ew-resize' },
        { 'width': '10px', 'height': '100%', 'top': '0', 'right': '-5px', 'cursor': 'ew-resize' }
      ],
      parent: undefined
    }
  },
  mounted() {
    var el = this.$refs.line.parentNode ? this.$refs.line.parentNode : this.$refs.line.parentElement
    this.parent = el;
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.line_dragging)
    })
  },
  computed: {
    style() {
      var directions = ['top', 'bottom', 'left', 'right'];
      var index = directions.indexOf(this.direction)
      if (index == -1) index = 0
      return this.styles[index]
    }
  },
  methods: {
    drag_mousedown(e) {
      document.addEventListener('mousemove', this.line_dragging)
    },
    drag_mouseup(e) {
      document.removeEventListener('mousemove', this.line_dragging)
    },
    line_dragging(e) {
      var style = this.getStyle(this.parent)
      var directions = ['top', 'bottom', 'left', 'right'];
      var index = directions.indexOf(this.direction)
      index = Math.max(0, index);
      if (index == 0 || index == 1) {
        var itemHeight = parseInt(style.height.replace(/[a-z]/gi, ''));
        var height = (itemHeight - e.movementY) + 'px';
        this.parent.style.height = height
      } else {
        var itemWidth = parseInt(style.width.replace(/[a-z]/gi, ''));
        var width = (itemWidth + e.movementX) + 'px'
        this.parent.style.width = width
      }
    },
    getStyle(obj) {
      return obj.currentStyle ? obj.currentStyle : window.getComputedStyle(obj);
    }
  }
}
</script>
<style scoped>
.drag_line {
  position: absolute;
}
</style>