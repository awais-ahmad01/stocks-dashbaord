import Footer from './components/footer'
import Header from "./components/header"


import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <Header/>

         <Outlet/>

        <Footer/>
    </div>
  )
}

export default Layout