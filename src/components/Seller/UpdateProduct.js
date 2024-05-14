import { useState, useEffect } from 'react'
import React from 'react'
import SellerSidebar from './SellerSidebar'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const baseUrl = 'http://127.0.0.1:8000/api/';

function UpdateProduct() {
    const {product_id} =useParams();
    const vendor_id = localStorage.getItem('vendor_id')

    const [IsImageDeleted, setIsImageDeleted] = useState(false)

    const [IsFeatureImageSelected, setIsFeatureImageSelected] = useState(false)
    const [IsProductFileSelected, setIsProductFileSelected] = useState(false)
    const [IsMultipleProductImagesSelected, setIsMultipleProductImagesSelected] = useState(false)

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
        'demo_url': '',
        'image': '',
        'product_imgs': [],
    })
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
        if(event.target.name === 'image'){
            setIsFeatureImageSelected(true)
        }
        if(event.target.name === 'product_file'){
            setIsProductFileSelected(true)
        }
    }

    const multipleFileHandler = (event) => {
        var files = event.target.files;
        if(files.length > 0){
            setIsMultipleProductImagesSelected(true);
            setProductImgs(files);
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

        if(IsProductFileSelected){
            formData.append('image', ProductData.image)
        }
        if(IsProductFileSelected){
            formData.append('product_file', ProductData.product_file)
        }
        formData.append('demo_url',ProductData.demo_url)

        //Submit Data
        axios.patch(baseUrl + 'product/'+product_id+'/', formData, {
            headers:{
                'content-type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setErrorMsg('');
                    setSuccessMsg(response.statusText)

                    if(IsMultipleProductImagesSelected){
                        for(let i=0; i < ProductImgs.length; i++){
                            const ImageFormData = new FormData();
                            ImageFormData.append('product',response.data.id);
                            ImageFormData.append('image',ProductImgs[i]);
                            console.log(ImageFormData)
                            // Submit multiple Images
                            axios.post(baseUrl+'product-imgs/?from_update=1',ImageFormData)
                            .then(function (response){
                                console.log(response)
                            })
                            .catch(function (error){
                                console.log(error);
                            })
                            // End upload images
                        }
                    }
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
        fetchProductData(baseUrl + 'product/'+ product_id);
    }, []);

    function fetchData(baseurl) {
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setCategoryData(data.results)
        });
    }

    function deleteImage(image_id){
        axios.delete(baseUrl + 'product-img/'+image_id+'/')
        .then(function (response) {
            if(response.status==204){
                window.location.reload()
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    function fetchProductData(baseurl) {
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setProductData({
                'category': data.category,
                'vendor': data.vendor,
                'title': data.title,
                'slug': data.slug,
                'detail': data.detail,
                'price': data.price,
                'usd_price': data.usd_price,
                'tags': data.tags,
                'image': data.image,
                'demo_url': data.demo_url,
                'product_file': data.product_file,
                'product_imgs': data.product_imgs,
            })
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
                        <h4 className='card-header'>Update Product</h4>
                        <div className='card-body'>
                            {SuccessMsg && <p className="text-success"> {SuccessMsg} </p>}
                            {ErrorMsg && <p className="text-danger"> {ErrorMsg} </p>}
                            <form>
                                <div className="mb-3">
                                    <label for="Title" className="form-label">Category</label>
                                    <select className='form-control' name='category' onChange={inputHandler}>
                                            {
                                                CategoryData.map((item, index) =><option selected={item.id===ProductData.category} value={item.id}>{item.title}</option>)
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
                                    <textarea className="form-control" name="tags" value={ProductData.tags} onChange={inputHandler} rows="8" id="Tags"/>
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
                                        <img src={ProductData.image} className='img rounded border mt-2' width='200' />
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-3'>
                                        <label for="Product_Imgs" className='form-label'>Product Images</label>
                                        <div className="form-group">
                                            <input type="file" multiple name='product_imgs' className="form-control-file mb-3" onChange={multipleFileHandler} id="Product_Imgs"/>
                                        </div>
                                        <>
                                        {
                                            ProductData.product_imgs && ProductData.product_imgs.map((img,index)=>
                                            <span className='image-box d-inline p-3 my-2' onClick={()=>deleteImage(img.id)} >
                                                <i className='fa fa-trash text-danger' style={styles.deleteBtn} role='button'></i>
                                                <img src={img.image} className='my-4' width='200' />
                                            </span>
                                            )
                                        }
                                        </>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-3'>
                                        <label for="Product_File" className='form-label'>Product File</label>
                                        <div className="form-group">
                                            <input type="file" name='product_file' className="form-control-file" onChange={fileHandler} id="Product_File"/>
                                            {ProductData.product_file && (
                                                <a href={ProductData.product_file} download>{ProductData.product_file.name}</a>
                                            )}
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

const styles ={
    'deleteBtn':{
        'position':'absolute',
    }
}

export default UpdateProduct;
