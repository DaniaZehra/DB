import { searchRoutesService } from '../services/Search.js';

export const searchRoutes = async (req, res) => {
    const { input } = req.body;
    
    try {
        const result = await searchRoutesService(input);
        res.json({result})
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


