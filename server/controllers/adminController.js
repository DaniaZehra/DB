import AdminService from '../services/admin.js';

export const adminSignin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await AdminService.adminSignin(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateAdminDetails = async (req, res) => {
    const { username, updates } = req.body;
    try {
        const result = await AdminService.updateAdminDetails(username, updates);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    const { username } = req.body;
    try {
        const result = await AdminService.deleteAdmin(username);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const createNewAdmin = async(req,res)=> {
    const {username, password} = req.body;
    try {
        res = await AdminService.createAdmin(username, password);
        console.log(res.message); // Admin created successfully
    } catch (error) {
        console.error(error.message); // Handle errors (e.g., Username already exists)
    }
}
export const getAdminActivity = async(req, res) => {
    try{
        res = await AdminService.getAdminActivity();
        console.log(res);
    }catch (error){
        console.error(error.message);
        res.json({message:'error in controller'});
    }
}

// export const sendOTPEmail = async(req, res) => {
//     const {email} = req.body;
//     try{
//         const otp = await AdminService.generateOTP();
//         res = await AdminService.sendOTPEmail(email, otp);
//     }catch(error){
//         console.error(error.message);
//         res.json({message:'error in controller'});
//     }
// }
