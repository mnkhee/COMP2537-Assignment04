let pokemonList = [];

const setup = async () => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    pokemonList = response.data.results;
    const pokemon = pokemonList[0];
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);

    console.log(pokemonList);
    console.log(pokemon);
    console.log(res.data);

    $('#game_grid').html(`
    <div style="width:200px">
    <img src="${res.data.sprites.other['official-artwork'].front_default}"/>
    </div>`);
}

$(document).ready(setup);