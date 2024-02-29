import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import swagger from '@/utils/swagger.json';

import { OpenFoodController } from '@/modules/openFoodScrapping/controller';
import { OpenFoodService } from '@/modules/openFoodScrapping/service';

const openFoodService = new OpenFoodService();
const openFoodController = new OpenFoodController(openFoodService);

const routes = Router();

routes.get('/', (req, res) =>
  res.status(200).json({
    message: 'Server is running',
  })
);

routes.use('/docs', swaggerUi.serve);
routes.get('/docs', swaggerUi.setup(swagger));

routes.get('/products/:productId', openFoodController.searchByProductId);
routes.get('/products', openFoodController.searchByTerm);

export { routes };
