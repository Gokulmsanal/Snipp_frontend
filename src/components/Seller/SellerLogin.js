import React, { useState } from 'react';
import axios from 'axios';

function SellerLogin(props) {
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const [LoginFormData, setLoginFormData] = useState({
        'username': '',
        'password': ''
    });
    const [ErrorMsg, setErrorMsg] = useState('');

    const inputHandler = (event) => {
        setLoginFormData({
            ...LoginFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData();
        formData.append('username', LoginFormData.username);
        formData.append('password', LoginFormData.password);

        // Submit Data
        axios.post(baseUrl + 'vendor/login/', formData)
            .then(function (response) {
                if (response.data.bool === false) {
                    setErrorMsg(response.data.msg);
                } else {
                    console.log(response.data);
                    localStorage.setItem('vendor_id', response.data.id);
                    localStorage.setItem('vendor_login', true);
                    localStorage.setItem('vendor_username', response.data.user);
                    window.location.href = '/vendor/dashboard';
                    setErrorMsg('');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const checkVendor = localStorage.getItem('vendor_login');
    if (checkVendor) {
        window.location.href = '/seller/dashboard';
    }

    return (
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-md-8 col-12 offset-2'>
                    <div className='card'>
                        <h4 className='card-header'>Login</h4>
                        <div className='card-body'>
                            {ErrorMsg &&
                                <p className="text-danger">{ErrorMsg}</p>
                            }
                            <form onSubmit={submitHandler}> {/* Added onSubmit event handler */}
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" onChange={inputHandler} name='username' value={LoginFormData.username} className="form-control" id="username"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pwd" className="form-label">Password</label> {/* Fixed htmlFor attribute */}
                                    <input type="password" onChange={inputHandler} name='password' value={LoginFormData.password} className="form-control" id="pwd"/>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button> {/* Changed type to submit */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerLogin;
