import { useState, useEffect } from 'react'
import React from 'react'
import SellerSidebar from './SellerSidebar'
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api/';

function AddProduct() {
    const vendor_id = localStorage.getItem('vendor_id')
    const [ErrorMsg, setErrorMsg] = useState('')
    const [SuccessMsg, setSuccessMsg] = useState('')
    const [CategoryData, setCategoryData] = useState([])
    const [ProductData, setProductData] = useState({
        'category': '',
        'vendor': '',
        'title': '',
        'slug': '',
        'detail': '',
        'price': '',
        'usd_price': '',
        'tags': '',
        'image': '',
        'demo_url': '',
        'product_file': ''
    })

    const [ImgUploadErrorMsg, setImgUploadErrorMsg] = useState('')
    const [ImgUploadSuccessMsg, setImgUploadSuccessMsg] = useState('')
    const [ProductImgs, setProductImgs] = useState([])

    const inputHandler = (event) => {
        setProductData({
            ...ProductData,
            [event.target.name]: event.target.value
        })
    }

    const fileHandler = (event) => {
        setProductData({
            ...ProductData,
            [event.target.name]: event.target.files[0]
        })
    }

    const multipleFileHandler = (event) =>{
        var files=event.target.files;
        if(files.length>0){
            setProductImgs(files)
        }
    }

    const submitHandler = () => {
        const formData = new FormData();
        formData.append('vendor', ProductData.vendor)
        formData.append('category', ProductData.category)
        formData.append('title', ProductData.title)
        formData.append('slug', ProductData.slug)
        formData.append('detail', ProductData.detail)
        formData.append('price', ProductData.price)
        formData.append('usd_price', ProductData.usd_price)
        formData.append('tags', ProductData.tags)
        formData.append('image', ProductData.image)
        formData.append('demo_url', ProductData.demo_url)
        formData.append('product_file', ProductData.product_file)

        //Submit Data
        axios.post(baseUrl + 'products/', formData, {
            headers:{
                'content-type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                if (response.status == 201) {
                    setProductData({
                        'category': '',
                        'vendor': '',
                        'title': '',
                        'slug': '',
                        'detail': '',
                        'price': '',
                        'usd_price': '',
                        'tags': '',
                        'image': '',
                        'demo_url': '',
                        'product_file': ''
                    })
                    setErrorMsg('');
                    setSuccessMsg(response.statusText)

                    for(let i=0; i < ProductImgs.length; i++){
                        const ImageFormData = new FormData();
                        ImageFormData.append('product',response.data.id);
                        ImageFormData.append('image',ProductImgs[i]);
                        // Submit multiple Images
                        axios.post(baseUrl+'product-imgs/',ImageFormData)
                        .then(function (response){
                            console.log(response)
                        })
                        .catch(function (error){
                            console.log(error);
                        })
                        // End upload images
                    }

                    setProductImgs('');

                } else {
                    setSuccessMsg('');
                    setErrorMsg(response.statusText)
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    useEffect(() => {
        setProductData({
            ...ProductData,
            'vendor': vendor_id
        });

        fetchData(baseUrl + 'categories/');
    }, []);

    function fetchData(baseurl) {
        fetch(baseurl)
            .then((response) => response.json())
            .then((data) => {
                setCategoryData(data.results)
            });
    }

    return (
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-md-2 col-12 mb-2'>
                    <SellerSidebar />
                </div>
                <div className='col-md-10 col-12'>
                    <div className='card'>
                        <h4 className='card-header'>Add Product</h4>
                        <div className='card-body'>
                            {SuccessMsg && <p className="text-success"> {SuccessMsg} </p>}
                            {ErrorMsg && <p className="text-danger"> {ErrorMsg} </p>}
                            <form>
                                <div className="mb-3">
                                    <label for="Title" className="form-label">Category</label>
                                    <select className='form-control' name='category' onChange={inputHandler}>
                                        {
                                            CategoryData.map((item, index) => <option key={index} value={item.id}>{item.title}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label for="Title" className="form-label">Title</label>
                                    <input type="text" name="title" value={ProductData.title} onChange={inputHandler} className="form-control" id="Title"/>
                                </div>
                                <div className="mb-3">
                                    <label for="Slug" className="form-label">slug</label>
                                    <input type="text" name="slug" value={ProductData.slug} onChange={inputHandler} className="form-control" id="Slug"/>
                                </div>
                                <div className="mb-3">
                                    <label for="INR_Price" className="form-label">INR Price</label>
                                    <input type="number" name="price" value={ProductData.price} onChange={inputHandler} className="form-control" id="INR_Price"/>
                                </div>
                                <div className="mb-3">
                                    <label for="USD_Price" className="form-label">USD Price</label>
                                    <input type="number" name="usd_price" value={ProductData.usd_price} onChange={inputHandler} className="form-control" id="USD_Price"/>
                                </div>
                                <div className="mb-3">
                                    <label for="Detail" className="form-label">Detail</label>
                                    <textarea className="form-control" name="detail" value={ProductData.detail} onChange={inputHandler} rows="8" id="Detail"/>
                                </div>
                                <div className="mb-3">
                                    <label for="Tags" className="form-label">Tags</label>
                                    <textarea className="form-control" name="tag_list" value={ProductData.tag_list} onChange={inputHandler} rows="8" id="Tags"/>
                                </div>
                                <div className="mb-3">
                                    <label for="Demo_URL" className="form-label">Demo URL</label>
                                    <input type="url" name="demo_url" value={ProductData.demo_url} onChange={inputHandler} className="form-control" id="Demo_URL"/>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-3'>
                                        <label for="productImg" className='form-label'>Featured Image</label>
                                        <div className="form-group">
                                            <input type="file" name='image' className="form-control-file" onChange={fileHandler} id="ProductImg"/>
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-3'>
                                        <label for="Product_Imgs" className='form-label'>Product Images</label>
                                        <div className="form-group">
                                            <input type="file" name='image' className="form-control-file" onChange={multipleFileHandler} id="Product_Imgs"/>
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-3'>
                                        <label for="Product_File" className='form-label'>Product File</label>
                                        <div className="form-group">
                                            <input type="file" name='product_file' className="form-control-file" onChange={fileHandler} id="Product_File"/>
                                        </div>
                                    </div>
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

export default AddProduct;
