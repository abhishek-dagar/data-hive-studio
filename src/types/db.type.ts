import sqlite3 from "sqlite3";

export interface DBType extends sqlite3.Database {}

export interface ConnectionsType {
  id: string;
  name: string;
  connection_type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  connection_string: string;
  save_password: number;
  color: string;
}

export const DbConnectionsTypes = ["pgSql", "sqlite"];

export const DbConnectionColors = ["#15db95", "#ff5d59", "#fad83b", "#9858ff"];
