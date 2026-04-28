export async function loadAndDisplayFeaturedGames() {
    const container = document.getElementById('featured-productContainer');

    try {
        const [gamesRes, pricesRes] = await Promise.all([
            fetch('../games/games.json'),
            fetch('../games/gamePrices.json')
        ]);

        if (!gamesRes.ok || !pricesRes.ok) throw new Error("Check JSON files!");

        let games = await gamesRes.json();
        const priceMap = await pricesRes.json();

        // --- RANDOMIZATION LOGIC ---
        // Shuffle the games array and take only the first 6
        games = games.sort(() => 0.5 - Math.random()).slice(0, 6);

        let gameCards = '';

        games.forEach(game => {
            const price = priceMap[game.id] ? `$${priceMap[game.id]}` : 'Free';
            const imageUrl = game.cover?.url
                ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big')
                : 'img/placeholder.png';
            const devName = game.involved_companies?.[0]?.company?.name || 'Unknown Developer';

            // Conversion 0-100 to 0-5 stars
            const starValue = game.total_rating ? Math.round((game.total_rating / 20) * 2) / 2 : 0;
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= starValue) { starsHtml += '<i class="fas fa-star"></i>'; }
                else if (i - 0.5 === starValue) { starsHtml += '<i class="fas fa-star-half-alt"></i>'; }
                else { starsHtml += '<i class="far fa-star"></i>'; }
            }

            gameCards += `
                <div class="pro" data-id="${game.id}">
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
                    <button type="button" class="cart" data-game='${game.id}'>
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = gameCards;
    } catch (error) {
        console.error('Homepage Display Error:', error);
        container.innerHTML = `<p>Error loading featured games.</p>`;
    }
}

export async function loadAndDisplayFeaturedMerchandise() {
    const container = document.getElementById('merchandise-productContainer');

    try {
        const merchandiseRes = await fetch('../merchandise/merchandise.json');
        if (!merchandiseRes.ok) throw new Error("Check JSON files!");

        let merchandise = await merchandiseRes.json();

        // --- RANDOMIZATION LOGIC ---
        // Shuffle the games array and take only the first 6
        merchandise = merchandise.sort(() => 0.5 - Math.random()).slice(0, 3);

        let merchCards = '';

        merchandise.forEach(merch => {
            const imageUrl = merch.imageUrl
                ? merch.imageUrl.replace('.jpg', '_800x.jpg')
                : 'img/placeholder.png';

            const starValue = merch.rating ? Math.round(merch.rating * 2) / 2 : 0;

            // 2. Generate stars based on that rounded value
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= starValue) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else if (i - 0.5 === starValue) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }

            merchCards += `
                <div class="pro" data-id="${merch.id}"> 
                    <img src="${imageUrl}" style="width: 100%; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 20px;">
                    <div class="des">
                        <h6>${merch.companyName}</h6>
                        <h5>${merch.name}</h5>
                        <div class="star">
                    ${starsHtml}
                    <span>(${starValue})</span> <!-- Using the rounded value here -->
                </div>
                        <h4>$${merch.price.toFixed(2)}</h4> 
                        <h4>${merch.associatedGame}</h4> 
                    <!-- Adds the game data attributes to button here -->
                </div>
                    <button type="button" class="cart" data-merch='${merch.id}'>
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = merchCards;
    } catch (error) {
        console.error('Display Error:', error);
        container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}