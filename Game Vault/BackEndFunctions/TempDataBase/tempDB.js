console.log("TempDB running!!!")

/**
 * 
 * tempDB js
 * 
 * Functions:
 * fill Products - fetches data from Json files and stores it in 
 * corresponding arrays (Reason: we load JSON once and store it in memory arrays
 * so we avoid going back and forth fetching data)
 * 
 * ShowFeaturedProducts - displays only a portion of the data inside
 * featuredProducts array, if the current page is the home page it'll display
 * physical games dynamically by creating cards for each item.
 * 
 * ShowMerchandiseProducts - displays only a portion of the data inside
 * merchandiseProducts array, if the current page is the home page or merchandise page
 * it'll display merchandise products dynamically by creating cards for each item.
 * 
 * ShowDigitalProducts - display only a portion of the data inside 
 * digitalProducts array, if the current page is the digital games page it'll
 * display digital games dynamically by creating cards for each item.
 *
 * ShowPhysicalProducts - display only a portion of the data inside 
 * physicalProducts array, if the current page is the physical games page it'll
 * display physical games dynamically by creating cards for each item.
 * 
 * 
 */



//Arrays containing database data

let featuredProducts = []
let merchandiseProducts = [] // all merchandise database

let digitalProducts = []
let physicalProducts = []

let tempProducts = [] // All games database

let currentSearchTerm = "";
let currentSortValue = "default";

function sortProducts(products, sortValue){
  const sorted = [...products];

  switch (sortValue){
    case "price-low":
      sorted.sort((a,b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a,b) => b.price - a.price);
      break;
    case "rating-high":
      sorted.sort((a,b) => b.rating - a.rating);
      break;
    case "title-az":
      sorted.sort((a,b) => a.title.localeCompare(b.title));
      break;
    case "title-za":
      sorted.sort((a,b) => b.title.localeCompare(a.title));
      break; 
    default:
      break;
  }

  return sorted;
}

function filterProducts(products, searchTerm){
  const term = searchTerm.trim().toLowerCase();

  if (!term) return [...products];

  return products.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(term);
      const companyMatch = product.company?.toLowerCase().includes(term);
      const gameMatch = product.game?.toLowerCase().includes(term);
      const typeMatch = product.type?.toLowerCase().includes(term);

      return titleMatch || companyMatch || gameMatch || typeMatch;
  });
}

function processProducts(products) {
  const filtered = filterProducts(products, currentSearchTerm);
  return sortProducts(filtered, currentSortValue);
}



//Id references to inject HTML - dynamically modify HTML
const containerFeatured = document.getElementById("featured-productContainer")
const containerMerchandise = document.getElementById("merchandise-productContainer")
const containerPhysicalG = document.getElementById("PhysicalGames-productContainer")
const containerDigitalG = document.getElementById("DigitalGames-productContainer")

async function fillProducts(){

//prodR is used to get physical and digital games info for now
//fetches data from json files and assigns it to the corresponding array
  try{
    const prodR = await fetch("BackEndFunctions/TempDataBase/tempProducts.json")
    const data = await prodR.json();

    featuredProducts = data;
    digitalProducts = data;
    physicalProducts = data;

    tempProducts = data;
  }
  catch (err){
      console.log("Failed to load game products", err);
      return
  }
//fetches data from json files and assigns it to the corresponding array
  try{
    const merchR = await fetch("BackEndFunctions/TempDataBase/tempMerchandise.json")
    merchandiseProducts = await merchR.json();
  }
  catch(err){
    console.log("Failed to load merchandise products")
    return
  }

  //Calls all functions
    ShowFeaturedProducts();
    ShowMerchandiseProducts();
    ShowPhysicalProducts();
    ShowDigitalProducts();
    setupSortAndSearch();
}

