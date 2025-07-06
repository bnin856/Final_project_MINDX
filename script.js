// Khai báo các biến
let board = [1,2,3,4,5,6,7,8,9,10,11,0]; 
let emptyPos = 11; 
let gameTimer; 
let seconds = 0; 
let stepCount = 0; 
let gameStarted = false; 
let gameHistory = []; 

// Lấy các thẻ HTML
let startButton = document.querySelector('.start-btn');
let gameGrid = document.querySelector('.grid');
let timeDisplay = document.querySelector('.clock-time');
let historyBody = document.querySelector('.history-table tbody');

// Trả về board đúng thứ tự
function getCorrectBoard() {
  let correct = [1,2,3,4,5,6,7,8,9,10,11,0];
  return correct;
}

// Vẽ lại board
function drawBoard() {
  gameGrid.innerHTML = '';
  
  for (let i = 0; i < 12; i++) {
    let cell = document.createElement('div');
    let num = board[i];
    
    if (num === 0) {
      cell.className = 'cell cell-12 empty';
      cell.textContent = '';
    } else {
      cell.className = 'cell cell-' + num;
      cell.textContent = num;
    }
    
    gameGrid.appendChild(cell);
  }
}

// Hiển thị lịch sử
function showHistory() {
  historyBody.innerHTML = '';
  
  for (let i = 0; i < gameHistory.length; i++) {
    let row = document.createElement('tr');
    let item = gameHistory[i];
    let stt = i + 1;
    let moves = item.moves;
    let time = formatTime(item.time);
    
    row.innerHTML = '<td>' + stt + '</td><td>' + moves + '</td><td>' + time + '</td>';
    historyBody.appendChild(row);
  }
}

// Chuyển giây thành mm:ss
function formatTime(t) {
  let minutes = Math.floor(t/60);
  let secs = t % 60;
  
  let minStr;
  if (minutes < 10) {
    minStr = '0' + minutes;
  } else {
    minStr = minutes;
  }
  
  let secStr;
  if (secs < 10) {
    secStr = '0' + secs;
  } else {
    secStr = secs;
  }
  
  return minStr + ':' + secStr;
}

// Cập nhật đồng hồ
function updateTimer() {
  timeDisplay.textContent = formatTime(seconds);
}

// Bắt đầu đếm giờ
function startClock() {
  gameTimer = setInterval(function() {
    seconds = seconds + 1;
    updateTimer();
  }, 1000);
}

// Dừng đếm giờ
function stopClock() {
  clearInterval(gameTimer);
  gameTimer = null;
}

// Trộn board
function mixBoard() {
  board = getCorrectBoard();
  emptyPos = 11;
  
  // Trộn 100 lần
  for (let i = 0; i < 100; i++) {
    let possibleMoves = getPossibleMoves(emptyPos);
    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    let randomMove = possibleMoves[randomIndex];
    swapCells(emptyPos, randomMove);
    emptyPos = randomMove;
  }
  
  // Nếu vẫn đúng thì trộn lại
  if (checkWin() === true) {
    mixBoard();
  }
}

// Lấy các vị trí có thể di chuyển
function getPossibleMoves(pos) {
  let moves = [];
  let row = Math.floor(pos / 4);
  let col = pos % 4;
  
  // Kiểm tra có thể di chuyển lên không
  if (row > 0) {
    moves.push(pos - 4);
  }
  
  // Kiểm tra có thể di chuyển xuống không
  if (row < 2) {
    moves.push(pos + 4);
  }
  
  // Kiểm tra có thể di chuyển trái không
  if (col > 0) {
    moves.push(pos - 1);
  }
  
  // Kiểm tra có thể di chuyển phải không
  if (col < 3) {
    moves.push(pos + 1);
  }
  
  return moves;
}

// Đổi chỗ 2 ô
function swapCells(i, j) {
  let temp = board[i];
  board[i] = board[j];
  board[j] = temp;
}

// Di chuyển ô đen
function moveTile(direction) {
  if (gameStarted === false) {
    return;
  }
  
  let row = Math.floor(emptyPos / 4);
  let col = emptyPos % 4;
  let target = -1;
  
  if (direction === 'up' && row > 0) {
    target = emptyPos - 4;
  }
  if (direction === 'down' && row < 2) {
    target = emptyPos + 4;
  }
  if (direction === 'left' && col > 0) {
    target = emptyPos - 1;
  }
  if (direction === 'right' && col < 3) {
    target = emptyPos + 1;
  }
  
  if (target >= 0 && target < 12) {
    swapCells(emptyPos, target);
    emptyPos = target;
    stepCount = stepCount + 1;
    drawBoard();
    if (checkWin() === true) {
      gameWon();
    }
  }
}

// Kiểm tra thắng
function checkWin() {
  let correct = getCorrectBoard();
  
  for (let i = 0; i < 12; i++) {
    if (board[i] !== correct[i]) {
      return false;
    }
  }
  
  return true;
}

// Xử lý thắng
function gameWon() {
  gameStarted = false;
  stopClock();
  
  setTimeout(function() {
    alert('YOU WIN!');
    startButton.textContent = 'Chơi lại';
    startButton.classList.remove('end-btn');
    
    let newRecord = {
      moves: stepCount,
      time: seconds
    };
    gameHistory.push(newRecord);
    
    showHistory();
  }, 200);
}

// Xử lý nút bắt đầu/kết thúc
function handleStartButton() {
  if (gameStarted === false) {
    // Bắt đầu game
    mixBoard();
    drawBoard();
    seconds = 0;
    stepCount = 0;
    updateTimer();
    startClock();
    gameStarted = true;
    startButton.textContent = 'Kết thúc';
    startButton.classList.add('end-btn');
  } else {
    // Kết thúc game
    gameStarted = false;
    stopClock();
    startButton.textContent = 'Bắt đầu';
    startButton.classList.remove('end-btn');
    board = getCorrectBoard();
    emptyPos = 11;
    drawBoard();
    seconds = 0;
    stepCount = 0;
    updateTimer();
  }
}

// Lắng nghe phím
document.addEventListener('keydown', function(e) {
  if (gameStarted === false) {
    return;
  }
  
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
    e.preventDefault();
    moveTile('up');
  }
  
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
    e.preventDefault();
    moveTile('down');
  }
  
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    e.preventDefault();
    moveTile('left');
  }
  
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    e.preventDefault();
    moveTile('right');
  }
});

// Gán sự kiện nút
startButton.addEventListener('click', handleStartButton);

// Khởi tạo
function initGame() {
  board = getCorrectBoard();
  emptyPos = 11;
  drawBoard();
  updateTimer();
  showHistory();
}
initGame(); 
