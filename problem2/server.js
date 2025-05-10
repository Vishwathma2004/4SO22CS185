const app = require('./index'); 

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Stock Price Aggregation Service running on port http://localhost:${port}`);
});
