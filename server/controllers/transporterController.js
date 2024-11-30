import Transporter from '../services/transporter.js';
import cookie from 'js-cookie';

export const registerTransporter = async(req,res)=>{
    const {first_name,last_name, username, password, email} = req.body;
    console.log(req.body);
    if(!username||!password||!email){
        return res.status(400).json({message:'All fields are required'});
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

export const getAnalytics = (req, res) =>{
    const { transporterId } = req.body;

    try {
      const analyticsData = Transporter.viewAnalytics(transporterId);

      if (!analyticsData) {
        return res.status(404).json({ message: 'No analytics data found.' });
      }

      res.status(200).json(analyticsData);
    } catch (err) {
      console.error('Error in getAnalytics controller:', err.message);
      res.status(500).json({ message: 'Error retrieving analytics data' });
    }
  }