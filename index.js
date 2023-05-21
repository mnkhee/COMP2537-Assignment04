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
  let difficulty = 'EASY';
  const options = [
    { value: 'EASY', width: '600px', height: '400px' },
    { value: 'MEDIUM', width: '800px', height: '600px' },
    { value: 'HARD', width: '1200px', height: '800px' }
  ];

  pokemonList = response.data.results;

  shuffleImage(pokemonList);

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    $(`#option${i + 1}`).on('click', function () {
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
    generateGrid(difficulty);
    $('#game_grid').css('display', 'flex');
    $('#info').css('display', 'block');
    $('#themes').css('display', 'block');
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

    for (let i = 0; i < selectedPokemonList.length; i++) {
      const pokemon = selectedPokemonList[i];
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      const pokemonImage = res.data.sprites.other['official-artwork'].front_default;
      const pokeballImage = '/Pokeball.png';

      gridHTML += `
        <div style="width: 200px">
          <img src="${pokemonImage}"/>
        </div>
        <div style="width: 200px">
          <img src="${pokemonImage}"/>
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
 * - Randomize placement of pokemon images (think of an algorithm to do this)
 */