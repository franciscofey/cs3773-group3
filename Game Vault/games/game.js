// File to display the game info to the website (Let me know if you have questions -Lauren)
export async function loadAndDisplayGames() {
    const container = document.getElementById('game-container');
    const sortSelect = document.getElementById('sort-by');

    try {
        // Fetch all data sources at once
        const [gamesRes, pricesRes, quantityRes] = await Promise.all([
            fetch('games.json'),
            fetch('gamePrices.json'),
            fetch('gameQuantity.json')
        ]);

        if (!gamesRes.ok || !pricesRes.ok) throw new Error("Check JSON files!");

        const games = await gamesRes.json();
        const priceMap = await pricesRes.json();
        const quantityMap = await quantityRes.json();

        // Handle the sorting logic based on dropdown selection
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
        } else if (sortValue === 'quantity-low') {
            games.sort((a, b) => (quantityMap[a.id] || 0) - (quantityMap[b.id] || 0));
        } else if (sortValue === 'quantity-high') {
            games.sort((a, b) => (quantityMap[b.id] || 0) - (quantityMap[a.id] || 0));
        }

        // Generate HTML for each game card
        let gameCards = '';
        games.forEach(game => {
            const price = priceMap[game.id] ? `$${priceMap[game.id]}` : 'Free';
            const quantity = quantityMap[game.id] ? `${quantityMap[game.id]}` : 0;
            const stockDisplay = (quantity == 0) ? "OUT OF STOCK" : quantity;

            // Swap thumbnail for a high-res cover image
            const imageUrl = game.cover?.url ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big') : 'img/placeholder.png';
            const devName = game.involved_companies?.[0]?.company?.name || 'Unknown Developer';

            // Convert 0-100 rating to a 5-star scale
            const starValue = game.total_rating ? Math.round((game.total_rating / 20) * 2) / 2 : 0;
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= starValue) {
                    starsHtml += '<i class="fas fa-star"></i>'; // Full
                } else if (i - 0.5 === starValue) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>'; // Half
                } else {
                    starsHtml += '<i class="far fa-star"></i>'; // Empty
                }
            }

            // Build the card string
            gameCards += `
                <div class="pro" data-id="${game.id}" data-summary="${(game.summary || "").toLowerCase()}">
                    <img src="${imageUrl}" alt="${game.name}">
                    <div class="des">
                        <h6>${devName}</h6>
                        <h5>${game.name}</h5>
                        <div class="star">
                            ${starsHtml}
                            <span>(${starValue})</span>
                        </div>
                        <h4>${price}</h4>
                        <div class="stock-container">
                            <span class="stock-label">STOCK:</span>
                            <span class="stock-value">${stockDisplay}</span>
                        </div>
                    </div>
                    <button type="button" class="cart" data-game='${game.id}'>
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            `;
        });

        // Inject all cards into the container at once
        container.innerHTML = gameCards;

    } catch (error) {
        console.error('Display Error:', error);
        container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
