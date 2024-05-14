import React,{useState} from 'react'
import Sidebar from './Sidebar'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AddReview() {
    const baseUrl='http://127.0.0.1:8000/api/';

    const {product_id} = useParams();
    var customer_id=localStorage.getItem('customer_id')
    const [errorMsg,seterrorMsg]=useState('')
    const [successMsg,setsuccessMsg]=useState('')
    const [ReviewFormData, setReviewFormData] = useState({
        "reviews":'',
        "rating":1
    })

    const inputHandler = (e) => {
        setReviewFormData({
            ...ReviewFormData,
            [e.target.name]:e.target.value
        })
    }

    const submitHandler = (e) => {
        const formData=new FormData();
        formData.append('reviews',ReviewFormData.reviews)
        formData.append('rating',ReviewFormData.rating)
        formData.append('customer',customer_id)
        formData.append('product',product_id)

        //Submit Data
        axios.post(baseUrl+'productrating/',formData)
        .then(function (response){
            if(response.status!=201){
                seterrorMsg('Data not saved')
                setsuccessMsg('')
            }else{
                seterrorMsg('')
                setsuccessMsg('Data saved')
                setReviewFormData({
                    "reviews":'',
                    "rating":'',
                })
            }
        })
        .catch(function (error){
            console.log(error);
        })
    }

    const disableBtn=(ReviewFormData.reviews=='') || (ReviewFormData.rating=='');


    return (
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-md-2 col-12 mb-2'>
                    <Sidebar/>
                </div>
                <div className='col-md-10 col-12'>
                    <div className='card'>
                        <h4 className='card-header'>Add Review</h4>
                        <div className='card-body'>
                            {errorMsg && <p className='alert alert-danger'>{errorMsg}</p>}
                            {successMsg && <p className='alert alert-success'>{successMsg}</p>}
                            <div className="mb-3">
                                    <label for="reviews" className="form-label">Review</label>
                                    <textarea className="form-control" name='reviews' onChange={inputHandler} value={ReviewFormData.reviews} id="reviews"/>
                            </div>
                            <div className='mb-3'>
                                <label for='rating' className='form-label'>Rating</label>
                                <select className='form-control' name='rating' onChange={inputHandler}>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </div>
                            <button type="button" disabled={disableBtn} onClick={submitHandler} className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
      )
    }

export default AddReview