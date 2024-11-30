import db from '../config/database.js'; 

export const searchRoutesService = async (input) => {
    try {
        const query = `
            SELECT 
                r.route_id, 
                r.origin, 
                r.stops, 
                r.destination, 
                r.transporter_id, 
                s.schedule_id, 
                s.departure_time, 
                s.arrival_time,
                s.status
            FROM 
                route r 
            INNER JOIN 
                schedule s 
            ON 
                r.route_id = s.route_id 
            WHERE 
                r.origin LIKE '%Gulshan%' 
            OR
                r.destination LIKE '%Gulshan%'
            ORDER BY 
                r.route_id, s.departure_time;
 
        `;

        console.log('Query:', query); 
        console.log('Input:', `%${input}%`);

        const [rows] = await db.query(query, [`%${input}%`, `%${input}%`]);
        console.log(rows);
        if(!rows||rows.length==0){
            console.log("None found");
        }
        return rows;
    } catch (error) {
        console.error('Error executing search query:', error);
        throw new Error('Database query error');
    }
};
