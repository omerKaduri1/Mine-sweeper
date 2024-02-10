'use strict'

const MINE = '<img src="img/bomb.png" class="bomb"/>'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
var gIsFirstClick = true
var gLivesCount
var gTimerInterval
var elSmileyBtn = document.querySelector('.reset-btn')
var gElBody = document.querySelector('body')

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
    elSmileyBtn.innerText = '😊'
    gElBody.style.backgroundImage = 'url(img/light-bcg.avif)'
    clearInterval(gTimerInterval)
    document.querySelector('.timer span').innerText = '000'
    updateShownCellsCount(-gGame.shownCount)
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
    board = setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var symbol = getSymbol(cell)
            var cellClass = (cell.isShown && !cell.isMarked) ? 'shown' : ''
            var spanClass = (cell.isShown || cell.isMarked) ? '' : 'un-shown'
            strHTML += `<td class="cell ${cellClass}" data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, event)">
            <span class="${spanClass}">${symbol}</span></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

function getSymbol(cell) {
    if (cell.isMarked) return FLAG
    if (cell.isMine) return MINE
    if (cell.minesAroundCount) return cell.minesAroundCount
    else return EMPTY
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
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    if (cell.isShown) return
    if (!cell.isMarked) {
        cell.isShown = true

        updateShownCellsCount(1)
        if (gIsFirstClick) {
            placeRandMines(i, j)
            gIsFirstClick = false
            startTimer()
        }

        if (cell.isMine) {
            handleStrike()
        }

        if (!cell.minesAroundCount && !cell.isMine) {
            expandShown(gBoard, elCell, i, j)
        }

    }

    else {
        return
    }

    var isVictory = checkGameOver()
    if (isVictory) {
        showModal(isVictory)
        clearInterval(gTimerInterval)
        elSmileyBtn.innerText = '😎'
        gGame.isOn = false

    }
    renderBoard(gBoard)
}

function expandShown(board, elCell, rowIdx, colIdx) {
    for (let i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = (colIdx - 1); j <= (colIdx + 1); j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            const cell = board[i][j]
            if (!cell.isShown) {
                cell.isShown = true
                updateShownCellsCount(1)
            }
        }
    }
}

function placeRandMines(clickedRow, clickedCol) {
    var mineCount = 0
    while (mineCount < gLevel.mines) {
        const randIIdx = getRandomInt(0, gLevel.size)
        const randJIdx = getRandomInt(0, gLevel.size)
        var randCell = gBoard[randIIdx][randJIdx]
        if (!randCell.isMine && (randIIdx !== clickedRow || randJIdx !== clickedCol)) {
            randCell.isMine = true
            mineCount++
        }
    }
    setMinesNegsCount(gBoard)
}

function handleStrike() {
    gLivesCount--
    if (gLivesCount > 0) {
        elSmileyBtn.innerText = '😵'
        setTimeout(() => {
            elSmileyBtn.innerText = '😊'
        }, 2000);
        changeLivesDisplay()
    } else if (gLivesCount === 0) {
        clearInterval(gTimerInterval)
        showModal()
        gGame.isOn = false
        elSmileyBtn.innerText = '😵'
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

function showModal(isVictory) {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    if (isVictory) elModal.innerText = 'You won!🏆'
    else elModal.innerText = 'Maybe next time...'
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    onInit()
}

function setLivesCountRender() {
    const elLive1 = document.querySelector('.live-1')
    const elLive2 = document.querySelector('.live-2')
    const elLive3 = document.querySelector('.live-3')
    if (gLevel.size > 4) {
        elLive1.style.visibility = 'visible'
        elLive2.style.visibility = 'visible'
        elLive3.style.visibility = 'visible'
    } else {
        elLive1.style.visibility = 'hidden'
        elLive2.style.visibility = 'visible'
        elLive3.style.visibility = 'hidden'
    }
}

function onCellMarked(elCell, event) {
    event.preventDefault()

    var cell = gBoard[elCell.dataset.i][elCell.dataset.j]
    if (!cell.isMarked) {
        elCell.innerHTML = FLAG
        gGame.markedCount++
        cell.isMarked = true
    } else {
        cell.isMarked = false
        elCell.innerHTML = EMPTY
        gGame.markedCount--
    }

}

function checkGameOver() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            const isLegitCell = (cell.isMine && cell.isMarked || !cell.isMine && cell.isShown)
            if (!isLegitCell) return false
        }
    }
    return true
}

function updateShownCellsCount(diff) {
    gGame.shownCount += diff
    document.querySelector('.shown-count').innerText = (gGame.shownCount + '').padStart(2, '0')
}

function startTimer() {
    if (gTimerInterval) clearInterval(gTimerInterval)

    var startTime = Date.now()
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime
        const seconds = getFormatSeconds(timeDiff)
        gGame.secsPassed++
        document.querySelector('.timer span').innerText = seconds
    }, 1000)
}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return (seconds + '').padStart(3, '0')
}

function changeToDark() {
    gElBody.style.color = 'white'
    gElBody.style.backgroundImage = 'url(img/dark-bcg.jpg)'
}

function changeToLight() {
    gElBody.style.color = 'black'
    gElBody.style.backgroundImage = 'url(img/light-bcg.avif)'
}

function onExterminatorClick(elBtn) {
    if (gLevel.size > 4) {
        elBtn.style.visibility = 'visible'
    } else {
        return alert('You cant use this button on beginner level')
    }
    var mineCount = 0
    while (mineCount < 3) {
        const randIIdx = getRandomInt(0, gLevel.size)
        const randJIdx = getRandomInt(0, gLevel.size)
        var randCell = gBoard[randIIdx][randJIdx]
        if (randCell.isMine && !randCell.isShown) {
            randCell.isMine = false
            mineCount++
        }
    }
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}
