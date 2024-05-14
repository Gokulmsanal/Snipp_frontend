import React,{useState,useEffect} from 'react'
import { Link, json } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import logo from '../../logo.svg';


function VendorOrders() {
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const vendor_id = localStorage.getItem('vendor_id')
    const [OrderItems, setOrderItems] = useState([])

    useEffect(() => {
        fetchData(baseUrl+'vendor/'+vendor_id+'/orderitems/');
    }, []);

    function fetchData(baseUrl){
        fetch(baseUrl)
        .then((response) => response.json())
        .then((data) => {
            setOrderItems(data.results)
            console.log(OrderItems)
        });
      }

      function changeOrderStatus(order_id,status){
        fetch(baseUrl+'order-modify/'+order_id+'/',{
            method:"PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({order_status:status})
        })
        .then(function(response){
            if(response.status==200){
                fetchData(baseUrl+'vendor/'+vendor_id+'/orderitems/');
            }
        })
      }

  return (
    <div className='container mt-4'>
        <div className='row'>
            <div className='col-md-3 col-12 mb-2'>
                <SellerSidebar/>
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
                            <tbody>
                                {
                                    OrderItems.map((item,index)=><tr>
                                    <td>{index+1}</td>
                                    <td>
                                        <Link><img src={'item.product.image'} className="img-thumbnail" width='80' alt="logo"/></Link>
                                        <p><Link>{item.product.title}</Link></p>
                                    </td>
                                    <td>Rs. {item.product.price}</td>
                                    <td>
                                        {
                                            item.order.order_status && <span className='text-success'><i className='fa fa-check-circle'></i>Completed</span>
                                        }
                                        {
                                            !item.order.order_status && <span className='text-warning'><i className='fa fa-spinner'></i>Pending</span>
                                        }
                                    </td>
                                    <td>
                                    <div className="dropdown">
                                        <button className="btn btn-primary dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Change Status
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                {
                                                    !item.order.order_status && <a className="dropdown-item" onClick={()=>changeOrderStatus(item.order.id,true)}>Complete</a>
                                                }
                                                {
                                                    item.order.order_status && <a className="dropdown-item" onClick={()=>changeOrderStatus(item.order.id,false)}>Pending</a>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    </td>
                                </tr>)
                                }
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <Link><img src={logo} className="img-thumbnail" width='80' alt="logo"/></Link>
                                        <p><Link>Django</Link></p>
                                    </td>
                                    <td>Rs. 500</td>
                                    <td><span className='text-success'><i className='fa fa-check-circle'></i>Completed</span></td>
                                    <td>
                                    <div className="dropdown">
                                        <button className="btn btn-primary dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Change Status
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Approve</a></li>
                                            <li><a className="dropdown-item" href="#">Sent</a></li>
                                            <li><a className="dropdown-item" href="#">Complete</a></li>
                                        </ul>
                                    </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <Link><img src={logo} className="img-thumbnail" width='80' alt="logo"/></Link>
                                        <p><Link>Django</Link></p>
                                    </td>
                                    <td>Rs. 500</td>
                                    <td><span className='text-success'><i className='fa fa-check-circle'></i>Completed</span></td>
                                    <td>
                                    <div className="dropdown">
                                        <button className="btn btn-primary dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Change Status
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Complete</a></li>
                                        </ul>
                                    </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default VendorOrders
