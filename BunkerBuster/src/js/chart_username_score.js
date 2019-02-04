var score = 0;


function saveusername() {
  var username = document.getElementById("username_id");
  localStorage.setItem("username_id", username.value);
}

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
