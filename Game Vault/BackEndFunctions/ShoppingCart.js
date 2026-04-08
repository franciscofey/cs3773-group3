/**
 * ShoppingCart.js
 * 
 * Handles user interactions for product cards.
 * 
 * If the user clicks the cart button, the item is added to the shopping cart.
 * 
 * If the user clicks the product card, they are redirected to the product details page (sproduct.html).
 */

console.log("ShoppingCart.js is running");

document.addEventListener("click", e => {

    // CART CLICK
    // Find the cart button even if a child element (like the icon) is clicked
    const cartbutton = e.target.closest(".cart");
    if (cartbutton) { 

        e.stopPropagation();
        
        const id = Number(cartbutton.dataset.id);
        const type = cartbutton.dataset.type;

        let product;

        if (type === "merch") {
            product = merchandiseProducts.find(p => p.id === id);
        } else {
            product = tempProducts.find(p => p.id === id);
        }

        if (product) {
            cart.push(product);
            console.log("Cart:", cart);
        }
        
        return;
    }

    // CARD CLICK
    // Find the card element even if a child element (like a button or text) is clicked
    const card = e.target.closest(".pro");
    if (!card) return;

    window.location.href = "sproduct.html";
});