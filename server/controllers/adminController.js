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
