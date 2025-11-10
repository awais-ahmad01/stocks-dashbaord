import { useSelector } from "react-redux";

const Footer = () => {

  //  const {stocksRealTimeData} = useSelector(state => state.stocks);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          
          <div className="text-sm text-gray-600">
            Last updated: <span className="font-mono">
              {/* {stocksRealTimeData[0]?.timeStamp} */}
              {getCurrentTime()}
              </span>
          </div>
          
         
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Real-time active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;