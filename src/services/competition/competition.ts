import apiClient from "../../util/apiClient";

export interface Competition {
    id: number;
    code: string;
    year: number;
    title: string | null;
    is_active: boolean;
    application_deadline: string | null;
    report_deadline: string | null;
    contract_date: string | null;
    max_smeta_amount: number;
    collaborator_limit: number;
    created_at: string | null;
    created_by: string | null;
}

export const getCompetitions = async (): Promise<Competition[]> => {
    const res = await apiClient.get("/api/competitions");
    return res.data?.data ?? [];
};

export const getActiveCompetition = async (): Promise<Competition | null> => {
    const res = await apiClient.get("/api/competition/active");
    return res.data?.data ?? null;
};

export const createCompetition = async (payload: {
    year: number;
    code?: string;
    title?: string;
    application_deadline?: string;
    report_deadline?: string;
    contract_date?: string;
    max_smeta_amount?: number;
    collaborator_limit?: number;
    activate?: boolean;
}): Promise<Competition> => {
    const res = await apiClient.post("/api/competition", payload);
    return res.data?.data;
};

export const activateCompetition = async (id: number): Promise<void> => {
    await apiClient.post(`/api/competition/${id}/activate`);
};
