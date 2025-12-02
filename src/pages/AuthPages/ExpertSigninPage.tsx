import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import ExpertSignin from "../../components/auth/ExpertSignin";

export default function ExpertSigninPage() {
  return (
    <>
      <PageMeta
        title="Aztu E-Qrant"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <ExpertSignin />
      </AuthLayout>
    </>
  );
}
