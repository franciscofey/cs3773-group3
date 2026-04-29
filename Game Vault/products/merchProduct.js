export async function loadAndDisplayProduct() {
    const container = document.getElementById('product-container');
    const params = new URLSearchParams(window.location.search);
    const merchId = params.get('id');

    // Make sure there is an ID in the URL to look up
    if (!merchId) {
        container.innerHTML = `<div class="error-msg">Error: No valid Merch ID found.</div>`;
        return;
    }

    try {
        const merchandiseRes = await fetch('../merchandise/merchandise.json');
        if (!merchandiseRes.ok) throw new Error("Could not load merchandise data.");

        const merchandise = await merchandiseRes.json();
        const merch = merchandise.find(m => m.id == merchId);

        // Stop if the item isn't in the JSON file
        if (!merch) {
            container.innerHTML = `<div class="error-msg"><h2>Merch not found in database</h2></div>`;
            return;
        }

        const stockDisplay = (merch.quantity == 0) ? "OUT OF STOCK" : merch.quantity;

        // Round rating to the nearest half-star
        const rating = merch.rating || 0;
        const starValue = merch.rating ? Math.round(merch.rating * 2) / 2 : 0;

        // Map numeric rating to FontAwesome star icons
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

        const imageUrl = merch.imageUrl || 'img/placeholder.png';

        // Inject the full detail view into the product container
        container.innerHTML = `
    <section class="product-page-container">
        <div class="product-media">
            <div class="image-wrapper">
                <img src="${imageUrl}" id="MainImg" alt="${merch.name}">
            </div>
        </div>

        <div class="product-details">
            <nav class="breadcrumb">Store / Merchandise / Catalog</nav>
            <h1 class="merch-title">${merch.name}</h1>
            
            <div class="rating-bar">
                <span class="stars">${starsHtml}</span>
                <span class="score-label">${rating} / 5.0</span>
            </div>

            <div class="price-tag">$${merch.price.toFixed(2)}</div>

            <div class="stock-container">
                <span class="stock-label">STOCK:</span>
                <span class="stock-value">${stockDisplay}</span>
            </div>

            <div class="purchase-zone">
                <div class="qty-wrapper">
                    <label for="qty">Quantity</label>
                    <input type="number" id="qty" value="1" min="1" ${merch.quantity == 0 ? 'disabled' : ''}>
                </div>
                <!-- Button disables itself if inventory hits zero -->
                <button type="button" class="cart add-to-cart-btn" data-merch='${merch.id}' 
                    ${merch.quantity == 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${merch.quantity == 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
            
            <div class="meta-info">
                <span><i class="fas fa-truck"></i> Worldwide Shipping</span>
                <span><i class="fas fa-shield-alt"></i> Secure Transaction</span>
            </div>
        </div>
    </section>
`;

    } catch (error) {
        console.error("CRITICAL ERROR:", error);
        container.innerHTML = `<div class="error-msg"><h2>Error loading data.</h2></div>`;
    }
}
