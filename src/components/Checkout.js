import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import { CartContext,CurrencyContext } from '../Context';
import { useContext,useState } from 'react';

function Checkout(props) {
    const [cartButtonClickStatus, setcartButtonClickStatus] = useState(false)
    const [productData, setproductData] = useState([])
    const {cartData,setCartData}=useContext(CartContext)
    const {CurrencyData}=useContext(CurrencyContext)



    const cartItems = cartData ? cartData.length : 0; // Calculate the number of cart items

    // const cartAddButtonHandler = () => {
    //     var previousCart = localStorage.getItem('cartData');
    //     var cartJson = JSON.parse(previousCart);
    //     var cartData = {
    //         'product': {
    //             'id': productData.id,
    //             'title': productData.title
    //         },
    //         'user': {
    //             'id': 1
    //         }
    //     };
    //     if (cartJson != null && Array.isArray(cartJson)) { // Check if cartJson is not null and is an array
    //         cartJson.push(cartData);
    //         var cartString = JSON.stringify(cartJson);
    //         localStorage.setItem('cartData', cartString);
    //         setCartData(cartJson);
    //     } else {
    //         var newCartList = [];
    //         newCartList.push(cartData);
    //         var cartString = JSON.stringify(newCartList);
    //         localStorage.setItem('cartData', cartString);
    //     }
    //     setcartButtonClickStatus(true);
    // };


    var sum=0;
    cartData.map((item,index)=>{
        if(CurrencyData =='inr' || CurrencyData == undefined){
            sum+=parseFloat(item.product.price)
        }else if(CurrencyData =='usd'){
            sum+=parseFloat(item.product.usd_price)
        }
    })

    const cartRemoveButtonHandler = (product_id) => {
        var previousCart = localStorage.getItem('cartData');
        var cartJson = JSON.parse(previousCart);
    
        // Filter out the item to remove from the cartJson array
        var updatedCartJson = cartJson.filter(cart => cart !== null && cart.product.id !== product_id);
    
        var cartString = JSON.stringify(updatedCartJson);
        localStorage.setItem('cartData', cartString);
        
        // Update cart button click status
        setcartButtonClickStatus(false);
        
        // Update cart data context
        setCartData(updatedCartJson);
    }
    return (
        <div className='container mt-4'>
            <h3 className='mb-4'>All Items ({cartItems})</h3>
            {cartData && cartData.length > 0 ? (
                <div className='row'>
                    <div className='`col-12'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Link to={`/product/${item.product.id}`}>
                                                    <img src={item.product.image} className="img-thumbnail" width='80' alt="logo"/>
                                                </Link>
                                                <p><Link to={`/product/${item.product.id}`}>{item.product.title}</Link></p>
                                            </td>
                                            {
                                                (CurrencyData =='inr' || CurrencyData == undefined) && <td>Rs. {item.product.price}</td>

                                            }
                                            {
                                                CurrencyData =='usd' && <td>$ {item.product.usd_price}</td>

                                            }
                                            <td>
                                            <button title="Remove from Cart" type='button' onClick={()=>cartRemoveButtonHandler(item.product.id)} className='btn btn-warning'><i className="fa-solid fa-cart-plus"></i> Remove from Cart</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>Total</th>
                                        {
                                            (CurrencyData =='inr' || CurrencyData == undefined) && <td>Rs. {sum}</td>

                                        }
                                        {
                                            CurrencyData =='usd' && <td>$ {sum}</td>

                                        }
                                    </tr>
                                    <tr>
                                        <td colSpan='3' align='center'>
                                            <Link to="/categories" className='btn btn-secondary'>Continue Shopping</Link>
                                            <Link to="/confirm-order" className='btn btn-success ms-1'>Proceed</Link>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='row'>
                    <div className='col-12'>
                        <Link to="/categories" className='btn btn-success'>Home</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;
