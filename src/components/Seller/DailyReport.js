import React, { useEffect, useState } from 'react'
import SellerSidebar from './SellerSidebar'
import Chart from "react-apexcharts";

function DailyReport() {
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const [Dates, setDates] = useState([])
    const [Data, setData] = useState([])



// ___________________________________________________________________________________________________________________________________________________


// Generate random dummy data for dates
const generateRandomDates = (count) => {
  const startDate = new Date('2024-04-01');
  const dates = [];
  for (let i = 0; i < count; i++) {
    const randomOffset = Math.floor(Math.random() * 30); // Random number between 0 and 29
    const date = new Date(startDate);
    date.setDate(date.getDate() + randomOffset);
    dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  }
  return dates;
};

// Generate random dummy data for values
const generateRandomData = (count, min, max) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    data.push(randomValue);
  }
  return data;
};

const dummyDates = generateRandomDates(5); // Generate 5 random dates
const dummyData = generateRandomData(5, 50, 200); // Generate 5 random data values between 50 and 200



// ___________________________________________________________________________________________________________________________________________________


    function fetch_report(baseUrl) {
      fetch(baseUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.show_chart_daily_orders) {
            setDates(data.show_chart_daily_orders.dates);
            setData(data.show_chart_daily_orders.data);
          } else {
            // Use randomly generated dummy data if actual data is not available
            setDates(generateRandomDates(5)); // Generate 5 random dates
            setData(generateRandomData(5, 50, 200)); // Generate 5 random data values between 50 and 200
          }
        });
    }

    useEffect(() =>{
        const vendor_id = localStorage.getItem('vendor_id')
        console.log('this is vendor id',vendor_id)
        fetch_report(baseUrl+'vendor/'+vendor_id+'/');
    },[])

    const chartOptions={
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: Dates
        }
      },
      series: [
        {
          name: "Orders",
          data: Data
        }
      ]
    }
  
    const chartElement=<Chart options={chartOptions.options} series={chartOptions.series} type="bar" width="500"/>


return (
    <div className='container mt-4'>
        <div className='row'>
            <div className='col-md-3 col-12 mb-2'>
                <SellerSidebar/>
            </div>
            <div className='col-md-9 col-12 mb-2'>
                <h2>Daily Report</h2>
                <div className='row mt-2'>
                    {chartElement}
                </div>
            </div>
        </div>
    </div>
  )
}

export default DailyReport