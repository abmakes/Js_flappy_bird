class Answers {
  constructor(game, x){
    this.game = game;
    this.spriteHeight = 180;
    this.spriteWidth = 180;
    this.scaleWidth = this.spriteWidth * this.game.ratio;
    this.scaleHeight = this.spriteHeight * this.game.ratio;
    this.x = x;
    this.y = Math.random() * (this.game.height * 0.5 - this.scaleHeight);
        // collision properties
    this.collisionX;
    this.collisionY;

    this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio: 1 * this.game.ratio;
    this.game.ratio
    this.markForDeletion = false;
    this.image = document.getElementById("flower");
    // questions
    this.id = 1;
    this.question = this.game.content[1][0];
    this.answer = this.game.content[1][2];

  }

  update(){
    this.x -= this.game.speed
    this.y += this.speedY
    this.collisionX = this.x + this.scaleWidth * 0.5;
    this.collisionY = this.y + this.scaleHeight * 0.5;
    // gameover obstacles dissapear
    if (!this.game.gameOver) {
      if (this.y <= 0 || this.y >= this.game.height - this.scaleHeight) {
        this.speedY *= -1
      } 
    } else {
      this.speedY += 0.1;// gameover obstacles dissapear

    }
    // use isofscreen to count the numebr of obstavles and keep score
    if (this.isOffScreen()) {
      this.markForDeletion = true;
      this.game.obstacles = this.game.obstacles.filter(obstacle => !obstacle.markForDeletion);
      if (!this.game.gameOver) this.game.score++;
      if (this.game.obstacles.length === 0) this.game.triggerGameOver();
    }
    if (this.game.checkCollision(this, this.game.player)){
      // set flag on player
      this.game.player.collided = true
      this.game.speed = 0
      this.game.triggerGameOver();
    }

  }

  draw(){
    // this.game.ctx.fillRect(this.x, this.y, this.scaleWidth, this.scaleHeight)
    this.game.ctx.drawImage(this.image, 0, 0, 312, 306, this.x, this.y, this.scaleWidth, this.scaleHeight);
    /// Collision detection
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    // this.game.ctx.stroke();
    this.ctx.font ="30px Protest Riot"
    this.game.ctx.fillText(this.question, this.width * 0.50, this.height*0.5 + 45)
  }

  resize(){
    this.scaleWidth = this.spriteWidth * this.game.ratio;
    this.scaleHeight = this.spriteHeight * this.game.ratio;
    this.collisionRadius = this.scaleWidth * 0.4;
  }

  isOffScreen(){
    return this.x < -this.scaleWidth || this.y > this.game.height;
  }
}