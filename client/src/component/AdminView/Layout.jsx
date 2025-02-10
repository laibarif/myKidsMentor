import React from 'react'
import { Outlet } from 'react-router-dom'

import Footer from './Footer.jsx'
function AdminLayout() {
  return (
    <div>
        
        <Footer/>
        <div class="p-20 sm:ml-52">
         
            <Outlet/>
        </div>
    </div>
  )
}

export default AdminLayout