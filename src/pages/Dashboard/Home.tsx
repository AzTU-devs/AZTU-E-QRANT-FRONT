import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import AztuLogoDark from "../../../public/aztu-logo.webp";
import AztuLogoLight from "../../../public/aztu-logo-light.png";
import GrantLogoDark from "../../../public/e-grant-logo-dark.png";
import GrantLogoLight from "../../../public/e-grant-logo-light.png";
import { clearLoginToast } from "../../redux/slices/authSlice";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface State extends SnackbarOrigin {
  open: boolean;
}

export default function Home() {
  const dispatch = useDispatch();
  const showLoginToast = useSelector((state: RootState) => state.auth.showLoginToast);

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  React.useEffect(() => {
    if (showLoginToast) {
      setState({ open: true, vertical: "top", horizontal: "center" });
    }
  }, [showLoginToast]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, open: false });
    dispatch(clearLoginToast());
  };

  const { vertical, horizontal, open } = state;

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="flex flex-col justify-center items-center text-center px-4">
        <div className="flex justify-center items-center">
          <img
            src={AztuLogoLight}
            alt=""
            className="hidden dark:block w-auto h-25 mr-[30px]"
          />
          <img
            src={AztuLogoDark}
            alt=""
            className="block dark:hidden w-auto h-25 mr-[30px]"
          />
          {/* Light mode image */}
          <img
            src={GrantLogoLight}
            alt="Grant Logo Light"
            className="hidden dark:block w-auto h-35"
          />
          {/* Dark mode image */}
          <img
            src={GrantLogoDark}
            alt="Grant Logo Dark"
            className="block dark:hidden w-auto h-35"
          />
        </div>

        <h1 className="mt-6 text-4xl font-bold text-[rgb(20,30,79)] dark:text-white">
          AzTU Daxili Qrant müsabiqəsi
        </h1>
        <p className="mt-8 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          Elmi-tədqiqat və ya innovasiya layihələrinin maliyyə dəstəyi ilə həyata
          keçirilməsi üçün Azərbaycan Texniki Universiteti tərəfindən qrant
          müsabiqəsi elan olunu. Elmi qrant layihələrinin əsas məqsədi elmi
          tədqiqatların və innovativ ideyaların maliyyələşdirilməsi və
          dəstəklənməsidir. Əlavə olaraq, qrantlar şəffaflıq, rəqabət və elmi
          keyfiyyət prinsiplərinə əsaslanaraq, elmi mühitdə yaradıcılığı və
          məhsuldarlığı artırmaq məqsədi daşıyır.
        </p>
      </div>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="Welcome"
        key={vertical + horizontal}
        autoHideDuration={3000}
        ContentProps={{
          sx: {
            backgroundColor: 'yourColorHere', // e.g. 'green', '#4caf50', 'rgba(0,0,0,0.7)'
            color: 'white', // text color for contrast
            fontWeight: 'bold',
          }
        }}
        className="mt-[80px]"
      />
    </>
  );
}