export interface PageDisplayList
{
  PageId: number;
  PageName: string;
  Description: string;
  IsEnabled: boolean;
}

export interface PageDisplayListChecked
{
  PageId: number;
  PageName: string;
  IsChecked: boolean;
}

export interface DisableView
{
  PageId: string;
}
