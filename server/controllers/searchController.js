import { searchRoutesService } from '../services/Search.js';

export const searchRoutes = async (req, res) => {
    const { input } = req.query;
    
    try {
        const result = await searchRoutesService(input);
        res.json({ message: "Search route is working" });
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


