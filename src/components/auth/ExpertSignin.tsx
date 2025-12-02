import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../services/otp/otp";
import { setUserType } from "../../redux/slices/authSlice";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function ExpertSignin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

//   const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await sendOtp(finKod);
//       if (res === "SUCCESS") {
//         await Swal.fire({
//           icon: "success",
//           title: "OTP uğurla göndərildi",
//           text: "Zəhmət olmasa e-poçt adresinizi yoxlayın",
//           showConfirmButton: true
//         });
//         navigate(`/otp-verification/${finKod}`);
//       } else if (res === "NOT FOUND") {
//         Swal.fire({
//           icon: "error",
//           title: "Yanlış fin kod",
//           text: "Zəhmət olmasa fin kodun doğruluğundan əmin olun."
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Xəta baş verdi",
//           text: "Zəhmət olmasa bir az sonra yenidən cəhd edin.",
//         });
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Xəta baş verdi",
//         text: "Zəhmət olmasa bir az sonra yenidən cəhd edin.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
            <div className="mb-[50px] text-gray-700 dark:text-gray-400 sm:text-start flex items-center">
          <div className="cursor-pointer" onClick={() => { dispatch(setUserType(null)) }}>
            <ArrowBackIosIcon /> Əvvəl
          </div>
        </div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daxil Ol
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sistemə daxil olmaq üçün e-poçt adresinizi daxil edin və OTP kodu üçün e-poçt adresinizi yoxlayın!
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="grant@gmail.com" value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" />
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading || !email}>
                    {loading ? "Doğrulanır..." : "Təsdiqlə"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}