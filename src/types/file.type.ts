interface FileType {
  id: string;
  name: string;
  type: "file" | "table" | "structure";
  code?: string;
  tableName?: string;
  tableData?: any;
  schemaName?: string;
  schemaData?: any;
}
