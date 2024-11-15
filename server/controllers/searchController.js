import { searchRoutes } from '../models/search.js';

const searchRoutes = async(req,res)=>{
    const {input} = req.query;
    try{
        const result = await createPool.querty("select * from search where name Like ? or origin LIKE ? or destination LIKE ?",[`%${input}%`,`%${input}%`,`%${input}%`]);
        res.json(result);

    }catch(error){
        console.error('Error searching:', error);
        res.status(500).json({error: 'Internal server error'});
    }
    res.json(result);
}

module.exports ={searchRoutes}