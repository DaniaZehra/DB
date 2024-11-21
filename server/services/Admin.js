import db from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

class Admin {
    // View Analytics function
    static async viewAnalytics(transporterId) {
      //const client = await getClient();  // Get the database client
      try {
        // SQL query to fetch analytics for a specific transporter or all transporters
        const query = `
          SELECT profit, average_rating, total_revenue, transporters_transporter_id 
          FROM analytics
          WHERE transporters_transporter_id = $1
        `;
        
        // Execute query with the given transporterId (pass null if you want to fetch all transporters)
        const result = await db.query(query, [transporterId]);
  
        if (result.rows.length === 0) {
          console.log('No analytics data found for the given transporter.');
          return null;  // Return null if no data found
        }
  
        // Return the analytics data
        return result.rows;
      } catch (err) {
        console.error('Error retrieving analytics data:', err);
        throw new Error('Error retrieving analytics data');
      } finally {
        await client.end();  // Ensure the client is closed after the query
      }
    }
  }

  export default Admin;