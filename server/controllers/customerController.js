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

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long, include at least one number, and one special character.',
            });
        }

        await Customer.create(username, first_name, last_name, password, cust_email);
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
    const { cust_id, updates } = req.body;

    try {
        if (!cust_id || !updates || typeof updates !== 'object') {
            return res.status(400).json({ message: 'Customer ID and updates are required' });
        }

        const { first_name, last_name, cust_email, password } = updates;

        if (first_name) {
            await Customer.updateFirstName(cust_id, first_name);
        }

        if (last_name) {
            await Customer.updateLastName(cust_id, last_name);
        }

        if (cust_email) {
            await Customer.updateEmail(cust_id, cust_email);
        }

        if (password) {
            await Customer.updatePassword(cust_id, password);
        }

        return res.status(200).json({ message: 'Customer details updated successfully' });
    } catch (error) {
        console.error('Error updating customer details:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteCustomer = async (req, res) => {
    const { cust_id } = req.body;

    try {
        if (!cust_id) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        await Customer.deleteCustomer(cust_id);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// export const bookCourier = async (req, res) => {
//     const { customer_id, courier_name } = req.body;

//     try {
//         if (!customer_id || !courier_name) {
//             return res.status(400).json({ message: 'Customer ID and courier name are required' });
//         }

//         await Customer.BookCourier(customer_id, courier_name);
//         res.status(201).json({ message: 'Courier booked successfully' });
//     } catch (error) {
//         console.error('Error booking courier:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


export const bookRide = async (req, res) => {
    try {
      const { cust_id, route_id, rideDate } = req.body;
      if (!cust_id || !route_id || !rideDate) {
        return res.status(400).json({ message: 'Missing required fields: cust_id, routeId, or rideDate.' });
      }
      const bookingResult = await Customer.bookRide(cust_id, route_id, rideDate);
      console.log(bookingResult);

      res.status(201).json({
        message: 'Ride booked successfully!'
      });
    } catch (error) {
      console.error('Error in booking controller:', error.message);
      if (error.message.includes('Invalid route_id selected')) {
        console.log("Error here");
        return res.status(400).json({ message: 'Invalid route selected.' });
      }
      if (error.message.includes('No vehicle found for the selected transporter')) {
        console.log("Error here");
        return res.status(404).json({ message: 'No available vehicle for the selected route.' });
      }
  
      // Handle general errors
      res.status(500).json({ message: 'An error occurred while booking the ride.', error: error.message });
    }
  };

  export const getLoyaltyPoints = async(req, res) => {
    try {
        const {cust_id} = req.body;
        const loyalty_points = await Customer.getLoyaltyPoints(cust_id);
        console.log(loyalty_points);
        res.status(200).json({ "loyalty_points":loyalty_points });
    } catch (error) {
        console.error('Error fetching loyalty-points:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const fetchBookings = async(req,res)=>{
    try{
        const {cust_id} = req.body;
        const result = await Customer.fetchBookings(cust_id);
        res.status(200).json({result});
    }catch(error){
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const fetchCustomerDetails = async(req,res)=>{
    try{
        const {cust_id} = req.body;
        const result = await Customer.fetchCustomerDetails(cust_id);
        res.status(200).json({result});
    }catch(error){
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const submitFeedback = async (req, res) => {
    const { booking_id, comments, rating } = req.body;

    // Input validation
    if (!booking_id || !comments || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    try {
        const feedback = await Customer.submitFeedback(booking_id, comments, rating);
        res.status(200).json({ success: true, message: 'Feedback submitted successfully', data: feedback.data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}