import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context';
import axios from 'axios';
import { CartContext,CurrencyContext } from '../Context';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import useRazorpay from "react-razorpay"

const baseUrl = 'http://127.0.0.1:8000/api';
function ConfirmOrder() {
    const [Razorpay] = useRazorpay();
    const [ConfirmOrder,SetConfirmOrder]=useState(false)
    const [orderId,SetorderId]=useState('')
    const [orderAmount,SetorderAmount]=useState(0)
    const [OrderStatus,SetOrderStatus]=useState(false)
    const [PayMethod,SetPayMethod]=useState('')
    const userContext = useContext(UserContext);
    const {cartData,setCartData}=useContext(CartContext)
    const {CurrencyData}=useContext(CurrencyContext)
    
    if (!userContext) {
        window.location.href = "/customer/login"
    } else {
        if(ConfirmOrder==false){
            addOrderInTable();
        }
    }
    
    function addOrderInTable() {
        const customerId = localStorage.getItem('customer_id');

        var total_amount=0
        var total_usd_amount=0
        var previousCart=localStorage.getItem('cartData')
        var cartJson=JSON.parse(previousCart)
        cartJson.map((cart,index)=>{
            total_amount+=parseFloat(cart.product.price)
            total_usd_amount+=parseFloat(cart.product.usd_price)
        });

        // console.log(customerId)
        console.log(customerId,total_amount,total_usd_amount)
        const formData = new FormData();
        formData.append('customer', customerId);
        formData.append('total_amount', total_amount);
        formData.append('total_usd_amount', total_usd_amount);

        // Submit Data
        axios.post(baseUrl+'/orders/',formData)
        .then(function(response) {
            var orderId=response.data.id
            SetorderId(orderId)
            if(CurrencyData=='usd'){
                SetorderAmount(response.data.total_usd_amount)
            }else{
                SetorderAmount(response.data.total_amount)
            }
            orderItems(orderId)
            SetConfirmOrder(true)
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    function updateOrderStatus(order_status,transData={}){
        const trans_data=new FormData();
        // Submit Data
        if(transData){
            trans_data.append('trans_ref',transData.trans_ref);
            trans_data.append('payment_mode',transData.payment_mode);
        }
        axios.post(baseUrl+'/update-order-status/'+orderId,trans_data)
        .then(function(response) {
            window.location.href='/order/success';
        })
        .catch(function(error) {
            window.location.href='/order/failure';
        });
    }

    function orderItems(orderId){
        var previousCart=localStorage.getItem('cartData')
        var cartJson=JSON.parse(previousCart)

        if(cartJson!=null){
            var sum=0;
            cartJson.map((cart,index)=>{
                const formData = new FormData();
                formData.append('order', orderId);
                formData.append('product', cart.product.id);
                formData.append('qty', 1);
                formData.append('price', cart.product.price);
                formData.append('usd_price', cart.product.usd_price);

        
                axios.post(baseUrl + '/orderitems/', formData)
                .then(function(response) {
                    // Remove Cart Items from local storage
                    cartJson.splice(index, 1)
                    localStorage.setItem('cartData',JSON.stringify(cartJson))
                    setCartData(cartJson)
                })
                .catch(function(error) {
                    console.log(error);
                });
            })
        }

    }

    function changePaymentMethod(payMethod){
        SetPayMethod(payMethod)
    }

    function PayNowButton(){
        if (PayMethod!=''){
            changePaymentMethod(PayMethod)
            if(PayMethod=='razorpay'){
                razorPayHandler();
            }
        }else{
            alert('Select Payment Method!!')
        }
    }

    function razorPayHandler(){
        var razorPayData=new FormData();
        var order_amount=orderAmount*100;
        razorPayData.append('amount',order_amount)
        razorPayData.append('order_id',orderId)
        // Submit Data
        axios.post(baseUrl+'/create-razorpay-order/',razorPayData)
        .then(function(response){
            if(response.data.bool==true){
                const options = {
                    key: 'rzp_test_oy9pi3SdZpttG2', // Enter the Key ID generated from the Dashboard
                    amount: orderAmount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    currency: "INR",
                    name: orderId,
                    description: "Test Transaction",
                    image: "https://example.com/your_logo",
                    order_id: response.data.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
                    handler: function (response) {
                    //   alert(response.razorpay_payment_id);
                    //   alert(response.razorpay_order_id);
                    //   alert(response.razorpay_signature);
                    updateOrderStatus(true,{
                        'trans_ref':response.razorpay_payment_id,
                        'payment_mode':'razorpay'
                    });
                    },
                    theme: {
                      color: "#3399cc",
                    },
                  };
                
                  const rzp1 = new Razorpay(options);
                
                  rzp1.on("payment.failed", function (response) {
                    alert(response.error.code);
                    alert(response.error.description);
                    alert(response.error.source);
                    alert(response.error.step);
                    alert(response.error.reason);
                    alert(response.error.metadata.order_id);
                    alert(response.error.metadata.payment_id);
                    // window.location.href='/orderfailure'
                  });
                
                  rzp1.open();
            }
        })
        .catch(function(error){
            console.log(error)
            window.location.href='/order/failure';
        })
    }

    // dummy data
    const [timestamp, setTimestamp] = useState(0);

    const generateTimestamp = () => {
        const newTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
        setTimestamp(newTimestamp);
      };

      useEffect(() => {
        generateTimestamp(); // Generate timestamp when component mounts
      }, []);
    // dummy data ends


    return (
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-6 offset-3'>
                    <div className='card py-3 text-center'>
                        <h3><i className='fa fa-check-circle text-success'></i>Your Order has been Confirmed</h3>
                        <h5>ORDER ID: {orderId} {timestamp}</h5>
                    </div>
                    <div className='card p-3 mt-4'>
                        <form>
                            {
                                CurrencyData=='usd'  &&
                                <>
                                    <div className='form-group'>
                                        <label>
                                            <input type='radio' onChange={()=>changePaymentMethod('paypal')} name='payMethod'/> PayPal
                                        </label>
                                    </div>
                                </>
                            }
                            {
                                CurrencyData!='usd' &&
                                <div className='form-group'>
                                <label>
                                    <input type='radio' onChange={()=>changePaymentMethod('razorpay')} name='payMethod'/> Razorpay
                                </label>
                            </div>
                            }
                            <button type='button' onClick={PayNowButton} className='btn btn-sm btn-success mt-3'>Next</button>
                        </form>
                        { PayMethod == 'paypal' &&
                            <PayPalScriptProvider options=
                            {{ "client-id":"AVYNcji159TZQa4smtUTZ2m5YKQUE3WV4wrqIK_p10VV-G_Qrfo6Q8vcTXP4FW7p78jPTKVvrCUT_WXG" }}>
                            <PayPalButtons className='mt-3'
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    currency_code: 'USD',
                                                    value: orderAmount,
                                                },
                                            },
                                        ],
                                    })
                                }}
                                onApprove={(data,actions) => {
                                    return actions.order.capture().then((details) => {
                                        const name = details.payer.name.given_name;
                                        alert(`Transaction completed by ${name}`)
                                        updateOrderStatus(orderId,true,{
                                            'trans_ref':details.id,
                                            'payment_mode':'paypal'
                                        })
                                    })
                                }}
                            />
                            </PayPalScriptProvider>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmOrder;

