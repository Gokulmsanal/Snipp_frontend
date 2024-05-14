import { Link } from 'react-router-dom';
import React,{useState,useEffect} from 'react';
import { useContext } from 'react'
import { UserContext,CartContext, CurrencyContext } from '../Context';
import logo from '../logo.svg'
import axios from 'axios';

function SingleProduct(props) {
    const baseUrl='http://127.0.0.1:8000/api';
    const [cartButtonClickStatus, setcartButtonClickStatus] = useState(false)
    const [ProductInWishlist, setProductInWishlist] = useState(false)
    const {cartData,setCartData}=useContext(CartContext)
    const {CurrencyData}=useContext(CurrencyContext)
    const userContext = useContext(UserContext);

    if(!props.product.image){
        props.product.image=logo;
    }

    const product_id=props.product.id
    const productData=props.product;
    const imgStyle = {
        width: '100%',
        height: '10vw',
        ObjectFit:'contain',
        padding:'20px',
        background:'#f9f9f9'
    }

    
    useEffect(() => {
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
    <div className='col-12 col-lg-3 col-md-4 col-sm-6 mb-4'>
        <div className="card">
        <Link to={`/product/${props.product.slug}/${props.product.id}`}>
          <img src={props.product.image} className="card-img-top" style={imgStyle} alt={props.product.title} />
        </Link>
            <div className="card-body">
                <h5 className="card-title">
                 <Link to={`/product/${props.product.slug}/${props.product.id}`}> 
                    {props.product.title} 
                 </Link>
                </h5>
                {
                    CurrencyData != 'usd' && <h6 className="card-title text-muted">Price: Rs.{props.product.price}</h6>
                }
                {
                    CurrencyData == 'usd' && <h6 className="card-title text-muted">Price: ${props.product.usd_price}</h6>
                }
            </div>
            <div className='card-footer'>
                { !cartButtonClickStatus && 
                    <button title="Add to Cart" type='button' onClick={cartAddButtonHandler} className='btn btn-success btn-sm'><i className="fa-solid fa-cart-plus"></i></button>
                }
                { cartButtonClickStatus && 
                    <button title="Remove from Cart" type='button' onClick={cartRemoveButtonHandler} className='btn btn-warning btn-sm'><i className="fa-solid fa-cart-plus"></i></button>
                }

                {
                    (userContext.login && !ProductInWishlist) && <button onClick={saveInWishList} title="Add to Wishlist" className='btn btn-danger ms-1 btn-sm'><i className="fa fa-heart"></i></button>
                }
                {
                    userContext.login == null && <button title="Add to Wishlist" className='btn btn-danger ms-1 btn-sm disabled'><i className="fa fa-heart"></i></button>
                }
                {
                    (userContext.login && !ProductInWishlist) && <button title="Add to Wishlist" className='btn btn-danger ms-1 btn-sm disabled'><i className="fa fa-heart"></i></button>
                }
            </div>
        </div>
    </div>
 );
}

export default SingleProduct;
