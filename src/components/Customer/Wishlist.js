import React from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import logo from '../../logo.svg';
import  {useState,useEffect,useContext} from 'react'
import { CurrencyContext } from '../../Context';
import axios from 'axios';

function Wishlist() {

    const {CurrencyData}=useContext(CurrencyContext)

    const baseUrl = 'http://127.0.0.1:8000/api';
    const customerId = localStorage.getItem('customer_id')
    const [WishItems,setWishItems]=useState([]);

    useEffect(() => {
        fetchData(baseUrl+'/customer/'+customerId+'/wishitems');
      },[]);

    function fetchData(baseurl){
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setWishItems(data.results)
        });
      }

      // Remove From Wishlist
      function removeFromWishList(wishlist_id){
        const formData = new FormData();
        formData.append('wishlist_id', wishlist_id);
        // Submit Data
        axios.post(baseUrl+'/remove-from-wishlist/',formData)
        .then(function(response) {
            if(response.data.bool==true){
                document.getElementById('row'+wishlist_id).remove();
            }
        })
        .catch(function(error) {
            console.log(error);
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
                                    <th>Products</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    WishItems.map((item,index)=>{
                                        return <tr id={`row${item.id}`}>
                                            <td>{index+1}</td>
                                            <td>
                                                <Link><img src={item.product.image} className='img-thumbnail' width='80' alt="" /></Link>
                                                <p><Link>{item.product.title}</Link></p>
                                            </td>
                                            {
                                                CurrencyData != 'usd' && <td>Rs. {item.product.price}</td>
                                            }
                                            {
                                                CurrencyData == 'usd' && <td>$ {item.product.usd_price}</td>
                                            }
                                            
                                            <td><button className='btn btn-danger btn sm' onClick={()=>removeFromWishList(item.id)}>Remove</button></td>
                                        </tr>
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

export default Wishlist