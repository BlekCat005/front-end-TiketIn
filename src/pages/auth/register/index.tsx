import AuthLayout from "@/components/layouts/AuthLayout";
import Register from "@/components/views/Auth/Register";

const RegisterPage = () => {
  return (
    <AuthLayout title="TiketIn | Register">
      <Register />
    </AuthLayout>
  );
};

export default RegisterPage;
