// app/admin/page.tsx

import AdminAddSpotForm from "@/components/AdminAddSpotForm";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin: Add Trade Spot</h1>
      <AdminAddSpotForm />
    </div>
  );
}
