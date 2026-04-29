export async function loadAndDisplayProduct() {
    const container = document.getElementById('product-container');
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    // Make sure an ID exists in the URL
    if (!gameId) {
        container.innerHTML = `<div class="error-msg">Error: No valid Game ID found.</div>`;
        return;
    }

    try {
        // Pull all necessary data from the JSON files
        const [gamesRes, pricesRes, quantityRes] = await Promise.all([
            fetch('../games/games.json'),
            fetch('../games/gamePrices.json'),
        ]);

        const games = await gamesRes.json();
        const priceMap = await pricesRes.json();

        // Match the ID from the URL to a specific game object
        const game = games.find(g => g.id == gameId);

        if (!game) {
            container.innerHTML = `<div class="error-msg"><h2>Game not found in database</h2></div>`;
            return;
        }

        // Convert the 0-100 rating to a 5-star scale
        const starValue = game.total_rating ? Math.round((game.total_rating / 20) * 2) / 2 : 0;
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= starValue) {
                starsHtml += `<i class="fas fa-star"></i>`;
            } else if (i - 0.5 === starValue) {
                starsHtml += `<i class="fas fa-star-half-alt"></i>`;
            } else {
                starsHtml += `<i class="far fa-star"></i>`;
            }
        }

        const price = priceMap[game.id] ? `$${priceMap[game.id]}` : 'Free';
        const imageUrl = game.cover?.url
            ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
            : '../img/placeholder.png';

        // Inject the full product detail layout
        container.innerHTML = `
            <section class="product-page-container">
                <div class="product-media">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" id="MainImg" alt="${game.name}">
                    </div>
                </div>

                <div class="product-details">
                    <nav class="breadcrumb">Store / Games / Catalog</nav>
                    <h1 class="game-title">${game.name}</h1>
                    <div class="rating-bar">
                        <span class="stars">${starsHtml}</span>
                        <span class="score-label">${starValue} / 5.0</span>
                    </div>
                    <div class="price-tag">${price}</div>
                    <div class="purchase-zone">
                        <div class="qty-wrapper">
                            <label for="qty">Quantity</label>
                            <input type="number" id="qty" value="1" min="1">
                        </div>
                        <button type="button" class="cart add-to-cart-btn" data-id="${game.id}">
                            <i class="fas fa-shopping-cart"></i> 
                        </button>
                    </div>

                    <div class="description-box">
                        <h3>About this game</h3>
                        <p>${game.summary || 'No description available for this title.'}</p>
                    </div>
                    
                    <div class="meta-info">
                        <span><i class="fas fa-check-circle"></i> Digital Download</span>
                        <span><i class="fas fa-shield-alt"></i> Secure Transaction</span>
                    </div>
                </div>
            </section>
        `;
        
    } catch (error) {
        console.error("CRITICAL ERROR:", error);
        container.innerHTML = `<div class="error-msg"><h2>Error loading data. Check console (F12).</h2></div>`;
    }
}
