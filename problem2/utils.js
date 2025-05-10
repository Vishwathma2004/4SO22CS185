const axios = require('axios');

async function fetchStockPriceHistory(ticker, minutes) {
  const url = `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`;
  
  try {
    const response = await axios.get(url);
    return response.data.map((item) => ({
      price: item.price,
      lastUpdatedAt: item.lastUpdatedAt,
    }));
  } catch (err) {
    throw new Error(`Error fetching price history for ${ticker}: ${err.message}`);
  }
}

// Calculate the average price from an array of stock prices
function calculateAverage(priceHistory) {
  const sum = priceHistory.reduce((acc, current) => acc + current.price, 0);
  return sum / priceHistory.length;
}

// Calculate the correlation between two sets of stock prices using Pearson's correlation coefficient
function calculateCorrelation(priceHistory1, priceHistory2) {
  if (priceHistory1.length !== priceHistory2.length) {
    throw new Error('Price histories must have the same length for correlation calculation.');
  }

  const mean1 = calculateAverage(priceHistory1);
  const mean2 = calculateAverage(priceHistory2);

  const covariance = priceHistory1.reduce((acc, current, index) => {
    return acc + (current.price - mean1) * (priceHistory2[index].price - mean2);
  }, 0) / (priceHistory1.length - 1);

  const stdDev1 = Math.sqrt(
    priceHistory1.reduce((acc, current) => acc + Math.pow(current.price - mean1, 2), 0) / (priceHistory1.length - 1)
  );
  const stdDev2 = Math.sqrt(
    priceHistory2.reduce((acc, current) => acc + Math.pow(current.price - mean2, 2), 0) / (priceHistory2.length - 1)
  );

  const correlation = covariance / (stdDev1 * stdDev2);
  return correlation;
}

module.exports = {
  fetchStockPriceHistory,
  calculateAverage,
  calculateCorrelation,
};
