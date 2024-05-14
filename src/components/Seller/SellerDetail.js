import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { UserContext, CurrencyContext } from '../../Context';
import SingleProduct from '../SingleProduct';

function SellerDetail() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const [ProductList, setProductList] = useState([]);
    const [VendorData, setVendorData] = useState({
        'profile_img':'',
        'user':{
            'username':'',
            'total_products':0
        }
    });
    const { seller_username, seller_id } = useParams();
    const userContext = useContext(UserContext);
    const { CurrencyData } = useContext(CurrencyContext);

    useEffect(() => {
        fetchProducts(baseUrl + '/vendor-products/' + seller_id);
        fetchVendor(baseUrl + '/vendor/' + seller_id);
    }, []);

    function fetchProducts(baseurl) {
        fetch(baseurl)
           .then((response) => response.json())
           .then((data) => {
                setProductList(data.results);
            });
    }

    function fetchVendor(baseurl) {
        fetch(baseurl)
           .then((response) => response.json())
           .then((data) => {
                console.log(data.user.first_name);
                setVendorData(data);
            });
    }

    // Ensure the component re-renders when VendorData updates
    // useEffect(() => {
    //     if (VendorData.user) {
    //         console.log(VendorData.user.first_name); // This should now log the first name correctly
    //     }
    // }, [VendorData]);

    return (
        <section className='container mt-4'>
            <div className='row mb-4'>
                <div className='col-3'>
                    <img src={VendorData.profile_img} className='img-thumbnail' alt={VendorData} />
                </div>
                <div className='col-9'>
                    {
                        VendorData.user.first_name && <h3>{VendorData.user? VendorData.user.first_name : 'Loading...'} {VendorData.user? VendorData.user.last_name : ''}</h3>
                    }
                    {
                        !VendorData.user.first_name && <h3>{VendorData.user? VendorData.user.username : 'Loading...'}</h3>
                    }
                    <p>Total Products: {VendorData.user? VendorData.total_products :''}</p>
                </div>
            </div>
            <div className='row'>
                {
                    ProductList.map((product) => <SingleProduct product={product} />)
                }
            </div>
        </section>
    );
}

export default SellerDetail;
