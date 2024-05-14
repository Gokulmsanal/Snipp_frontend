import React,{useState,useEffect} from 'react'
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom'

function Dashboard(props) {
    const baseUrl='http://127.0.0.1:8000/api';
    var customer_id=localStorage.getItem('customer_id');
    const [CountList,setCountList]=useState({
        'totalAddress':0,
        'totalWishList':0,
        'totalOrders':0
    });

    useEffect(() => {
        fetchData(baseUrl+'/customer/dashboard/'+customer_id+'/');
      },[]);

      function fetchData(baseurl){
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setCountList({
                'totalAddress':data.totalAddress,
                'totalWishList':data.totalWishList,
                'totalOrders':data.totalOrders                
            })
        });
      }

  return (
    <div className='container mt-4'>
        <div className='row'>
            <div className='col-md-3 col-12 mb-2'>
                <Sidebar/>
            </div>
            <div className='col-md-9 col-12 mb-2'>
                <div className='row'>
                    <div className='col-md-4 mb-2'>
                        <div className='card'>
                            <div className='card-body text-center'>
                                <h4>Total Orders</h4>
                                <h4><Link to="/customer/orders">{CountList.totalOrders}</Link></h4>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 mb-2'>
                        <div className='card'>
                            <div className='card-body text-center'>
                                <h4>Total Wishlist</h4>
                                <h4><Link to="/customer/wishlist">{CountList.totalWishList}</Link></h4>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 mb-2'>
                        <div className='card'>
                            <div className='card-body text-center'>
                                <h4>Total Addresses</h4>
                                <h4><Link to="/customer/addresses">{CountList.totalAddress}</Link></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard