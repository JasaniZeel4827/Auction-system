
let timerInterval;
let currentTimer = 10;
let playerIndex = -1;

const players = [
  {
    name: "Virat Kohli",
    country: "India",
    category: "Batsman",
    basePrice: 100
  },
  {
    name: "Brett Lee",
    country: "Australia",
    category: "Bowler",
    basePrice: 150
  },
  {
    name: "Moeen Ali",
    country: "England",
    category: "All-Rounder",
    basePrice: 200
  }
];



function renderPlayers() {
  const playersList = document.getElementById("playersList");
  playersList.innerHTML = "";

  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.className = "player-item";
    li.id = `player${index}`;

    const playerDetails = document.createElement("div");
    playerDetails.className = "player-details";
    playerDetails.textContent = `${index + 1}. ${player.name} - ${
      player.country
    } - ${player.category} - Base Price: $${player.basePrice}`;

    const startBidButton = document.createElement("button");
    startBidButton.className = "start-bid-button";
    startBidButton.textContent = "Start Bid";
    startBidButton.addEventListener("click", () => startBid(index));

    li.appendChild(playerDetails);
    li.appendChild(startBidButton);
    playersList.appendChild(li);
  });
}
renderPlayers(); 


const teams = {
  team1: { name: "Rajasthan Royals", budget: 400, players: [], bids: [] },
  team2: { name: "Chennai Super Kings", budget: 150, players: [], bids: [] },
  team3: { name: "RCB", budget: 100, players: [], bids: [] }
};


function renderTeamWidgets() {
  for (const teamId in teams) {
    const teamWidget = document.getElementById(teamId);
    teamWidget.querySelector("h2").textContent = teams[teamId].name;
    updateTeamBudget(teamId, teams[teamId].budget);

    const bidButton = teamWidget.querySelector(".bid-now-button");
    bidButton.addEventListener("click", () => teamBid(teamId));
  }
}

function updateTeamBudget(teamId, budget) {
  document.getElementById(`budget-${teamId}`).textContent = `$${budget}`;
}

renderTeamWidgets(); // Function call


function startBid(i) {
  playerIndex = i; 
  clearInterval(timerInterval); 
  currentTimer = 10; 
  timerInterval = setInterval(updateTimer, 1000); 

  showTimerContainer();
  enableAllBidButtons();
}




function updateTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = currentTimer;
  if (currentTimer === 0) {
    clearInterval(timerInterval);
    disableAllBidButtons();
    hideTimerContainer();
    sellPlayer();
  }
  currentTimer--;
}



function showTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "block";

  const soldContainer = document.querySelector(".sold-container");
  soldContainer.style.display = "block";
}


function hideTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "none";

  const soldContainer = document.querySelector(".sold-container");
  soldContainer.style.display = "none";
}


function enableAllBidButtons() {
  const bidButtons = document.querySelectorAll(".bid-now-button");
  bidButtons.forEach(button => {
    button.disabled = false;
  });
}


function disableAllBidButtons() {
  const bidButtons = document.querySelectorAll(".bid-now-button");
  bidButtons.forEach(button => {
    button.disabled = true;
  });
}


function teamBid(teamId) {
  const bidAmount = parseFloat(
    prompt(
      `Enter bidding amount for ${players[playerIndex].name}:`,
      players[playerIndex].basePrice
    )
  );

  if (isNaN(bidAmount) || bidAmount < players[playerIndex].basePrice) {
    alert("Invalid bid amount.");
    return;
  }

  if (bidAmount > teams[teamId].budget) {
    alert("Team does not have enough budget to place this bid.");
    return;
  }

  const biddingInfo = {
    teamId: teamId,
    playerIndex: playerIndex,
    bidAmount: bidAmount
  };

  if (!teams[teamId].bids) {
    teams[teamId].bids = [];
  }
  teams[teamId].bids[playerIndex] = biddingInfo;
}

function sellPlayer() {
  const highestBidder = getHighestBidder();
  if (highestBidder !== null) {
    const teamId = highestBidder.teamId;
    const bidAmount = highestBidder.bidAmount;
    const player = players[playerIndex];

   
    teams[teamId].budget -= bidAmount;

    
    const playerListItem = document.getElementById(`player${playerIndex}`);
    playerListItem.classList.add("sold");
    playerListItem.querySelector(".start-bid-button").style.display = "none";
    const soldTo = document.createElement("span");
    soldTo.textContent = `SOLD to: ${teams[teamId].name} for $${bidAmount}`;
    playerListItem.appendChild(soldTo);

    const purchasedList = document.getElementById(`players-${teamId}`);
    const purchasedItem = document.createElement("li");
    purchasedItem.textContent = `${player.name} - $${bidAmount}`;
    purchasedList.appendChild(purchasedItem);


    updateTeamBudget(teamId, teams[teamId].budget);

    
    hideTimerContainer();
    disableAllBidButtons();
    playerIndex = -1;
  }
}


function getHighestBidder() {
  let highestBidder = null;
  for (const teamId in teams) {
    if (teams[teamId].bids && teams[teamId].bids[playerIndex]) {
      const bidAmount = teams[teamId].bids[playerIndex].bidAmount;
      if (!highestBidder || bidAmount > highestBidder.bidAmount) {
        highestBidder = teams[teamId].bids[playerIndex];
      }
    }
  }
  return highestBidder;
}
