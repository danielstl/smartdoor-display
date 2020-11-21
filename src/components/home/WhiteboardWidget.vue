<template>
  <div class="widget-base whiteboard-base">
    <div id="whiteboard-title">Draw a quick message...</div>
    <canvas id="whiteboard" @touchmove.prevent="moveDraw" @mousemove.prevent="moveDraw" @touchend.prevent="stopDraw" @mouseup.prevent="stopDraw"
            @touchstart.prevent="draw" @mouseenter.prevent="draw" @mousedown.prevent="draw"/>
  </div>
</template>

<script>
export default {
  name: "WhiteboardWidget",
  data() {
    return {
      canvas: null,
      context: null,
      pos: [0, 0]
    }
  },
  mounted() {
    this.canvas = document.getElementById("whiteboard");
    this.context = this.canvas.getContext("2d");

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    let rect = this.canvas.getBoundingClientRect();

// increase the actual size of our canvas
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;

// ensure all drawing operations are scaled
    this.context.scale(devicePixelRatio, devicePixelRatio);

// scale everything down using CSS
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  },
  methods: {
    draw: function (e) { //setPosition
      //alert("draw " + JSON.stringify(e));
      this.pos = [(e.touches ? e.touches[0].clientX : e.clientX) - this.canvas.offsetLeft, (e.touches ? e.touches[0].clientY : e.clientY) - this.canvas.offsetTop];
    },
    moveDraw: function (e) { //draw
      //alert("move" + JSON.stringify(e));
      if (e.buttons && e.buttons !== 1) return;

      let ctx = this.context;

      ctx.beginPath(); // begin

      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#c0392b';

      ctx.moveTo(this.pos[0], this.pos[1]); // from
      this.draw(e);
      ctx.lineTo(this.pos[0], this.pos[1]); // to

      ctx.stroke(); // draw it!
    },
    stopDraw: function () {
      //alert("yo");
    },
    drawaa: function (e) {
      alert("AA " + JSON.stringify(e.touches[0].clientX));
    }
  }
}
</script>

<style scoped>
.whiteboard-base {
  display: flex;
  flex-flow: column;
}

#whiteboard-title {
  margin: 0.8em;
  font-weight: 600;
}

#whiteboard {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>