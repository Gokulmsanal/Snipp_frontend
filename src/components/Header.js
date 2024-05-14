import React,{useContext, useState} from 'react'
import { Link } from 'react-router-dom'
import { UserContext,CartContext,CurrencyContext } from '../Context'

function Header(props) {
  const userContext=useContext(UserContext);
  const {cartData}=useContext(CartContext)
  // const currentCurrency=localStorage.getItem('currency')
  // const [Currency,setCurrency]=useState(currentCurrency)
  const checkVendor = localStorage.getItem('vendor_login');

  const {CurrencyData,setCurrencyData}=useContext(CurrencyContext)

  if(cartData == null){
    var cartItems=0
  }else{
    var cartItems=cartData.length
  }

  const changeCurrency = (e) => {
    var _currency=e.target.value;
    localStorage.setItem('currency',_currency)
    setCurrencyData(_currency)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="navbar-brand" to="/"> Python Market Place </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/categories">Categories</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  My Account
                </a>
                <ul className="dropdown-menu">
                  {userContext !='true' &&
                    <>
                      <li><Link className="dropdown-item" to="/customer/register">Register</Link></li>
                      <li><Link className="dropdown-item" to="/customer/login">Login</Link></li>
                    </>
                  }
                  {userContext == 'true' && 
                    <>
                      <li><Link className="dropdown-item" to="/customer/dashboard">Dashboard</Link></li>
                      <li><Link className="dropdown-item" to="/customer/logout">Logout</Link></li>
                    </>
                }
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Vendor Panel
                </a>
                  {
                    checkVendor && <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/seller/dashboard">Dashboard</Link></li>
                      <li><Link className="dropdown-item" to="/seller/logout">Logout</Link></li>
                    </ul>
                  }
                  {
                    !checkVendor && <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/seller/register">Register</Link></li>
                      <li><Link className="dropdown-item" to="/seller/login">Login</Link></li>
                    </ul>
                  }
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/checkout">New Orders (4)</Link>
              </li> */}
              <li className="nav-item">
                <Link className="nav-link" to="/checkout">My Cart ({cartItems})</Link>
              </li>
              <li className="nav-item">
                <div className='nav-link'>
                  <select onChange={changeCurrency}>
                    {
                      CurrencyData != 'usd' && <>
                        <option value='inr' selected>INR</option>
                        <option value='usd'>USD</option>
                      </>

                    }
                    {
                      CurrencyData == 'usd' && <>
                        <option value='inr'>INR</option>
                        <option value='usd' selected>USD</option>
                      </>

                    }

                  </select>
                </div>
                
              </li>
            </ul>
          </div>
        </div>
      </nav>
  )
}

export default Header