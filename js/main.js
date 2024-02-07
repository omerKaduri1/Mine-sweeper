'use strict'

const MINE = '<img src="img/bomb.png" class="bomb"/>'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
var gIsFirstClick = true
var gLivesCount = 3

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = false
    renderLives()
}

function buildBoard() {
    var board = []
    for (let i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (let j = 0; j < gLevel.size; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            board[i][j] = cell
        }
    }
    // board[0][1].isMine = true
    // board[2][3].isMine = true
    board = setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            // var symbol = (cell.isMine) ? MINE : EMPTY
            // var negsCount = (cell.isMine) ? EMPTY : cell.minesAroundCount
            strHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})">
            </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countCellNegs(board, i, j)
        }
    }
    return board
}

function countCellNegs(board, rowIdx, colIdx) {
    var count = 0
    for (let i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
        if (i < 0 || i >= board.length) continue

        for (let j = (colIdx - 1); j <= (colIdx + 1); j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            var cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    cell.isShown = true
    if (gIsFirstClick) {
        setTimeout(() => {
            placeRandMines()
            setMinesNegsCount(gBoard)
            gIsFirstClick = false
        }, 20);
        console.log(gIsFirstClick);
    } else {
        var symbol
        if (cell.isMine) symbol = MINE
        const negsCount = (cell.isMine || !cell.minesAroundCount) ? EMPTY : cell.minesAroundCount
        console.log('elCell:', elCell)
        if (!cell.isMine) {
            elCell.innerText = negsCount
        } else {
            elCell.innerHTML = symbol
        }
    }
}

function placeRandMines() {
    var mineNum = gLevel.mines
    while (mineNum > 0) {
        const randIIdx = getRandomInt(0, gLevel.size)
        const randJIdx = getRandomInt(0, gLevel.size)
        var randCell = gBoard[randIIdx][randJIdx]
        console.log({ randIIdx, randJIdx })
        if (!randCell.isMine) {
            randCell.isMine = true
            mineNum--
        }
    }
}

function renderLives() {
    var elLivesDiv = document.querySelector('.lives-container')
    for (let i = 1; i < 4; i++) {
        const LIVES = `<img src="img/hearts-life.png" class=" lives live-${i}"/>`
        elLivesDiv.innerHTML += LIVES
    } 
}

function countLives() {
    gLivesCount--
    
}