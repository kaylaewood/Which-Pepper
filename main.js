// sections
var gameOverScreen = document.querySelector('.game-over-screen');
var gameScreen = document.querySelector('.game-screen');
var rulesScreen = document.querySelector('.rules-screen');
var startScreen = document.querySelector('.start-screen');
var topPlayerBoard = document.querySelector('.top-player-board');

// buttons
var newGameButton = document.querySelector('#new-game-button');
var rulesPlayButton = document.querySelector('#rules-play-button');
var startPlayButton = document.querySelector('#start-play-button');
var topPlayerButton = document.querySelector('#top-player-button');

// text changes
var gameAsidePlayer1MatchesNumber = document.querySelector('#game-aside-player1-matches-number');
var player1Text = document.querySelectorAll('.player1-text');
var player2Text = document.querySelectorAll('.player2-text');
var timerMinutes = document.querySelector('#timer-minutes');
var timerSeconds = document.querySelector('#timer-seconds');
var topPlayerNames = document.querySelectorAll('.top-player-name');
var topPlayerTimes = document.querySelectorAll('.top-player-time');

// other selectors
var gameBoard = document.querySelector('#game-board');
var gameCards = document.querySelectorAll('.game-card');
var startErrorMessage = document.querySelector('.start-error-message');
var startPlayer1Input = document.querySelector('#start-player1-input');
var startPlayer2Input = document.querySelector('#start-player2-input');

// global non-qs variables
var decksArr = null;
var picSrc = ['images/card-pic5.jpg', 'images/card-pic1.jpg', 'images/card-pic2.jpg', 'images/card-pic1.jpg', 'images/card-pic3.jpg', 'images/card-pic2.jpg', 'images/card-pic4.jpg', 'images/card-pic5.jpg', 'images/card-pic3.jpg', 'images/card-pic4.jpg'];
var timeEnd = null;
var timeStart = null;
var totalTime = null;
var player1Name = null;
var player2Name = null;

// event listeners
gameBoard.addEventListener('click', clickGameBoard);
newGameButton.addEventListener('click', clickNewGameButton);
rulesPlayButton.addEventListener('click', clickRulesPlayButton);
startPlayButton.addEventListener('click', clickStartPlayButton);
topPlayerButton.addEventListener('click', showTopPlayers);
window.addEventListener('load', pageLoad);

// mega functions
function pageLoad() {
  console.log('load');
  updateTopPlayerBoard();
};

function clickGameBoard() {
  if (event.target.parentNode.classList.contains('game-card') && decksArr.selectedCards.length < 2) {
    flipCardPic(event);
  }
};

function clickNewGameButton() {
  decksArr.resetCards();
  decksArr.shuffle(picSrc);
  switchSections(gameOverScreen, startScreen);
  clearInputs();
  showCards();
};

function clickRulesPlayButton() {
  switchSections(rulesScreen, gameScreen);
  instantiateCards();
  startTimer();
};

function clickStartPlayButton() {
  if (startPlayer1Input.value.length) {
    sendToStorage('player1Name', startPlayer1Input.value);
    sendToStorage('player2Name', startPlayer2Input.value);
    player1Name = getFromStorage('player1Name');
    player2Name = getFromStorage('player2Name');
    insertNames(player1Text, player1Name);
    insertNames(player2Text, player2Name);
    switchSections(startScreen, rulesScreen);
  } else {
    showErrorMessage(startErrorMessage);
  }
};

//functions
function showTopPlayers() {
  topPlayerBoard.classList.toggle('hide');
};

function sendToStorage(key, value) {
  localStorage.setItem(key, value);
};

function getFromStorage(key) {
  return localStorage.getItem(key);
};

function calculateTime() {
  timeEnd = Date.now();
  totalTime = (timeEnd - timeStart)/1000;
  totalMinutes = Math.round(totalTime/60);
  totalSeconds = Math.round(totalTime%60);
  logTime();
};

