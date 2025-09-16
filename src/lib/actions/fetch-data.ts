"use server";
import { ConnectionDetailsType, DatabaseClient } from "./../../types/db.type";
import { handlers } from "@/lib/databases/db";
import { FilterType, TableForm } from "@/types/table.type";
import { cookies } from "next/headers";
import { SortColumn } from "react-data-grid";
import { PaginationType } from "@/types/file.type";
import { updateConnection } from "./app-data";

export async function getCookie() {
  const cookie = cookies();
  return cookie;
}

export const getDbInstance = async (): Promise<DatabaseClient | null> => {
  if (!global.connectionManagerInstance) {
    const cookie = await getCookie();
    const dbType = cookie.get("dbType")?.value as keyof typeof handlers;
    global.connectionManagerInstance = new handlers[dbType]();
  }
  const isConnected = global.connectionManagerInstance.isConnectedToDb();
  if (isConnected) {
    return global.connectionManagerInstance;
  }
  const result =
    await global.connectionManagerInstance.getConnectionDetailsFromCookies();
  if (!result.connectionDetails) {
    return null;
  }
  await global.connectionManagerInstance.connectDb({
    connectionDetails: result.connectionDetails,
  });
  return global.connectionManagerInstance;
};

export const getConnectionDetails = async (): Promise<ConnectionDetailsType | null> => {
  if (global.connectionManagerInstance) {
    const cookie = await getCookie();
    const dbType = cookie.get("dbType")?.value as keyof typeof handlers;
    global.connectionManagerInstance = new handlers[dbType]();
    const result =
      await global.connectionManagerInstance.getConnectionDetailsFromCookies();
    if (!result.connectionDetails) {
      return null;
    }
    return result.connectionDetails;
  }
  return global.connectionManagerInstance;
};

export const resetDbInstance = async (): Promise<void> => {
  if (global.connectionManagerInstance) {
    await global.connectionManagerInstance.disconnectDb();
    global.connectionManagerInstance = null;
  }
};

export async function changeDataBase({
  newConnectionDetails,
}: {
  newConnectionDetails: Partial<ConnectionDetailsType>;
}) {
  const cookie = cookies();
  const connectionUrl = cookie.get("currentConnection");
  if (!connectionUrl) {
    return { success: false, error: "No connection to the database" };
  }

  const oldConnectionDetails: ConnectionDetailsType = JSON.parse(
    connectionUrl?.value || "",
  );
  const updatedConnectionDetails = {
    ...oldConnectionDetails,
    ...newConnectionDetails,
  };

  cookie.set("currentConnection", JSON.stringify(updatedConnectionDetails));
  const connectionManager = await getDbInstance();
  if (!connectionManager) {
    return { success: false, error: "No connection to the database" };
  }
  await connectionManager.connectDb({
    connectionDetails: updatedConnectionDetails,
  });
  return { success: true };
}

export async function currentConnectionDetails() {
  const cookie = cookies();
  const connectionUrl = cookie.get("currentConnection");
  const connectionDetails: ConnectionDetailsType = JSON.parse(
    connectionUrl?.value || "",
  );
  return connectionDetails;
}

export async function getCurrentDatabaseType() {
  const cookie = cookies();
  const dbType = cookie.get("dbType")?.value;
  return dbType;
}

export async function getTablesWithFieldsFromDb(
  currentSchema: string,
  isUpdateSchema = false,
) {
  const connection = await getDbInstance();
  if (!connection) return null;

  const result = await connection.getTablesWithFieldsFromDb(
    currentSchema,
    isUpdateSchema,
  );
  return result;
}

export async function getDatabases() {
  const connection = await getDbInstance();
  if (!connection) return null;

  return await connection.getDatabases();
}

export async function getSchemas() {
  const connection = await getDbInstance();
  if (!connection) return null;

  return await connection.getSchemas();
}

export async function getTableColumns(table_name: string) {
  const connection = await getDbInstance();
  if (!connection) return { columns: null };

  return await connection.getTableColumns(table_name);
}

