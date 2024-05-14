import React from 'react'
import logo from '../logo.svg';

function LatestProducts() {
  return (
    <div className='col-12 col-md-3 mb-4'>
        <div className="card">
        <img src={logo} className="card-img-top" alt="logo"/>
            <div className="card-body">
                <h5 className="card-title">Product title</h5>
                <h6 className="card-title text-muted">Price:Rs. 500</h6>
            </div>
            <div className='card-footer'>
                <button title="Add to Cart" className='btn btn-success btn-sm'><i className="fa-solid fa-cart-plus"></i></button>
                <button title="Add to Wishlist" className='btn btn-danger btn-sm ms-1'><i className="fa fa-heart"></i></button>
            </div>
        </div>
    </div>
  )
}

export default LatestProducts