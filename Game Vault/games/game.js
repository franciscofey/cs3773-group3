// File to display the game info to the website (Let me know if you have questions -Lauren)
export async function loadAndDisplayGames() {
    const container = document.getElementById('game-container');
    const sortSelect = document.getElementById('sort-by');

    try {
        const [gamesRes, pricesRes] = await Promise.all([
            fetch('games.json'),
            fetch('gamePrices.json')
        ]);

        if (!gamesRes.ok || !pricesRes.ok) throw new Error("Check JSON files!");

        const games = await gamesRes.json();
        const priceMap = await pricesRes.json();
        
        // Sorting system
        const sortValue = sortSelect ? sortSelect.value : 'default';

        if (sortValue === 'price-low') {
            games.sort((a, b) => (priceMap[a.id] || 0) - (priceMap[b.id] || 0));
        } else if (sortValue === 'price-high') {
            games.sort((a, b) => (priceMap[b.id] || 0) - (priceMap[a.id] || 0));
        } else if (sortValue === 'rating-high') {
            games.sort((a, b) => (b.total_rating || 0) - (a.total_rating || 0));
        } else if (sortValue === 'title-az') {
            games.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'title-za') {
            games.sort((a, b) => b.name.localeCompare(a.name));
        }
        // --------------------------

        // Actual game card production
        let gameCards = '';

        games.forEach(game => {
            const price = priceMap[game.id] ? `$${priceMap[game.id]}` : 'Free';

            const imageUrl = game.cover?.url
                ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big')
                : 'img/placeholder.png';

            const devName = game.involved_companies?.[0]?.company?.name || 'Unknown Developer';

            // --- Star Rating Logic ---
            // Converts 0-100 to 0-5 (rounds to the nearest 0.5)
            const starValue = game.total_rating ? Math.round((game.total_rating / 20) * 2) / 2 : 0;

            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= starValue) {
                    starsHtml += '<i class="fas fa-star"></i>'; // Full star
                } else if (i - 0.5 === starValue) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>'; // Half star
                } else {
                    starsHtml += '<i class="far fa-star"></i>'; // Empty star
                }
            }
            // --------------------------

            gameCards += `
                <div class="pro">
                    <img src="${imageUrl}" alt="${game.name}">
                    <div class="des">
                        <h6>${devName}</h6>
                        <h5>${game.name}</h5>
                        <div class="star">
                            ${starsHtml}
                            <span>(${starValue})</span>
                        </div>
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
