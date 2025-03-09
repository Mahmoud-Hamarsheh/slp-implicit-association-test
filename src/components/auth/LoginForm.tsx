
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/admin");
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Set redirect URL to the login page on the same domain
      const redirectUrl = window.location.origin + "/auth";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى التحقق من بريدك الإلكتروني",
      });
      setResetMode(false);
    } catch (error: any) {
      toast({
        title: "خطأ في إرسال رابط إعادة التعيين",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (resetMode) {
    return (
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "جاري إرسال الرابط..." : "إرسال رابط إعادة التعيين"}
        </Button>
        <div className="text-center">
          <Button 
            type="button" 
            variant="link" 
            onClick={() => setResetMode(false)}
            className="p-0"
          >
            العودة لتسجيل الدخول
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>
      <div className="flex justify-between items-center text-sm">
        <Button 
          type="button" 
          variant="link" 
          onClick={() => setResetMode(true)}
          className="p-0"
        >
          نسيت كلمة المرور؟
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => navigate("/")}
          className="p-0"
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">روابط مباشرة للوصول:</p>
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
            >
              الاختبار
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin")}
            >
              لوحة التحكم
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
