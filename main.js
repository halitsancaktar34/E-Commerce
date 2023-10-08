// HTML'den gelenler
const categoryList = document.querySelector('.categories')
const productList = document.querySelector(".products")
const modal = document.querySelector(".modal-wrapper")
const basketBtn = document.querySelector("#basket-btn")
const closeBtn = document.querySelector("#close-btn")
const basketList = document.querySelector("#list")
const totalInfo = document.querySelector("#total")

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();
})

const baseUrl = 'https://fakestoreapi.com'

function fetchCategories() {
    fetch(`${baseUrl}/products/categories`)
        .then((response) => response.json())
        .then(renderCategories)
        .catch((err) => alert("Kategorileri alırken hata oluştu."))
}
function renderCategories(categories) {
    categories.forEach((category) => {
        const categoryDiv = document.createElement("div")
        categoryDiv.classList.add("category")
        const randomNum = Math.round(Math.random() * 1000)
        categoryDiv.innerHTML = `<img src="https://picsum.photos/300/300?r=${randomNum}" />
        <h2>${category}</h2>`
        categoryList.appendChild(categoryDiv)
    })
}

let data;
async function fetchProducts() {
    try {
        const response = await fetch(`${baseUrl}/products`)
        data = await response.json()
        renderProducts(data)
    } catch (err) {
        alert("Ürünleri alırken hata oluştu")
    }
}

function renderProducts(products) {
    const cardsHTML = products.map(
        (product) => ` <div class="card">
        <div class="img-wrapper">
        <img src="${product.image}"></div>
        <h4>${product.title}</h4>
        <h4>${product.category}</h4>
        <div class="info">
            <span>${product.price}$</span>
            <button onclick="addToBasket(${product.id})">Sepete Ekle</button>
        </div>
        <!-- Card -->
    </div>`
    ).join("")
    productList.innerHTML = cardsHTML
}

// Sepet İşlemleri

let basket = []
let total = 0
basketBtn.addEventListener("click", () => {
    modal.classList.add("active")
    renderBasket()
})

document.addEventListener("click", (e) => {
    if (
        e.target.classList.contains("modal-wrapper") || e.target.id === "close-btn"
    ) {
        modal.classList.remove("active")
    }
})

function addToBasket(id) {
    const product = data.find((i) => i.id === id)
    const found = basket.find((i) => i.id == id)
    if (found) {
        found.amount++
    } else {
        basket.push({ ...product, amount: 1 })
    }
}

function renderBasket() {
    basketList.innerHTML = basket.map((item) => `
    <div class="item">
       <img src="${item.image}" />
       <h3 class="title">${item.title.slice(0, 20) + '...'}</h3>
       <h4 class="price">$${item.price}</h4>
       <p>Miktar: ${item.amount}</p>
       <img onclick="handleDelete(${item.id
        })" id="delete-img" src="/images/e-trash.png" />
     </div>
`
    ).join("")
    calculateTotal()
}

function calculateTotal() {
    const total = basket.reduce(
        (sum, i) => sum + i.price * i.amount, 0
    )
    const amount = basket.reduce((sum, i) => sum + i.amount, 0)
    totalInfo.innerHTML = `  <span id="count">${amount} ürün</span>
    toplam:
    <span id="price">${total.toFixed(2)}</span>$`
}

function handleDelete(deleteId){
    basket = basket.filter((i) => i.id !==deleteId)
    renderBasket()
    calculateTotal()
}