const express = require("express");
const axios = require("axios");
const app = express();
const port = 9876; // Or any other port

// Window size for storing numbers
const WINDOW_SIZE = 10;
let numberWindow = [];

// Function to fetch numbers from the test server API
const fetchNumbers = async (type) => {
  try {
    let url = "";
    if (type === "p") {
      url = "http://20.244.56.144/evaluation-service/primes";
    } else if (type === "f") {
      url = "http://20.244.56.144/evaluation-service/fibo";
    } else if (type === "e") {
      url = "http://20.244.56.144/evaluation-service/even";
    } else if (type === "r") {
      url = "http://20.244.56.144/evaluation-service/rand";
    }
    const response = await axios.get(url);
    return response.data.numbers;
  } catch (error) {
    console.error("Error fetching numbers:", error);
    return [];
  }
};

// Endpoint to handle number requests
app.get("/numbers/:numberid", async (req, res) => {
  const numberId = req.params.numberid;

  // Fetch numbers based on the number ID (prime, fibonacci, even, random)
  const newNumbers = await fetchNumbers(numberId);

  // Filter out duplicates and new numbers to maintain unique numbers
  newNumbers.forEach((number) => {
    if (!numberWindow.includes(number)) {
      if (numberWindow.length >= WINDOW_SIZE) {
        numberWindow.shift(); // Remove the oldest number
      }
      numberWindow.push(number); // Add the new number
    }
  });

  // Calculate the average of the numbers
  const avg = numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length;

  // Response body
  res.json({
    windowPrevState: numberWindow.length > 0 ? numberWindow : [],
    windowCurrState: numberWindow,
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Average Calculator Microservice running on http://localhost:${port}`);
});
