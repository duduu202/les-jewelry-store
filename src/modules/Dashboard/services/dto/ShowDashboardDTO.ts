interface IShowDashboardDTO {
  start_date: Date;
  end_date: Date;
  categories: string[];
  division_split?: number;
}

export { IShowDashboardDTO };
