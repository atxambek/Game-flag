const socket = io();
const battleArea = document.getElementById("battleArea");
const resultsEl = document.getElementById("results");
const leaderboardList = document.getElementById("leaderboardList");
const roundStatusEl = document.getElementById("roundStatus");
const roundWinnerSound = document.getElementById("roundWinner");

socket.on("roundStatus", data=>{
  if(data.status==="gathering"){
    roundStatusEl.innerText = `Round ${data.round}: Gathering players...`;
    battleArea.innerHTML="";
    resultsEl.innerHTML="";
  }else if(data.status==="battle"){
    roundStatusEl.innerText = `Round ${data.round}: Battle!`;
  }
});

socket.on("roundResult", winners=>{
  battleArea.innerHTML="";
  resultsEl.innerHTML="Round Results:<br>";
  winners.forEach(w=>{
    const container=document.createElement("div");
    container.className="userFlag";
    container.style.top=`${Math.random()*(battleArea.clientHeight-50)}px`;
    container.style.left=`${Math.random()*(battleArea.clientWidth-50)}px`;

    const avatar=document.createElement("img");
    avatar.src=w.avatar;
    avatar.className="avatar";

    const flagImg=document.createElement("img");
    flagImg.src=`/flags/${w.flag}.png`;
    flagImg.className="flag";

    container.appendChild(avatar);
    container.appendChild(flagImg);
    battleArea.appendChild(container);

    resultsEl.innerHTML+=`${w.user} won with ${w.flag} 🎉<br>`;
  });
  roundWinnerSound.play();
  socket.emit("requestLeaderboard");
});

socket.on("leaderboardUpdate", data=>{
  leaderboardList.innerHTML="";
  data.forEach(u=>{
    const li=document.createElement("li");
    li.innerText=`${u.user}: ${u.points}`;
    leaderboardList.appendChild(li);
  });
});
