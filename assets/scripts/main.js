class Game {
  constructor (canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.baseHeight = 720;
    this.ratio = this.height / this.baseHeight;
    this.player = new Player(this);
    this.background = new Background(this);
    this.sound = new AudioControl();
    this.obstacles = [];
    this.numberOfObstacles = 10;
    this.speed;
    this.score;
    this.gameOver;
    this.timer; 
    // min max speed for charge ability
    this.maxSpeed
    this.minSpeed
    // peiodic events timer
    this.eventTimer = 0;
    this.eventInterval = 150;
    this.eventUpdate = false
    this.touchStartX;
    this.swipeDistance = 50;


    this.resize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', e => {
      this.resize( e.currentTarget.innerWidth, e.currentTarget.innerHeight)
    })  

    // restart game
    document.getElementById("restart").addEventListener("mousedown", e => {
          this.resize(window.innerWidth, window.innerHeight);
    })

    // mouse events
    this.canvas.addEventListener("mousedown", e => {
      this.player.flap();
    })

    // keyboard event
    window.addEventListener("keydown", e => {
      if (e.key === "ArrowUp" || e.key === " " || e.key === "Enter") {
        this.player.flap()
      }
      if (e.key === "Shift" || e.key.toLowerCase() === "c") {
        this.player.startCharge()
      }
      if (this.gameOver && e.key.toLowerCase() === "r") {
        this.resize(window.innerWidth, window.innerHeight);
      }
    })

    // PHONE CONTROLS // touch events
    this.canvas.addEventListener("touchstart" , e => {
      this.player.flap();
      console.log("touch")
      this.touchStartX = e.changedTouches[0].pageX;
    })
    document.addEventListener("touchend", e => {
      if (e.target.id === 'restart') this.resize(window.innerWidth, window.innerHeight);
    })
    this.canvas.addEventListener("touchmove" , e => {
      if (e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance) {
        console.log("swipe")
        this.player.startCharge();
      }    
    })
  } 
  
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.fillStyle = 'black';
    this.ctx.font = "30px Protest Riot"
    this.ctx.textAlign = "right"
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "white";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ratio = this.height / this.baseHeight
    
    this.gravity = 0.15*this.ratio;
    this.speed = 2*this.ratio;
    // min max speed for charge ability
    this.minSpeed = this.speed;
    this.maxSpeed = this.speed * 5;
    this.background.resize();
    this.player.resize(); 
    this.createObstacles();
    this.obstacles.forEach(obstacle => {
      obstacle.resize();
    });
    this.score = 0;
    document.getElementById('restart').style.display = 'none'
    this.gameOver = false;
    this.timer = 0;
  }

  // deltatime added after timer
  render(deltaTime) {
    // console.log(deltaTime)
    if (!this.gameOver) this.timer += deltaTime;
    this.handlePeriodicEvents(deltaTime); //re-evaluate necesity
    this.background.update();
    this.background.draw();
    this.drawStatusText();
    this.player.update();
    this.player.draw();
    this.obstacles.forEach(obstacle => {
      obstacle.update();
      obstacle.draw()
    });
  }

  createObstacles() {
      this.obstacles = [];
      const firstX = this.baseHeight * this.ratio;
      const obstacleSpacing = 700 * this.ratio;
      for (let i=0; i < this.numberOfObstacles; i++){
        this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing))
      }
  }

  checkCollision(a,b){
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.collisionRadius + b.collisionRadius
    return distance <= sumOfRadii
  }

  formatTimer(){
    return (this.timer * 0.001).toFixed(1);
  }

  handlePeriodicEvents(deltaTime){
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      ///because some ms can get lost here use remainder
      // this.eventTimer = 0;
      this.eventTimer = this.eventTimer % this.eventInterval;
      this.eventUpdate = true;
      // This allows us to update events using ms and not animation frame speed
    }
  }

  triggerGameOver(){
    if (!this.gameOver) {
      this.gameOver = true; // incase of accidental funciton trigger set gameover
      if (this.obstacles.length <= 0){
        this.sound.play(this.sound.win);
        this.message1 = "EXCELLENT!"
        this.message2 = "Can you do it faster than " + this.formatTimer() + ' seconds?';
      } else {
        this.sound.play(this.sound.lose);
        this.message1 = "GAME OVER"
        this.message2 = "Collision time " + this.formatTimer() + ' seconds.';
      }
    }
  }

  // Function runs with every animation frame so remove unecessary items like game end display
  drawStatusText() {
    this.ctx.save();
    this.ctx.fillText('SCORE: ' + this.score, this.width - 10, 30);
    // after item draws on the right shift alignment to left
    this.ctx.textAlign = 'left'
    this.ctx.fillText('TIME: ' + this.formatTimer(), 10, 30);
    /// Game over screen
    if (this.gameOver){
      this.ctx.textAlign = "center"
      this.ctx.font ="30px Protest Riot"
      this.ctx.fillText(this.message1, this.width * 0.50, this.height*0.5)
      this.ctx.font ="20px Protest Riot"
      this.ctx.fillText(this.message2, this.width * 0.50, this.height*0.5 + 35)
      document.getElementById('restart').style.display = 'block'
    }

    //// Energy display
    if (this.player.energy <= this.player.minEnergy) this.ctx.fillStyle = "red";
    else if (this.player.energy >= this.player.maxEnergy) this.ctx.fillStyle = "lightgreen";
    for (let i = 0; i < this.player.energy; i++) {
      this.ctx.fillRect(10, this.height - 10 - this.player.barSize * i, 5 * this.player.barSize, this.player.barSize)
    }
    this.ctx.restore();
  }

}

window.addEventListener('load', function() {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext('2d');
  canvas.width = 720;
  canvas.height = 720;

  const game = new Game(canvas, ctx);

  let lastTime = 0
  /// timestamp is built into requestanimtionframe
  /// deltTime === timesincelastrender
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime; // How man ms did it take pc to generate animation frame
    // if (deltaTime >= 16.67 ) { //this line is for 60fps
      lastTime = timeStamp
    // }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.render(deltaTime)
    if (!this.gameOver) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})