"use client";
import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useDispatch } from "react-redux";
import {
  addTableFile,
  addTableStructureFile,
} from "@/redux/features/open-files";

const TablesMenu = ({
  children,
  table_name,
}: {
  children: React.ReactNode;
  table_name: string;
}) => {
  const dispatch = useDispatch();
  const handleViewData = () => {
    dispatch(addTableFile({ table_name }));
  };
  const handleOpenStructure = () => {
    dispatch(addTableStructureFile({ table_name }));
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(table_name);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="px-2 py-1 min-w-[150px]">
        <ContextMenuItem onSelect={handleViewData} className="text-xs">View Data</ContextMenuItem>
        <ContextMenuItem onSelect={handleOpenStructure} className="text-xs">
          View Structure
        </ContextMenuItem>
        <ContextMenuItem disabled className="text-xs">Export to file</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={handleCopyName} className="text-xs">Copy Name</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TablesMenu;
