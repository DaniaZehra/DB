import express from 'express'
import { searchRoutes} from '../controllers/searchController.js'

const router = express.Router();
router.post('/', searchRoutes);
export default router;
