document.addEventListener('DOMContentLoaded', function() {
    const exchangeSelect = document.getElementById('exchange');
    const tabs = document.querySelectorAll('.tabs button');
    const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const lightThemeBtn = document.getElementById('light-theme');
    const darkThemeBtn = document.getElementById('dark-theme');
    let currentExchange = 0;
    let currentList = 0;

    function fetchData() {
        fetch(`https://livefeed3.chartnexus.com/Dummy/quotes?market_id=${currentExchange}&list=${currentList}`)
            .then(response => response.json())
            .then(data => updateTable(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateTable(data) {
        stockTableBody.innerHTML = '';
        data.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stock.stockcode}</td>
                <td>${stock.name}</td>
                <td>${stock.last}</td>
                <td>${stock.volume}</td>
                <td>${stock.buy_price}</td>
                <td>${stock.buy_volume}</td>
                <td>${stock.sell_price}</td>
                <td>${stock.sell_volume}</td>
                <td class="${stock.last - stock.previous >= 0 ? 'positive' : 'negative'}">${stock.last - stock.previous}</td>
                <td class="${stock.last - stock.previous >= 0 ? 'positive' : 'negative'}">${(100 * (stock.last - stock.previous) / stock.previous).toFixed(2)}%</td>
            `;
            stockTableBody.appendChild(row);
        });
    }

    exchangeSelect.addEventListener('change', function() {
        currentExchange = this.value;
        fetchData();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            currentList = this.getAttribute('data-list');
            fetchData();
        });
    });

    lightThemeBtn.addEventListener('click', function() {
        document.body.className = 'light-theme';
    });

    darkThemeBtn.addEventListener('click', function() {
        document.body.className = 'dark-theme';
    });

    fetchData();
    setInterval(fetchData, 5000);
});
