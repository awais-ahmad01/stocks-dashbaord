// import { symbols } from "../symbols";

const StocksHistory = require("../models/stocksHistory");

const getStocksData = async (req, res) => {
  try {

   const symbols = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc. (Google)" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." }
];


   
    // const symbol = req.query.symbol || 'IBM';
    const stockData = [];
    for (let sym of symbols.slice(0, 1)) {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${sym.symbol}&interval=1min&apikey=${process.env.API_SECRET}`;

      const response = await fetch(url);

      const data = await response.json();
      console.log("data:", data);

      const timeSeries = data["Time Series (1min)"];

      //   console.log("timeseries:", timeSeries);

      const latestTimeStamp = timeSeries ? Object.keys(timeSeries)[0] : null;

      //   console.log("latest:", latestTimeStamp);

      const latestData = timeSeries[latestTimeStamp];

      //   console.log(latestData);

      const dateInNY = new Date(`${latestTimeStamp} UTC-05:00`);
      const localTime = dateInNY.toLocaleString("en-GB", {
        timeZone: "Asia/Karachi",
      });

      const stock = {
        symbol: sym.symbol,
        name: sym.name,
        open: parseFloat(latestData["1. open"]),
        high: parseFloat(latestData["2. high"]),
        low: parseFloat(latestData["3. low"]),
        close: parseFloat(latestData["4. close"]),
        change:
          parseFloat(latestData["4. close"]) -
          parseFloat(latestData["1. open"]),
        changePercent:
          ((parseFloat(latestData["4. close"]) -
            parseFloat(latestData["1. open"])) /
            parseFloat(latestData["1. open"])) *
          100,
        volume: parseFloat(latestData["5. volume"]),
        timeStamp: localTime,
      };

      console.log("stock:", stock);

      stockData.push(stock);
    }

    res.status(200).json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
};





const getOrUpdateStockHistoryData = async (req, res) => {
  const symbol = req.query.symbol;
  console.log("symbol:", symbol);

  try {
    const now = new Date();
    let stocks = await StocksHistory.findOne({ symbol });

    if (!stocks) {
      console.log("No existing stock found, creating new entry...");
      stocks = new StocksHistory({ symbol });
    }

    // Daily
    if (
      !stocks.daily ||
      !stocks.daily.data ||
      stocks.daily.data.length === 0 ||
      now - new Date(stocks.daily.lastUpdated) > 24 * 60 * 60 * 1000
    ) {
      console.log("Fetching daily data...");
      const newDailyData = await fetchDaily(symbol);
      if (!newDailyData.success) {
        return res.status(429).json({
          success: false,
          message: newDailyData.message || "API rate limit reached.",
        });
      }
      stocks.daily = { lastUpdated: now, data: newDailyData.data };
    }


    //Weekly
    if (!stocks.weekly ||  !stocks.weekly.data ||
      stocks.weekly.data.length === 0 || now - new Date(stocks.weekly.lastUpdated) > 7 * 24 * 60 * 60 * 1000) {
      const newWeeklyData = await fetchWeekly(symbol);
      if (!newWeeklyData.success) {
        return res.status(429).json({
          success: false,
          message: newWeeklyData.message || "API rate limit reached.",
        });
      }
     
        stocks.weekly = { lastUpdated: now, data: newWeeklyData.data };
    }

    // // Monthly
    if (!stocks.monthly ||  !stocks.monthly.data ||
      stocks.monthly.data.length === 0 || now - new Date(stocks.monthly.lastUpdated) > 30 * 24 * 60 * 60 * 1000) {
      const newMonthlyData = await fetchMonthly(symbol);
      if (!newMonthlyData.success) {
        return res.status(429).json({
          success: false,
          message: newMonthlyData.message || "API rate limit reached.",
        });
      }
     
      stocks.monthly = { lastUpdated: now, data: newMonthlyData.data };
      }

    await stocks.save();

    res.status(200).json({ success: true, data: stocks });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



const fetchDaily = async (symbol) => {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${process.env.API_SECRET}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Daily Data:", data);

    if (data.Information)
      return { success: false, message: data.Information};

    const timeSeries = data["Time Series (60min)"];
    if (!timeSeries) return { success: false, message: "No time series data found." };

   
    const latestDateData = getLatestDateData(timeSeries);
    
    return { success: true, data: latestDateData };
  } catch (error) {
    console.error("Error fetching daily data:", error);
    return { success: false, message: "Failed to fetch daily data" };
  }
};

const getLatestDateData = (timeSeries) => {
  const timeStamps = Object.keys(timeSeries);
  
  
  const dataByDate = {};
  
  timeStamps.forEach(timeStamp => {
    const date = timeStamp.split(' ')[0]; // 
    if (!dataByDate[date]) {
      dataByDate[date] = [];
    }
    
    const currentData = timeSeries[timeStamp];
    dataByDate[date].push({
      currentPrice: parseFloat(currentData["4. close"]),
      open: parseFloat(currentData["1. open"]),
      high: parseFloat(currentData["2. high"]),
      low: parseFloat(currentData["3. low"]),
      volume: parseFloat(currentData["5. volume"]),
      timeStamp: timeStamp,
    });
  });
  
 
  const dates = Object.keys(dataByDate).sort().reverse();
  const latestDate = dates[0];
  
 
  return dataByDate[latestDate].sort((a, b) => 
    new Date(a.timeStamp) - new Date(b.timeStamp)
  );
};





const fetchWeekly = async (symbol) => {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${process.env.API_SECRET}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Weekly Data:", data);

    if (data.Information)
      return { success: false, message:  data.Information };

    
    const timeSeries = data["Weekly Time Series"];
    if (!timeSeries) return { success: false, message: "No weekly time series data found." };

    const weeklyData = processWeeklyData(timeSeries);
    return { success: true, data: weeklyData };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to fetch weekly data" };
  }
};

const processWeeklyData = (timeSeries) => {
  
  const timeStamps = Object.keys(timeSeries).sort().reverse();
  
 
  const last7Weeks = timeStamps.slice(0, 7);
  
  
  return last7Weeks.map(timeStamp => {
    const currentData = timeSeries[timeStamp];
    return {
      currentPrice: parseFloat(currentData["4. close"]),
      open: parseFloat(currentData["1. open"]),
      high: parseFloat(currentData["2. high"]),
      low: parseFloat(currentData["3. low"]),
      volume: parseFloat(currentData["5. volume"]),
      timeStamp: timeStamp,
    };
  }).reverse(); 
};


const fetchMonthly = async (symbol) => {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${process.env.API_SECRET}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Monthly Data:", data);

    if (data.Information)
      return { success: false, message: data.Information };

   
    const timeSeries = data["Monthly Time Series"];
    if (!timeSeries) return { success: false, message: "No monthly time series data found." };

    const monthlyData = processMonthlyData(timeSeries);
    return { success: true, data: monthlyData };
  } catch (error) {
    console.error("Error monthly data:", error);
    return { success: false, message: "Failed to fetch monthly data" };
  }
};


const processMonthlyData = (timeSeries) => {
  const timeStamps = Object.keys(timeSeries).sort().reverse().slice(0, 12); 
  
  return timeStamps.map(timeStamp => {
    const currentData = timeSeries[timeStamp];
    return {
      currentPrice: parseFloat(currentData["4. close"]),
      open: parseFloat(currentData["1. open"]),
      high: parseFloat(currentData["2. high"]),
      low: parseFloat(currentData["3. low"]),
      volume: parseFloat(currentData["5. volume"]),
      timeStamp: timeStamp,
    };
  }).reverse(); 
};




module.exports = { getStocksData, getOrUpdateStockHistoryData };
