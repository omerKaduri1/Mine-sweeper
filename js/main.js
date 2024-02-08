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
    gIsFirstClick = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = true
    gLivesCount = (gLevel.size <= 4) ? 1 : 3
    setLivesCountRender()
}

function setLevels(elBtn) {
    gLevel.size = +elBtn.dataset.size
    gLevel.mines = +elBtn.dataset.mines
    onInit()
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
            const cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    const elSpan = elCell.querySelector('span')
    gGame.shownCount++

    cell.isShown = true
    if (cell.isShown) {
        elSpan.classList.remove('un-shown')
        elCell.classList.add('shown')
    }

    if (gIsFirstClick) {
        cell.isShown = true
        console.log('first Click:', elCell)
        placeRandMines(i, j)
        gIsFirstClick = false
        renderBoard(gBoard)
    }


    if (cell.isMine) {
        handleStrike()
    }

    if (!cell.minesAroundCount && !cell.isMine) {
        expandShown(gBoard, elCell, i, j)
    }
}

function expandShown(board, elCell, rowIdx, colIdx) {
    for (let i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = (colIdx - 1); j <= (colIdx + 1); j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            const cell = board[i][j]
            cell.isShown = true
            gGame.shownCount++
            const elNegCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            const elNegSpan = elNegCell.querySelector('span')
            elNegSpan.classList.remove('un-shown')
            elNegCell.classList.add('shown')
        }
    }
}

function placeRandMines(clickedRow, clickedCol) {
    var mineCount = 0
    while (mineCount < gLevel.mines) {
        const randIIdx = getRandomInt(0, gLevel.size)
        const randJIdx = getRandomInt(0, gLevel.size)
        var randCell = gBoard[randIIdx][randJIdx]
        console.log({ randIIdx, randJIdx })
        if (!randCell.isMine && (randIIdx !== clickedRow || randJIdx !== clickedCol)) {
            randCell.isMine = true
            mineCount++
        }
    }
    setMinesNegsCount(gBoard)
}

function handleStrike() {
    if (gLivesCount > 0)
        gLivesCount--
    changeLivesDisplay()
    if (gLivesCount === 0) {
        showModal()
        gGame.isOn = false
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
    elCell.addEventListener('contextmenu', function(e) {
        e.preventDefault()
        
        if (!elCell.isMarked) {
            elCell.innerHTML = FLAG
            gGame.markedCount++
            elCell.isMarked = true
        } else {
            elCell.innerHTML = ''
            gGame.markedCount--
            elCell.isMarked = false
        }
        
        console.log(elCell);
    })
}


function checkGameOver() {

}
