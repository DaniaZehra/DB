import Customer from '../services/customer.js';

export const registerCustomer = async(req,res)=>{
    const {id,username,first_name, last_name, phone_number, password,cust_email} = req.body;

    if(!username||!password||!cust_email){
        return res.status(400).json({message:'All fields are required'});
    }
    const existingUser = await Customer.findbyusername(username);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
    }
    const existingemail = await Customer.findbyemail(username);
    if (existingemail.length > 0) {
        return res.status(400).json({ message: 'email already exists' });
    }
    try{
        await Customer.create(id,username,first_name, last_name, phone_number, password,cust_email);
        res.status(201).json({message: 'Customer registered successfully'});
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({message: 'Internal server error'});
    }
    
}