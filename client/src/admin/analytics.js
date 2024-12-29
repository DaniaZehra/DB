// import { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// function Analytics() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('7d'); // Default: Last 7 days
//   const projectId = '109798';

//   useEffect(() => {
//     const fetchQuery = async () => {
//       const url = `https://us.posthog.com/api/projects/${projectId}/query/`;
//       const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer phx_ZCdAIqVg3zh9UNekJP5Xu6OFzQJXTwaH41QCGSNbodstKA0',
//       };

//       const payload = {
//         query: {
//           kind: 'HogQLQuery',
//           query: `
//             SELECT 
//               toDate(timestamp) AS date,
//               count() AS pageview_count
//             FROM events
//             WHERE event = '$pageview' AND timestamp > now() - INTERVAL ${dateRange}
//             GROUP BY date
//             ORDER BY date DESC
//             LIMIT 20`,
//         },
//       };

//       console.log(payload);

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(url, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const responseData = await response.json();
//         const formattedResults = responseData.results.reverse().map(([date, count]) => ({
//           date,
//           pageviews: count,
//         }));
//         setData(formattedResults);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuery();
//   }, [dateRange]);

//   const exportData = () => {
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'analytics.json';
//     link.click();
//   };

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{ background: '#fff', padding: '10px', border: '1px solid #ccc' }}>
//           <p>{label}</p>
//           <p>Pageviews: {payload[0].value}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!Array.isArray(data) || data.length === 0) return <div>No data available</div>;

//   return (
//     <div>
//       <div style={{ marginBottom: '20px' }}>
//         <label htmlFor="dateRange">Select Date Range: </label>
//         <select
//           id="dateRange"
//           value={dateRange}
//           onChange={(e) => setDateRange(e.target.value)}
//         >
//           <option value="7d">Last 7 Days</option>
//           <option value="30d">Last 30 Days</option>
//           <option value="90d">Last 90 Days</option>
//         </select>
//       </div>
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart data={data}>
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip content={<CustomTooltip />} />
//           <Line type="monotone" dataKey="pageviews" stroke="#8884d8" />
//         </LineChart>
//       </ResponsiveContainer>
//       <button onClick={exportData} style={{ marginTop: '20px' }}>
//         Export Data
//       </button>
//     </div>
//   );
// }

// export default Analytics;



import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

function Analytics() {
  const [data, setData] = useState([])
  const projectId = "109798"

  useEffect(() => {
    const fetchQuery = async () => {
      const url = `https://us.posthog.com/api/projects/${projectId}/query/`;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer phx_ZCdAIqVg3zh9UNekJP5Xu6OFzQJXTwaH41QCGSNbodstKA0"
      };
  
      const payload = {
        "query": {
          "kind": "HogQLQuery",
          "query": `SELECT 
                      toDate(timestamp) AS date,
                      count() AS pageview_count
                    FROM events
                    WHERE event = '$pageview'
                    GROUP BY date
                    ORDER BY date DESC
                    LIMIT 20`
        }
      }
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        setData(data.results.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchQuery();
  }, []);

  const formattedData = data.map(([date, count]) => ({
    date,
    pageviews: count
  }));

  return (
    <>
    <LineChart width={600} height={400} data={formattedData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="pageviews" stroke="#8884d8" />
    </LineChart>
  </>
  )
}

export default Analytics

