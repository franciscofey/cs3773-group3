/**
 * Grid view: Add game via cart icon.
 */
function getCurrentUserId() {
    const sessionUser = JSON.parse(localStorage.getItem("gv_session"));
    return sessionUser?.id || "guest_user";
}

function saveItemToLocalCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === product.id && item.type === product.type);

    if (existingItem) {
        existingItem.quantity += product.quantity || 1;
    } else {
        cart.push({
            id: product.id,
            title: product.name || product.title,
            name: product.name || product.title,
            price: Number(product.price) || 0,
            quantity: product.quantity || 1,
            imageurl: product.imageurl || product.image || "",
            type: product.type || product.source || "product"
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

export async function cartButtonGameCircle(event) {
    const btn = event.target.closest('.cart');
    if (!btn) return;
    const card = btn.closest('.pro');
    if (!card) return;

    // Stop if nothing is left
    const stockSpan = card.querySelector('.stock-value');
    let currentStock = parseInt(stockSpan?.innerText) || 0;
    if (currentStock <= 0) {
        alert("Sorry, this item is out of stock!");
        return;
    }

    // Scrape data from the card
    const name = card.querySelector('.game-title')?.innerText || card.querySelector('h5')?.innerText || "Unknown Game";
    const priceText = card.querySelector('.price-tag')?.innerText || card.querySelector('h4')?.innerText || "0";

    const gameData = {
        id: btn.dataset.game,
        name: name.trim(),
        price: parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0,
        quantity: 1
    };

    const userId = getCurrentUserId();
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, orderId, gameData })
        });

        if (response.ok) {
            const result = await response.json();
            saveItemToLocalCart({
                ...gameData,
                type: "physical"
            });

            // Lower stock display
            currentStock -= 1;
            stockSpan.innerText = currentStock === 0 ? "OUT OF STOCK" : currentStock;

            // Link future adds to this order
            if (result.orderId) localStorage.setItem('activeOrderId', result.orderId);
            alert(`Added ${gameData.name} to your order!`);
        }
    } catch (error) {
        console.error("Save failed:", error);
    }
}

export async function cartButtonDigitalCircle(event) {
    const btn = event.target.closest('.cart');
    if (!btn) return;
    const card = btn.closest('.pro');
    if (!card) return;

    // Scrape data from the card
    const name = card.querySelector('.game-title')?.innerText || card.querySelector('h5')?.innerText || "Unknown Game";
    const priceText = card.querySelector('.price-tag')?.innerText || card.querySelector('h4')?.innerText || "0";

    const gameData = {
        id: btn.dataset.game,
        name: name.trim(),
        price: parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0,
        quantity: 1
    };

    const userId = getCurrentUserId();
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, orderId, gameData })
        });

        if (response.ok) {
            const result = await response.json();
            saveItemToLocalCart({
                ...gameData,
                type: "digital"
            });

            // Link future adds to this order
            if (result.orderId) localStorage.setItem('activeOrderId', result.orderId);
            alert(`Added ${gameData.name} to your order!`);
        }
    } catch (error) {
        console.error("Save failed:", error);
    }
}

/**
 * Single page: Add game with specific quantity.
 */
export async function cartButtonGame(event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const stockSpan = document.querySelector('.stock-value');
    let currentStock = parseInt(stockSpan?.innerText) || 0;
    const quantityToBuy = parseInt(document.getElementById('qty')?.value) || 1;

    if (currentStock < quantityToBuy) {
        alert("Not enough stock available!");
        return;
    }

    const gameData = {
        id: btn.dataset.id,
        name: document.querySelector('.game-title')?.innerText.trim() || "Unknown Game",
        price: parseFloat(document.querySelector('.price-tag')?.innerText.replace(/[^0-9.]/g, '')) || 0,
        quantity: quantityToBuy
    };

    const userId = getCurrentUserId();
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, orderId, gameData })
        });

        if (response.ok) {
            const result = await response.json();
            saveItemToLocalCart({
                ...gameData,
                type: "physical"
            });

            // Deduct total quantity from display
            stockSpan.innerText = (currentStock - quantityToBuy) === 0 ? "OUT OF STOCK" : (currentStock - quantityToBuy);

            if (result.orderId) localStorage.setItem('activeOrderId', result.orderId);
            alert(`Added ${gameData.name} to your order!`);
        }
    } catch (error) {
        console.error("Save failed:", error);
    }
}