function ShowFeaturedProducts(){
  if (!containerFeatured) return; 
    
  //Inserts HTML script inside tag container with
  // id = "featured-productContainer"
    containerFeatured.innerHTML = "";

    featuredProducts.slice(0, 20).forEach(product => {
    const card = document.createElement('div')

    card.classList.add("pro");

    card.innerHTML = `
    
          <img src="img/featured.png" alt=""> <!-- alt is text shown if image fails to load -->
      <div class="des">
        <span>${product.company}</span>
        <h5>${product.title}</h5>

        <div class="star">
          ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
        </div>
    

        <div class="cartbutton-bottom-row">
        <h4>$${product.price}</h4>

        <button class="cart" data-id="${product.id}" data-type="game">
            <i class="fa-solid fa-cart-shopping"></i>
        </button>
        </div>
        </div>
        </div>
    `
   // Add product card to DOM container
    containerFeatured.appendChild(card)
    })
}

function ShowMerchandiseProducts(){
    if (!containerMerchandise) return; 
    
    containerMerchandise.innerHTML = "";

    const processedProducts = proccesProducts(merchandiseProducts);

    processedProducts.slice(0, 20).forEach(product => {
    const card = document.createElement('div');

    card.classList.add("pro");

    card.innerHTML = `
    
          <img src="img/featured.png" alt=""> <!-- alt is text shown if image fails to load -->
      <div class="des">
        <span>company</span>
        <h5>${product.title}</h5>

        <div class="star">
          ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
        </div>
    

        <div class="cartbutton-bottom-row">
        <h4>$${product.price}</h4>

        <button class="cart" data-id="${product.id}" data-type="merch">
            <i class="fa-solid fa-cart-shopping"></i>
        </button>
        </div>
        </div>
        </div>
    `

    containerMerchandise.appendChild(card)
    })
}

function ShowDigitalProducts(){
    if (!containerDigitalG) return; 

   containerDigitalG.innerHTML = "";

    const processedProducts = processProducts(digitalProducts);

    processedProducts.slice(0, 20).forEach(product => {
    const card = document.createElement('div')

    card.classList.add("pro");

    card.innerHTML = `
    
          <img src="img/featured.png" alt=""> <!-- alt is text shown if image fails to load -->
      <div class="des">
        <span>company</span>
        <h5>${product.title}</h5>

        <div class="star">
          ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
        </div>
    

        <div class="cartbutton-bottom-row">
        <h4>$${product.price}</h4>

        <button class="cart" data-id="${product.id}" data-type="game">
            <i class="fa-solid fa-cart-shopping"></i>
        </button>
        </div>
        </div>
        </div>
    `

   containerDigitalG.appendChild(card)
    })
}

function ShowPhysicalProducts(){
if (!containerPhysicalG) return; 

    console.log("Creating Physical Products..")

   containerPhysicalG.innerHTML = "";

   const processedProducts = processProducts(physicalProducts);

    processedProducts.slice(0, 20).forEach(product => {
    const card = document.createElement('div')

    card.classList.add("pro");

    card.innerHTML = `
    
          <img src="img/featured.png" alt=""> <!-- alt is text shown if image fails to load -->
      <div class="des">
        <span>company</span>
        <h5>${product.title}</h5>

        <div class="star">
          ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
        </div>
    

        <div class="cartbutton-bottom-row">
        <h4>$${product.price}</h4>

        <button class="cart" data-id="${product.id}" data-type="game">
            <i class="fa-solid fa-cart-shopping"></i>
        </button>
        </div>
        </div>
        </div>

    `

   containerPhysicalG.appendChild(card)
    })
}

function setupSortAndSearch(){
  const sortSelect = document.getElementById("sort-by");
  const searchInput = document.getElementById("query");
  const searchForm = document.getElementById("form");

  if (searchForm) {
    searchForm.addEventListener("submit", e => e.preventDefault());
  }
  if(sortSelect){
    sortSelect.addEventListener("change", e =>{
      currentSortValue = e.target.value;
      rerenderCurrentPage();
    });
  }

  if(searchInput){
    searchInput.addEventListener("input", e=>{
      currentSearchTerm = e.target.value;
      rerenderCurrentPage();
    }
    );
  }
  
}

function rerenderCurrentPage() {
  if (containerPhysicalG) {
    ShowPhysicalProducts();
  }

  if (containerDigitalG) {
    ShowDigitalProducts();
  }

  if (containerMerchandise) {
    ShowMerchandiseProducts();
  }

  if (containerFeatured) {
    ShowFeaturedProducts();
  }
}

// calls main function to run methods
fillProducts();
