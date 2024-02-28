import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swagger from '@/utils/swagger.json'

import { OpenFoodController } from '@/modules/openFoodScrapping/controller';
import { OpenFoodService } from '@/modules/openFoodScrapping/service';

const openFoodService = new OpenFoodService();
const openFoodController = new OpenFoodController(openFoodService);

const routes = Router();

routes.get('/products/:productId', openFoodController.searchByProductId);
routes.get('/products', openFoodController.searchByTerm);
routes.get('/docs',  swaggerUi.serve, swaggerUi.setup(swagger));

export { routes };
