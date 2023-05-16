let pokemonList = [];
let EASY = 3;
let MEDIUM = 6;
let HARD = 12;
  
  function shuffleImage(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

const setup = async () => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    let gridHTML = '';
    pokemonList = response.data.results;
    
    // Shuffles the pokemon images so that different pokemon appear each time.
    shuffleImage(pokemonList);
    
    $('#total').html(EASY);

    for (let i = 0; i < EASY; i++) {
      const pokemon = pokemonList[i];
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

    $('#dark').on('click', function () {
        $('#game_grid').css('background-color', 'black');
      });
    
      $('#light').on('click', function () {
        $('#game_grid').css('background-color', 'white');
      });
    };
  
  $(document).ready(setup);
  

  /**
   * TODO: 
   * - Add a timer
   * - Add a tracker for how many clicks it took to finish the game
   * - Add a tracker for how many pairs were found / how many remain
   * - Check if user has clicked on easy, medium, or hard, then load the appropriate number of pokemon.
   *    - Change the size of the game grid according the the difficulty
   * - Add a button to start the game
   * - Add a button to reset the game
   */