function callMethods(event) {
  for (var i = 0; i < decksArr.cards.length; i++) {
    if (parseInt(event.target.parentNode.dataset.id) === decksArr.cards[i].cardId) {
      decksArr.cards[i].updateSelected(decksArr);
    }
  }
  if (decksArr.selectedCards.length === 2) {
    hideMatched(event);
  }
};

function clearInputs() {
  startPlayer1Input.value = '';
  startPlayer2Input.value = '';
};

function flipCardPic(event) {
  event.target.parentNode.classList.add('on-click-animation');
  event.target.parentNode.classList.remove('no-match-animation');
  event.target.src = decksArr.cards[event.target.parentNode.dataset.id].matchId;
  event.target.parentNode.classList.add('flipped');
  callMethods(event);
};

function flipCardBack(event) {
  for (var i = 0; i < gameCards.length; i++) {
    if (gameCards[i].classList.contains('flipped')) {
      gameCards[i].classList.remove('flipped');
      gameCards[i].classList.add('no-match-animation');
      gameCards[i].children[0].src = 'images/letter-p.png';
      decksArr.cards[i].updateSelected(decksArr);
      gameCards[i].classList.remove('on-click-animation');
    }
  }
};

function hideCard(event) {
  for (var i = 0; i < gameCards.length; i++) {
    if (gameCards[i].classList.contains('flipped')) {
      gameCards[i].classList.remove('flipped');
      gameCards[i].classList.add('hide-card');
      gameCards[i].classList.remove('on-click-animation');
    }
  }
}

function hideMatched(event) {
  var isMatch = decksArr.checkMatched();
  if (isMatch) {
    setTimeout(function() {
      hideCard(event)
    }, 1000);
    gameAsidePlayer1MatchesNumber.innerText = decksArr.matches;
  } else {
    setTimeout(function() {
      flipCardBack(event)
    }, 2500);
  }
  if (decksArr.matches === 5) {
    calculateTime();
    switchSections(gameScreen, gameOverScreen);
    updateWinners();
  }
};

function insertNames(text, input) {
  for (var i = 0; i < text.length; i++) {
    var capitalName = input.toUpperCase();
    text[i].innerText = capitalName;
  }
};

function instantiateCards() {
  var cardsArr = [];
  for (var i = 0; i < gameCards.length; i++) {
    var card = new Cards({cardId: gameCards[i].dataset.id, matchId: picSrc[i]});
    cardsArr.push(card);
  }
  var deck = new Deck({cards: cardsArr});
  decksArr = deck;
};

function logTime() {
  timerMinutes.innerText = totalMinutes;
  timerSeconds.innerText = totalSeconds;
};

function showCards() {
  for (var i = 0; i < gameCards.length; i++) {
    gameCards[i].classList.remove('hide-card');
    gameCards[i].classList.remove('flipped');
    gameCards[i].classList.remove('no-match-animation');
    gameCards[i].children[0].src = 'images/letter-p.png';
  }
};

function showErrorMessage(errorText) {
  errorText.classList.remove('hide');
};

function startTimer() {
  timeStart = Date.now();
};

function switchSections(hide, show) {
  hide.classList.add('hide');
  show.classList.remove('hide');
};

var winners = [];

function updateWinners() {
  winners.push({name: player1Name, time: totalTime});
  sortWinners();
  var stringifiedWinnersArr = JSON.stringify(winners);
  localStorage.setItem('winnersArr', stringifiedWinnersArr);
  updateTopPlayerBoard();
};

function sortWinners(){
  winners.sort(function(a, b) {
    return a.time - b.time;
  })
};

function updateTopPlayerBoard() {
  var parsedWinnersArr = JSON.parse(localStorage.getItem('winnersArr'));
  for (var i = 0; i < parsedWinnersArr.length; i++) {
    topPlayerNames[i].innerText = parsedWinnersArr[i].name;
    topPlayerTimes[i].innerText = Math.round(parsedWinnersArr[i].time) + " seconds";
  }
};
