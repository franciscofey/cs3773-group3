/**
 * Handles adding games to the cart json from the game page.
 */
export async function cartButtonGameCircle(event) {
    // Checks if the add to cart button was pressed aka .cart 
    const btn = event.target.closest('.cart');
    if (!btn) return;

    // 1. Finds the specific card container clicked
    const card = btn.closest('.pro');
    if (!card) return;

    // 2. Attempts to find title via '.game-title' or 'h5'
    const name = card.querySelector('.game-title')?.innerText ||
        card.querySelector('h5')?.innerText || "Unknown Game";

    // 2. Attempts to find price via '.price-tag' or 'h4'
    const priceText = card.querySelector('.price-tag')?.innerText ||
        card.querySelector('h4')?.innerText || "0";
    
    const gameData = {
        id: btn.dataset.game, // Grabs the ID from the data-game attribute
        name: name.trim(),
        price: parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0, // Removes $
        quantity: 1 // Default quantity
    };

    const userId = "user_123";
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, orderId, gameData })
        });

        const result = await response.json();

        if (response.ok) {
            // Stores the order ID returned by the server for future items in this session
            if (result.orderId) localStorage.setItem('activeOrderId', result.orderId);
            alert(`Added ${gameData.name} to your order!`);
        }
    } catch (error) {
        console.error("Error saving game:", error);
    }
}

/**
 * Handles adding games to the cart from the single game detail page.
 */
export async function cartButtonGame(event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const userId = "user_123";
    const orderId = localStorage.getItem('activeOrderId');
    // Retrieve quantity from the number field, default is 1
    const quantity = parseInt(document.getElementById('qty')?.value) || 1;

    const gameData = {
        id: btn.dataset.id, // Grabs the ID from data-id attribute
        name: document.querySelector('.game-title')?.innerText.trim() || "Unknown Game",
        price: parseFloat(document.querySelector('.price-tag')?.innerText.replace(/[^0-9.]/g, '')) || 0,
        quantity: quantity
    };

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                orderId,
                gameData: gameData
            })
        });

        const result = await response.json();

        if (response.ok) {
            if (result.orderId) {
                localStorage.setItem('activeOrderId', result.orderId);
            }
            alert(`Added ${gameData.name} to your order!`);
        }
    } catch (error) {
        console.error("Error saving game:", error);
    }
}

/**
 * Handles adding merchandise to the cart from the merch page.
 */
export async function cartButtonMerchCircle(event) {
    const btn = event.target.closest('.cart');
    if (!btn) return;

    const card = btn.closest('.pro');
    if (!card) return;

    const userId = "user_123";
    const orderId = localStorage.getItem('activeOrderId');
    
    const merchData = {
        id: btn.dataset.merch, // Grabs the ID from data-merch attribute
        name: card.querySelector('h5')?.innerText || "Unknown Merch",
        // Grabs the h4 (price)
        price: parseFloat(card.querySelector('h4')?.innerText.replace(/[^0-9.]/g, '')) || 0,
        quantity: 1
    };

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                orderId,
                gameData: merchData
            })
        });

        const result = await response.json();

        if (response.ok) {
            if (result.orderId) {
                localStorage.setItem('activeOrderId', result.orderId);
            }
            alert(`Added ${merchData.name} to your order!`);
        }
    } catch (error) {
        console.error("Error saving merch:", error);
    }
}

/**
 * Handles adding merchandise from a single merchandise detail page.
 */
export async function cartButtonMerch(event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const userId = "user_123";
    const orderId = localStorage.getItem('activeOrderId');
    const quantity = parseInt(document.getElementById('qty')?.value) || 1;

    // 1. Gets the game data
    const merchData = {
        id: btn.dataset.merch,
        name: document.querySelector('.merch-title').innerText,
        price: parseFloat(document.querySelector('.price-tag').innerText.replace('$', '')),
        quantity: quantity
    };

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                orderId,
                gameData: merchData
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Updates json with the current session's order ID
            localStorage.setItem('activeOrderId', result.orderId);
            alert("Added to your order!");
        }
    } catch (error) {
        console.error("Error saving merch:", error);
    }
}
