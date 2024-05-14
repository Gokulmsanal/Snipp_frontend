import { Link } from 'react-router-dom';
import React from 'react';
import logo from '../../logo.svg'

function SingleSeller(props) {    
    const imgStyle = {
        width: '100%',
        height: '10vw',
        ObjectFit:'contain',
    }

    if(!props.seller.profile_img){
        props.seller.profile_img=logo;
    }


 return (
    <div className='col-12 col-md-3 mb-4'>
        <div className="card">
            <Link to={`/seller/${props.seller.user.username}/${props.seller.id}`}>
                <img src={props.seller.profile_img} className="card-img-top" style={imgStyle} alt={props.seller.user.username}/>
            </Link>
            <div className="card-body">
                <h5 className="card-title"><Link to={`/seller/${props.seller.user.username}/${props.seller.id}`}>{props.seller.user.username}</Link></h5>
            </div>
            <div className='card-footer'>
                {
                    props.seller.categories.map((item)=><Link className='me-1' to={`/category/${item.category__title}/${item.category__id}`}>{item.category__title}</Link>)
                }
            </div>
        </div>
    </div>
 );
}

export default SingleSeller;
