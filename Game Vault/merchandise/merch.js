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

            merchCards += `
                <div class="pro">
                    <img src="${imageUrl}" style="width: 100%; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 20px;">
                    <div class="des">
                        <h6>${merch.companyName}</h6>
                        <h5>${merch.name}</h5>
                        <p>${merch.rating ? merch.rating + '/ 5' : 'N/A'}</p>
                        <h4>$${merch.price.toFixed(2)}</h4> 
                        <h4>${merch.associatedGame}</h4> 
                    </div>
                    <a href="#" class="cart"><i class="fa-solid fa-cart-shopping"></i></a>
                </div>
            `;
        });

        container.innerHTML = merchCards;
    } catch (error) {
        console.error('Display Error:', error);
        container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
