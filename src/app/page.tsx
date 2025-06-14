"use client";
import ConnectionForm from "@/components/form/connection-form";
import ConnectionSidebar from "@/components/navbar/connection-side";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDispatch } from "react-redux";
import { connectAppDB } from "@/lib/actions/app-data";
import { initAppData } from "@/redux/features/appdb";
import { useEffect } from "react";
import { parseConnectionString } from "@/lib/helper/connection-details";
import { ConnectionDetailsType } from "@/types/db.type";

const ConnectionsPage = () => {
  const dispatch = useDispatch();
  // console.log(loading);
  const connectDb = async () => {
    const dbPath = await window.electron?.getAppDbPath?.();
    const parsedDetails = parseConnectionString("");
    const connectionDetails: ConnectionDetailsType = {
      id: "",
      name: "App Database",
      connection_type: "sqlite",
      host: parsedDetails.host || "",
      port: parsedDetails.port || 0,
      username: parsedDetails.user || "",
      password: parsedDetails.password || "",
      connection_string: dbPath || "",
      save_password: 1,
      color: "#15db95"
    };

    await connectAppDB({ connectionDetails });
    dispatch(initAppData() as any);
  };
  useEffect(() => {
    connectDb();
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={20} maxSize={70}>
        <ConnectionSidebar />
      </ResizablePanel>
      <ResizableHandle className="!w-2 bg-background" />
      <ResizablePanel defaultSize={80} minSize={30} maxSize={80} className="p-2 pl-0">
        <div className="h-full w-full flex-1 bg-secondary rounded-lg">
          <ConnectionForm />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ConnectionsPage;
