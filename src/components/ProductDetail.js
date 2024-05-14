import React, { useState,useEffect, useContext } from 'react'
import { Link, json } from 'react-router-dom';
import SingleRelatedProduct from './SingleRelatedProduct';
import { Carousel } from 'react-bootstrap'; // Import Carousel from react-bootstrap
import {useParams} from "react-router-dom"
import { UserContext,CartContext, CurrencyContext } from '../Context';
import axios from 'axios';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function ProductDetail() {
    const baseUrl='http://127.0.0.1:8000/api';
    const [productData, setproductData] = useState([])
    const [productImgs, setproductImgs] = useState([])
    const [productTags, setproductTags] = useState([])
    const [relatedProducts,setrelatedProducts] = useState([])
    const {product_slug,product_id} = useParams();
    const [cartButtonClickStatus, setcartButtonClickStatus] = useState(false)
    const [ProductInWishlist, setProductInWishlist] = useState(false)

    const {cartData,setCartData}=useContext(CartContext)
    const {CurrencyData}=useContext(CurrencyContext)
    const userContext = useContext(UserContext);

    useEffect(() => {
        fetchData(baseUrl+'/product/'+product_id);
        fetchRelatedData(baseUrl+'/related-products/'+product_id);
        checkProductInCart(product_id)
        checkProductInWishList(baseUrl+'/check-in-wishlist/',product_id);
      },[product_id]);


    function checkProductInCart(product_id) {
        var previousCart = localStorage.getItem('cartData');
        var cartJson = JSON.parse(previousCart);
        if (cartJson != null && Array.isArray(cartJson)) { // Check if cartJson is not null and is an array
            cartJson.map((cart) => {
                if (cart != null && cart.product.id == product_id) {
                    setcartButtonClickStatus(true);
                }
            });
        }
    }

    function fetchData(baseurl){
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setproductData(data);
            setproductImgs(data.product_imgs);
            setproductTags(data.tag_list);
        });
    }

    function fetchRelatedData(baseurl){
        fetch(baseurl)
        .then((response) => response.json())
        .then((data) => {
            setrelatedProducts(data.results);
        });
    }

    const tagsLinks=[]
    for(let i=0; i<productTags.length; i++){
        let tag=productTags[i].trim();
        tagsLinks.push(<Link className='badge bg-secondary text-white me-1' to={`/products/${tag}`}>{tag}</Link>)
    }
    
    const cartAddButtonHandler = () => {
        var previousCart = localStorage.getItem('cartData');
        var cartJson = JSON.parse(previousCart);
        var cartData = {
            'product': {
                'id': productData.id,
                'title': productData.title,
                'price': productData.price,
                'usd_price': productData.usd_price,
                'image': productData.image,
            },
            'user': {
                'id': 1,
            },
            'total_amount':10

        };
        if (cartJson != null && Array.isArray(cartJson)) { // Check if cartJson is not null and is an array
            cartJson.push(cartData);
            var cartString = JSON.stringify(cartJson);
            localStorage.setItem('cartData', cartString);
            setCartData(cartJson);
        } else {
            var newCartList = [];
            newCartList.push(cartData);
            var cartString = JSON.stringify(newCartList);
            localStorage.setItem('cartData', cartString);
        }
        setcartButtonClickStatus(true);
    };

    const cartRemoveButtonHandler = () => {
        var previousCart = localStorage.getItem('cartData');
        var cartJson = JSON.parse(previousCart);
        // Filter out the item to remove from the cartJson array
        var updatedCartJson = cartJson.filter(cart => cart !== null && cart.product.id !== productData.id);
        var cartString = JSON.stringify(updatedCartJson);
        localStorage.setItem('cartData', cartString);
        // Update cart button click status
        setcartButtonClickStatus(false);
        // Update cart data context
        setCartData(updatedCartJson);
    }
    
    function saveInWishList(){
        const customerId=localStorage.getItem('customer_id')
        const formData = new FormData();
        formData.append('customer', customerId);
        formData.append('product', productData.id);

        // Submit Data
        axios.post(baseUrl+'/wishlist/',formData)
        .then(function(response) {
            if(response.data.id){
                setProductInWishlist(true);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    // Check in wishlist
    function checkProductInWishList(baseUrl,product_id){
        const customerId=localStorage.getItem('customer_id')
        const formData = new FormData();
        formData.append('customer', customerId);
        formData.append('product', product_id);
        // Submit Data
        axios.post(baseUrl,formData)
        .then(function(response) {
            if(response.data.bool==true){
                setProductInWishlist(true)
            }else{
                setProductInWishlist(false)
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    
 return (
    <section className='container mt-4'>
        <div className='row'>
            <div className='col-4'>
                <div id="productThumbnailSlider" className='carousel carousel-dark slide carousel-fade' data-bs-ride="true">
                    <div className='carousel-indicators'>
                        {productImgs.map((img,index)=>{
                            if(index === 0){
                                return <button type='button' data-bs-target='#productThumbnailSlider' data-bs-slide-to={index} className='active'
                                 aria-current='true' aria-label='Slide 1'></button>
                            }else{
                                return <button type='button' data-bs-target='#productThumbnailSlider' data-bs-slide-to={index} 
                                aria-current='true' aria-label='Slide 1'></button>
                            }
                        })}
                    </div>
                    <div className='carousel-inner'>
                        {productImgs.map((img,index)=>{
                            if(index === 0){
                                return <div className='carousel-item active'>
                                    <img src={img.image} className='img-thumbnail mb-5' style={{  height: '250px',width: '400px',objectFit: 'cover' }} alt={index} />
                                </div>
                            }else{
                                return <div className='carousel-item'>
                                    <img src={img.image} className='img-thumbnail mb-5'  style={{  height: '250px',width: '400px',objectFit: 'cover' }} alt={index} />
                                </div>
                            }
                        })}
                    </div>
                    <button className='carousel-control-prev' type='button' data-bs-target='#productThumbnailSlider' data-bs-slide="prev">
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button' data-bs-target='#productThumbnailSlider' data-bs-slide="next">
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>
            </div>
            <div className='col-8'>
                <h3> {productData.title} </h3>
                <p>{productData.detail}</p>
                {
                    CurrencyData != 'usd' && <h6 className="card-title">Price: Rs.{productData.price}</h6>
                }
                {
                    CurrencyData == 'usd' && <h6 className="card-title">Price: ${productData.usd_price}</h6>
                }
                {productData.vendor ? (
                    <p>
                        Vendor: <Link to={`/seller/${productData.vendor.user.username}/${productData.vendor.id}`}>{productData.vendor.user.first_name} {productData.vendor.user.last_name}</Link>
                    </p>
                    ) : (
                    <p>Loading...</p>
                )}
                 <p>
                    <div className='card-footer mt-3'>
                        <a title='Demo' href={productData.demo_url} target='_blank' className='btn btn-dark me-1'>
                            <i className='fa-solid fa-cart-plus'></i> Demo
                        </a>
                        { !cartButtonClickStatus && 
                            <button title="Add to Cart" type='button' onClick={cartAddButtonHandler} className='btn btn-primary'><i className="fa-solid fa-cart-plus"></i> Add to Cart</button>
                        }
                        { cartButtonClickStatus && 
                            <button title="Remove from Cart" type='button' onClick={cartRemoveButtonHandler} className='btn btn-warning'><i className="fa-solid fa-cart-plus"></i> Remove from Cart</button>
                        }
                        <button title="Buy Now" className='btn btn-success ms-1'><i className="fa-solid fa-bag-shopping"></i> Buy Now</button>
                        {
                            (userContext.login && !ProductInWishlist) && <button onClick={saveInWishList} title="Add to Wishlist" className='btn btn-danger ms-1'><i className="fa fa-heart"></i> Wishlist</button>
                        }
                        {
                            userContext.login == null && <button title="Add to Wishlist" className='btn btn-danger ms-1 disabled'><i className="fa fa-heart"></i> Wishlist</button>
                        }
                        {
                            (userContext.login && !ProductInWishlist) && <button title="Add to Wishlist" className='btn btn-danger ms-1 disabled'><i className="fa fa-heart"></i> Wishlist</button>
                        }
                    </div>
                 </p>
                 <div className='producttags mt-3'>
                    <h5>Tags</h5>
                    <p>
                        {tagsLinks}
                    </p>
                 </div>
            </div>
        </div>
        {/* Related Products */}
        {relatedProducts.length > 0 &&
            <>
            <h3 className='text-center mb-3 mt-4'>Related Products</h3>
                <OwlCarousel className='owl-theme' items={5} loop margin={10}>
                    {relatedProducts.map((product,index)=>{
                        return <div class='item'>
                            <SingleRelatedProduct key={index} product={product} />
                        </div>    
                    })}
                </OwlCarousel>
            </>
        }
        {/* End Related Products */}
    </section>
 );
}

export default ProductDetail;



