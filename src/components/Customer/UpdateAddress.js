import React,{useState,useEffect} from 'react'
import Sidebar from './Sidebar'
import axios from 'axios'
import {useParams} from "react-router-dom"

function UpdateAddress() {
    const baseUrl='http://127.0.0.1:8000/api';
    const {address_id} = useParams();
    var customer_id=localStorage.getItem('customer_id');
    const [ErrorMsg, setErrorMsg] = useState('')
    const [SuccessMsg, setSuccessMsg] = useState('')
    const [AddressFormData,setAddressFormData]=useState({
        'address':'',
        'customer':customer_id
    })

    useEffect(() => {
        fetchData(baseUrl+'/address/'+address_id);
      },[]);

      function fetchData(baseurl){
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setAddressFormData({
                'address':data.address,
                'customer':customer_id
            })
        });
      }

    const inputHandler = (event) => {
        setAddressFormData({
            ...AddressFormData,
            [event.target.name]:event.target.value
        })
    }

    //submithandler using axios
    const submitHandler = () =>{
        const formData=new FormData();
        formData.append('address',AddressFormData.address)
        formData.append('customer',AddressFormData.customer)

        //Submit Data
        axios.put(baseUrl+'/address/'+parseInt(address_id)+'/',formData)
        .then(function (response){
            if(response.status!=200){
                setErrorMsg('Data not saved');
                setSuccessMsg('')
            }else{
                setErrorMsg('')
                setSuccessMsg('Data saved')
            }
            // console.log(response)
        })
        .catch(function (error){
            console.log(error);
        })
    }

    const disableBtn=(AddressFormData.address=='');

  return (
    <div className='container mt-4'>
        <div className='row'>
            <div className='col-md-2 col-12 mb-2'>
                <Sidebar/>
            </div>
            <div className='col-md-10 col-12'>
                <div className='card'>
                    <h4 className='card-header'>Update Address</h4>
                    <div className='card-body'>
                        {ErrorMsg && <p className='alert alert-danger'>{ErrorMsg}</p>}
                        {SuccessMsg && <p className='alert alert-success'>{SuccessMsg}</p>}
                        <div className="mb-3">
                                <label for="address" className="form-label">Address</label>
                                <textarea className="form-control" name='address' onChange={inputHandler} value={AddressFormData.address} id="address"/>
                        </div>
                        <button type="button" disabled={disableBtn} onClick={submitHandler} className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div> 
    </div>
  )
}

export default UpdateAddress