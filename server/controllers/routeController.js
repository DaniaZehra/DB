import  TransportRoute  from '../services/routes.js';

export const createRoutes = async (req, res) => {
    const { stops, origin, destination, transporter_id} = req.body;
    
    try {
        const result = await TransportRoute.createRoute(origin,destination,stops, transporter_id);
        res.json(result);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllRoutes = async(req,res) =>{
    const { input } = req.body;
    
    try {
        const result = await TransportRoute.getAllRoutes();
        res.json(result);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
