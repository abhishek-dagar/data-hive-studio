import React, { useEffect } from "react";
import { Column } from "react-data-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { compareFilter } from "@/config/filter";
import { Input } from "../ui/input";
import { TypeIcons, TypeIconsType } from "@/config/types-icon";
import { useDispatch, useSelector } from "react-redux";
import { updateFile } from "@/redux/features/open-files";
import { Button } from "../ui/button";
import { PlusIcon, XIcon } from "lucide-react";

interface ColumnProps extends Column<any> {
  data_type?: string;
}

const Filter = ({ columns }: { columns: ColumnProps[] }) => {
  const initialFilter = {
    column: columns[0].key,
    compare: "equals",
    value: "",
    separator: "WHERE",
  };
  const [filterValues, setFilterValues] = React.useState<any>([initialFilter]);

  const { currentFile } = useSelector((state: any) => state.openFiles);
  const dispatch = useDispatch();

  // const debounce = useDebouncedCallback((filter: any) => {
  //   // setFilter(filter);
  //   dispatch(updateFile({ id: currentFile?.id, tableFilter: filter }));
  // }, 1000);

  const handleFilterValueChange = (
    value: string,
    index: number,
    type: keyof typeof initialFilter,
  ) => {
    const updatedFilter = JSON.parse(JSON.stringify(filterValues));

    updatedFilter[index][type] = value;
    setFilterValues(updatedFilter);
    dispatch(
      updateFile({
        id: currentFile?.id,
        tableFilter: {
          ...currentFile?.tableFilter,
          filter: {
            oldFilter: currentFile?.tableFilter?.filter?.oldFilter,
            newFilter: updatedFilter,
          },
          applyFilter: false,
        },
      }),
    );
  };

  const handleAddFilter = (index: number) => {
    const addedFilter = JSON.parse(JSON.stringify(filterValues));
    addedFilter.splice(index + 1, 0, { ...initialFilter, separator: "AND" });
    setFilterValues(addedFilter);
    dispatch(
      updateFile({
        id: currentFile?.id,
        tableFilter: {
          ...currentFile?.tableFilter,
          filter: {
            oldFilter: currentFile?.tableFilter?.filter?.oldFilter,
            newFilter: addedFilter,
          },
          applyFilter: false,
        },
      }),
    );
  };

  const handleRemoveFilter = (index: number) => {
    const removedFilter = JSON.parse(JSON.stringify(filterValues));
    removedFilter.splice(index, 1);
    setFilterValues(removedFilter);
    dispatch(
      updateFile({
        id: currentFile?.id,
        tableFilter: {
          ...currentFile?.tableFilter,
          filter: {
            oldFilter: currentFile?.tableFilter?.filter?.oldFilter,
            newFilter: removedFilter,
          },
          applyFilter: false,
        },
      }),
    );
  };

  const handleApplyFilters = () => {
    // console.log(filterValues);
    dispatch(
      updateFile({
        id: currentFile?.id,
        tableFilter: {
          ...currentFile?.tableFilter,
          filter: {
            oldFilter: currentFile?.tableFilter?.filter?.oldFilter,
            newFilter: filterValues,
          },
          applyFilter: true,
        },
      }),
    );
  };

  const handleRemoveFilters = () => {
    dispatch(
      updateFile({
        id: currentFile?.id,
        tableFilter: {
          ...currentFile?.tableFilter,
          filter: {
            oldFilter: [],
            newFilter: [],
          },
          applyFilter: true,
        },
      }),
    );
    setFilterValues([initialFilter]);
  };

  useEffect(() => {
    if (currentFile?.tableName) {
      if (currentFile?.tableFilter?.filter?.oldFilter?.length > 0) {
        setFilterValues(currentFile?.tableFilter?.filter?.oldFilter);
      } else {
        setFilterValues([initialFilter]);
      }
    }
  }, [currentFile?.tableName, currentFile?.tableFilter?.filter?.oldFilter]);

  console.log(filterValues);

  return (
    <div className="flex flex-1 gap-2">
      <div className="flex flex-1 flex-col gap-2">
        {filterValues.map((filterValue: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={filterValue.separator}
              disabled={index === 0}
              onValueChange={(value) =>
                handleFilterValueChange(value, index, "separator")
              }
            >
              <SelectTrigger className="h-8 w-[100px] bg-background text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-background/70 backdrop-blur-md">
                {index === 0 && (
                  <SelectItem
                    value={"WHERE"}
                    className="cursor-pointer text-xs focus:bg-primary/60"
                  >
                    <p className="flex items-center gap-2">WHERE</p>
                  </SelectItem>
                )}
                <SelectItem
                  value={"AND"}
                  className="cursor-pointer text-xs focus:bg-primary/60"
                >
                  <p className="flex items-center gap-2">AND</p>
                </SelectItem>
                <SelectItem
                  value={"OR"}
                  className="cursor-pointer text-xs focus:bg-primary/60"
                >
                  <p className="flex items-center gap-2">OR</p>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={columns?.[0]?.key || "id"}
              value={filterValue.column}
              onValueChange={(value) =>
                handleFilterValueChange(value, index, "column")
              }
            >
              <SelectTrigger className="h-8 w-[140px] bg-background text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-background/70 backdrop-blur-md">
                {columns?.map((column: ColumnProps) => {
                  const Icon =
                    TypeIcons[column.data_type?.toLowerCase() as TypeIconsType];
                  return (
                    <SelectItem
                      key={column.key}
                      value={column.key}
                      className="cursor-pointer text-xs focus:bg-primary/60"
                    >
                      <p className="flex items-center gap-2">
                        {Icon && <Icon size={14} className="text-yellow-400" />}
                        {column.name}
                      </p>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              defaultValue="equals"
              onValueChange={(value) =>
                handleFilterValueChange(value, index, "compare")
              }
            >
              <SelectTrigger className="h-8 w-[130px] bg-background text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-secondary/70 backdrop-blur-md">
                {compareFilter?.map((column) => {
                  if (
                    !column.types.includes(filterValue.column?.data_type) &&
                    !column.types.includes("all")
                  )
                    return null;
                  return (
                    <SelectItem
                      key={column.key}
                      value={column.key}
                      className="cursor-pointer text-xs focus:bg-primary/60"
                    >
                      {column.value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyFilters();
              }}
              className="flex-1"
            >
              <Input
                className="h-8 bg-background !text-xs"
                value={filterValue.value}
                onChange={(e) =>
                  handleFilterValueChange(e.target.value, index, "value")
                }
                placeholder="Enter Value"
              />
            </form>
            <Button
              variant={"outline"}
              className="h-7 w-7 border-border px-2 [&_svg]:size-3"
              onClick={() => handleAddFilter(index)}
            >
              <PlusIcon />
            </Button>
            {index > 0 && (
              <Button
                variant={"outline"}
                className="h-7 w-7 border-border px-2 [&_svg]:size-3"
                onClick={() => handleRemoveFilter(index)}
              >
                <XIcon />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="flex h-8 items-center gap-2">
        <Button
          variant={"outline"}
          className="h-7 border-border bg-primary px-2 hover:bg-primary/70 [&_svg]:size-3"
          onClick={handleApplyFilters}
        >
          Apply
        </Button>
        {currentFile?.tableFilter?.filter?.oldFilter?.length > 0 && (
          <Button
            variant={"outline"}
            className="h-7 border-border px-2 [&_svg]:size-3"
            onClick={handleRemoveFilters}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default Filter;
