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
    
    shuffleImage(pokemonList);
    
    $('#total').html(EASY);

    for (let i = 0; i < EASY; i++) {
      const pokemon = pokemonList[i];
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      const pokeSprite = res.data.sprites.other['official-artwork'].front_default;
      
      gridHTML += `
        <div style="width: 200px">
          <img src="${pokeSprite}" alt="${pokemon.name}"/>
        </div>
        <div style="width: 200px">
          <img src="${pokeSprite}" alt="${pokemon.name}"/>
        </div>
      `;
    }
    
    $('#game_grid').html(gridHTML);
  }
  
  $(document).ready(setup);
  
  