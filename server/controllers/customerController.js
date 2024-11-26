import Customer from '../services/customer.js';

export const registerCustomer = async (req, res) => {
    const { username, first_name, last_name, phone_number, password, cust_email } = req.body;

    try {
        if (!username || !password || !cust_email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await Customer.findbyusername(username);
        if (existingUser && existingUser.length > 2) {
            console.log(existingUser.length, existingUser);
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await Customer.findbyemail(cust_email);
        if (existingEmail && existingEmail.length > 2) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        await Customer.create(username, first_name, last_name, phone_number, password, cust_email);
        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const viewRoutes = async (req, res) => {
    try {
        const routes = await Customer.viewRoutes();
        res.status(200).json({ routes });
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTrafficUpdates = async (req, res) => {
    const { origin, destination } = req.body;

    try {
        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        const trafficData = await Customer.getTrafficUpdates(origin, destination);
        console.log(trafficData);
        res.status(200).json({ trafficData });
    } catch (error) {
        console.error('Error fetching traffic updates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const estimateFare = async (req, res) => {
    const { origin, destination } = req.body;

    try {
        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        const fare = await Customer.estimateFare(origin, destination);
        res.status(200).json({ estimatedFare: fare });
    } catch (error) {
        console.error('Error estimating fare:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCustomerDetails = async (req, res) => {
    const { custId, updates } = req.body;

    try {
        if (!custId || !updates || typeof updates !== 'object') {
            return res.status(400).json({ message: 'Customer ID and updates are required' });
        }

        const updatedCustomer = await Customer.updateCustomerDetails(custId, updates);
        res.status(200).json({ message: 'Customer details updated successfully', updatedCustomer });
    } catch (error) {
        console.error('Error updating customer details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCustomer = async (req, res) => {
    const { custId } = req.body;

    try {
        if (!custId) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        await Customer.deleteCustomer(custId);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const bookCourier = async (req, res) => {
    const { customer_id, courier_name } = req.body;

    try {
        if (!customer_id || !courier_name) {
            return res.status(400).json({ message: 'Customer ID and courier name are required' });
        }

        await Customer.BookCourier(customer_id, courier_name);
        res.status(201).json({ message: 'Courier booked successfully' });
    } catch (error) {
        console.error('Error booking courier:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const bookRide = async (req, res) => {
    try {
      // Extract data from the request body
      const { custId, routeId, rideDate } = req.body;
  
      // Basic validation
      if (!custId || !routeId || !rideDate) {
        return res.status(400).json({ message: 'Missing required fields: custId, routeId, or rideDate.' });
      }
  
      // Call the booking service
      const bookingResult = await bookingService.bookRide(custId, routeId, rideDate);
  
      // Respond with success
      res.status(201).json({
        message: 'Ride booked successfully!',
        bookingId: bookingResult.insertId,
      });
    } catch (error) {
      console.error('Error in booking controller:', error.message);
  
      // Handle specific errors
      if (error.message.includes('Invalid route_id selected')) {
        return res.status(400).json({ message: 'Invalid route selected.' });
      }
      if (error.message.includes('No vehicle found for the selected transporter')) {
        return res.status(404).json({ message: 'No available vehicle for the selected route.' });
      }
  
      // Handle general errors
      res.status(500).json({ message: 'An error occurred while booking the ride.', error: error.message });
    }
  };

