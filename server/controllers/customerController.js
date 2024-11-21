import Customer from '../services/customer.js';

export const registerCustomer = async(req,res)=>{
    const {id,username,first_name, last_name, phone_number, password,cust_email} = req.body;

    if(!username||!password||!cust_email){
        return res.status(400).json({message:'All fields are required'});
    }

    try{
        await Customer.create(id,username,first_name, last_name, phone_number, password,cust_email);
        res.status(201).json({message: 'Customer registered successfully'});
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({message: 'Internal server error'});
    }
    
}