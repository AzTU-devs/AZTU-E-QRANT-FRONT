import apiClient from "../../util/apiClient";

export interface AppNotification {
    id: number;
    type: string;
    title: string;
    body: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string | null;
}

export const getNotifications = async (): Promise<AppNotification[]> => {
    const res = await apiClient.get("/api/notifications");
    return res.data?.data ?? [];
};

export const getUnreadCount = async (): Promise<number> => {
    const res = await apiClient.get("/api/notifications/unread-count");
    return res.data?.data?.count ?? 0;
};

export const markNotificationRead = async (id: number): Promise<void> => {
    await apiClient.post(`/api/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
    await apiClient.post("/api/notifications/read-all");
};
