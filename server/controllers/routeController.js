import { TransportRoute } from '../services/routes.js';

export const createRoutes = async (req, res) => {
    const { origin, destination, distance } = req.query;
    
    try {
        const result = await TransportRoute.createRoutes(origin,destination,distance);
        res.json(result);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllRoutes = async(req,res) =>{
    const { input } = req.query;
    
    try {
        const result = await TransportRoute.getAllRoutes();
        res.json(result);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { transportRoutes };