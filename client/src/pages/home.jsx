import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStocksData } from "../store/actions/stocksAction";
import { addWatchList } from "../store/actions/watchList";
import Loader from "../components/loader"
import { Link, useNavigate } from "react-router-dom";

const stocksRealTimeData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.63,
    change: 1.24,
    changePercent: 0.88,
    volume: "38.4M",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 407.54,
    change: -2.36,
    changePercent: -0.58,
    volume: "21.7M",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 171.48,
    change: 0.85,
    changePercent: 0.5,
    volume: "18.3M",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.22,
    change: 3.12,
    changePercent: 1.73,
    volume: "33.1M",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 175.34,
    change: -5.21,
    changePercent: -2.89,
    volume: "45.3M",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 485.58,
    change: 2.42,
    changePercent: 1.55,
    volume: "15.8M",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 950.02,
    change: 22.45,
    changePercent: 2.47,
    volume: "38.9M",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 195.41,
    change: -1.23,
    changePercent: -0.63,
    volume: "12.6M",
  },
];

const Home = () => {
  // const {stocksRealTimeData} = useSelector(state => state.stocks);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isloading } = useSelector((state) => state.stocks);
  console.log(isloading)
  console.log(user);
  // console.log("stocks:", stocksRealTimeData)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Function to fetch latest data
  //   const fetchStocks = () => {
  //     dispatch(getStocksData());
  //   };

  //   fetchStocks();

  //   const id = setInterval(fetchStocks, 60000);

  //   return () => clearInterval(id);
  // }, [dispatch]);

  const handleAddToWatchlist = (symbol, name, event) => {
    event.preventDefault();

    console.log(`Added ${symbol}, ${name} to watchlist`);

    if (isAuthenticated) {
      dispatch(addWatchList({ userId: user._id, symbol, name }))
        .unwrap()
        .then(() => {
          window.alert("Added successfully!."); 
        })
        .catch((error) => {
          window.alert(error);
        });
    } else {
      navigate("/login");
    }
  };




  if(isloading){
    return <Loader/>
  }



  return (
    <main className="max-w-7xl mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Real-Time Stock Dashboard
        </h2>
        <p className="text-gray-600">
          Live market data updated every 1 minute.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stocksRealTimeData.map((stock) => (
          <Link to={`/stockDetails/${stock.symbol}`} key={stock.symbol}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
              <button
                onClick={(e) =>
                  handleAddToWatchlist(stock.symbol, stock.name, e)
                }
                className="absolute top-4 right-4 p-2 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors duration-200"
                title="Add to watchlist"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stock.symbol}
                  </h3>
                  <p className="text-sm text-gray-600">{stock.name}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${stock.price.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-medium ${
                    stock.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </p>
              </div>

              <div className="text-sm text-gray-600">
                Volume: {stock.volume}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mb-12">
        <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium shadow-sm">
          Load More
        </button>
      </div>
    </main>
  );
};

export default Home;
