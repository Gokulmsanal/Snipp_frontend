import React,{useState,useEffect} from 'react'
import SellerSidebar from './SellerSidebar';
import { Link } from 'react-router-dom';

function Customers() {
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const vendor_id = localStorage.getItem('vendor_id')
    const [CustomerList, setCustomerList] = useState([])

    useEffect(() => {
        fetchData(baseUrl+'vendor/'+vendor_id+'/customers/');
    }, []);

    function fetchData(baseUrl){
        fetch(baseUrl)
        .then((response) => response.json())
        .then((data) => {
            setCustomerList(data.results)
        });
      }

      function showConfirm(customer_id){
        var _confirm=window.confirm('Are you sure to delete this order?')
        if(_confirm){
            fetch(baseUrl+'delete-customer-orders/'+customer_id,{
                method:'DELETE'
            })
            .then((response) => {
                if(response.bool==true){
                    fetchData(baseUrl+'seller/customer/'+customer_id+'/orderitems');
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
                <div className='row'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    CustomerList.map((item,index)=><tr>
                                    <td>{index+1}</td>
                                    <td>
                                        {item.user.username}
                                    </td>
                                    <td>{item.user.email}</td>
                                    <td>{item.customer.mobile}</td>
                                    <td>
                                        <Link to={`/seller/customer/${item.customer.id}/orderitems/`} className='btn btn-primary btn-sm'>Orders</Link>
                                        <button onClick={()=>showConfirm(item.customer.id)} className='btn btn-danger btn-sm ms-1'>Remove from List</button>
                                    </td>
                                </tr>)
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

export default Customers