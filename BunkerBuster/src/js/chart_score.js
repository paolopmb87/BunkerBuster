var score = 0;

function save_high_score(score) {
  var highScore = localStorage.getItem("highScore") || 0;
  var username = localStorage.getItem("username_id") || 0;
  if(highScore !== null){
    if (score > highScore) {
      localStorage.setItem("username_id", username);
      localStorage.setItem("highScore", score);
    }
  }
  else{
    localStorage.setItem("highScore", score);
    localStorage.setItem("username_id", username);
  }
}
