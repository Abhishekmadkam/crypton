const urlParams = new URLSearchParams(window.location.search);
const tokenId = urlParams.get('id');



const detailsContainer = document.getElementById('details-container')
fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}`)
.then(response => response.json())
.then(data => {
    detailsContainer.innerHTML = `
      <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
      <p>Market Cap: $${data.market_data.market_cap.usd.toLocaleString()}</p>
      <p>24h Volume: $${data.market_data.total_volume.usd.toLocaleString()}</p>
      <p>Website: <a href="${data.links.homepage[0]}" target="_blank">${data.links.homepage[0]}</a></p>
    `;


    fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=7`)
        .then(res  => res.json())
        .then(chartData => {
            const prices  = chartData.prices.map(p => p[1]);
            const labels = chartData.prices.map(p => new Date(p[0]).toLocaleDateString());

            new Chart(document.getElementById('priceChart'),{
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'prices (usd)',
                        data: prices,
                        borderColor: '#0f0',
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        fill: true,
                        tension: 0.2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x:{ticks :{color: '#fff'}},
                        y:{ticks :{color: '#fff'}}
                    },
                    plugins: {
                        legend: {labels: {color:'#0f0'}}

                    }
                }
            });
        });
});