/**
 * Single page: Add game with specific quantity.
 */
export async function cartButtonDigitalGame(event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const quantityToBuy = parseInt(document.getElementById('qty')?.value) || 1;

    const gameData = {
        id: btn.dataset.id,
        name: document.querySelector('.game-title')?.innerText.trim() || "Unknown Game",
        price: parseFloat(document.querySelector('.price-tag')?.innerText.replace(/[^0-9.]/g, '')) || 0,
        quantity: quantityToBuy
    };

    const userId = getCurrentUserId();
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, orderId, gameData })
        });

        if (response.ok) {
            const result = await response.json();
            saveItemToLocalCart({
                ...gameData,
                type: "digital"
            });

            if (result.orderId) localStorage.setItem('activeOrderId', result.orderId);
            alert(`Added ${gameData.name} to your order!`);
        }
    } catch (error) {
        console.error("Save failed:", error);
    }
}

/**
 * Grid view: Add merchandise via cart icon.
 */
export async function cartButtonMerchCircle(event) {
    const btn = event.target.closest('.cart');
    if (!btn) return;
    const card = btn.closest('.pro');
    if (!card) return;

    const stockSpan = card.querySelector('.stock-value');
    let currentStock = parseInt(stockSpan?.innerText) || 0;
    if (currentStock <= 0) {
        alert("Sorry, this item is out of stock!");
        return;
    }

    const merchData = {
        id: btn.dataset.merch,
        name: card.querySelector('h5')?.innerText || "Unknown Merch",
        price: parseFloat(card.querySelector('h4')?.innerText.replace(/[^0-9.]/g, '')) || 0,
        quantity: 1
    };

    const userId = getCurrentUserId();
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, orderId, gameData: merchData })
        });

        if (response.ok) {
            const result = await response.json();
            saveItemToLocalCart({
                    ...merchData,
                    type: "merch"
                });

            currentStock -= 1;
            stockSpan.innerText = currentStock === 0 ? "OUT OF STOCK" : currentStock;

            if (result.orderId) localStorage.setItem('activeOrderId', result.orderId);
            alert(`Added ${merchData.name} to your order!`);
        }
    } catch (error) {
        console.error("Save failed:", error);
    }
}

/**
 * Single page: Add merchandise with quantity.
 */
export async function cartButtonMerch(event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const stockSpan = document.querySelector('.stock-value');
    let currentStock = parseInt(stockSpan?.innerText) || 0;
    const quantityToBuy = parseInt(document.getElementById('qty')?.value) || 1;

    if (currentStock < quantityToBuy) {
        alert("Not enough stock available!");
        return;
    }

    const merchData = {
        id: btn.dataset.merch,
        name: document.querySelector('.merch-title').innerText,
        price: parseFloat(document.querySelector('.price-tag').innerText.replace(/[^0-9.]/g, '')),
        quantity: quantityToBuy
    };

    const userId = getCurrentUserId();
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, orderId, gameData: merchData })
        });

        if (response.ok) {
            const result = await response.json();
            saveItemToLocalCart({
                ...merchData,
                type: "merch"
            });


            stockSpan.innerText = (currentStock - quantityToBuy) === 0 ? "OUT OF STOCK" : (currentStock - quantityToBuy);

            // Persist order session
            localStorage.setItem('activeOrderId', result.orderId);
            alert("Added to your order!");
        }
    } catch (error) {
        console.error("Save failed:", error);
    }
}
