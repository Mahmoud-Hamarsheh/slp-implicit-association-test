
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dashboard } from "@/components/admin/Dashboard";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if admin login from localStorage
    const isAdmin = localStorage.getItem("isAdmin");
    
    if (isAdmin === "true") {
      setLoading(false);
      return;
    }
    
    // Check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    } else {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Clear admin flag
    localStorage.removeItem("isAdmin");
    // Sign out from Supabase session
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">لوحة تحكم نتائج IAT</h1>
          <Button onClick={handleLogout} variant="outline" className="hover:bg-slate-100">تسجيل الخروج</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-center">جاري التحميل...</p>
          </div>
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
};

export default Admin;
