import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from "./pages/home"
// import Login from "./pages/login"
import MyWatchlist from "./pages/watchlist";
import StockChart from "./components/stocksChart";
import StockDetail from './pages/stockDetails';

import Layout from './layout';

import Login from './pages/login';
import Register from './pages/register';
import ProtectedRoute from './protectedRoute';


function App() {
  

  return (
    <>
       <Router>
      
          <Routes>

               <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            
            <Route index element={<Home />} />

             <Route 
                path="/watchlist" 
                element={
                  <ProtectedRoute>
                    <MyWatchlist />
                  </ProtectedRoute>
                } 
              />

              <Route path="/stockDetails/:symbol" element={<StockDetail />} />
           </Route> 
            
         

          </Routes>

       </Router>
    </>
  )
}

export default App
