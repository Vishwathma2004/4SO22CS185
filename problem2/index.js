const express = require('express');
const axios = require('axios');
const { calculateAverage, calculateCorrelation, fetchStockPriceHistory } = require('./utils');

const app = express();
const port = 3000;

// Define route for average stock price in the last "m" minutes
app.get('/stocks/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const minutes = parseInt(req.query.minutes, 10);
  const aggregation = req.query.aggregation;

  if (aggregation === 'average') {
    try {
      const priceHistory = await fetchStockPriceHistory(ticker, minutes);
      const averagePrice = calculateAverage(priceHistory);
      
      res.json({
        averageStockPrice: averagePrice,
        priceHistory: priceHistory,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid aggregation type' });
  }
});

// Define route for stock price correlation between two stocks
app.get('/stockcorrelation', async (req, res) => {
  const ticker1 = req.query.ticker1;
  const ticker2 = req.query.ticker2;
  const minutes = parseInt(req.query.minutes, 10);

  if (!ticker1 || !ticker2 || ticker1 === ticker2) {
    return res.status(400).json({ error: 'Both tickers must be provided and different.' });
  }

  try {
    const [priceHistory1, priceHistory2] = await Promise.all([
      fetchStockPriceHistory(ticker1, minutes),
      fetchStockPriceHistory(ticker2, minutes),
    ]);

    const correlation = calculateCorrelation(priceHistory1, priceHistory2);

    res.json({
      correlation: correlation,
      stocks: {
        [ticker1]: {
          averagePrice: calculateAverage(priceHistory1),
          priceHistory: priceHistory1,
        },
        [ticker2]: {
          averagePrice: calculateAverage(priceHistory2),
          priceHistory: priceHistory2,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the app object so it can be used in another file
module.exports = app;
