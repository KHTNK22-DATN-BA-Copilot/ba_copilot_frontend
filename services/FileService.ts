import "server-only";

// ── Raw API response types ─────────────────────────────────────

export interface ApiTreeRaw {
    folders?: ApiFolderRaw[];
    files?: ApiFileRaw[];
}

export interface ApiFolderRaw {
    id: number;
    name: string;
    folders?: ApiFolderRaw[];
    files?: ApiFileRaw[];
}

export interface ApiFileRaw {
    id: number;
    name: string;
    extension?: string;
    file_type?: string;
    file_metadata?: { size?: number };
    created_at?: string;
    updated_at?: string;
    file_size?: number;
}

interface FileUploadResponse {
    status: "success" | "error" | "ok";
    files: [
        {
            id: string;
            name: string;
            size_kb: number;
            type: string;
            content: string;
            created_at: string;
        },
    ];
}

// ── Service ────────────────────────────────────────────────────

export class FileService {
    private static readonly baseUrl =
        process.env.BACKEND_DOMAIN ?? "http://localhost:8010";

    private static authHeaders(
        token: string,
        json = false,
    ): Record<string, string> {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
        };
        if (json) headers["Content-Type"] = "application/json";
        return headers;
    }

    public static async getTreeStructure(
        token: string,
        projectId: string,
    ): Promise<ApiTreeRaw> {
        const resp = await fetch(
            `${this.baseUrl}/api/v1/projects/${projectId}/tree`,
            { headers: this.authHeaders(token) },
        );
        if (!resp.ok) throw new Error(`Failed to fetch tree: ${resp.status}`);
        const data = await resp.json();
        return data?.tree ?? { folders: [], files: [] };
    }

    public static async createFolder(
        token: string,
        projectId: string,
        name: string,
        parentId: number | null,
    ): Promise<{ id: number; name: string }> {
        const resp = await fetch(
            `${this.baseUrl}/api/v1/projects/${projectId}/folders`,
            {
                method: "POST",
                headers: this.authHeaders(token, true),
                body: JSON.stringify({ name, parent_id: parentId }),
            },
        );
        if (!resp.ok)
            throw new Error(`Failed to create folder: ${resp.status}`);
        return resp.json();
    }

    public static async deleteFolder(
        token: string,
        folderId: number,
    ): Promise<void> {
        const resp = await fetch(`${this.baseUrl}/api/v1/folders/${folderId}`, {
            method: "DELETE",
            headers: this.authHeaders(token),
        });
        if (!resp.ok)
            throw new Error(`Failed to delete folder: ${resp.status}`);
    }

    public static async renameFolder(
        token: string,
        folderId: number,
        newName: string,
    ): Promise<void> {
        const resp = await fetch(`${this.baseUrl}/api/v1/folders/${folderId}`, {
            method: "PATCH",
            headers: this.authHeaders(token, true),
            body: JSON.stringify({ name: newName }),
        });
        if (!resp.ok)
            throw new Error(`Failed to rename folder: ${resp.status}`);
    }

    public static async uploadFile(
        token: string,
        projectId: string,
        folderId: number,
        formData: FormData,
    ): Promise<ApiFileRaw | ApiFileRaw[]> {
        const resp = await fetch(
            `${this.baseUrl}/api/v1/files/upload/${projectId}/${folderId}`,
            {
                method: "POST",
                headers: this.authHeaders(token),
                body: formData,
            },
        );

        if (!resp.ok) throw new Error(`Failed to upload file: ${resp.status}`);
        const response = await resp.json() as FileUploadResponse;

        if(response.status === "ok") {

            const data = response.files       
            const result: ApiFileRaw[] = data.map(item => {
                return {
                    id: parseInt(item.id),
                    name: item.name,
                    file_size: item.size_kb, 
                    extension: item.type, 
                    created_at: item.created_at,
                }
            })   
            
            return result;
        }
        else {
            return []
        }
        
    }

    public static async deleteFile(token: string, fileId: number): Promise<void> {
        const resp = await fetch(`${this.baseUrl}/api/v1/files/${fileId}`, {
            method: "DELETE",
            headers: this.authHeaders(token),
        });
        if (!resp.ok) throw new Error(`Failed to delete file: ${resp.status}`);
    }

}
