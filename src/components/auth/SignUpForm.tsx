import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Label from "../form/Label";
import { Link } from "react-router";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { EyeCloseIcon, EyeIcon } from "../../icons";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const options = [
    { value: "0", label: "Layihə rəhbəri" },
    { value: "1", label: "Layihə icraçısı" },
  ];

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [, setError] = useState("");
  const [email, setEmail] = useState("");
  const [finKod, setFinKod] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fatherName, setFatherName] = useState("");
  const [insOptions, setInstOptions] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInst, setSelectedInst] = useState("");
  const [inputFocussed, setInputFocussed] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSelectChange = (value: string) => {
    setRole(value);
  };

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await apiClient.get('/api/institutions');
        setInstitutions(response.data.data);
        const transformedOptions = response.data.data.map((institution: any) => ({
          value: institution.institution_code.toString(),
          label: institution.institution_name,
        }));
        setInstOptions(transformedOptions);
      } catch (err) {
        setError('Failed to fetch institutions');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  console.log(institutions);

  const instSelectChange = (value: string) => {
    setSelectedInst(value);
  }

  const userType = useSelector((state: RootState) => state.auth.userType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!finKod || !email || !password || !confirmPassword || !role || !name || !surname || !fatherName || !selectedInst) {
      Swal.fire("Xəta", "Zəhmət olmasa bütün sahələri doldurun!", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Xəta", "Şifrələr uyğun deyil!", "error");
      return;
    }
    console.log("Sending data:", {
      fin_kod: finKod,
      password,
      user_type: userType,
      project_role: role,
      email: email,
      name: name,
      surname: surname,
      father_name: fatherName,
      institution_code: selectedInst
    });


    try {
      setLoading(true);
      if (!(/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) && password.length >= 8) {
        Swal.fire("Xəta", "Daha güclü bir şifrədən istifadə edin!", "error");
      } else {
        const response = await apiClient.post("/auth/signup", {
          fin_kod: finKod,
          password,
          user_type: userType,
          project_role: Number(role),
          email: email,
          name: name,
          surname: surname,
          father_name: fatherName,
          institution_code: selectedInst
        });

        console.log(response);

        Swal.fire("Uğurla qeydiyyatdan keçdiniz!", "", "success").then(() => {
          navigate("/signin");
        });
      }
    } catch (error: any) {
      Swal.fire("Xəta", "Server xətası", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Qeydiyyat
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Qeydiyyat üçün Fin kod, şifrə və layihə rolunu daxil edin!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  {/* <!-- Fin Kod 1 --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Ad<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Ad"
                      value={name}
                      onChange={(e) => setName((e.target.value))}
                    />
                  </div>

                  {/* <!-- Fin Kod 2 --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Soyad<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="surname"
                      name="surname"
                      placeholder="Soyad"
                      value={surname}
                      onChange={(e) => setSurname((e.target.value))}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Ata adı<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="father_name"
                      name="father_name"
                      placeholder="Ata adı"
                      value={fatherName}
                      onChange={(e) => setFatherName((e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Fin Kod --> */}
                  <div className="sm:col-span-2">
                    <Label>
                      Fin kod<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      maxLength={7}
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Fin kod"
                      value={finKod}
                      onChange={(e) => setFinKod((e.target.value).toUpperCase())}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Email --> */}
                  <div className="sm:col-span-2">
                    <Label>
                      E-poçt<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      maxLength={254}
                      type="email"
                      id="email"
                      name="emaiuil"
                      placeholder="E-poçt"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative mt-5">
                  <Label>
                    Müəssisə <span className="text-error-500">*</span>
                  </Label>
                  <Select
                    options={insOptions}
                    placeholder="Müəssisə seçin"
                    onChange={instSelectChange}
                    className="dark:bg-dark-900"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Şifrə <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      minLength={8}
                      placeholder="Şifrə"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setInputFocussed(true)}
                      onBlur={() => setInputFocussed(false)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
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
                  <div>
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
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Təkrar şifrə <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      minLength={8}
                      placeholder="Təkrar şifrə"
                      type={showConfPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowConfPass(!showConfPass)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfPass ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  <div className="relative mt-5">
                    <Label>
                      Layihə rolu <span className="text-error-500">*</span>
                    </Label>
                    <Select
                      options={options}
                      placeholder="Rol seçin"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button
                    disabled={
                      loading ||
                      !finKod.trim() ||
                      !password.trim() ||
                      !confirmPassword.trim() ||
                      !role.trim() ||
                      !email
                    } className="w-full">
                    {loading ? "Qeydiyyat davam edir" : "Qeydiyyat"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Artıq hesabınız var? {""}
                <Link
                  to="/signin"
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
