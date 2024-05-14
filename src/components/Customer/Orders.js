import React from 'react'
import Sidebar from './Sidebar'
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react'
import axios from 'axios';
import OrderRow from './OrderRow';

function Orders() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const customerId = localStorage.getItem('customer_id')
    const [OrderItems,setOrderItems]=useState([]);

    useEffect(() => {
        fetchData(baseUrl+'/customer/'+customerId+'/orderitems');
      },[]);

    function fetchData(baseurl){
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setOrderItems(data.results)
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
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {
                                    OrderItems.map((item,index)=>{
                                        return <OrderRow item={item} key={index} index={index} />
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Orders