import Swal from "sweetalert2";
import Label from "../form/Label";
import { Link } from "react-router";
import React, { useState } from "react";
import { useParams } from "react-router";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { resetPassword } from "../../services/auth/auth";

export default function NewPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [inputFocussed, setInputFocussed] = useState(false);
    const [repeatedPassword, setRepeatedPassword] = useState("");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const isStrongPassword =
                /[A-Z]/.test(password) &&
                /[0-9]/.test(password) &&
                /[^A-Za-z0-9]/.test(password) &&
                password.length >= 8;

            if (!isStrongPassword) {
                return Swal.fire({
                    icon: "error",
                    title: "Xəta",
                    text: "Daha güclü bir şifrədən istifadə edin!",
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
            }

            if (password !== repeatedPassword) {
                return Swal.fire({
                    icon: "error",
                    title: "Xəta",
                    text: "Şifrələr uyğun deyil!",
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
            }

            if (!token) {
                return Swal.fire({
                    icon: "error",
                    title: "Token mövcud deyil!",
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                }).then(() => {
                    navigate("/");
                });
            }

            const res = await resetPassword({ password, token: token || "" });

            if (res === "SUCCESS") {
                return Swal.fire({
                    icon: "success",
                    title: "Şifrəniz uğurla yeniləndi!",
                    text: "Yeni şifrədən istifadə edərək daxil ola bilərsiz.",
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                }).then(() => {
                    navigate("/");
                });
            } else if (res === "UNAUTHORIZED") {
                return Swal.fire({
                    icon: "error",
                    title: "Müddət bitmişdir!",
                    text: "Zəhmət olmasa yenidən otp kod əldə edin.",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate("/");
                });
            } else {
                return Swal.fire({
                    icon: "error",
                    title: "Gözlənilməz xəta baş verdi text!",
                    text: "Yenidən cəhd edin",
                    confirmButtonText: "OK"
                });
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Şifrəni yeniləyərkən xəta baş verdi!",
                confirmButtonText: "OK"
            }).then(() => {
                navigate("/");
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-5">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Yeni şifrə təyin edin
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Yeni şifrə təyin edərkən aşağıdakı qaydalara riayət edin!
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleResetPassword}>
                            <div className="space-y-5">
                                <div className="relative">
                                    <Label>
                                        Yeni şifrə <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={!showPassword ? "password" : "text"}
                                            placeholder="Şifrə"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value) }}
                                            onFocus={() => setInputFocussed(true)}
                                            onBlur={() => setInputFocussed(false)}
                                            className="pr-10"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                {inputFocussed ? (
                                    <div className="mb-[10px]">
                                        <div className="flex items-center">
                                            <div className="flex justify-center items-center"
                                                style={{
                                                    backgroundColor: password.length >= 8 ? "green" : "red",
                                                    borderColor: password.length >= 8 ? "green" : "red",
                                                    borderWidth: 2,
                                                    width: "15px",
                                                    height: "15px",
                                                    borderRadius: "50%",
                                                    padding: "7px",
                                                    marginRight: 10
                                                }}>
                                                {password.length >= 8 ? (
                                                    <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                                                ) : (
                                                    <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                                                )}
                                            </div>
                                            <p>
                                                Minimum 8 simvol
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex justify-center items-center"
                                                style={{
                                                    backgroundColor: /[A-Z]/.test(password) ? "green" : "red",
                                                    borderColor: /[A-Z]/.test(password) ? "green" : "red",
                                                    borderWidth: 2,
                                                    width: "15px",
                                                    height: "15px",
                                                    borderRadius: "50%",
                                                    padding: "7px",
                                                    marginRight: 10
                                                }}>
                                                {/[A-Z]/.test(password) ? (
                                                    <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                                                ) : (
                                                    <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                                                )}
                                            </div>
                                            <p>
                                                Ən azı bir böyük hərf
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex justify-center items-center"
                                                style={{
                                                    backgroundColor: /[0-9]/.test(password) ? "green" : "red",
                                                    borderColor: /[0-9]/.test(password) ? "green" : "red",
                                                    borderWidth: 2,
                                                    width: "15px",
                                                    height: "15px",
                                                    borderRadius: "50%",
                                                    padding: "7px",
                                                    marginRight: 10
                                                }}>
                                                {/[0-9]/.test(password) ? (
                                                    <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                                                ) : (
                                                    <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                                                )}
                                            </div>
                                            <p>
                                                Ən azı bir nömrə
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex justify-center items-center"
                                                style={{
                                                    backgroundColor: /[^A-Za-z0-9]/.test(password) ? "green" : "red",
                                                    borderColor: /[^A-Za-z0-9]/.test(password) ? "green" : "red",
                                                    borderWidth: 2,
                                                    width: "15px",
                                                    height: "15px",
                                                    borderRadius: "50%",
                                                    padding: "7px",
                                                    marginRight: 10
                                                }}>
                                                {/[^A-Za-z0-9]/.test(password) ? (
                                                    <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                                                ) : (
                                                    <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                                                )}
                                            </div>
                                            <p>
                                                Ən azı bir xüsusi simvol (!@#$%^&*(),.?":{ }|")
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="relative">
                                    <Label>
                                        Təkrar şifrə <span className="text-error-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Təkrar şifrə"
                                            type={!showPassword ? "password" : "text"}
                                            value={repeatedPassword}
                                            onChange={(e) => setRepeatedPassword(e.target.value)}
                                            className="pr-10" // reserve space for the icon
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Button className="w-full" size="sm" disabled={loading || !password}>
                                        {loading ? "Doğrulanır..." : "Təsdiqlə"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Artıq hesabınız var? {""}
                                <Link
                                    to="/"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Daxil Ol
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}