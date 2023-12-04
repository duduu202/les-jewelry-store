import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShowDashboardService } from '../services/ShowDashboard.service';

class DashboardController {
  async show(req: Request, res: Response): Promise<Response> {
    const { all_sales, start_date, end_date, groups, division_split } =
      req.query;

    const showDashboardService = container.resolve(ShowDashboardService);

    const dashboard = await showDashboardService.execute({
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      compareGroups: groups,
      division_split: division_split ? Number(division_split) : undefined,
      all_sales: all_sales ? Boolean(all_sales) : false,
    });

    return res.json(dashboard);
  }
}

export { DashboardController };
