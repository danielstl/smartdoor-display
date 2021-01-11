<template>
  <div class="widget-base whiteboard-base">
    <div id="whiteboard-title">Draw a quick message...</div>
    <canvas id="whiteboard" @touchmove.prevent="moveDraw" @mousemove.prevent="moveDraw" @touchend.prevent="stopDraw"
            @mouseup.prevent="stopDraw"
            @touchstart.prevent="draw" @mouseenter.prevent="draw" @mousedown.prevent="draw"/>
    <div id="whiteboard-options">
      <ul>
        <li class="colour-item" v-for="(c, i) in colours" :key="c">
          <button @click.prevent="selectColour(i)" :style="{'background-color': c}"
                  :class="{'colour': 1, 'selected': i === selectedColour}"></button>
        </li>
        <li>
          <button @click.prevent="clearCanvas" class="colour">
          <span class="material-icons">delete</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "WhiteboardWidget",
  data() {
    return {
      canvas: null,
      context: null,
      pos: [0, 0],
      colours: [
        "#000000",
        "#ff0000",
        "#ff600a",
        "#ffff00",
        "#4acd00",
        "#0000ff",
        "#00ffff",
        "#ff00ff"
      ],
      selectedColour: 0
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
      if (e.buttons !== undefined && e.buttons !== 1) return;

      let ctx = this.context;

      ctx.beginPath(); // begin

      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = this.colours[this.selectedColour];

      ctx.moveTo(this.pos[0], this.pos[1]); // from
      this.draw(e);
      ctx.lineTo(this.pos[0], this.pos[1]); // to

      ctx.stroke(); // draw it!
    },
    stopDraw: function () {

    },
    selectColour: function (index) {
      this.selectedColour = index;
    },
    clearCanvas: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

#whiteboard-options > ul {
  list-style: none;
  display: flex;
  padding: 0;
  justify-content: space-evenly;
}

.colour {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  border: 2px solid transparent;
  transition: all 0.1s;
  padding: 0;
  text-align: center;
  background-color: #666;
  color: white;
}

.selected {
  border: 2px solid white;
  box-shadow: 0 0 0 2px #303030;
}

button:focus {
  outline: none;
}
</style>