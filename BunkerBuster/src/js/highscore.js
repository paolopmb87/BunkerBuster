var score = 0;
var highscore = localStorage.getItem("highscore");

function high_score() {
  if(highscore !== null){
    if (score > highscore) {
      localStorage.setItem("highscore", score);
    }
  }
  else{
    localStorage.setItem("highscore", score);
  }
}
