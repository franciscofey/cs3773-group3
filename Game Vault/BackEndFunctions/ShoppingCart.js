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

// display products in cart page
function FillUICartProducts() {
     const UICartProducts = document.getElementById("cart-products");
     const UICartTotal = document.getElementById("subtotal");

    if (!UICartProducts && !UICartTotal) return;


    UICartProducts.innerHTML = ""; // 🔥 clear old rows


    cart.forEach(item => {

        const rowContainer = document.createElement('tr');

        rowContainer.dataset.id = item.id;

        const subT = Number(item.price * item.quantity).toFixed(2)

        rowContainer.innerHTML = `
            <td><button class="deleteBtt fa-solid fa-xmark"></button></td>
            <td><img src="img/featured.png" alt=""></td>
            <td>${item.title}</td>
            <td>$${item.price}</td>
            <td>
            <button class="qty-minus">−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="qty-plus">+</button>
            </td>
            
            <td>$${subT}</td>
        `;

            // <!-- <td><input class="quantity" type="number" value="${item.quantity}"></td> ->
        UICartProducts.append(rowContainer);

    });

    let cartT = 0
    let cartSubT = 0;
    cart.forEach(item =>{
        cartT += item.price*item.quantity;
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
             <button class="checkout-button" class="normal">Proceed to checkout</button>
    `;

    const checkoutButton = document.querySelector(".checkout-button");

    if (cart.length === 0) {
        checkoutButton.classList.add("disabled");
        checkoutButton.disabled = true;
    } else {
        checkoutButton.classList.add("active");
        checkoutButton.disabled = false;
    }
}


function calculateSubTotal(price){
   return Number(((price*0.0825) + price).toFixed(2));
}

//Shopping Cart Icon click
document.addEventListener("click", e => {

    // CART CLICK

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

        if (!product) return;

        // CHECK IF ITEM ALREADY EXISTS IN CART
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
            console.log(existingItem);

        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        FillUICartProducts();

        console.log("Cart updated:", cart);
        return;
    }

    // CARD CLICK
    const card = e.target.closest(".pro");
    if (!card) return;

    window.location.href = "sproduct.html";
});

// Remove button click
document.addEventListener("click", e => {
    const removeButton = e.target.closest(".deleteBtt");
    if (!removeButton) return;

    const row = removeButton.closest("tr");
    const id = Number(row.dataset.id);

    const item = cart.find(i => i.id === id);
    if (!item) return;

    // decrease quantity or remove item completely
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(i => i.id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // re-render UI
    FillUICartProducts();
});

// increase button cart
document.addEventListener("click", e => {

    const plusBtn = e.target.closest(".qty-plus");

    if(!plusBtn) return;

    e.stopPropagation();
    const row = plusBtn.closest("tr");
    const id = Number(row.dataset.id);

    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    FillUICartProducts();

});

// decrease button cart
document.addEventListener("click", e => {

    const minusBtn = e.target.closest(".qty-minus");
    if (!minusBtn) return;

    const row = minusBtn.closest("tr");
    const id = Number(row.dataset.id);

    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (item.quantity > 1) {
        item.quantity -= 1;
    } 

    localStorage.setItem("cart", JSON.stringify(cart));
    FillUICartProducts();
});


// redirect to checkout page
document.addEventListener("click", e => {

    const checkoutButton = e.target.closest(".checkout-button");

    if (!checkoutButton) return;

    e.stopPropagation();

    if (cart.length === 0) {
    console.log("Cart is empty");
    return;
}

    window.location.href = "../checkout.html";
});


if (window.location.pathname.includes("cart.html")) {
    FillUICartProducts();
}

 