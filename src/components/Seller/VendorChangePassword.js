import React,{useState} from 'react'
import SellerSidebar from './SellerSidebar'
import axios from 'axios'

function VendorChangePassword() {
    const baseUrl='http://127.0.0.1:8000/api/';
    const [PasswordData,setPasswordData]=useState({
        'password':'',
        'c_password':'',
    })
    const [ConfirmError,setConfirmError]=useState(false)
    const vendor_id = localStorage.getItem('vendor_id')
    const inputHandler = (e) => {
        setPasswordData({
            ...PasswordData,
            [e.target.name]:e.target.value
        })
    }

    const submitHandler = (e) => {
        if (PasswordData.password==PasswordData.c_password){
            setConfirmError(false)
            console.log('confirmed')
        }else{
            setConfirmError(true)
        }
        const formData=new FormData();
        formData.append('password',PasswordData.password)


        //Submit Data
        axios.post(baseUrl+'vendor-change-password/'+vendor_id,formData)
        .then(function (response){
            console.log(response)
        })
        .catch(function (error){
            console.log(error);
        })

    //     const formUserData=new FormData();
    //     formUserData.append('first_name',ProfileData.first_name)
    //     formUserData.append('last_name',ProfileData.last_name)
    //     formUserData.append('username',ProfileData.username)
    //     formUserData.append('email',ProfileData.email)
    //     formUserData.append('address',ProfileData.address)
    //     axios.put(baseUrl+'/user/'+ProfileData.user_id+'/',formUserData)
    //     .then(function (response){
    //         console.log(response)
    //     })
    //     .catch(function (error){
    //         console.log(error);
    //     })
    }

  return (
    <div className='container mt-4'>
        <div className='row'>
            <div className='col-md-2 col-12 mb-2'>
                <SellerSidebar/>
            </div>
            <div className='col-md-10 col-12'>
                {
                    ConfirmError && <p className='text-danger'>Password does not match</p>
                }
                <div className='card'>
                    <h4 className='card-header'>Change Password</h4>
                    <div className='card-body'>
                        <form>
                            <div className="mb-3">
                                <label for="pwd" className="form-label">New Password</label>
                                <input type="password" name='password' value={PasswordData.password} onChange={inputHandler} className="form-control" id="pwd"/>
                            </div>
                            <div className="mb-3">
                                <label for="cpwd" className="form-label">Confirm Password</label>
                                <input type="password" name='c_password' value={PasswordData.c_password} onChange={inputHandler} className="form-control" id="pwd"/>
                            </div>
                            <button type="button" onClick={submitHandler} className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div> 
    </div>
  )
}

export default VendorChangePassword