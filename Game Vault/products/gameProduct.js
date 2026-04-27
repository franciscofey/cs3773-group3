// gameProduct.js
/*export async function loadAndDisplayProduct() {
    console.log("1. Script started");
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');
    console.log("2. Detected ID from URL:", gameId);

    if (!gameId || gameId === "undefined") {
        console.error("Error: No valid ID found in URL");
        return;
    }

    try {
        console.log("3. Attempting to fetch JSON files...");
        // Use absolute paths from the root to avoid folder confusion
        const [gamesRes, pricesRes] = await Promise.all([
            fetch('../games/games.json'),
            fetch('../games/gamePrices.json')
        ]);

        const games = await gamesRes.json();
        const priceMap = await pricesRes.json();
        console.log("4. JSON data loaded. Total games:", games.length);

        // Find the game - convert string ID to Number
        const game = games.find(g => g.id == gameId);
        console.log("5. Found game object:", game);

        if (!game) {
            document.getElementById('product-container').innerHTML = "<h2>Game not found in database</h2>";
            return;
        }
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

        const price = priceMap[game.id] ? `$${priceMap[game.id]}` : 'Free';
        const imageUrl = game.cover?.url ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big') : '../img/placeholder.png';

        console.log("6. Injecting HTML...");
        document.getElementById('product-container').innerHTML = `
            <section id="prodetails" class="section-p1">
                <div class="single-pro-image">
                    <img src="${imageUrl}" width="100%" id="MainImg">
                </div>
                <div class="single-pro-details">
                    <h4>${game.name}</h4>
                    <h2>${price}</h2>
                    <input type="number" value="1">
                    <button class="normal cart" data-id="${game.id}">Add to Cart</button>
                    <h4>${game.summary}</h4>
                    <div class="star">
                        ${starsHtml}
                        <span>(${starValue})</span>
                    </div>
                </div>
            </section>
        `;
        console.log("7. Injection complete!");

    } catch (error) {
        console.error("CRITICAL ERROR:", error);
        document.getElementById('product-container').innerHTML = "<h2>Error loading data. Check console (F12).</h2>";
    }
}*/

export async function loadAndDisplayProduct() {
    const container = document.getElementById('product-container');
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    // 1. Validate ID
    if (!gameId) {
        container.innerHTML = `<div class="error-msg">Error: No valid Game ID found.</div>`;
        return;
    }

    try {
        // 2. Fetch Data
        const [gamesRes, pricesRes] = await Promise.all([
            fetch('../games/games.json'),
            fetch('../games/gamePrices.json')
        ]);

        const games = await gamesRes.json();
        const priceMap = await pricesRes.json();

        // 3. Find Game
        const game = games.find(g => g.id == gameId);

        if (!game) {
            container.innerHTML = `<div class="error-msg"><h2>Game not found in database</h2></div>`;
            return;
        }

        // 4. Prepare Logic (Stars, Price, Image)
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

        // 5. Inject Modern HTML Structure
        container.innerHTML = `
            <section class="product-page-container">
                <!-- Left Side: Visuals -->
                <div class="product-media">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" id="MainImg" alt="${game.name}">
                    </div>
                </div>

                <!-- Right Side: Product Details -->
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
                            <i class="fas fa-shopping-cart"></i> Add to Cart
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



