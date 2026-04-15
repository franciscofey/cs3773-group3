/**
 * ShoppingCart.js
 * 
 * Handles user interactions for product cards.
 * 
 * If the user clicks the cart button, the item is added to the shopping cart.
 * 
 * If the user clicks the product card, they are redirected to the product details page (sproduct.html).
 */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
            localStorage.setItem("cart", JSON.stringify(cart));
            FillUICartProducts();
            console.log("Supposedly the item is now visible")
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


document.addEventListener("click", e => {

    const removeButton = e.target.closest(".deleteBtt");

    if (!removeButton) return;

    const row = removeButton.closest("tr");
    const id = Number(row.dataset.id);

    // remove from array
    cart = cart.filter(item => item.id !== id);
    console.log("item was removed");
    console.log("current cart:", cart);
    // remove from UI
    row.remove();
    FillUICartProducts();
    // update storage
    localStorage.setItem("cart", JSON.stringify(cart));
});


function FillUICartProducts() {
     const UICartProducts = document.getElementById("cart-products");
     const UICartTotal = document.getElementById("subtotal");
    if (!UICartProducts && !UICartTotal) return;


    UICartProducts.innerHTML = ""; // 🔥 clear old rows


    cart.forEach(item => {

        const rowContainer = document.createElement('tr');

        rowContainer.dataset.id = item.id;

        const subtotal = calculateSubTotal(item.price);

        rowContainer.innerHTML = `
            <td><button class="deleteBtt fa-solid fa-xmark"></button></td>
            <td><img src="img/featured.png" alt=""></td>
            <td>${item.title}</td>
            <td>$${item.price}</td>
            <td><input type="number" value="1"></td>
            <td>$${subtotal}</td>
        `;

        UICartProducts.append(rowContainer);
    });

    let cartT = 0
    let cartSubT = 0;
    cart.forEach(item =>{
        cartT += item.price;
    })
    cartSubT = Number(cartT.toFixed(2));
    cartT = calculateSubTotal(cartT);


    UICartTotal.innerHTML = "";
    UICartTotal.innerHTML = `
        
     <h3>Cart Total</h3>
            <table>
                <tr>
                    <td>Cart Subtotal</td>
                    <td>$${cartSubT}</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td>Free</td>
                </tr>
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>$${cartT}</strong></td>
                </tr>
            </table>
            <button class="normal">Proceed to checkout</button>

    `;

}


function calculateSubTotal(price){
   return Number(((price*0.0825) + price).toFixed(2));
}

if (window.location.pathname.includes("cart.html")) {
    FillUICartProducts();
}