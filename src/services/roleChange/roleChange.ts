import apiClient from "../../util/apiClient";

// project_role: 0 = lead (owner), 1 = member (collaborator)
export interface RoleChangeRequest {
    id: number;
    fin_kod: string;
    current_role: number;
    requested_role: number;
    reason: string | null;
    status: "pending" | "approved" | "rejected";
    admin_note: string | null;
    created_at: string | null;
    decided_at: string | null;
    decided_by: string | null;
    user?: { name: string | null; surname: string | null; email: string | null };
}

export const ROLE_LABELS: Record<number, string> = {
    0: "Layihə rəhbəri",
    1: "İcraçı",
};

export const createRoleChangeRequest = async (payload: {
    requested_role: number;
    reason?: string;
}): Promise<RoleChangeRequest> => {
    const res = await apiClient.post("/api/role-change", payload);
    return res.data?.data;
};

export const getMyRoleChangeRequests = async (): Promise<RoleChangeRequest[]> => {
    const res = await apiClient.get("/api/role-change/mine");
    return res.data?.data ?? [];
};

export const getPendingRoleChangeRequests = async (): Promise<RoleChangeRequest[]> => {
    const res = await apiClient.get("/api/role-change/pending");
    return res.data?.data ?? [];
};

export const approveRoleChange = async (id: number, admin_note?: string): Promise<void> => {
    await apiClient.post(`/api/role-change/${id}/approve`, { admin_note });
};

export const rejectRoleChange = async (id: number, admin_note?: string): Promise<void> => {
    await apiClient.post(`/api/role-change/${id}/reject`, { admin_note });
};
