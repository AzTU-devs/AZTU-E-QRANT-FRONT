import apiClient from "../../util/apiClient";

export interface Attachment {
    id: number;
    original_filename: string;
    content_type: string | null;
    file_size: number | null;
    is_image: boolean;
    url: string;
    uploaded_at: string | null;
}

export interface ChatMessage {
    id: number;
    thread_id: number;
    sender_type: "user" | "admin";
    sender_fin_kod: string | null;
    sender_name?: string | null;
    body: string | null;
    is_read: boolean;
    created_at: string | null;
    attachments: Attachment[];
}

export interface Thread {
    id: number;
    user_fin_kod: string;
    created_at: string | null;
    last_message_at: string | null;
    messages: ChatMessage[];
    user?: { name: string | null; surname: string | null; email: string | null };
}

export interface ThreadListItem {
    id: number;
    user_fin_kod: string;
    user: { name: string | null; surname: string | null; email: string | null };
    last_message_at: string | null;
    last_preview: string;
    unread: number;
}

// ---- user ----
export const getMyThread = async (): Promise<Thread> =>
    (await apiClient.get("/api/messages/thread")).data.data;

export const sendMessage = async (body: string, files: File[]): Promise<ChatMessage> => {
    const fd = new FormData();
    fd.append("body", body);
    files.forEach((f) => fd.append("files", f));
    return (await apiClient.post("/api/messages/thread", fd)).data.data;
};

export const getMessagesUnreadCount = async (): Promise<number> =>
    (await apiClient.get("/api/messages/unread-count")).data?.data?.count ?? 0;

// ---- admin ----
export const getThreads = async (): Promise<ThreadListItem[]> =>
    (await apiClient.get("/api/messages/threads")).data.data ?? [];

export const getThreadByUser = async (finKod: string): Promise<Thread> =>
    (await apiClient.get(`/api/messages/threads/${finKod}`)).data.data;

export const sendMessageAsAdmin = async (finKod: string, body: string, files: File[]): Promise<ChatMessage> => {
    const fd = new FormData();
    fd.append("body", body);
    files.forEach((f) => fd.append("files", f));
    return (await apiClient.post(`/api/messages/threads/${finKod}`, fd)).data.data;
};

// Fetch an attachment as an object URL (the download endpoint needs the auth
// header, which <img src>/<a href> can't send — so we fetch a blob).
export const fetchAttachmentBlobUrl = async (url: string): Promise<string> => {
    const res = await apiClient.get(url, { responseType: "blob" });
    return URL.createObjectURL(res.data);
};
