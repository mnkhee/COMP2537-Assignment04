let pokemonList = [];
let EASY = 3;
let MEDIUM = 6;
let HARD = 12;
let timerInterval;
let seconds = 0;
let difficulty;
let openCards = [];
let click = 0;
let matches = 0;
const options = [
  { value: 'EASY', width: '600px', height: '400px', timeLimit: 100 },
  { value: 'MEDIUM', width: '800px', height: '600px', timeLimit: 200 },
  { value: 'HARD', width: '1200px', height: '800px', timeLimit: 300 }
];

function shuffleImage(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function getTimeLimit() {
  const selectedOption = options.find(option => option.value === difficulty);
  if (selectedOption) {
    return selectedOption.timeLimit;
  }
  return 100;
}

function clearGameBoard() {
  stopTimer();
  $('#time').html(seconds);
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    seconds++;
    $('#time').html(seconds);

    // Check if time limit reached
    const timeLimit = getTimeLimit();
    $('#timer').html(timeLimit);
    if (seconds === timeLimit) {
      alert('Out of time!');
      clearGameBoard();
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

const setup = async () => {
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
  let gridHTML = '';

  pokemonList = response.data.results;

  shuffleImage(pokemonList);

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    $(`#option${i + 1}`).on('click', async function () {
      gridHTML = '';
      stopTimer();
      seconds = 0;
      $('#time').html(seconds);
      $('#game_grid').css('display', 'none');
      $('#game_grid').css('width', option.width);
      $('#game_grid').css('height', option.height);
      difficulty = option.value;
      updateTotal(difficulty);
    });
  }

  $('#start').on('click', function () {
    updateTotal(difficulty);
    generateGrid(difficulty);
    $('#game_grid').css('display', 'flex');
    $('#info').css('display', 'block');
    $('#themes').css('display', 'block');
    $('#start').css('display', 'none');
    startTimer();
  });

  $('#reset').on('click', function () {
    stopTimer();
    seconds = 0;
    $('#time').html(seconds);
  });

  $('#dark').on('click', function () {
    $('#game_grid').css('background-color', 'black');
  });

  $('#light').on('click', function () {
    $('#game_grid').css('background-color', 'white');
  });

  function updateTotal(difficulty) {
    const difficultyValue = getDifficultyCount(difficulty);
    $('#total').html(difficultyValue);
  }

  async function generateGrid(difficulty) {
    const selectedPokemonList = pokemonList.slice(0, getDifficultyCount(difficulty));
    const duplicatedPokemonList = [...selectedPokemonList, ...selectedPokemonList];
    const difficultyValue = getDifficultyCount(difficulty);
    let remainingCards = difficultyValue - matches;
    let isClickable = true;

    shuffleImage(duplicatedPokemonList);

    for (let i = 0; i < duplicatedPokemonList.length; i++) {
      const pokemon = duplicatedPokemonList[i];
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      const pokemonImage = res.data.sprites.other['official-artwork'].front_default;
      const pokeballImage = '/Pokeball.png';
      const pokemonId = pokemon.name; // Get the ID of the Pokémon

      gridHTML += `
      <div class="pokeCard" id="${pokemonId}">
        <div class="card-inner">
          <div class="card-front">
            <img src="${pokeballImage}"/>
          </div>
          <div class="card-back">
            <img src="${pokemonImage}"/>
          </div>
        </div>
      </div>
      `;
    }

    $('#game_grid').html(gridHTML);

    $('.pokeCard').on('click', function () {
      const clickedCard = $(this);
      const cardId = clickedCard.attr('id');

      if (!isClickable || clickedCard.hasClass('is-flipped') || clickedCard.hasClass('locked')) {
        return; 
      } else {
        click++;
        $('#clicks').html(click);
      }

      clickedCard.addClass('is-flipped');
      clickedCard.addClass('locked'); 

      openCards.push({ cardId, element: clickedCard });

      if (openCards.length === 2) {
        isClickable = false;
        const [card1, card2] = openCards;

        if (card1.cardId === card2.cardId) {
          isClickable = true;
          openCards = [];
          matches++;
          $('#matches').html(matches);
          $('#left').html(remainingCards - matches);

          if (matches === difficultyValue) {
            setTimeout(() => {
              stopTimer();
              clearGameBoard();
              alert('You win!');
            }, 500);
          }
        } else {
          setTimeout(() => {
            card1.element.removeClass('is-flipped');
            card2.element.removeClass('is-flipped');
            card1.element.removeClass('locked'); 
            card2.element.removeClass('locked');
            openCards = [];
            isClickable = true;
          }, 1000);
        }
      }
    });
    const flipAllCards = () => {
      alert('Power Up!');
      const unflippedCards = $('.pokeCard').not('.is-flipped');
      unflippedCards.addClass('is-flipped');

      setTimeout(() => {
        unflippedCards.removeClass('is-flipped');
      }, 1000);
    };

    const flipInterval = Math.random() * 40000 + 10000; // Random number between 10 and 100 seconds
    setInterval(flipAllCards, flipInterval);
  }


  function getDifficultyCount(difficulty) {
    switch (difficulty) {
      case 'EASY':
        return 3;
      case 'MEDIUM':
        return 6;
      case 'HARD':
        return 12;
      default:
        return 3;
    }
  }
};

$(document).ready(setup);
