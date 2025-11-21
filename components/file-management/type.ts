export type FileItem = {};

export type FolderData = {
    id: number;
    name: string;
    files: FileItem[];
    color: string;
};

export type FileNode =
    | {
          id: string | number;
          name: string;
          type: "file";
          size: number | string;
          uploadedDate: string;
          fileType: string;
          file: File
      }
    | {
          id: string | number;
          name: string;
          type: "folder";
          children: FileNode[];
          systemFileType: boolean;
      };
