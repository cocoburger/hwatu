const gridContainer = document.querySelector('.grid-container')
let cards = []
let firstCard, secondCard
let lockBoard = false
let score = 0
let idToNameMapping = {};


fetch('../data/data.json').then((result) => result.json())
    .then((cardData) => {
      cards = [...cardData]
      shuffleCards()
      generateCards()
    })


function shuffleCards(  ) {
  let currentIndex = cards.length,
      randomIndex,
      temporaryValue
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = cards[currentIndex]
    cards[currentIndex] = cards[randomIndex]
    cards[randomIndex] = temporaryValue
  }
}


function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateCards() {
  for ( let card of cards ) {
    const cardElement = generateCard(card)
    gridContainer.appendChild(cardElement)
    cardElement.addEventListener('click', flipCard)
  }
}

function generateCard (card) {
  const uniqueId = generateUniqueId();
  idToNameMapping[uniqueId] = card.name;
  const cardElement = document.createElement('div')
  cardElement.classList.add('card')
  cardElement.setAttribute('data-id', uniqueId);

  cardElement.innerHTML = `
      <div class='front'>
        <img class='front-image' src=${card.image} alt='card'>
      </div>
      <div class='back'></div>
    `
  return cardElement
}

function flipCard() {
  if ( lockBoard ) return
  if ( this === firstCard ) return;

  this.classList.add('flipped')

  if ( !firstCard ) {
    firstCard = this
    return
  }

  secondCard = this
  score++
  document.querySelector('.score').textContent = score
  lockBoard = true

  checkForMatch()
}

function checkForMatch(  ) {
  const firstCardName = idToNameMapping[firstCard.getAttribute('data-id')];
  const secondCardName = idToNameMapping[secondCard.getAttribute('data-id')];

  let isMatch = firstCardName === secondCardName;

  isMatch ? disableCards() : unflipCards()
}

function disableCards(  ) {
  firstCard.removeEventListener('click', flipCard)
  secondCard.removeEventListener('click', flipCard)

  resetBoard()
}


function unflipCards(  ) {
  setTimeout(() => {
    firstCard.classList.remove('flipped')
    secondCard.classList.remove('flipped')
    resetBoard()
  }, 1000)
}

function resetBoard() {
  firstCard = null
  secondCard = null
  lockBoard = false
}

function restart() {
  resetBoard()
  shuffleCards()
  score = 0
  document.querySelector('.score').textContent = score
  gridContainer.innerHTML = ""
  generateCards()
}
