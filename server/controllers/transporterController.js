import Transporter from '../services/transporter.js';
import cookie from 'js-cookie';

export const registerTransporter = async(req,res)=>{
    const {first_name,last_name, username, password, email} = req.body;
    console.log(req.body);
    if(!username||!password||!email){
        return res.status(400).json({message:'All fields are required'});
    }
    const existingUser = await Transporter.findbyusername(username);
        if (existingUser && existingUser.length > 2) {
            console.log(existingUser.length, existingUser);
            return res.status(400).json({ message: 'Username already exists' });
        }

    const existingEmail = await Transporter.findbyemail(cust_email);
        if (existingEmail && existingEmail.length > 2) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long, include at least one number, and one special character.',
            });
        }

    try{
        await Transporter.create(first_name,last_name,username,password, email);
        const userId = Transporter.searchIdbyEmail(email);
        res.cookie('userId',userId, {httpOnly:false});
        res.status(201).json({message: 'Transporter registered successfully'});
    } catch (error) {
        console.error('Error registering transporter:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const Retrieve = async(req, res)=>{
    const {table_name, userId} = req.body;
    try{
        const result = await Transporter.retrieve(table_name, userId);
        console.log(result);
        res.json({result});
    }
    catch (error) {
        console.error('Error retrievin:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const Delete = async(req, res)=>{
    const {table_name, userId, Id} = req.body;
    try{
        const result = await Transporter.delete(table_name, userId);
        console.log(result);
        res.json({result});
    }
    catch (error) {
        console.error('Error retrievin:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getAnalytics = async (req, res) =>{
    const { transporterId } = req.body;

    try {
      const analyticsData = await Transporter.viewAnalytics(transporterId);
      console.log(analyticsData)

      if (!analyticsData) {
        return res.status(404).json({ message: 'No analytics data found.' });
      }

      res.status(200).json(analyticsData);
    } catch (err) {
      console.error('Error in getAnalytics controller:', err.message);
      res.status(500).json({ message: 'Error retrieving analytics data' });
    }
  }