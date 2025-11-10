import React, { useState } from 'react';
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

// Register ChartJS components
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
  const [timeRange, setTimeRange] = useState('daily');

  // Sample stock data
  const stockData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.63,
    change: 1.24,
    changePercent: 0.88,
    volume: '38.4M',
    marketCap: '2.87T',
    peRatio: 28.5,
  };

  // Generate dummy data based on time range
  const generateChartData = (range) => {
    switch (range) {
      case 'daily':
        return {
          labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
          data: [181.5, 182.0, 182.3, 182.1, 182.8, 182.5, 182.9, 182.7, 182.6, 182.4, 182.8, 182.9, 182.7, 182.6],
        };
      case 'weekly':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [180.5, 181.2, 182.8, 183.1, 182.6, 182.3, 182.6],
        };
      case 'monthly':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [178.5, 180.2, 181.8, 182.6],
        };
      case 'yearly':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [165, 168, 172, 175, 178, 180, 177, 179, 181, 183, 182, 182.6],
        };
      default:
        return {
          labels: [],
          data: [],
        };
    }
  };

  const chartDataConfig = generateChartData(timeRange);

  const chartData = {
    labels: chartDataConfig.labels,
    datasets: [
      {
        label: 'Price',
        data: chartDataConfig.data,
        borderColor: stockData.change >= 0 ? '#10B981' : '#EF4444',
        backgroundColor: stockData.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: stockData.change >= 0 ? '#10B981' : '#EF4444',
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

  return (
    <div className="min-h-screen bg-gray-50">
      
     

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{stockData.symbol}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stockData.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stockData.change >= 0 ? '+' : ''}{stockData.change} ({stockData.changePercent}%)
                </span>
              </div>
              <p className="text-lg text-gray-600">{stockData.name}</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              <div>
                <p className="text-2xl font-bold text-gray-900">${stockData.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Current Price</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stockData.volume}</p>
                <p className="text-sm text-gray-500">Volume</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stockData.marketCap}</p>
                <p className="text-sm text-gray-500">Market Cap</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stockData.peRatio}</p>
                <p className="text-sm text-gray-500">P/E Ratio</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
              {stockData.symbol} Price Chart
            </h3>
            
          
            <div className="flex space-x-2">
              {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
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
            <Line data={chartData} options={chartOptions} />
          </div>

       
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Showing {timeRange} data for {stockData.symbol}. 
              {timeRange === 'daily' && ' Intraday prices from market open to close.'}
              {timeRange === 'weekly' && ' Last 7 days of trading.'}
              {timeRange === 'monthly' && ' Last 30 days of trading.'}
              {timeRange === 'yearly' && ' Monthly prices for the last 12 months.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockDetail;