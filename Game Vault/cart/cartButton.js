export async function cartButtonGameCircle(event) {
    const btn = event.target.closest('.cart');
    if (!btn) return;
    
    const card = btn.closest('.pro');
    if (!card) return;
    
    const name = card.querySelector('.game-title')?.innerText ||
        card.querySelector('h5')?.innerText || "Unknown Game";

    const priceText = card.querySelector('.price-tag')?.innerText ||
        card.querySelector('h4')?.innerText || "0";

    const gameData = {
        id: btn.dataset.game,
        name: name.trim(),
        price: parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0,
        quantity: 1
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
            if (result.orderId) localStorage.setItem('activeOrderId', result.orderId);
            alert(`Added ${gameData.name} to your order!`);
        }
    } catch (error) {
        console.error("Error saving game:", error);
    }
}

export async function cartButtonGame(event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const userId = "user_123";
    const orderId = localStorage.getItem('activeOrderId');
    const quantity = parseInt(document.getElementById('qty')?.value) || 1;

    const gameData = {
        id: btn.dataset.id,
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

export async function cartButtonMerchCircle(event) {
    const btn = event.target.closest('.cart');
    if (!btn) return;

    const card = btn.closest('.pro');
    if (!card) return;

    const userId = "user_123";
    const orderId = localStorage.getItem('activeOrderId');
    
    const merchData = {
        id: btn.dataset.merch,
        name: card.querySelector('h5')?.innerText || "Unknown Merch",
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

export async function cartButtonMerch(event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const userId = "user_123";
    const orderId = localStorage.getItem('activeOrderId');
    const quantity = parseInt(document.getElementById('qty')?.value) || 1;
    
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
            localStorage.setItem('activeOrderId', result.orderId);
            alert("Added to your order!");
        }
    } catch (error) {
        console.error("Error saving merch:", error);
    }
}
