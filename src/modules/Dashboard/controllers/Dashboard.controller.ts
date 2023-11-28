import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShowDashboardService } from '../services/ShowDashboard.service';

class DashboardController {
  async show(req: Request, res: Response): Promise<Response> {
    const { start_date, end_date, categories, division_split } = req.query as {
      start_date: string;
      end_date: string;
      categories: string[];
      division_split?: string;
    };

    const showDashboardService = container.resolve(ShowDashboardService);

    const dashboard = await showDashboardService.execute({
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      categories,
      division_split: division_split ? Number(division_split) : undefined,
    });

    return res.json(dashboard);
  }
}

export { DashboardController };
