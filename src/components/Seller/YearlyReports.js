import React, { useEffect, useState } from 'react';
import SellerSidebar from './SellerSidebar';
import Chart from 'react-apexcharts';

function YearlyReports() {
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const [Dates, setDates] = useState([]);
    const [Data, setData] = useState([]);

    // Generate random dummy data for dates
    const generateRandomYears = (count) => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < count; i++) {
            const randomYear = Math.floor(Math.random() * 10) + currentYear - 9; // Random year in the last 10 years
            years.push(randomYear);
        }
        return years;
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

    function fetch_report(baseUrl) {
        fetch(baseUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.show_chart_yearly_orders) {
                    setDates(data.show_chart_yearly_orders.dates);
                    setData(data.show_chart_yearly_orders.data);
                } else {
                    // Use randomly generated dummy data for yearly orders if actual data is not available
                    setDates(generateRandomYears(5)); // Generate data for 5 random years
                    setData(generateRandomData(5, 50, 200)); // Generate 5 random data values between 50 and 200
                }
            });
    }

    useEffect(() =>{
        const vendor_id = localStorage.getItem('vendor_id');
        console.log('this is vendor id', vendor_id);
        fetch_report(baseUrl + 'vendor/' + vendor_id + '/');
    }, []);

    const chartOptions = {
        options: {
            chart: {
                id: 'basic-bar'
            },
            xaxis: {
                categories: Dates
            }
        },
        series: [
            {
                name: 'Orders',
                data: Data
            }
        ]
    };

    const chartElement = <Chart options={chartOptions.options} series={chartOptions.series} type="bar" width="500" />;

    return (
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                    <SellerSidebar />
                </div>
                <div className='col-md-9 col-12 mb-2'>
                    <h2>Yearly Report</h2>
                    <div className='row mt-2'>
                        {chartElement}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default YearlyReports;
