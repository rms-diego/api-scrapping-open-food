import { Request, Response } from 'express';
import { OpenFoodService } from '../service';

import { searchByIdSchema, searchByTermSchema } from '@/utils/validations';

export class OpenFoodController {
  constructor(private readonly openFoodService: OpenFoodService) {}

  public searchByProductId = async (req: Request, res: Response) => {
    const { productId } = searchByIdSchema.parse(req.params); // validations request params

    const data = await this.openFoodService.searchByProductId(productId);

    return res.status(200).json(data);
  };

  public searchByTerm = async (req: Request, res: Response) => {
    const { nova, nutrition, page } = searchByTermSchema.parse(req.query); // validations request query params

    const data = await this.openFoodService.searchByTerm({
      nova: nova?.toString(),
      nutrition: nutrition?.toUpperCase(),
      pageOpenFood: page?.toString(),
    });

    return res.status(200).json(data);
  };
}
