
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Dashboard } from "@/components/admin/Dashboard"
import { TestAvailabilityDialog } from "@/components/admin/TestAvailabilityDialog"
import { Settings } from "lucide-react"

const Admin = () => {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isTestAvailabilityDialogOpen, setIsTestAvailabilityDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      
      // Check if admin login from localStorage first
      const adminFlag = localStorage.getItem("isAdmin")
      if (adminFlag === "true") {
        setIsAdmin(true)
        setLoading(false)
        return
      }
      
      // Check Supabase auth session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate("/auth")
        return
      }
      
      // Check if user has admin or researcher role
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['admin', 'researcher'])
      
      if (error) {
        console.error('Error checking user roles:', error)
        toast({
          title: "خطأ في التحقق من الصلاحيات",
          description: "حدث خطأ أثناء التحقق من صلاحياتك. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        })
        navigate("/auth")
        return
      }
      
      if (!userRoles || userRoles.length === 0) {
        toast({
          title: "غير مخول",
          description: "ليس لديك الصلاحيات اللازمة للوصول إلى لوحة التحكم.",
          variant: "destructive"
        })
        navigate("/")
        return
      }
      
      setIsAdmin(true)
    } catch (error) {
      console.error('Auth error:', error)
      navigate("/auth")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    // Clear admin flag
    localStorage.removeItem("isAdmin");
    // Sign out from Supabase session
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-lg">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-lg text-red-600">غير مصرح لك بالوصول لهذه الصفحة</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">لوحة تحكم نتائج IAT</h1>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsTestAvailabilityDialogOpen(true)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Settings size={16} />
              تفعيل/تعطيل الاختبار
            </Button>
            <Button onClick={handleLogout} variant="outline" className="hover:bg-slate-100">تسجيل الخروج</Button>
          </div>
        </div>

        <Dashboard />

        <TestAvailabilityDialog 
          open={isTestAvailabilityDialogOpen} 
          onOpenChange={setIsTestAvailabilityDialogOpen} 
        />
      </div>
    </div>
  )
}

export default Admin;