export async function getTablesData(
  table_name: string,
  options?: {
    filters?: FilterType[];
    orderBy?: SortColumn[];
    pagination?: PaginationType;
  },
) {
  const connection = await getDbInstance();
  if (!connection)
    return { data: null, error: "No connection to the database" };

  const { data, error, totalRecords } = await connection.getTablesData(
    table_name,
    options,
  );

  // For MongoDB, we need to serialize ObjectId and other special types properly
  // Check if this is MongoDB by looking for ObjectId in the data
  if (data && Array.isArray(data) && data.length > 0) {
    const firstDoc = data[0];

    if (
      firstDoc &&
      firstDoc._id &&
      typeof firstDoc._id === "object" &&
      firstDoc._id.toString
    ) {
      // This is likely MongoDB data, serialize it properly
      const serializedData = data.map((doc: any) => {
        const plainDoc = { ...doc };
        // Convert ObjectId to string
        if (
          plainDoc._id &&
          typeof plainDoc._id === "object" &&
          plainDoc._id.toString
        ) {
          plainDoc._id = plainDoc._id.toString();
        }
        // Convert Date objects to ISO strings
        Object.keys(plainDoc).forEach((key) => {
          if (plainDoc[key] instanceof Date) {
            plainDoc[key] = plainDoc[key].toISOString();
          }
        });
        return plainDoc;
      });

      return { data: JSON.stringify(serializedData), error, totalRecords };
    }
  }

  return { data: JSON.stringify(data), error, totalRecords };
}

export async function getTableRelations(table_name: string) {
  const connection = await getDbInstance();
  if (!connection)
    return { data: null, error: "No connection to the database" };

  return await connection.getTableRelations(table_name);
}

export async function dropTable(table_name: string) {
  const connection = await getDbInstance();
  if (!connection)
    return { data: null, error: "No connection to the database" };

  return await connection.dropTable(table_name);
}

export async function executeQuery(query: string) {
  const connection = await getDbInstance();
  if (!connection)
    return {
      data: null,
      message: null,
      error: "No connection to the database",
    };

  return await connection.executeQuery(query);
}

export async function testConnection({
  connectionDetails,
  isConnect,
  dbType,
}: {
  connectionDetails: ConnectionDetailsType;
  isConnect?: boolean;
  dbType?: keyof typeof handlers;
}) {
  if (!dbType) return { success: false, error: "Database type not found" };

  if (!(dbType in handlers))
    return { success: false, error: "Database type not found" };

  const handler = new handlers[dbType]();
  const { success, error } = await handler.testConnection({
    connectionDetails,
  });

  const cookie = cookies();
  if (success && isConnect) {
    cookie.set("currentConnection", JSON.stringify(connectionDetails));
    cookie.set("dbType", dbType as string);
  }
  return { success, error };
}

export async function disconnectDb(connectionPath: string | null) {
  const cookie = cookies();
  const connectionUrl = cookie.get("currentConnection");
  if (!connectionUrl) return false;

  const connectionDetails: ConnectionDetailsType = JSON.parse(
    connectionUrl.value,
  );

  // Use resetInstance to ensure complete cleanup
  await resetDbInstance();

  if (connectionPath) {
    await updateConnection(connectionPath, {
      ...connectionDetails,
      is_current: false,
    });
  }
  cookie.delete("currentConnection");
  cookie.delete("dbType");
  return true;
}

export async function updateTable(
  tableName: string,
  data: Array<{
    oldValue: Record<string, any>;
    newValue: Record<string, any>;
  }>,
) {
  const connection = await getDbInstance();
  if (!connection) {
    return false;
  }

  const response = await connection.updateTable(tableName, data);

  return { ...response, data: JSON.stringify(response.data) };
}

export async function deleteTableData(tableName: string, data: any[]) {
  const connection = await getDbInstance();
  if (!connection) return false;

  const response = await connection.deleteTableData(tableName, data);
  return { ...response, data: JSON.stringify(response.data) };
}

export async function insertTableData(data: {
  tableName: string;
  values: any[][];
}) {
  const connection = await getDbInstance();
  if (!connection) return false;

  const response = await connection.insertRecord(data);
  return { ...response, data: JSON.stringify(response.data) };
}

export async function createTable(data: TableForm) {
  const connection = await getDbInstance();
  if (!connection) return { data: null, error: "Not connected to Database" };

  const response = await connection.createTable(data);
  return { ...response, data: JSON.stringify(response.data) };
}
