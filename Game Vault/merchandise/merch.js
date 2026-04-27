//File to display the merch info to the website (Let me know if you have questions -Lauren)
export async function loadAndDisplayMerchandise() {
    const container = document.getElementById('merch-container');
    const sortSelect = document.getElementById('sort-by'); // Make sure this ID exists in your HTML

    try {
        const merchandiseRes = await fetch('merchandise.json');
        if (!merchandiseRes.ok) throw new Error("Check JSON files!");

        let merchandise = await merchandiseRes.json();

        // --- Sorting Logic ---
        const sortValue = sortSelect ? sortSelect.value : 'default';

        if (sortValue === 'price-low') {
            merchandise.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-high') {
            merchandise.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'title-az') {
            merchandise.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'title-za') {
            merchandise.sort((a, b) => b.name.localeCompare(a.name));
        }

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
