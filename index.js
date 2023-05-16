  function shuffleImage(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

const setup = async () => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    pokemonList = response.data.results;
    
    shuffleImage(pokemonList);
    
    let gridHTML = '';
    
    for (let i = 0; i < 3; i++) {
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
  
  