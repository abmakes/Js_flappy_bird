class Player {
  constructor (game) {
    this.game = game;
    this.x = 20;
    this.y;
    this.spriteWidth = 180;
    this.spriteHeight = 180;
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
    this.energy = 25;
    this.maxEnergy = this.energy * 2;
    this.minEnergy = 15;
    this.barSize;
    this.charging;
    this.image = document.getElementById('player_bird');
    this.frameY; /// Used to reference the sprite sheet images
  }

  draw() {
    // this.game.ctx.strokeRect(this.x, this.y, this.width, this.height)
    /// SPRITE SHEET DRAWING  /// where to start (sourceX, SourceY), how big and are to cut out (sourceW, SourceH) Where to put it (this.x, this.y), how big to display it (this.width, this.height)
    this.game.ctx.drawImage(this.image, 0, this.frameY * this.spriteHeight, 180, 180, this.x, this.y, this.width, this.height);
    /// Collision detection
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    // this.game.ctx.stroke();
  }

  update() {
    this.handleEnergy()
    /// check if player is moving down set wings
    if (this.speedY >= 0) this.wingsUp();
    this.y += this.speedY;
    // needs to update as it oves up and down
    this.collisionY = this.y + this.height * 0.5;
    if (!this.isTouchingBottom() && !this.charging) {
      this.speedY += this.game.gravity
    } else {
      this.speedY = 0
    }
    //bottom boundary
    if (this.isTouchingBottom()) {
      return this.y >= this.game.height - this.height - this.game.bottomMargin;
    }
    //bottom boundary
    if (this.charging && !this.isTouchingTop) {
      this.speedY = 0
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
    this.energy = 25;
    this.barSize = Math.floor(5 * this.game.ratio);
    // Player starting sprite image
    this.wingsIdle();
    this.charging = false;

  }

  // special ability
  startCharge() {
    if (this.energy >= this.minEnergy && !this.charging) {
      this.charging = true;
      this.wingsCharge()
      this.game.speed = this.game.maxSpeed;
      this.game.sound.play(this.game.sound.charge);
    } else {
      this.stopCharge();
    }
  }
  stopCharge() {
    this.charging = false;
    this.game.speed = this.game.minSpeed;
  }

  // Boundaries return true or false
  isTouchingTop() {
    return this.y <= 0;
  }
  isTouchingBottom() {
    return this.y >= this.game.height - this.height - this.game.bottomMargin;
  }

  handleEnergy() {
    if (this.game.eventUpdate) {
      if (this.energy < this.maxEnergy) {
        this.energy += 1; 
      }
      if (this.charging){
        this.energy -= 5;
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
      this.wingsDown();
      this.game.sound.play(this.game.sound.flap);
    }
  }

  wingsIdle(){
    if (!this.charging) this.frameY = 0;
  }
  wingsUp(){
    if (!this.charging) this.frameY = 1;
  }
  wingsDown(){
    if (!this.charging) this.frameY = 2;
  }
  wingsCharge(){
    this.frameY = 3;
  }
}
