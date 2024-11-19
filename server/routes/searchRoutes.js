import express from 'express'
import { searchRoutes} from '../controllers/searchController.js'

const router = express.Router();
router.get('/', searchRoutes);
export default router;
