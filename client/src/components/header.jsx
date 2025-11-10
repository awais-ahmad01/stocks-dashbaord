import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../store/actions/auth'

const Header = () => {

  const dispatch = useDispatch()

  const {isAuthenticated} = useSelector(state => state.auth)


  console.log("isAuth:", isAuthenticated)



  const handleLogout = ()=>{
    dispatch(signOut())
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
       
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">StockView</h1>
          </div>

        
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>

            <Link 
              to="/watchlist" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Watchlist
            </Link>

            {!isAuthenticated ? (
                <Link to='/login'>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Sign In
            </button>
            </Link>
            ):(
              
              <button 
                onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Logout
            </button>
         
            )
          
          }
            
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
