import Transporter from '../services/transporter.js';

export const registerTransporter = async(req,res)=>{
    const {first_name,last_name, username, password, email} = req.body;
    console.log(req.body);
    if(!username||!password||!email){
        return res.status(400).json({message:'All fields are required'});
    }

    try{
        await Transporter.create(first_name,last_name,username,password, email);
        res.status(201).json({message: 'Transporter registered successfully'});
    } catch (error) {
        console.error('Error registering transporter:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}