'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
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
    board[0][1].isMine = true
    board[2][2].isMine = true
    board = setMinesNegsCount(board)
    console.table(board)

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var symbol = (cell.isMine) ? MINE : EMPTY
            strHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})">
            ${symbol}</td>`
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
        // console.log({ i });
        if (i < 0 || i >= board.length) {
             continue
        }

        for (let j = (colIdx - 1); j <= (colIdx + 1); j++) {
            if (i === rowIdx && j === colIdx) {
                 continue
            }
            if (j < 0 || j >= board[i].length) {
                continue
            }
            var cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}