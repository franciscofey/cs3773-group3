//File to display the game info to the website (Let me know if you have questions -Lauren)
export async function loadAndDisplayGames() {
    const container = document.getElementById('game-container');

    try {
        //Fetches the API scraper json
        const response = await fetch('games.json');
        if (!response.ok) throw new Error("games.json not found. Run scraper.js first!");

        const games = await response.json();
        container.innerHTML = '';

        //Pulls the info needed (Like a for loop, it adjusts to the amount of info)
        games.forEach(game => {
            const imageUrl = game.cover?.url
                ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big')
                : 'img/placeholder.png';

            const devName = game.involved_companies?.[0]?.company?.name || 'Unknown Developer';

            container.innerHTML += `
                <div class="pro">
                    <img src="${imageUrl}" alt="${game.name}">
                    <div class="des">
                        <h6>${devName}</h6>
                        <h5>${game.name}</h5>
                        <p>${game.total_rating ? Math.round(game.total_rating) + '%' : 'N/A'}</p>
                        <h4>$PRICE</h4> 
                        <a href="#" class="cart"><i class="fa-solid fa-cart-shopping"></i></a>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Display Error:', error);
        container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
