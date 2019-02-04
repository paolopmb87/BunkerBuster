var score = 0;


function save_high_score(score) {
  var highScore = localStorage.getItem("highScore") || 0;
  if(highScore !== null){
    if (score > highScore) {
      localStorage.setItem("highScore", score);
    }
  }
  else{
    localStorage.setItem("highScore", score);
  }
}
