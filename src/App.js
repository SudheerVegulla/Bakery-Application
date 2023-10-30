import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

const App = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedChart, setSelectedChart] = useState("numberOfOrders");
  const [chartType, setChartType] = useState("numberOfOrders");
  const [filterType, setFilterType] = useState("");
  const [filterState, setFilterState] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (
      (!filterType || order.itemType === filterType) &&
      (!filterState || order.orderState === filterState) &&
      (!startDate || new Date(order.lastUpdateTime) >= startDate) &&
      (!endDate || new Date(order.lastUpdateTime) <= endDate)
    ) {
      return true;
    }
    return false;
  });

  const dummyOrders = [
    {
      itemType: "Cake",
      orderState: "Created",
      lastUpdateTime: "2023-10-30T08:00:00",
    },
    {
      itemType: "Cookies",
      orderState: "Shipped",
      lastUpdateTime: "2023-10-30T09:00:00",
    },
    {
      itemType: "Cake",
      orderState: "Delivered",
      lastUpdateTime: "2023-10-30T10:00:00",
    },
    {
      itemType: "Muffins",
      orderState: "Created",
      lastUpdateTime: "2023-10-30T11:00:00",
    },
    {
      itemType: "Muffins",
      orderState: "Delivered",
      lastUpdateTime: "2023-10-30T12:00:00",
    },
  ];

  const getChartData = () => {
    switch (chartType) {
      case "numberOfOrders":
        return {
          options: {
            xaxis: {
              categories: ["Hour 1", "Hour 2", "Hour 3", "Hour 4", "Hour 5"],
            },
          },
          series: [
            {
              name: "Number of Orders (Last 5 Hours)",
              data: [5, 7, 12, 8, 10],
            },
          ],
        };
      case "totalValue":
        return {
          options: {
            xaxis: {
              categories: ["Hour 1", "Hour 2", "Hour 3", "Hour 4", "Hour 5"],
            },
          },
          series: [
            {
              name: "Total Value (Rs) (Last 5 Hours)",
              data: [2500, 3500, 2000, 4000, 5000],
            },
          ],
        };
      default:
        return null;
    }
  };

  const timeSeriesData = getChartData();

  const barChartOptions = {
    chart: {
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      categories: ["Cake", "Muffin", "Cookies"],
    },
  };
  const barChartData = [
    {
      name: "Number of Orders",
      data: [20, 15, 30],
    },
  ];

  const barChartStateData = {
    options: {
      xaxis: {
        categories: ["Created", "Shipped", "Delivered", "Canceled"],
      },
    },
    series: [
      {
        name: "Number of Orders",
        data: [10, 15, 20, 5],
      },
    ],
  };

  const applyFilters = () => {};

  return (
    <div className="container">
      <h1>Star Bakery Dashboard</h1>
      <div className="section">
        <h2>Time Selector</h2>
        <div className="date-picker">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
          />
          <button onClick={applyFilters} className="apply-button">
            Apply
          </button>
        </div>
      </div>
      <div className="section order-data-section">
        <h2>Order Data</h2>
        <label>
          Filter by Type:
          <select onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All</option>
            <option value="Cake">Cake</option>
            <option value="Cookies">Cookies</option>
            <option value="Muffins">Muffins</option>
          </select>
        </label>
        <label>
          Filter by State:
          <select onChange={(e) => setFilterState(e.target.value)}>
            <option value="">All</option>
            <option value="Created">Created</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
        </label>
      </div>
      <div className="section">
        <h2>Time Series Chart</h2>
        <label>
          Chart:
          <select onChange={(e) => setChartType(e.target.value)}>
            <option value="numberOfOrders">Number of Orders</option>
            <option value="totalValue">Total Value (Rs)</option>
          </select>
        </label>
        <ReactApexChart
          options={timeSeriesData.options}
          series={timeSeriesData.series}
          type="line"
        />
      </div>
      <div className="section">
        <h2>Bar Chart - Orders by Type</h2>
        <ReactApexChart
          options={barChartOptions}
          series={barChartData}
          type="bar"
        />
      </div>
      <div className="section">
        <h2>Bar Chart - Orders by State</h2>
        <ReactApexChart
          options={barChartStateData.options}
          series={barChartStateData.series}
          type="bar"
        />
      </div>
    </div>
  );
};

export default App;
