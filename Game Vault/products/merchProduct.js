export async function loadAndDisplayProduct() {
    const container = document.getElementById('product-container');
    const params = new URLSearchParams(window.location.search);
    const merchId = params.get('id');

    if (!merchId) {
        container.innerHTML = `<div class="error-msg">Error: No valid Merch ID found.</div>`;
        return;
    }

    try {
        const merchandiseRes = await fetch('../merchandise/merchandise.json');
        if (!merchandiseRes.ok) throw new Error("Could not load merchandise data.");

        const merchandise = await merchandiseRes.json();
        const merch = merchandise.find(m => m.id == merchId);

        if (!merch) {
            container.innerHTML = `<div class="error-msg"><h2>Merch not found in database</h2></div>`;
            return;
        }

        // --- Fix 1: Generate starsHtml ---
        const rating = merch.rating || 0;
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

        const imageUrl = merch.imageUrl || 'img/placeholder.png';

// Then update your innerHTML to use the wrapper:
        container.innerHTML = `
            <section class="product-page-container">
                <div class="product-media">
                    <div class="image-wrapper"> <!-- Added this wrapper -->
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

                    <div class="purchase-zone">
                        <div class="qty-wrapper">
                            <label for="qty">Quantity</label>
                            <input type="number" id="qty" value="1" min="1">
                        </div>
                        <!-- Fix 2: Ensure class matches your event listener (cart) and pass data -->
                        <button type="button" class="cart add-to-cart-btn" data-merch='${merch.id}'>
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
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
        container.innerHTML = `<div class="error-msg"><h2>Error loading data.</h2></div>`;
    }
}
