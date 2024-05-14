import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import SellerSidebar from './SellerSidebar';

function SellerProducts(props) {
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const [ProductData, setProductData] = useState([])
    useEffect(() => {
        fetchData(baseUrl + 'products/');
    }, []);

    function fetchData(baseurl){
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setProductData(data.results)
        });
      }

      function showConfirm(product_id){
        var _confirm=window.confirm('Are you sure to delete this product?')
        if(_confirm){
            fetch(baseUrl+'product/'+product_id,{
                method:'DELETE'
            })
            .then((response) => {
                if(response.status==204){
                    fetchData(baseUrl+'products/');
                }
            });
        }
      }

  return (
    <div className='container mt-4'>
        <div className='row'>
            <div className='col-md-3 col-12 mb-2'>
                <SellerSidebar/>
            </div>
            <div className='col-md-9 col-12 mb-2'>
                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <td colSpan="5">
                                    <Link to="/seller/add-product" className="btn btn-primary"><i className='fa fa-plus-circle'></i> Add Product</Link>
                                </td>
                            </tr>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>USD Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ProductData.map((product,index)=>
                                    <tr>
                                        <td>{product.id}</td>
                                        <td><Link to={`/seller/update-product/${product.id}`}>{product.title}</Link></td>
                                        <td>&#8377;{product.price}</td>
                                        <td>${product.usd_price}</td>
                                        <td>
                                            {
                                                !product.publish_status && 'Pending'
                                            }
                                            {
                                                product.publish_status && <span className='text-success'>Published</span>
                                            }
                                        </td>
                                        <td>
                                            <Link to={`/seller/update-product/${product.id}`} className='btn btn-primary ms-1'>Edit</Link>
                                            <Link href={`/seller/delete-product/${product.id}`} onClick={()=>showConfirm(product.id)} className='btn btn-danger ms-1'>Delete</Link>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SellerProducts