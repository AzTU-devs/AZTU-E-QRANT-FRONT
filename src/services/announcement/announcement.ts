import apiClient from "../../util/apiClient";

export interface Announcement {
    id: number;
    title: string;
    content: string;
    published: boolean;
    created_by: string | null;
    created_at: string | null;
    updated_at: string | null;
}

// Published announcements — shown on every authenticated user's dashboard.
export const getAnnouncements = async (): Promise<Announcement[]> => {
    const res = await apiClient.get("/api/announcements");
    return res.data?.data ?? [];
};

// All announcements (drafts included) — admin management view.
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
    const res = await apiClient.get("/api/admin/announcements");
    return res.data?.data ?? [];
};

export const createAnnouncement = async (payload: {
    title: string;
    content: string;
    published: boolean;
}): Promise<Announcement> => {
    const res = await apiClient.post("/api/announcements", payload);
    return res.data?.data;
};

export const updateAnnouncement = async (
    id: number,
    payload: Partial<{ title: string; content: string; published: boolean }>
): Promise<Announcement> => {
    const res = await apiClient.patch(`/api/announcements/${id}`, payload);
    return res.data?.data;
};

export const deleteAnnouncement = async (id: number): Promise<void> => {
    await apiClient.delete(`/api/announcements/${id}`);
};
