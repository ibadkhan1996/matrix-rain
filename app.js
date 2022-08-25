const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

class DrawSymbol {
  #x;
  #y;
  #canvasHeight;
  #fontSize;
  #fontColor;
  #characters;
  #char;
  #charScattered;
  #invertDirection;
  constructor(
    x,
    canvasHeight,
    fontSize,
    fontColor,
    characters,
    charScattered,
    invertDirection
  ) {
    this.#x = x;
    this.#y = this.#invertDirection ? this.#canvasHeight : 0;
    this.#invertDirection = invertDirection;
    this.#canvasHeight = canvasHeight;
    this.#fontSize = fontSize;
    this.#fontColor = fontColor;
    this.#characters = characters;
    this.#char = "";
    this.#charScattered = this.#invertDirection
      ? 1 - charScattered
      : charScattered || 0;
  }

  draw(context) {
    this.#char = this.#characters.charAt(
      Math.floor(Math.random() * this.#characters.length)
    );
    // context.font = `${this.#fontSize}px monospace`;
    // context.fillStyle = this.#fontColor;
    if (this.#invertDirection) {
      context.fillText(this.#char, this.#x * this.#fontSize, this.#y);
      if (
        this.#y <= this.#canvasHeight &&
        Math.random() * 1 >
          (this.#charScattered >= 1 ? 1 - 0.01 : this.#charScattered)
        // Math.random() * this.#fontSize >
        //   (this.#charScattered >= this.#fontSize / this.#fontSize
        //     ? this.#fontSize - this.#fontSize * 0.01
        //     : this.#charScattered * this.#fontSize)
      ) {
        this.#y = this.#y - this.#fontSize;
      } else if (this.#y < 0) {
        this.#y = this.#canvasHeight;
      }
    } else {
      context.fillText(
        this.#char,
        this.#x * this.#fontSize,
        this.#y * this.#fontSize
      );
      if (
        this.#y * this.#fontSize > this.#canvasHeight &&
        Math.random() * 1 >
          (this.#charScattered >= 1 ? 1 - 0.01 : this.#charScattered)
      ) {
        this.#y = 0;
      } else {
        this.#y += 1;
      }
    }
  }
}

class RainEffect {
  #fontSize;
  #fontColor;
  #characters;
  #charScattered;
  #canvasWidth;
  #canvasHeight;
  #columns;
  #symbols;
  #invertDirection;

  constructor({
    fontSize,
    fontColor,
    characters,
    charScattered,
    canvasWidth,
    canvasHeight,
    invertDirection,
  } = {}) {
    this.#fontSize = fontSize || 25;
    this.#fontColor = fontColor || "#0aff0a";
    this.#characters = characters || "0123456789abcdefghijklmnopqrstuvwxyz";
    this.#charScattered = charScattered;
    this.#canvasWidth = canvasWidth;
    this.#canvasHeight = canvasHeight;
    this.#columns = this.#canvasWidth / this.#fontSize;
    this.#symbols = [];
    this.#invertDirection = invertDirection ?? false;
    this.#initialize();
  }

  #initialize() {
    for (let column = 0; column < this.#columns; column++) {
      this.#symbols.push(
        new DrawSymbol(
          column,
          this.#canvasHeight,
          this.#fontSize,
          this.#fontColor,
          this.#characters,
          this.#charScattered,
          this.#invertDirection
        )
      );
    }
  }

  draw() {
    this.#symbols.forEach((symbol) => {
      symbol.draw(ctx);
    });
  }

  resize(width, height) {
    this.#canvasWidth = width;
    this.#canvasHeight = height;
    this.#columns = this.#canvasWidth / this.#fontSize;
    this.#symbols = [];
    this.#initialize();
  }

  // animate() {
  //   setInterval(this.draw, 1000 / 30);
  // }
}

const matrix = new RainEffect({
  fontSize: 20,
  fontColor: "red",
  charScattered: 0.99,
  canvasWidth: canvas.width,
  canvasHeight: canvas.height,
  invertDirection: false,
});

// matrix.animate();

let lastTime = 0;
const fps = 30;
const nextFrame = 1000 / fps;
let timer = 0;

// let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
// gradient.addColorStop(0, "red");
// gradient.addColorStop(0.2, "blue");
// gradient.addColorStop(0.4, "green");
// gradient.addColorStop(0.6, "yellow");
// gradient.addColorStop(0.8, "purple");
// gradient.addColorStop(1, "orange");

function animate(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  if (timer > nextFrame) {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${20}px monospace`;
    ctx.fillStyle = "red";
    // ctx.fillStyle = gradient;
    matrix.draw();
    timer = 0;
  } else {
    timer += deltaTime;
  }
  requestAnimationFrame(animate);
}
animate(0);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  matrix.resize(canvas.width, canvas.height);
});
