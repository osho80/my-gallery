'use strict'

// Const & Globals:

const MINE = '💣';
const TILE = '⬛️';
const FLAG = '🚩';
const NORMAL = '🙂';
const SADNDEAD = '🥴';
const WINNER = '😎';
const LIFE = '❤️';
var gElMood = document.querySelector('.mood button');

var gBoard;
var gSize = 4;
var gNumOfMines = 2;
var gGame = { isOn: true, win: null, shownCount: 0, markedCount: 0, secPassed: 0 }
var gIsOn = true;
var gFirstClick = true;
var gWatch;
var gSafe = false;
var gHidden = [];       // stores hidden neighbours for hint function
var gNumOfHints = 3;

// Functions:

function initGame() {
    console.log('Lets play!');
    gNumOfHints = 3;
    gBoard = buildBoard(gSize, gNumOfMines);
    renderBoard(gBoard);
    var elSafe = document.querySelector('.safe');
    elSafe.style.display = 'none';
    if (gWatch) clearInterval(gWatch);
    renderTime('00');
    
}

function changeLevel(size, numOfMines) {
    gSize = size;
    gNumOfMines = numOfMines;
    initGame();
}

function buildBoard(size, numOfMines) {
    //debugger
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
            board[i][j] = cell;
        }
    }

    console.table(board);
    return board;
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];

            strHTML += `\t<td class="unturned" onclick="cellClicked(this ,${i}, ${j})" onmousedown="cellMarked(event ,${i}, ${j})">`;
            if (!currCell.isShown && !currCell.isMarked) strHTML += TILE;
            if (currCell.isMarked) strHTML += FLAG;
            if (currCell.isMine && currCell.isShown) strHTML += MINE;
            if (currCell.minesAroundCount > 0 && currCell.isShown) {
                strHTML += currCell.minesAroundCount;
            }
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    console.log('strHTML is:');
    console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    gElMood.innerText = NORMAL;
    renderHints(gNumOfHints);
    checkGameOver(board);
}

function setMinesNegsCount(board) {
    //debugger
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];


            if (currCell.isMine === true) {
                var cellI = i;
                var cellJ = j;
                for (var x = cellI - 1; x <= cellI + 1; x++) {
                    if (x < 0 || x >= board.length) continue;
                    for (var y = cellJ - 1; y <= cellJ + 1; y++) {
                        var neighbor = board[x][y];
                        if (y < 0 || y >= board[i].length) continue;
                        if (x === cellI && y === cellJ) continue;
                        if (neighbor.isMine === true) continue;
                        neighbor.minesAroundCount++;
                    }
                }

            }
        }

    }
}


function cellClicked(elCell, cellI, cellJ) {
    //debugger
    if (gGame.shownCount) {                      // if true then not first click
        if (!gSafe) {
            gBoard[cellI][cellJ].isShown = true;
            gGame.shownCount++;
            renderBoard();
        }

        if (gSafe) {
            showNegs(cellI, cellJ);
        }
    } else {
        startWatch();
        randomMineSet(gNumOfMines, gBoard, cellI, cellJ);
        setMinesNegsCount(gBoard);
        gBoard[cellI][cellJ].isShown = true;
        gGame.shownCount++;
        renderBoard();
    }

}


function randomMineSet(gNumOfMines, board, cellI, cellJ) {
    //debugger
    var minesPlaced = 0;
    while (minesPlaced < gNumOfMines) {
        var i = getRandomInt(0, board.length);
        if (i === cellI) continue;
        var j = getRandomInt(0, board.length);
        if (j === cellJ) continue;
        board[i][j].isMine = true;
        minesPlaced++;
    }
    
}

function cellMarked(event, cellI, cellJ) {
    var click = event;
    if (click.button === 2) {
        if(!gBoard[cellI][cellJ].isMarked) {
            gBoard[cellI][cellJ].isMarked = true;
            gGame.markedCount++;
            renderBoard();
        } 
        else if (gBoard[cellI][cellJ].isMarked) {
            gBoard[cellI][cellJ].isMarked = false;
            gGame.markedCount--;
            renderBoard();
        }
    } else {
        return;
    }

}

function checkGameOver(board) {
    //debugger
    var allClear = false;
    var allMarked = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine && currCell.isShown && !gSafe) {
                //console.log('You lost');
                gGame.isOn = false;
                gGame.win = false;

            }


            if (gGame.shownCount === gSize ** 2 - gNumOfMines) allClear = true;
            if (gGame.markedCount === gNumOfMines) allMarked = true;
            if (allClear && allMarked) {
                gGame.win = true;
                gGame.isOn = false;

            }

        }


    }
    if (!gGame.isOn) endGame();
}





function endGame() {
    //debugger
    var modal = document.querySelector('.gameOver');
    modal.style.display = 'block';
    var endGameMsg = document.querySelector('.gameOver h2');
    if (!gGame.win) {
        endGameMsg.innerHTML = 'You lost';
        gElMood.innerText = SADNDEAD;
    }
    if (gGame.win) {
        endGameMsg.innerHTML = 'Awesome!!';
        gElMood.innerText = WINNER;
    }
    clearInterval(gWatch);
    //console.log(endGameMsg);

}

function playAgain() {
    var modal = document.querySelector('.gameOver');
    modal.style.display = 'none';
    var elSafe = document.querySelector('.safe');
    elSafe.style.display = 'none';
    gGame = { isOn: true, win: null, shownCount: 0, markedCount: 0, secPassed: 0 }
    initGame();
    console.log('wow!');

}


function startWatch() {
    var startTime = Date.now();
    gWatch = setInterval(function () {
        var currTime = Date.now();
        var totalTime = parseInt((currTime - startTime) / 1000);
        renderTime(totalTime);
    }, 1000);
}

function renderTime(time) {
    
    document.querySelector('.watch').innerText = `Timer ${time}`;
}

function hint() {
    if (gNumOfHints <= 0) return;
    if (!gGame.shownCount) return;
    gSafe = true;
    var elSafe = document.querySelector('.safe');
    elSafe.style.display = 'block';
}


function showNegs(cellI, cellJ) {
    //debugger

    for (var x = cellI - 1; x <= cellI + 1; x++) {
        if (x < 0 || x >= gBoard.length) continue;
        for (var y = cellJ - 1; y <= cellJ + 1; y++) {
            if (y < 0 || y >= gBoard.length) continue;
            var cell = gBoard[x][y];
            if (!cell.isShown) gHidden.push(cell);
            for (var show = 0; show < gHidden.length; show++) {
                cell.isShown = true;
            }
        }
    }

    renderBoard();
    setTimeout(function () { hideNegs() }, 1000);
}

function hideNegs() {
    for (var hide = 0; hide < gHidden.length; hide++) {
        gHidden[hide].isShown = false;
    }
    renderBoard();
    gHidden = [];
    gSafe = false;
    var elSafe = document.querySelector('.safe');
    elSafe.style.display = 'none';
    gNumOfHints--;
    renderHints(gNumOfHints);
}

function renderHints(gNumOfHints) {

    document.querySelector('.hints').innerText = `🦺 ${gNumOfHints}`;
}

