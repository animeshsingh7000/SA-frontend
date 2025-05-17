import { ChartDataset, ChartType, DefaultDataPoint } from "chart.js";

export interface ChartData<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
> {
  labels?: TLabel[] | TLabel[][];
  datasets: ChartDataset<TType, TData>[];
}

