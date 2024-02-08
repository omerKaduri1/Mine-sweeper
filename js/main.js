'use strict'

const MINE = '<img src="img/bomb.png" class="bomb"/>'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
var gIsFirstClick = true
var gLivesCount

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
    gGame.isOn = true
    gLivesCount = (gLevel.size <= 4) ? 1 : 3
}

function setLevels(elBtn) {
    gLevel.size = +elBtn.dataset.size
    gLevel.mines = +elBtn.dataset.mines
    onInit()
    setLivesCountRender()
    console.log('gLevel:', gLevel)
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
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // board[0][3].isMine = true
    // board[1][2].isMine = true
    board = setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    // debugger
    var strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            const negsCount = (cell.isMine || !cell.minesAroundCount) ? EMPTY : cell.minesAroundCount
            var symbol = (cell.isMine) ? MINE : negsCount
            strHTML += `<td class="cell" data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this)">
            <span class="un-shown">${symbol}</span></td>`
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
    console.log('cell:', cell)
    const elSpan = elCell.querySelector('span')
    elSpan.classList.remove('un-shown')
    elCell.classList.add('shown')
    console.log('elCell:', elCell)
    // gGame.shownCount++
    if (gIsFirstClick) {
        placeRandMines()
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        elSpan.classList.remove('un-shown')
        elCell.classList.add('shown')
        gIsFirstClick = false
    }
    if (cell.isMine) handleStrike()
}
// placeRandMines()
function placeRandMines() {
    var mineCount = 0
    while (mineCount < gLevel.mines) {
        const randIIdx = getRandomInt(0, gLevel.size)
        const randJIdx = getRandomInt(0, gLevel.size)
        var randCell = gBoard[randIIdx][randJIdx]
        console.log({ randIIdx, randJIdx })
        if (!randCell.isMine && !randCell.isShown) {
            randCell.isMine = true
            mineCount++
        }
    }
}

function handleStrike() {
    if (gLivesCount > 0)
        gLivesCount--
    changeLivesDisplay()
    if (gLivesCount === 0) {
        showModal()
    }
}

function changeLivesDisplay() {
    const elLivesImgs = document.querySelectorAll('.lives')
    for (let i = 0; i < elLivesImgs.length; i++) {
        if (i < gLivesCount) {
            elLivesImgs[i].style.visibility = 'visible'
        } else {
            elLivesImgs[i].style.visibility = 'hidden'

        }
    }
}

function showModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.innerText = 'You lost, try again!'
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}

function setLivesCountRender() {
    const elLive1 = document.querySelector('.live-1')
    const elLive3 = document.querySelector('.live-3')
    if (gLevel.size > 4) {
        elLive1.style.visibility = 'visible'
        elLive3.style.visibility = 'visible'
    } else {
        elLive1.style.visibility = 'hidden'
        elLive3.style.visibility = 'hidden'
    }
}

// function disableContextMenu() {
//     const elCell = document.querySelector('.noContextMenu')
//     elCell.addEventListener('contextmenu', (ev) => {
//         ev.preventDefault()
//         console.log('Right clicked!');
//     })
// }

function onCellMarked(elCell) {
    elCell.addEventListener('contextmenu', (e) => {
        elCell.innerHTML = FLAG
        e.preventDefault()
        gGame.markedCount++
        elCell.isMarked = true
        console.log(elCell);
    })

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}