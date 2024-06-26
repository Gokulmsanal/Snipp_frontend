import { useEffect } from 'react';
import React,{useState} from 'react'
import logo from '../logo.svg';
import { Link } from 'react-router-dom'


function Categories() {
  const baseUrl='http://127.0.0.1:8000/api';
  const [categories, setCategories] = useState([])
  const [totalResult,setTotalResults]=useState(0);

  useEffect(() => {
    fetchData(baseUrl+'/categories');
  },[]);

  function fetchData(baseurl){
    fetch(baseurl)
    .then((response) => response.json())
    .then((data) => {
      setCategories(data.results)
      setTotalResults(data.count)
    });
  }

  function changeUrl(baseurl){
    fetchData(baseurl)
  }

  var links=[];
  var limit=1;
  var totalLinks=totalResult/limit;
  for (let i=1; i<=totalLinks; i++){
    links.push(<li className="page-item"><Link onClick={()=>changeUrl(baseUrl+`/categories/?page=${i}`)} to={`/categories/?page=${i}`} className="page-link">{i}</Link></li>)
  }

  const imgStyle = {
    width: '100%',
    height: '10vw',
    ObjectFit:'contain',
    padding:'20px',
    background:'#f9f9f9'
}

  return (
    <div>
        <section className='container mt-4'>
        {/* Categories */}
          <h3 className='mb-4'>All Categories</h3>
          <div className='row mb-2'>
            {
              categories.map((category)=>
            <div className='col-12 col-md-3 mb-4'>
              <div className="card">
              <Link to={`/category/${category.title}/${category.id}`} ><img style={imgStyle} src={category.cat_img} className="card-img-top" alt="{category.title}"/></Link>
                <div className="card-body">
                  <h5 className="card-title"><Link to={`/category/${category.title}/${category.id}`}>{category.title}</Link></h5>
                </div>
                <div className='card-footer'>
                  Product Downloads: {category.total_downloads}
                </div>
              </div>
            </div>  
            )
            }
            {/* Category Box */}
          </div>
            {/* Category Box End */}
          <nav aria-label="Page navigation example">
            <ul class="pagination">
                {links}
            </ul>
          </nav>
        </section>
    </div>
  )
}

export default Categories

