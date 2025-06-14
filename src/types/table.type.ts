import { Column, RenderCellProps } from "react-data-grid";

export interface TableForm {
  name: string;
  columns?: TableFormColumn[];
}

export interface TableFormColumn {
  name: string;
  type: string;
  isNull: boolean;
  defaultValue: any;
  keyType: "PRIMARY" | "FOREIGN KEY";
  foreignTable: string;
  foreignTableColumn: string;
}

export interface CustomColumns extends Column<any> {
  customRenderCell?: (
    props: RenderCellProps<any>,
    extraFiled: any,
  ) => React.ReactNode;
}

export interface Row {
  [key: string]: any; // Dynamic data rows
}

export interface FilterType {
  column: string;
  compare: string;
  separator: string;
  value: any;
}
