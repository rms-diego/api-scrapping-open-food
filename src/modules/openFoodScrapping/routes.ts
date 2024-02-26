import { Router } from 'express';
import { OpenFoodController } from './controller';
import { OpenFoodService } from './service';

const openFoodService = new OpenFoodService();
const openFoodController = new OpenFoodController(openFoodService);

const routes = Router();
routes.get('/products/:productId', openFoodController.searchByProductId);

export { routes };
