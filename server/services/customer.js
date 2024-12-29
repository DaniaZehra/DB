import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './user.js';
import axios from 'axios'

dotenv.config();

class Customer extends User {
    static async findbyusername(username) {
        const [rows] = await db.query('SELECT * from customer where username = ?', [username]);
        return rows;
    }

    static async findbyemail(email) {
        const rows = await db.query('SELECT * from customer where cust_email = ?', [email]);
        return rows;
    }

    static async create(username, first_name, last_name, password, email) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await db.query(
            'INSERT INTO customer (username, first_name, last_name, hashedPassword, cust_email) VALUES (?, ?, ?, ?, ?)',
            [username, first_name, last_name, hashedPassword, email]
        );
    }

    static async saveRefreshToken(Id, refreshToken) {
        await db.query("DELETE FROM customer_usertoken WHERE user_id = ?", [Id]);
        await db.query("INSERT INTO customer_usertoken (user_id, token) VALUES (?, ?)", [Id,refreshToken]);
    }

    // static async BookCourier(customer_id, courier_name) {
    //     return await db.query('INSERT INTO couriers (customer_id, courier_name) values (?, ?)', [customer_id, courier_name]);
    // }

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
        const API_KEY = process.env.GOOGLE_MAP_API_KEY;

        const baseURL = 'https://maps.googleapis.com/maps/api/directions/json';

        const origin_m = origin + ', Karachi';
        const destination_m = destination + ', Karachi';

        try {
            const response = await axios.get(baseURL, {
                params: {
                    origin: origin_m,
                    destination: destination_m,
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
        const apiKey = process.env.GOOGLE_MAP_API_KEY;
        const baseFare = 120;
        const costPerKm = 40;
        const costPerMin = 2;
        const trafficSurcharge = 50;
        const origin_m = origin + ', Karachi';
        const destination_m = destination + ', Karachi';
    
        try {
            const departureTime = Math.floor(Date.now() / 1000);
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin_m)}&destination=${encodeURIComponent(destination_m)}&key=${apiKey}&departure_time=${departureTime}&traffic_model=best_guess`
            );

            const data = await response.json();
            console.log('API Response:', data);
    
            if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
                throw new Error(`No routes found or API error: ${data.status}`);
            }
    
            const route = data.routes[0];
            if (!route.legs || route.legs.length === 0) {
                throw new Error('No legs found in the route.');
            }
    
            const distanceInMeters = route.legs[0].distance.value;
            const durationInSeconds = route.legs[0].duration.value;
    
            const distanceInKm = distanceInMeters / 1000;
            const timeInMinutes = durationInSeconds / 60;
    
            const estimatedFare =
                baseFare + (costPerKm * distanceInKm) + (costPerMin * timeInMinutes) + trafficSurcharge;
    
            return Math.ceil(estimatedFare);
        } catch (error) {
            console.error('Error during fare estimation:', error);
            throw error;
        }
    }
    
    static async updateFirstName(cust_id, first_name) {
        try {
            const query = `
                UPDATE customer
                SET first_name = ?, updated_at = NOW()
                WHERE cust_id = ?
            `;
            await db.query(query, [first_name, cust_id]);
            console.log(`First name updated successfully for customer ID: ${cust_id}`);
        } catch (error) {
            console.error('Error updating first name:', error.message);
            throw error;
        }
    }
    
    static async updateLastName(cust_id, last_name) {
        try {
            const query = `
                UPDATE customer
                SET last_name = ?, updated_at = NOW()
                WHERE cust_id = ?
            `;
            await db.query(query, [last_name, cust_id]);
            console.log(`Last name updated successfully for customer ID: ${cust_id}`);
        } catch (error) {
            console.error('Error updating last name:', error.message);
            throw error;
        }
    }
    
    static async updateEmail(cust_id, cust_email) {
        try {
            const query = `
                UPDATE customer
                SET cust_email = ?, updated_at = NOW()
                WHERE cust_id = ?
            `;
            await db.query(query, [cust_email, cust_id]);
            console.log(`Email updated successfully for customer ID: ${cust_id}`);
        } catch (error) {
            console.error('Error updating email:', error.message);
            throw error;
        }
    }
    
    static async updatePassword(cust_id, password) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            const query = `
                UPDATE customer
                SET password = ?, updated_at = NOW()
                WHERE cust_id = ?
            `;
            await db.query(query, [hashedPassword, cust_id]);
            console.log(`Password updated successfully for customer ID: ${cust_id}`);
        } catch (error) {
            console.error('Error updating password:', error.message);
            throw error;
        }
    }
    

    static async bookRide(cust_id, route_id, rideDate, origin, destination) {
        console.log('Origin:', origin);
        console.log('Destination:', destination);
        try {
            const routeQuery = 'SELECT transporter_id FROM route WHERE route_id = ?';
            const [routeResult] = await db.query(routeQuery, [route_id]);
            if (routeResult.length === 0) {
                throw new Error('Invalid route_id selected.');
            }
            const transporterId = routeResult[0].transporter_id;
    
            const vehicleQuery = `
                SELECT vehicle_id, current_capacity, initial_capacity 
                FROM vehicle 
                WHERE transporter_id = ?
            `;
            const [vehicleResult] = await db.query(vehicleQuery, [transporterId]);
            if (vehicleResult.length === 0) {
                throw new Error('No vehicle found for the selected transporter.');
            }
    
            const { vehicle_id, current_capacity, initial_capacity } = vehicleResult[0];
    
            if (current_capacity <= 0) {
                throw new Error('No seats available for this vehicle.');
            }
    
            const updateCapacityQuery = `
                UPDATE vehicle 
                SET current_capacity = current_capacity - 1 
                WHERE vehicle_id = ?
            `;
            await db.query(updateCapacityQuery, [vehicle_id]);
            const fare = await Customer.estimateFare(origin, destination);
    
            const bookingQuery = `
                INSERT INTO bookings (customer_id, vehicle_id, route_id, transporter_id, ride_date, price)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [bookingResult] = await db.promise().query(bookingQuery, [
                cust_id,
                vehicle_id,
                route_id,
                transporterId,
                rideDate,
                fare 
            ]);
    
            const loyaltyQuery = 'UPDATE customer SET loyalty_points = loyalty_points + 5 WHERE cust_id = ?';
            await db.promise().query(loyaltyQuery, [cust_id]);
    
            console.log(
                `Booking successful! Booking ID: ${bookingResult.insertId}. Remaining seats: ${
                    current_capacity - 1
                }/${initial_capacity}. Estimated Fare: ${fare}`
            );
    
            return bookingResult;
        } catch (error) {
            console.error('Error booking ride:', error.message);
            throw error;
        }
    }

    static async getLoyaltyPoints(cust_id){
        try {
            const loyalty_points = await db.query('select loyalty_points from customer where cust_id = ?', [cust_id]);
            return loyalty_points;
        } catch(error){
            console.error('Error fetching loyalty points', error.message);
            throw error;
        }
    }

    static async deleteCustomer(cust_id) {
        try {
            const deleteCustomerQuery = 'DELETE FROM customer WHERE cust_id = ?';
            deleteResult = await db.query(deleteCustomerQuery, [cust_id]);

            console.log('Customer and associated data deleted successfully.');
            return deleteResult;
        } catch (error) {
            console.error('Error deleting customer:', error.message);
            throw error;
        }
    }

    static async fetchBookings(cust_id){
        try{
           const bookings = await db.query('select * from bookings where cust_id = ? and ride_date<sysdate()',[cust_id]);
           console.log(bookings);
           return bookings;
        }catch (error){
            console.error('Error fetching bookings', error.message);
            throw error;
        }
    }

    static async fetchCurrentBookings(cust_id){
        try{
           const bookings = await db.query('select * from bookings where cust_id = ? and ride_date>=sysdate()',[cust_id]);
           console.log(bookings);
           return bookings;
        }catch (error){
            console.error('Error fetching bookings', error.message);
            throw error;
        }
    }

    static async fetchCustomerDetails(cust_id){
        try{
            const details = await db.query('select * from customer where cust_id = ?',[cust_id]);
            console.log(details);
           return details;
        }catch(error){
            console.error('Error fetching details', error.message);
            throw error;
        }
    }

    static async submitFeedback(bookingId, comments, rating) {
        try {
            const result = await db.query(
                'INSERT INTO feedback (booking_id, comments, rating) VALUES (?, ?, ?)',
                [bookingId, comments, rating]
            );
            return { success: true, data: result };
        } catch (error) {
            console.error('Error submitting feedback:', error);
            throw new Error('Failed to submit feedback');
        }
    }
}

export default Customer;
