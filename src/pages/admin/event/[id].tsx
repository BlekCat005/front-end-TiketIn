import DashboardLayout from "@/components/layouts/DashboardLayout";
import DetailEvent from "@/components/views/Admin/DetailEvent";

const AdminDetailEventPage = () => {
  return (
    <DashboardLayout
      title="Detail Event"
      description="Manage information of a event"
      type="admin"
    >
      <DetailEvent />
    </DashboardLayout>
  );
};

export default AdminDetailEventPage;
