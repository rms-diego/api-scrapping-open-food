import { Request, Response } from 'express';
import { OpenFoodService } from '../service';
import { Exception } from '@/utils/exception';

export class OpenFoodController {
  constructor(private readonly openFoodService: OpenFoodService) {}

  public searchByProductId = async (req: Request, res: Response) => {
    const { productId } = req.params;

    const content = await this.openFoodService.searchByProductId(productId);

    return res.status(200).json(content);
  };

  public searchByTerm = async (req: Request, res: Response) => {
    const { nova, nutrition, page } = req.query;

    const result = await this.openFoodService.searchByTerm({
      nova: nova?.toString(),
      nutrition: nutrition?.toString(),
      pageOpenFood: page?.toString(),
    });

    return res.status(200).json(result);
  };
}
