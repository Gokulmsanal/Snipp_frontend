import React from 'react'

function CustomerLogout() {
    localStorage.removeItem('customer_login')
    localStorage.removeItem('customer_username')
    localStorage.removeItem('customer_id')
    window.location.href='/customer/login'

  return (
    // <div>Logout</div>
    <div></div>
  )
}

export default CustomerLogout