class AudioControl{
  constructor() {
    this.charge = document.getElementById("charge-sound");
    this.flap = document.getElementById("flap-sound");
    this.win = document.getElementById("win");
    this.lose = document.getElementById("lose");
  }
  /// Custom method  to allow sounds to restart befor the prev has finished
  play(sound){
    sound.currentTime = 0 //rewind track
    sound.play();
  }
}