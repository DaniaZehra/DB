import db from '../config/database.js'; 

export const searchRoutesService = async (input) => {
    try {
        const query = `
            SELECT * FROM stops
            WHERE stop_name LIKE ? 
            OR location LIKE ? 
        `;

        const [rows] = await db.query(query, [`%${input}%`, `%${input}%`, `%${input}%`]);
        if(!rows||rows.length==0){
            console.log("None found");
        }
        return rows;
    } catch (error) {
        console.error('Error executing search query:', error);
        throw new Error('Database query error');
    }
};
