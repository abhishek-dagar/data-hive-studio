import { CustomColumns } from "@/types/table.type";
import { RenderCellProps } from "react-data-grid";
import { pgSqlTypes } from "@/types/db.type";
import InputCell from "@/components/table-cells/input-cell";
import CheckBoxCell from "@/components/table-cells/check-box-cell";
import SelectCell from "@/components/table-cells/select-cell";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export const columns: CustomColumns[] = [
  {
    key: "name",
    name: "Name",
    editable: true,
    renderCell: (props: RenderCellProps<any>) => (
      <InputCell {...props} name="name" />
    ),
  },
  {
    key: "type",
    name: "Type",
    editable: true,
    renderCell: (props: RenderCellProps<any>) => (
      <SelectCell
        {...props}
        name="type"
        items={Object.entries(pgSqlTypes)
          .filter(([type]) => Number.isNaN(parseInt(type)))
          .map(([type]) => ({ label: type, value: type }))}
      />
    ),
  },
  {
    key: "isNull",
    name: "Null",
    renderCell: (props: RenderCellProps<any>) => (
      <CheckBoxCell
        {...props}
        name="isNull"
        disabled={props.row.keyType === "PRIMARY"}
      />
    ),
  },
  {
    key: "defaultValue",
    name: "Default Value",
    renderCell: (props: RenderCellProps<any>) => (
      <InputCell {...props} name="defaultValue" />
    ),
  },
  {
    key: "keyType",
    name: "Key Type",
    renderCell: (props: RenderCellProps<any>) => (
      <SelectCell
        {...props}
        name="keyType"
        items={[
          { label: "null", value: null },
          { label: "PRIMARY", value: "PRIMARY" },
          { label: "FOREIGN", value: "FOREIGN" },
        ]}
      />
    ),
  },
  {
    key: "foreignTable",
    name: "Foreign Table",
    customRenderCell: (props: RenderCellProps<any>, { tables }) => {
      return (
        <SelectCell
          {...props}
          name="foreignTable"
          disabled={props.row.keyType !== "FOREIGN"}
          items={[
            { label: "null", value: null },
            ...tables.map((table: any) => ({
              label: table.table_name,
              value: table.table_name,
            })),
          ]}
        />
      );
    },
  },
  {
    key: "foreignTableColumn",
    name: "Foreign Table Column",
    customRenderCell: (
      props: RenderCellProps<any>,
      { getForeignTableFields },
    ) => {
      const options = getForeignTableFields(props.rowIdx);

      return (
        <SelectCell
          {...props}
          name="foreignTableColumn"
          disabled={props.row.keyType !== "FOREIGN" || !props.row.foreignTable}
          items={[{ label: "null", value: null }, ...(options || [])]}
        />
      );
    },
  },
  {
    key: "actionButton",
    name: "",
    customRenderCell: ({ rowIdx }, extraFields) => {
      const deleteColumn = extraFields.deleteColumn;
      const handleDeleteColumn = () => deleteColumn(rowIdx);
      return (
        <div className="no-bg flex h-full w-full items-center justify-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="h-7 w-7 rounded-full px-1 text-muted-foreground hover:bg-transparent hover:text-white"
            onClick={handleDeleteColumn}
          >
            <XIcon />
          </Button>
        </div>
      );
    },
  },
];
