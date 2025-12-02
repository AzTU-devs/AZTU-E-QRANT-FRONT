import apiClient from "../../util/apiClient";

export const getLockStatus = async () => {
    const res = await apiClient.get("/lock-status");
    return res.data;
};

export const lockVariable = async () => {
    const res = await apiClient.post("/lock");
    return res.data;
};

export const unlockVariable = async () => {
    const res = await apiClient.post("/unlock");
    return res.data;
};