import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './user.js';
import axios from 'axios'

dotenv.config();

class Customer extends User {
    static async findbyusername(username) {
        const rows = await db.query('SELECT * from customer where username = ?', [username]);
        return rows;
    }

    static async findbyemail(email) {
        const rows = await db.query('SELECT * from customer where cust_email = ?', [email]);
        return rows;
    }

    static async create(username, first_name, last_name, phone_number, password, email) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await db.query(
            'INSERT INTO customer (username, first_name, last_name, phone_number, cust_password, cust_email) VALUES (?, ?, ?, ?, ?, ?)',
            [username, first_name, last_name, phone_number, hashedPassword, email]
        );
    }

    static async saveRefreshToken(Id, refreshToken, type) {
        await db.query("DELETE FROM usertoken WHERE user_id = ? AND user_type = ?", [Id, type]);
        await db.query("INSERT INTO usertoken (user_id, user_type, token) VALUES (?, ?, ?)", [Id, type, refreshToken]);
    }

    static async BookCourier(customer_id, courier_name) {
        return await db.query('INSERT INTO couriers (customer_id, courier_name) values (?, ?)', [customer_id, courier_name]);
    }

    static async viewRoutes() {
        try {
            const query = 'SELECT route_id, stops, transporter_id, origin, destination FROM route';
            const rows = await db.query(query);
            return rows;
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    }

    static async getTrafficUpdates(origin, destination) {
        const API_KEY = 'AIzaSyD3X0SjDZocXb0C9TCtl9xdebH8MyjIwnI';

        const baseURL = 'https://maps.googleapis.com/maps/api/directions/json';

        try {
            const response = await axios.get(baseURL, {
                params: {
                    origin: origin,
                    destination: destination,
                    departure_time: 'now',
                    traffic_model: 'best_guess',
                    key: API_KEY,
                },
            });
            console.log(response.data);

            if (response.data.status === 'OK' && response.data.routes.length > 0) {
                const route = response.data.routes[0]; // Take the first route
                const leg = route.legs?.[0]; // Take the first leg of the route
                
                if (leg) {
                    return {
                        distance: leg.distance?.text || 'Distance not available',
                        duration: leg.duration?.text || 'Duration not available',
                        duration_in_traffic: leg.duration_in_traffic?.text || 'Traffic duration not available',
                        summary: route.summary || 'No summary available',
                    };
                } else {
                    throw new Error('Legs not found in the route.');
                }
            } else {
                throw new Error(`API Error: ${response.data.status}`);
            }
        } catch (error) {
            console.error('Error fetching traffic updates:', error.response?.data || error.message);
            throw error;
        }
    }

    static async estimateFare(origin, destination) {
        const apiKey = 'AIzaSyD3X0SjDZocXb0C9TCtl9xdebH8MyjIwnI';

        const baseFare = 120;
        const costPerKm = 40;
        const costPerMin = 2;
        const trafficSurcharge = 50;

        try {
            const departureTime = Math.floor(Date.now() / 1000);
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}&departure_time=${departureTime}&traffic_model=best_guess`
            );

            const data = await response.json();

            if (data.error_message) {
                throw new Error(`API Error: ${data.error_message}`);
            }

            const route = data.routes[0];
            const distanceInMeters = route.legs[0].distance.value;
            const durationInSeconds = route.legs[0].duration.value;

            const distanceInKm = distanceInMeters / 1000;
            const timeInMinutes = durationInSeconds / 60;

            const estimatedFare =
                baseFare +
                (costPerKm * distanceInKm) +
                (costPerMin * timeInMinutes) +
                trafficSurcharge;

            const finalFare = Math.ceil(estimatedFare);
            console.log(`Estimated Fare: ${finalFare} Rs`);
            return finalFare;
        } catch (error) {
            console.error('Error during fare estimation:', error);
            throw error;
        }
    }

    static async updateCustomerDetails(custId, updates) {
        try {
            const fieldMap = {
                'First Name': 'first_name',
                'Last Name': 'last_name',
                'Email': 'cust_email',
                'Phone Number': 'phone_number',
                'Username': 'username',
                'Password': 'password',
            };

            const updateKeys = Object.keys(updates).filter(key => fieldMap[key]);

            if (updateKeys.length === 0) {
                throw new Error('No valid fields to update.');
            }

            for (const key of updateKeys) {
                const dbColumn = fieldMap[key];

                if (dbColumn === 'password') {
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(updates[key], saltRounds);

                    const updatePasswordQuery = `
                        UPDATE customer
                        SET password = ?, updated_at = NOW()
                        WHERE cust_id = ?
                    `;
                    await db.query(updatePasswordQuery, [hashedPassword, custId]);
                } else {
                    const updateFieldQuery = `
                        UPDATE customer
                        SET ${dbColumn} = ?, updated_at = NOW()
                        WHERE cust_id = ?
                    `;
                    await db.query(updateFieldQuery, [updates[key], custId]);
                }
            }

            const selectQuery = `
                SELECT cust_id, first_name, last_name, cust_email, phone_number, username, updated_at
                FROM customer
                WHERE cust_id = ?
            `;
            const result = await db.query(selectQuery, [custId]);

            if (result.length === 0) {
                throw new Error('Customer not found or no changes made.');
            }

            console.log('Customer details updated successfully:', result[0]);
            return result[0];
        } catch (error) {
            console.error('Error updating customer details:', error.message);
            throw error;
        }
    }

    static async bookRide(custId, routeId, rideDate) {
        try {
          const routeQuery = 'SELECT transporter_id FROM route WHERE route_id = ?';
          const [routeResult] = await client.promise().query(routeQuery, [routeId]);
          if (routeResult.length === 0) {
            throw new Error('Invalid route_id selected.');
          }
          const transporterId = routeResult[0].transporter_id;
    
          const vehicleQuery = 'SELECT vehicle_id FROM vehicle WHERE transporter_id = ?';
          const [vehicleResult] = await db.query(vehicleQuery, [transporterId]);
          if (vehicleResult.length === 0) {
            throw new Error('No vehicle found for the selected transporter.');
          }
          const vehicleId = vehicleResult[0].vehicle_id;
    
          const feedbackInsertQuery = 'INSERT INTO feedback (comments) VALUES ("No feedback yet")';
          const [feedbackResult] = await db.query(feedbackInsertQuery);
          const feedbackId = feedbackResult.insertId;
    
          const bookingQuery = `
            INSERT INTO bookings (customer_id, vehicle_id, route_id, transporter_id, ride_date, feedback_id)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const [bookingResult] = await client.promise().query(bookingQuery, [
            custId,
            vehicleId,
            routeId,
            transporterId,
            rideDate,
            feedbackId,
          ]);
    
          console.log('Booking successful! Booking ID:', bookingResult.insertId);
          return bookingResult;
        } catch (error) {
          console.error('Error booking ride:', error.message);
          throw error;
        }
    }

    static async deleteCustomer(custId) {
        try {
            const deleteCustomerQuery = 'DELETE FROM customer WHERE cust_id = ?';
            await db.query(deleteCustomerQuery, [custId]);

            console.log('Customer and associated data deleted successfully.');
        } catch (error) {
            console.error('Error deleting customer:', error.message);
            throw error;
        }
    }
}

export default Customer;
