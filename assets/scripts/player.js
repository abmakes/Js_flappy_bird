class Player {
  constructor (game) {
    this.game = game;
    this.x = 20;
    this.y;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
    this.width;
    this.height;
    this.speedY;
    this.flapSpeed;
    // collision properties
    this.collisionX = this.x;
    this.collisionY;
    this.collisionRadius = this.width * 0.5;
    this.collided;
    // special ability
    this.energy = 30;
    this.maxEnergy = this.energy * 2;
    this.minEnergy = 15;
    this.barSize;
    this.charging;
  }
  draw() {
    this.game.ctx.strokeRect(this.x, this.y, this.width, this.height)
    /// Collision detection
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    this.game.ctx.stroke();
  }
  update() {
    this.handleEnergy()
    this.y += this.speedY;
    // needs to update as it oves up and down
    this.collisionY = this.y + this.height * 0.5;
    if (!this.isTouchingBottom() && !this.charging) {
      this.speedY += this.game.gravity
    } else {
      this.spedY = 0
    }
    //bottom boundary
    if (this.isTouchingBottom()) {
      this.y = this.game.height - this.height;
    }
  }
  resize () {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    // place the player in the middle 
    this.y = this.game.height * 0.5 - this.height * 0.5
    // gravity vs speed is goo for jumper
    this.speedY = -5 * this.game.ratio;
    // scale movement proportional to screen size
    this.flapSpeed = 6 * this.game.ratio
    // collision properties
    this.collisionRadius = this.width * 0.5;
    this.collisionX = this.x + this.width * 0.5;
    // on gamerestart collided false
    this.collided = false;
    // scale energy bars
    this.barSize = Math.floor(5 * this.game.ratio);
  }
      // special ability
  startCharge() {
    this.charging = true;
    this.game.speed = this.game.maxSpeed;
  }
  stopCharge() {
    this.charging = false;
    this.game.speed = this.game.minSpeed;
  }
  isTouchingTop() {
    return this.y <= 0;
  }
  isTouchingBottom() {
    return this.y >= this.game.height - this.height
  }
  handleEnergy() {
    if (this.game.eventUpdate) {
      if (this.energy < this.maxEnergy) {
        this.energy += 1; 
      }
      if (this.charging){
        this.energy -= 4;
        if (this.energy <= 0){
          this.energy = 0;
          this.stopCharge();
        }
      }
    }
  }
  flap() {
    this.stopCharge();
    if (!this.isTouchingTop()){
      this.speedY = -this.flapSpeed;
    }
  }


}
