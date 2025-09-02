import apiClient from "../../util/apiClient";

export const sendOtp = async (fin_kod: string) => {
    const response = await apiClient.post(`/auth/send-otp/${fin_kod}`);

    if (response.data.status === 200) {
        return "SUCCESS";
    } else if (response.data.status === 404) {
        return "NOT FOUND";
    } else {
        return "ERROR";
    }
}


export const validateOtp = async (fin_kod: string, otp: number) => {
    try {
        const response = await apiClient.post(`/auth/validate-otp/${fin_kod}/${otp}`);
        if (response.data.status === 200 && response.data.data) {
            return response.data.data;
        } else if (response.data.status === 400 || response.data.status === 404) {
            return "UNAUTHORIZED";
        } else {
            return "ERROR";
        }
    } catch (err) {
        console.error("Validate OTP error:", err);
        return "ERROR";
    }
};