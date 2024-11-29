/* eslint-disable no-case-declarations */

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { fetchSalesData } from "../../../api/adminApi";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart: React.FC = () => {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching
      try {
        const salesDataResponse = await fetchSalesData(filter);
        const salesData = Array.isArray(salesDataResponse) ? salesDataResponse : salesDataResponse?.data;

        if (!Array.isArray(salesData)) {
          throw new Error("Invalid sales data format.");
        }

        // Format the labels and data points based on the filter
        const labels = salesData.map((data: any) => {
          switch (filter) {
            case "weekly":
              const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              return data._id; // Assuming _id represents the day index (0-6)
              
            case "monthly":
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return months[(data._id-1) % 12]; // Assuming _id represents the month index (0-11)
              
            case "yearly":
              return `Year ${data._id}`; // For yearly, you can just use the year or the _id value directly
        
            default:
              return data._id; // If no filter, return the raw value of _id
          }
        });
       
        const dataPoints = salesData.map((data: any) => data.totalRevenue);


    

        // Set the chart data
        setChartData({
          labels,
          datasets: [
            {
              label: "Total Revenue",
              data: dataPoints,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error: any) {
        setError(error.message || "Failed to fetch sales data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>
             
            </div>
          </div>
        </div>
        {/* Filter Buttons */}
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            {["weekly", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as "weekly" | "monthly" | "yearly")}
                className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${
                  filter === type ? "bg-white" : "bg-whiter"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading, Error, or Chart */}
      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData ? (
        <div id="chartOne" className="-ml-5">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
              },
            }}
          />
        </div>
      ) : (
        <p>No data available for the selected filter.</p>
      )}
    </div>
  );
};

export default SalesChart;









// import React, { useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { fetchSalesData } from "../../../api/adminApi";

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const SalesChart: React.FC = () => {
//   const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">("weekly");
//   const [chartData, setChartData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null); // Reset error before fetching
//       try {
//         const salesDataResponse = await fetchSalesData(filter);
//         const salesData = Array.isArray(salesDataResponse)
//           ? salesDataResponse
//           : salesDataResponse?.data;

//         if (!Array.isArray(salesData)) {
//           throw new Error("Invalid sales data format.");
//         }

//         // Format the labels and data points based on the filter
//         const labels = salesData.map((data: any) => {
//           switch (filter) {
//             case "weekly":
//               return `Day ${data._id}`; // Use the correct key for weekly data
//             case "monthly":
//               return `Day ${data._id}`; // Use the correct key for monthly data
//             case "yearly":
//               return `Month ${data._id}`; // Use the correct key for yearly data
//             default:
//               return data._id;
//           }
//         });

//         const dataPoints = salesData.map((data: any) => data.totalRevenue);

//         // Set the chart data
//         setChartData({
//           labels,
//           datasets: [
//             {
//               label: "Total Revenue",
//               data: dataPoints,
//               backgroundColor: "rgba(75, 192, 192, 0.6)",
//               borderColor: "rgba(75, 192, 192, 1)",
//               borderWidth: 1,
//             },
//           ],
//         });
//       } catch (error: any) {
//         setError(error.message || "Failed to fetch sales data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [filter]);

//   return (
//     <div>
//       {/* Filter Buttons */}
//       <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
//         {["weekly", "monthly", "yearly"].map((type) => (
//           <button
//             key={type}
//             onClick={() => setFilter(type as "weekly" | "monthly" | "yearly")}
//             style={{
//               backgroundColor: filter === type ? "#4caf50" : "#e0e0e0",
//               border: "none",
//               padding: "10px 20px",
//               cursor: "pointer",
//               borderRadius: "5px",
//               fontWeight: filter === type ? "bold" : "normal",
//             }}
//           >
//             {type.charAt(0).toUpperCase() + type.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Loading, Error, or Chart */}
//       {loading ? (
//         <p>Loading chart...</p>
//       ) : error ? (
//         <p style={{ color: "red" }}>{error}</p>
//       ) : chartData ? (
//         <Bar
//           data={chartData}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 display: true,
//               },
//             },
//           }}
//         />
//       ) : (
//         <p>No data available for the selected filter.</p>
//       )}
//     </div>
//   );
// };

// export default SalesChart;
