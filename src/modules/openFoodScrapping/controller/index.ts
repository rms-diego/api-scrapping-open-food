import { Request, Response } from 'express';
import { OpenFoodService } from '../service';

export class OpenFoodController {
  constructor(private readonly openFoodService: OpenFoodService) {}

  public searchByProductId = async (req: Request, res: Response) => {
    const { productId } = req.params;

    const content = await this.openFoodService.searchByProductId(productId);

    return res.status(200).json(content);
  };
}
