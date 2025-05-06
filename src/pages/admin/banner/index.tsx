import DashboardLayout from "@/components/layouts/DashboardLayout";
import Banner from "@/components/views/Admin/Banner";

const AdminBannerPage = () => {
  return (
    <DashboardLayout
      title="Banner"
      description="List of all banner, create new Banner, and manage banner"
      type="admin"
    >
      <Banner />
    </DashboardLayout>
  );
};

export default AdminBannerPage;
