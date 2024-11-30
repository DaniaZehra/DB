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

export const updateRoute = async (req, res) => {
    try {
      const routeData = req.body;
      const result = await updateRouteService(routeData);
      res.status(200).json({ success: true, message: 'Route updated successfully', result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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

export const deleteRoute = async(req, res)=>{
    const {id} = req.body;
    console.log(id);
    try {
        const result = await TransportRoute.deleteRoute(id);
        res.json(result);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
