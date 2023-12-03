interface IGroupDTO {
  categories: string[];
}

interface IShowDashboardDTO {
  start_date: Date;
  end_date: Date;
  /** each group of categories will be a line in the chart */
  compareGroups: IGroupDTO[];
  division_split?: number;
}

export { IShowDashboardDTO, IGroupDTO };
