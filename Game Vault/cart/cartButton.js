// After the add to cart button is clicked this will store the necessary data to create/update orders
export async function cartButton(event) {
    const btn = event.target.closest('.cart');
    const gameData = JSON.parse(btn.dataset.game);
    const userId = "user_123";

    // NULL if user just created a new order
    const orderId = localStorage.getItem('activeOrderId');

    try {
        const response = await fetch('http://localhost:3000/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, gameData, orderId })
        });

        const result = await response.json();

        if (response.ok) {
            // Saves the new ID so the next add to cart click adds to this same order
            localStorage.setItem('activeOrderId', result.orderId);
            alert("Added to your current order!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}