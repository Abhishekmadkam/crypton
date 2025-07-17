let currency = "usd";
let coins = [];
let page = 1;

const tokenListDiv = document.getElementById("token-list");
const searchInput = document.getElementById("search");
const currencySelector = document.getElementById("currency");
const themeToggle = document.getElementById("theme-toggle");
const loadMoreBtn = document.getElementById("load-more");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

currencySelector.addEventListener("change", (e) => {
    currency = e.target.value;
    page = 1;
    coins = [];
    loadCoins(true);
});

searchInput.addEventListener("input", () => {
    const search = searchInput.value.toLowerCase();
    displayCoins(coins.filter(token =>
        token.name.toLowerCase().includes(search) ||
        token.symbol.toLowerCase().includes(search)
    ));
});

loadMoreBtn.addEventListener("click", () => {
    page++;
    loadCoins();
});

function loadCoins(reset = false) {
    if (reset) {
        tokenListDiv.innerHTML = "<p>Loading...</p>";
    }

    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_asc&per_page=50&page=${page}&sparkline=false`)
        .then(res => res.json())
        .then(data => {
            coins = [...coins, ...data];
            displayCoins(coins);
        })
        .catch(err => {
            console.error("API error:", err);
            tokenListDiv.innerHTML = "<p>error : you can see only two coins</p>";
        });
}

function displayCoins(data) {
    tokenListDiv.innerHTML = "";
    data.forEach(token => {
        const card = document.createElement("div");
        card.className = "token-card";
        card.innerHTML = `
            <img src="${token.image}" alt="${token.name}">
            <strong>${token.name} (${token.symbol.toUpperCase()})</strong><br>
            Price: ${currency.toUpperCase()} ${token.current_price.toLocaleString()}<br>
            24h: ${token.price_change_percentage_24h?.toFixed(2)}%<br>
            <a href="details.html?id=${token.id}" target="_blank">Details</a>
        `;
        tokenListDiv.appendChild(card);
    });
}

// Initial load
loadCoins();
