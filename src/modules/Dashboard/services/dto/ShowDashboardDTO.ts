interface IGroupDTO {
  categories: string[];
}

interface IShowDashboardDTO {
  start_date: Date;
  end_date: Date;
  compareGroups: IGroupDTO[];
  division_split?: number;
}

export { IShowDashboardDTO, IGroupDTO };
