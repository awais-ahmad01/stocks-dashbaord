import { Link } from "react-router-dom";

const MyWatchlist = () => {
  const watchlistData = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
    
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
     
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h2>
        <p className="text-gray-600">Your personalized stock tracking list</p>
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {watchlistData.map((stock) => (
          <Link 
            to={`/stockDetails/${stock.symbol}`}
            key={stock.symbol} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group cursor-pointer"
          >
           
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {stock.symbol}
              </h3>
              <p className="text-sm text-gray-600 leading-tight">
                {stock.name}
              </p>
            </div>

          
          
          </Link>
        ))}
      </div>

      {/* Empty State (optional) */}
      {watchlistData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stocks in watchlist</h3>
          <p className="text-gray-600">Add stocks to your watchlist to track them here</p>
        </div>
      )}
    </main>
  );
};

export default MyWatchlist;