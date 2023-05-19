let pokemonList = [];
let EASY = 3;
let MEDIUM = 6;
let HARD = 12;
let timerInterval;
let seconds = 0;

function shuffleImage(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    seconds++;
    $('#time').html(seconds);
  }, 1000);

  /**
   * have somethign that checks what difficulty is selected
   * if ... timelimit === ...
   * 
   * if (seconds === (timelimit)) {
   * alert('out of time');
   * } 
  */
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

const setup = async () => {
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
  let gridHTML = '';
  let difficulty;

  pokemonList = response.data.results;

  // Shuffles the pokemon images so that different pokemon appear each time.
  shuffleImage(pokemonList);

  $('#option1').on('click', function () {
    gridHTML = '';
    stopTimer();
    seconds = 0;
    $('#time').html(seconds);
    $('#game_grid').css('display', 'none');
    $('#game_grid').css('width', '600px');
    $('#game_grid').css('height', '400px');
    difficulty = 'EASY';
    updateTotal(difficulty); // Call a separate function to update the total
  });

  $('#option2').on('click', function () {
    gridHTML = '';
    stopTimer();
    seconds = 0;
    $('#time').html(seconds);
    $('#game_grid').css('display', 'none');
    $('#game_grid').css('width', '800');
    $('#game_grid').css('height', '600px');
    difficulty = 'MEDIUM';
    updateTotal(difficulty); // Call a separate function to update the total
  });

  $('#option3').on('click', function () {
    gridHTML = '';
    stopTimer();
    seconds = 0;
    $('#time').html(seconds);
    $('#game_grid').css('display', 'none');
    $('#game_grid').css('width', '1200px');
    $('#game_grid').css('height', '800px');
    difficulty = 'HARD';
    updateTotal(difficulty); // Call a separate function to update the total
  });

  $('#start').on('click', function () {
    $('#game_grid').css('display', 'flex');
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
    generateGrid(difficulty);
  }

  async function generateGrid(difficulty) {
    const selectedPokemonList = pokemonList.slice(0, getDifficultyCount(difficulty));

    for (let i = 0; i < selectedPokemonList.length; i++) {
      const pokemon = selectedPokemonList[i];
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      const pokemonImage = res.data.sprites.other['official-artwork'].front_default;

      gridHTML += `
        <div style="width: 200px">
          <img src="${pokemonImage}" alt="${pokemon.name}"/>
        </div>
        <div style="width: 200px">
          <img src="${pokemonImage}" alt="${pokemon.name}"/>
        </div>
      `;
    }

    $('#game_grid').html(gridHTML);
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


/**
 * TODO: 
 * - Add a tracker for how many clicks it took to finish the game
 * - Add a tracker for how many pairs were found / how many remain
 * - Check if user has clicked on easy, medium, or hard, then load the appropriate number of pokemon.
 *    - Change the size of the game grid according the the difficulty
 * - Add a button to start the game
 * - Add a button to reset the game
 * - Randomize placement of pokemon images
 */