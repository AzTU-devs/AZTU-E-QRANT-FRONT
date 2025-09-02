import apiClient from "../../util/apiClient";

export const resetPassword = async ({ password, token }: { password: string; token: string }) => {
    const response = await apiClient.post('/auth/reset-password', { password, token });

    if (response.data.status === 200) {
        return "SUCCESS";
    } else if (response.data.status === 401 || response.data.status === 403 || response.data.status === 404) {
        return "UNAUTHORIZED";
    } else {
        return "ERROR";
    }
}