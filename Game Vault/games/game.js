//File to display the game info to the website (Let me know if you have questions -Lauren)
export async function loadAndDisplayGames() {
    const container = document.getElementById('game-container');

    try {
        // Fetches both the games and prices in parallel
        const [gamesRes, pricesRes] = await Promise.all([
            fetch('games.json'),
            fetch('gamePrices.json')
        ]);

        if (!gamesRes.ok || !pricesRes.ok) throw new Error("Check your JSON files!");

        const games = await gamesRes.json();
        const priceMap = await pricesRes.json(); // table

        let gameCards = '';

        games.forEach(game => {
            // Finds price using the game's ID; default to 'N/A' if missing
            const price = priceMap[game.id] ? `$${priceMap[game.id]}` : 'TBD';

            const imageUrl = game.cover?.url
                ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big')
                : 'img/placeholder.png';

            const devName = game.involved_companies?.[0]?.company?.name || 'Unknown Developer';

            gameCards += `
                <div class="pro">
                    <img src="${imageUrl}" alt="${game.name}">
                    <div class="des">
                        <h6>${devName}</h6>
                        <h5>${game.name}</h5>
                        <p>${game.total_rating ? Math.round(game.total_rating) + '%' : 'N/A'}</p>
                        <h4>${price}</h4> 
                    </div>
                    <a href="#" class="cart"><i class="fa-solid fa-cart-shopping"></i></a>
                </div>
            `;
        });

        container.innerHTML = gameCards;
    } catch (error) {
        console.error('Display Error:', error);
        container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
