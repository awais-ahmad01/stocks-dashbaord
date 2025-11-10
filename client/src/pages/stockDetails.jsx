import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrUpdatedStocksHistoryData } from '../store/actions/stocksAction';
import Loader from '../components/loader';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockDetail = () => {
  const dispatch = useDispatch();
  const { stocksHistoryData } = useSelector(state => state.stocks);
  const { symbol } = useParams();
  const [timeRange, setTimeRange] = useState('daily');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);

  console.log("stocks:", stocksHistoryData);
  console.log("symbol:", symbol);

  
  const generateChartData = (range) => {
    if (!stocksHistoryData || !stocksHistoryData.data || !stocksHistoryData.data[range] || !stocksHistoryData.data[range].data) {
      return {
        labels: [],
        data: [],
      };
    }

    const rangeData = stocksHistoryData.data[range].data;
    
  
    let labels = [];
    let data = [];

    switch (range) {
      case 'daily':
        labels = rangeData.map(entry => {
          const date = new Date(entry.timeStamp);
          return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        });
        data = rangeData.map(entry => entry.currentPrice);
        break;
      
      case 'weekly':
        labels = rangeData.map(entry => {
          const date = new Date(entry.timeStamp);
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        });
        data = rangeData.map(entry => entry.currentPrice);
        break;
      
      case 'monthly':
        labels = rangeData.map(entry => {
          const date = new Date(entry.timeStamp);
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          });
        });
        data = rangeData.map(entry => entry.currentPrice);
        break;
      
      default:
        labels = [];
        data = [];
    }

    return { labels, data };
  };


  useEffect(() => {
    if (stocksHistoryData && stocksHistoryData.data && stocksHistoryData.data[timeRange] && stocksHistoryData.data[timeRange].data) {
      const rangeData = stocksHistoryData.data[timeRange].data;
      if (rangeData.length > 0) {
        const latestData = rangeData[rangeData.length - 1];
        const oldestData = rangeData[0];
        
        setCurrentPrice(latestData.currentPrice);
        
        const change = latestData.currentPrice - oldestData.currentPrice;
        const changePercent = (change / oldestData.currentPrice) * 100;
        
        setPriceChange(change);
        setPriceChangePercent(changePercent);
      }
    }
  }, [stocksHistoryData, timeRange]);

  const chartDataConfig = generateChartData(timeRange);

  const chartData = {
    labels: chartDataConfig.labels,
    datasets: [
      {
        label: 'Price',
        data: chartDataConfig.data,
        borderColor: priceChange >= 0 ? '#10B981' : '#EF4444',
        backgroundColor: priceChange >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: priceChange >= 0 ? '#10B981' : '#EF4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
       
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: false,
       
      },
    },
  };

 
  const calculateVolume = () => {
    if (!stocksHistoryData || !stocksHistoryData.data || !stocksHistoryData.data[timeRange] || !stocksHistoryData.data[timeRange].data) {
      return '0';
    }
    
    const rangeData = stocksHistoryData.data[timeRange].data;
    const totalVolume = rangeData.reduce((sum, entry) => sum + (entry.volume || 0), 0);
    
    if (totalVolume >= 1000000) {
      return (totalVolume / 1000000).toFixed(1) + 'M';
    } else if (totalVolume >= 1000) {
      return (totalVolume / 1000).toFixed(1) + 'K';
    }
    return totalVolume.toString();
  };

  useEffect(() => {
    dispatch(getOrUpdatedStocksHistoryData(symbol));
  }, [dispatch, symbol]);

  
  if (!stocksHistoryData || !stocksHistoryData.data) {
    return <Loader/>
  }

  return (
    <div className="">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{symbol}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  priceChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
              <p className="text-lg text-gray-600">{symbol} Stock Price</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              <div>
                <p className="text-2xl font-bold text-gray-900">${currentPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Current Price</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{calculateVolume()}</p>
                <p className="text-sm text-gray-500">Volume</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {stocksHistoryData.data?.daily?.data?.length || 0} points
                </p>
                <p className="text-sm text-gray-500">Data Points</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {stocksHistoryData.data?.[timeRange]?.lastUpdated ? 
                    new Date(stocksHistoryData.data[timeRange].lastUpdated).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
                <p className="text-sm text-gray-500">Last Updated</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
              {symbol} Price Chart
            </h3>
            
            <div className="flex space-x-2">
              {['daily', 'weekly', 'monthly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '400px' }}>
            {chartDataConfig.data.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available for {timeRange} timeframe</p>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              Showing {timeRange} data for {symbol}. 
              {timeRange === 'daily' && ' Intraday hourly prices.'}
              {timeRange === 'weekly' && ' Last 7 weeks of trading.'}
              {timeRange === 'monthly' && ' Last 12 months of trading.'}
              {' Data points: ' + chartDataConfig.data.length}
            </p>
          </div>
        </div>

       
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Summary</h4>
            {stocksHistoryData.data?.daily?.data && stocksHistoryData.data.daily.data.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Open: <span className="font-medium">${stocksHistoryData.data.daily.data[0]?.open?.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  High: <span className="font-medium">${Math.max(...stocksHistoryData.data.daily.data.map(d => d.high)).toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Low: <span className="font-medium">${Math.min(...stocksHistoryData.data.daily.data.map(d => d.low)).toFixed(2)}</span>
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Overview</h4>
            {stocksHistoryData.data?.weekly?.data && stocksHistoryData.data.weekly.data.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Weeks: <span className="font-medium">{stocksHistoryData.data.weekly.data.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current Trend: <span className={`font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange >= 0 ? 'Bullish' : 'Bearish'}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h4>
            {stocksHistoryData.data?.monthly?.data && stocksHistoryData.data.monthly.data.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Months: <span className="font-medium">{stocksHistoryData.data.monthly.data.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Period: {stocksHistoryData.data.monthly.data[0]?.timeStamp ? 
                    new Date(stocksHistoryData.data.monthly.data[0].timeStamp).toLocaleDateString() : 'N/A'} 
                  {' to '}
                  {stocksHistoryData.data.monthly.data[stocksHistoryData.data.monthly.data.length - 1]?.timeStamp ? 
                    new Date(stocksHistoryData.data.monthly.data[stocksHistoryData.data.monthly.data.length - 1].timeStamp).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockDetail;