import React from 'react'

function SellerLogout() {
    localStorage.removeItem('vendor_login')
    localStorage.removeItem('vendor_username')
    localStorage.removeItem('vendor_id')
    window.location.href='/seller/login'

  return (
    <div></div>
    // <div>Logout</div>
  )
}

export default SellerLogout