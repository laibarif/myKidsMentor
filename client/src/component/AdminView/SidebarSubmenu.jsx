import React from 'react'
import { Link } from 'react-router-dom'
function SidebarSubmenu() {
  return (
    <div>
        <ul>

        <Link 
        to='/admin/dashboard'>Dashboard</Link>
        </ul>
    </div>
  )
}

export default SidebarSubmenu