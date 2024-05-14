import { Link } from 'react-router-dom';
import SingleProduct from './SingleProduct';
import {useState,useEffect} from 'react';
import Testimonial from './Testimonial';
import SingleSeller from './Seller/SingleSeller';
import logo from '../logo.svg';


function Home() {
  const baseUrl='http://127.0.0.1:8000/api';
  const [products, setProducts] = useState([])
  const [ReviewList, setReviewList] = useState([])
  const [VendorList, setVendorList] = useState([])
  const [PopularProductList, setPopularProductList] = useState([])
  const [PopularCategoryList, setPopularCategoryList] = useState([])

  useEffect(() => {
    fetchData(baseUrl+'/products/?fetch_limit=4');
    fetchTestimonialData(baseUrl+'/productrating/');
    fetchPopularVendors(baseUrl+'/vendors/?fetch_limit=4');
    fetchPopularProducts(baseUrl+'/products/?popular=4');
    fetchPopularCategories(baseUrl+'/categories/?popular=4');
  },[]);

  function fetchData(baseurl){
    fetch(baseurl)
    .then((response) => response.json())
    .then((data) => {
      setProducts(data.results)
    });
  }

  function fetchTestimonialData(baseurl){
    fetch(baseurl)
    .then((response) => response.json())
    .then((data) => {
        setReviewList(data.results)
    });
  }

  
  function fetchPopularVendors(baseurl){
    fetch(baseurl)
    .then((response) => response.json())
    .then((data) => {
      setVendorList(data.results)
    });
  }

  function fetchPopularProducts(baseurl){
    fetch(baseurl)
    .then((response) => response.json())
    .then((data) => {
      setPopularProductList(data.results)
    });
  }

  function fetchPopularCategories(baseurl){
    fetch(baseurl)
    .then((response) => response.json())
    .then((data) => {
      setPopularCategoryList(data.results)
    });
  }

  const imgStyle = {
    width: '100%',
    height: '10vw',
    ObjectFit:'contain',
}

  return (
    <div>
        <main className='mt-4'>
        <div className='container'>
          {/* Latest Products */}
          <h3 className='mb-4'>Latest Products <Link to='/products' className='float-end btn btn-dark'>View All Products <i className="fa-solid fa-arrow-right-long"></i></Link></h3>
          <div className='row mb-4'>
            {
              products.map((product)=><SingleProduct product={product}/>)
            }          
          </div>
          {/* End Latest Products */}

          {/* Popular Products */}
          <h3 className='mb-4'>Popular Products <Link to='/products' className='float-end btn btn-dark'>View All Products <i className="fa-solid fa-arrow-right-long"></i></Link></h3>
          <div className='row mb-4'>
            {
              PopularProductList.map((product)=><SingleProduct product={product}/>)
            }   
          </div>
          {/* End Popular Products */}



          {/* Popular Categories */}
          <h3 className='mb-4'>Popular Categories <Link to='/categories' className='float-end btn btn-dark'>View All Categories <i className="fa-solid fa-arrow-right-long"></i></Link></h3>
          <div className='row mb-4'>
            {
              PopularCategoryList.map((category)=>
              <div className='col-12 col-md-3 mb-4'>
                <div className='card'>
                  <img style={imgStyle} src={category.cat_img} className="card-img-top" alt="{category.title}"/>
                  <div className='card-body'>
                    <h4 className='card-title'><Link to={`/category/${category.title}/${category.id}`} >{category.title}</Link></h4>
                  </div>
                  <div className='card-footer'>
                    Product Downloads: {category.total_downloads}
                  </div>
                </div>
              </div>
              )
            }
          </div>
          {/* End Popular Categories */}

          {/* Popular Sellers */}
          <h3 className='mb-4'>Popular Sellers <Link to='/sellers' className='float-end btn btn-dark'>View All Sellers <i className="fa-solid fa-arrow-right-long"></i></Link></h3>
          <div className='row mb-4'>
            {
              VendorList.map((vendor)=> <SingleSeller seller={vendor} />)
            }            
          </div>
          {/* End Popular Sellers */}

          {/* Rating and Reviews */}
          <div id="carouselExampleIndicators" className="carousel slide my-4 border bg-dark text-white p-5
          " data-bs-ride="carousel">
            <div className="carousel-indicators">    
              {
                ReviewList.map((item,index)=><button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} className="active" aria-current="true" aria-label={index}></button>)
              }
            </div>
            <div className="carousel-inner">
              {
                ReviewList.map((item,index)=><Testimonial index={index} item={item} />)
              }
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        {/* End Rating and Reviews */}
        </div>
      </main>
    </div>
  )
}

export default Home