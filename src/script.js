document.addEventListener("DOMContentLoaded", function () {
	const exchangeSelect = document.getElementById("exchange");
	const tabs = document.querySelectorAll(".tabs button");
	const stockTableBody = document
		.getElementById("stockTable")
		.querySelector("tbody");
	let currentExchange = 0;
	let currentList = 0;

	let previousData = new Map();

	function fetchData() {
		fetch(
			`https://livefeed3.chartnexus.com/Dummy/quotes?market_id=${currentExchange}&list=${currentList}`
		)
			.then((response) => response.json())
			.then((data) => updateTable(data))
			.catch((error) => console.error("Error fetching data:", error));
	}

	function updateTable(data) {
		stockTableBody.innerHTML = "";
		// console.clear();
		data.forEach((stock, i) => {
			const row = document.createElement("tr");

			const stockDifference = stock.last - stock.previous;
			const stockDifferencePercentage = (
				(100 * stockDifference) /
				stock.previous
			).toFixed(2);

			const statusStockClass = stockDifference >= 0 ? "positive" : "negative";

			const sign = statusStockClass == "positive" ? "+" : "";

			const previousStock = previousData.get(stock.stockcode) ?? {};
			let previousStockDifference = previousStock.last - previousStock.previous;
			if (isNaN(previousStockDifference)) previousStockDifference = 0;

			// console.log({
			// 	previousStock,
			// 	stock,
			// });

			const previousStockDifferencePercentage = (
				(100 * previousStockDifference) /
				(stock.previous ?? 0)
			).toFixed(2);

			row.innerHTML = `
                <td class="${
									stock.name != previousStock.name ||
									stock.stockcode != previousStock.stockcode
										? "animate-flash"
										: ""
								} dark:text-white">
                    <span class="font-bold">${stock.name}</span>
                    <br>
                    ${stock.stockcode}
                </td>
                <td class="${statusStockClass}  text-right ${
				stock.last != previousStock.last || stock.volume != previousStock.volume
					? "animate-flash"
					: ""
			}">
                    ${formatNumberTo2DecimalPlaces(stock.last)}
                    <br>
                    ${formatBigNumber(stock.volume)}
                </td>

                <td class="${statusStockClass}  text-right ${
				stockDifference != previousStockDifference ||
				stockDifferencePercentage != previousStockDifferencePercentage
					? "animate-flash"
					: ""
			}">
                    ${sign}${formatNumberTo2DecimalPlaces(stockDifference)}
                    <br>
                    ${sign}${stockDifferencePercentage}%
                </td>

                <td class="text-right dark:text-white ${
									stock.buy_price != previousStock.buy_price ||
									stock.buy_volume != previousStock.buy_volume
										? "animate-flash"
										: ""
								}">
                    ${formatNumberTo2DecimalPlaces(stock.buy_price)}
                    <br>
                    ${formatBigNumber(stock.buy_volume)}
                </td>
                <td class="text-right dark:text-white ${
									stock.sell_price != previousStock.sell_price ||
									stock.sell_volume != previousStock.sell_volume
										? "animate-flash"
										: ""
								}">
                    ${formatNumberTo2DecimalPlaces(stock.sell_price)}
                    <br>    
                    ${formatBigNumber(stock.sell_volume)}
                </td>
                
            `;
			stockTableBody.appendChild(row);
		});

		previousData = mapDataWithStockCode(data);
	}

	function mapDataWithStockCode(data) {
		let newData = new Map();
		data.forEach((stock) => {
			newData.set(stock.stockcode, stock);
		});
		return newData;
	}

	function formatBigNumber(number) {
		return Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(number);
	}

	function formatNumberTo2DecimalPlaces(number) {
		return number.toFixed(2);
	}

	function changeExchange(value) {
		currentExchange = value;
		previousData.clear();
		fetchData();
	}

	window.changeExchange = changeExchange;

	tabs.forEach((tab) => {
		tab.addEventListener("click", function () {
			const nextList = this.getAttribute("data-list");
			if (nextList != currentList) {
				previousData.clear();
			}
			currentList = nextList;
			fetchData();
		});
	});

	fetchData();
	setInterval(fetchData, 5000);
});
