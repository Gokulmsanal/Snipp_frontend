import axios from "axios";
import React,{useState} from 'react'

function Register(props) {
    const baseUrl='http://127.0.0.1:8000/api/';
    const [errorMsg,seterrorMsg]=useState('')
    const [successMsg,setsuccessMsg]=useState('')
    const [registerFormData, setRegisterFormData] = useState({
        "first_name":'',
        "last_name":'',
        "username":'',
        "email":'',
        "mobile":'',
        "password":'',
    })

    const inputHandler = (e) => {
        setRegisterFormData({
            ...registerFormData,
            [e.target.name]:e.target.value
        })
    }

    const submitHandler = (e) => {
        const formData=new FormData();
        formData.append('first_name',registerFormData.first_name)
        formData.append('last_name',registerFormData.last_name)
        formData.append('username',registerFormData.username)
        formData.append('email',registerFormData.email)
        formData.append('mobile',registerFormData.mobile)
        formData.append('password',registerFormData.password)

        //Submit Data
        axios.post(baseUrl+'customer/register/',formData)
        .then(function (response){
            if(response.data.bool==false){
                seterrorMsg(response.data.msg)
                setsuccessMsg('')
            }else{
                setRegisterFormData({
                    "first_name":'',
                    "last_name":'',
                    "username":'',
                    "email":'',
                    "mobile":'',
                    "password":'',
                })
                seterrorMsg('');
                setsuccessMsg(response.data.msg)
            }
        })
        .catch(function (error){
            console.log(error);
        })
    }

    const buttonEnable=(registerFormData.first_name!='') && (registerFormData.last_name!='') && (registerFormData.email!='') && (registerFormData.mobile!='') && (registerFormData.username!='') && (registerFormData.password!='')


  return (
    <div className='container mt-4'>
        <div className='row'>
            <div className='col-md-8 col-12 offset-2'>
                <div className='card'>
                    <h4 className='card-header'>Register</h4>
                    <div className='card-body'>
                        <p className="text-muted"><strong>Note: </strong>All fields are required</p>
                        {successMsg && <p className="text-success"> {successMsg} </p> }
                        {errorMsg && <p className="text-danger"> {errorMsg} </p>}
                        <form>
                            <div className="mb-3">
                                <label for="firstName" className="form-label">First Name</label>
                                <input type="text" onChange={inputHandler} value={registerFormData.first_name} name="first_name" className="form-control" id="firstName"/>
                            </div>
                            <div className="mb-3">
                                <label for="lastName" className="form-label">Last Name</label>
                                <input type="text" onChange={inputHandler} value={registerFormData.last_name} name="last_name" className="form-control" id="lastName"/>
                            </div>
                            <div className="mb-3">
                                <label for="username" className="form-label">Username</label>
                                <input type="text" onChange={inputHandler} value={registerFormData.username} name="username" className="form-control" id="username"/>
                            </div>
                            <div className="mb-3">
                                <label for="email" className="form-label">Email</label>
                                <input type="email" onChange={inputHandler} value={registerFormData.email} name="email" className="form-control" id="email"/>
                            </div>
                            <div className="mb-3">
                                <label for="email" className="form-label">Mobile</label>
                                <input type="number" onChange={inputHandler} value={registerFormData.mobile} name="mobile" className="form-control" id="mobile"/>
                            </div>
                            <div className="mb-3">
                                <label for="pwd" className="form-label">Password</label>
                                <input type="password" onChange={inputHandler} value={registerFormData.password} name="password" className="form-control" id="pwd"/>
                            </div>
                            <button type="button" disabled={!buttonEnable} onClick={submitHandler} className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register