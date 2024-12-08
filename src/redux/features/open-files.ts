import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  openFiles: FileType[];
  currentFile: FileType | null;
} = {
  openFiles: [],
  currentFile: null,
};

export const openFileSlice = createSlice({
  name: "openFiles",
  initialState,
  reducers: {
    resetOpenFiles: (state) => {
      state.openFiles = initialState.openFiles;
      state.currentFile = initialState.currentFile;
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    setOpenFiles: (state, action) => {
      state.openFiles = action.payload;
    },
    addOpenFiles: (state) => {
      const lastFile = state.openFiles.findLast(
        (file: any) => file.type === "file"
      );
      const lastOpenFile = state.openFiles[state.openFiles.length - 1];
      const lastOpenFileId = lastOpenFile ? parseInt(lastOpenFile.id) : 0;

      const lastNumber = lastFile ? parseInt(lastFile.id) : 0;
      const newFile: FileType = {
        id: (lastOpenFileId + 1).toString(),
        name: "Query-" + (lastNumber + 1).toString(),
        type: "file",
        code: "",
      };
      state.openFiles.push(newFile);
      state.currentFile = newFile;
    },
    updateFile: (state, action) => {
      const currentFile = state.currentFile;

      if (!currentFile) return;

      const index = state.openFiles.findIndex(
        (file: any) => file.id === currentFile.id.toString()
      );

      state.openFiles[index] = { ...currentFile, ...action.payload };
      state.currentFile = { ...currentFile, ...action.payload };
    },
    removeFile: (state, action) => {
      const index = state.openFiles.findIndex(
        (file: any) => file.id === action.payload.id
      );
      state.openFiles.splice(index, 1);
      if (state.currentFile?.id === action.payload.id) {
        if (index === 0 && state.openFiles.length > 0) {
          state.currentFile = state.openFiles[0];
        }
        if (index === 0 && state.openFiles.length === 0) {
          state.currentFile = null;
        }
        if (index > 0) {
          state.currentFile = state.openFiles[index - 1];
        }
      }
    },
    addTableFile: (state, action) => {
      const file = state.openFiles.find(
        (file: any) =>
          file.tableName === action.payload.table_name && file.type === "table"
      );
      if (file) {
        state.currentFile = file;
        return;
      }
      const newFile: FileType = {
        id: (state.openFiles.length + 1).toString(),
        name: action.payload.table_name,
        type: "table",
        tableName: action.payload.table_name,
      };
      state.openFiles.push(newFile);
      state.currentFile = newFile;
    },
    addTableStructureFile: (state, action) => {
      const file = state.openFiles.find(
        (file: any) =>
          file.tableName === action.payload.table_name &&
          file.type === "structure"
      );
      if (file) {
        state.currentFile = file;
        return;
      }
      const newFile: FileType = {
        id: (state.openFiles.length + 1).toString(),
        name: action.payload.table_name,
        type: "structure",
        tableName: action.payload.table_name,
      };
      state.openFiles.push(newFile);
      state.currentFile = newFile;
    },
  },
});

export const {
  setCurrentFile,
  setOpenFiles,
  addOpenFiles,
  updateFile,
  removeFile,
  addTableFile,
  addTableStructureFile,
  resetOpenFiles,
} = openFileSlice.actions;

export default openFileSlice.reducer;
