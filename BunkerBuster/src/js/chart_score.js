var score = 0;
var user_score = 0;
var arr=[];

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

function save_users_score(user_score) {
  var _username = document.getElementById("username");
  var _score = document.getElementById("score");
  var _highscore = document.getElementById("highscore");

  // _username.value = localStorage.getItem("username_id");
  _score.value = user_score;
  // _highscore.value = localStorage.getItem("highScore").value;

}


