const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
let windowNumbers = [];

const VALID_IDS = ["p", "f", "e", "r"];
const TEST_SERVER_API = "http://20.244.56.144/evaluation-service"; 

const fetchWithTimeout = async (url, timeout = 500) => {
  try {
    const source = axios.CancelToken.source();
    const id = setTimeout(() => source.cancel(), timeout);

    const response = await axios.get(url, { cancelToken: source.token });
    clearTimeout(id);
    return response.data.numbers || [];
  } catch (err) {
    return [];
  }
};

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  if (!VALID_IDS.includes(numberid)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const url = `${TEST_SERVER_API}/${numberid}`;
  const oldNumbers = [...windowNumbers];

  const newNumbers = await fetchWithTimeout(url);

  newNumbers.forEach(num => {
    if (!windowNumbers.includes(num)) {
      windowNumbers.push(num);
      if (windowNumbers.length > WINDOW_SIZE) {
        windowNumbers.shift();
      }
    }
  });

  const average =
    windowNumbers.reduce((acc, val) => acc + val, 0) /
    (windowNumbers.length || 1);

  res.json({
    windowPrevState: oldNumbers,
    windowCurrState: windowNumbers,
    avg: parseFloat(average.toFixed(2)),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
