"use client";

import { createContext, use, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/projects";
import { useParams, usePathname } from "next/navigation";

type WSStatus = "connected" | "disconnected" | "connecting";

interface WSContextType {
    token: string;
    setToken: (val: string) => void;
    // projectId: number;
    // setProjectId: (val: number) => void;
    wsStatus: WSStatus;
}

const WSContext = createContext<WSContextType | null>(null);

export const useWebSocket = () => {
    const context = useContext(WSContext);
    if (!context) throw new Error("useWebSocket must be used within WebSocketProvider");
    return context;
};

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    // Quản lý state global để các page đều có thể truy cập
    const [token, setToken] = useState<string>("");
    const [projectId, setProjectId] = useState<string>("");
    const [wsStatus, setWsStatus] = useState<WSStatus>("disconnected");

    const params = useParams();
    const urlProjectId = params?.id as string;

    const wsRef = useRef<WebSocket | null>(null);
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

    const WS_URL = process.env.NEXT_PUBLIC_WS_DOMAIN; 

    useEffect(() => {
        console.log("WebSocketProvider mounted, loading token and projectId from storage");

        (async () => {
            const accessToken = await getAccessToken();
            setToken(accessToken ?? accessToken);
        })()
    }, []);

    useEffect(() => {
        if (urlProjectId && urlProjectId !== "undefined") {
            setProjectId(urlProjectId);
        }
    }, [urlProjectId]);


    useEffect(() => {
        if (!token || !projectId || projectId === "undefined") return;

        let isIntentionalClose = false;

        const connectWS = () => {
            console.log(wsRef.current)
            if (wsRef.current) wsRef.current.close();
            
            setWsStatus("connecting");
            const ws = new WebSocket(`${WS_URL}/api/v1/ws/projects/${projectId}/upload?token=${token}`); //

            ws.onopen = () => {
                setWsStatus("connected");
                toast.success("Đã kết nối hệ thống thông báo");

                // Heartbeat ping mỗi 10s[cite: 1]
                heartbeatRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send("ping"); //[cite: 1]
                    }
                }, 10000); //[cite: 1]
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    // Xử lý logic push notification dựa trên status[cite: 1]
                    if (data.type === "file_status") { //[cite: 1]
                        if (data.status === "completed") { //[cite: 1]
                            toast.success(`Xử lý AI thành công file: ${data.file_id}`);
                        } else if (data.status === "failed") { //[cite: 1]
                            toast.error(`Lỗi xử lý file: ${data.file_id}`);
                        } else if (data.status === "processing") { //[cite: 1]
                            // Tùy chọn: Hiện toast nhỏ nhắn hoặc bỏ qua để tránh spam
                            toast(`Đang phân tích AI file ${data.file_id}...`, { icon: '⏳' }); 
                        }
                    }
                } catch (e) {
                    console.error("Lỗi parse WS data", e);
                }
            };

            ws.onclose = (e) => {
                setWsStatus("disconnected");
                if (heartbeatRef.current) clearInterval(heartbeatRef.current); //[cite: 1]

                if (!isIntentionalClose) {
                    console.log("Mất kết nối, đang thử lại...");
                    setTimeout(() => {
                        // Kiểm tra lại lần nữa trước khi connect
                        if (!isIntentionalClose) connectWS();
                    }, 2000);
                }
            };

            wsRef.current = ws;
        };

        connectWS();

        // Cleanup
        return () => {
            isIntentionalClose = true;
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        };
    }, [token, projectId]); // Tự động chạy lại nếu đổi token hoặc project

    return (
        <WSContext.Provider value={{ token, setToken, wsStatus }}>
            {children}
        </WSContext.Provider>
    );
}