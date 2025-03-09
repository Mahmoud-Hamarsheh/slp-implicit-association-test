
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6 flex items-center justify-center" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">تسجيل الدخول للوحة التحكم</CardTitle>
          <div className="mt-4 flex justify-center gap-4">
            <Button 
              variant="secondary"
              onClick={() => navigate("/")}
              size="sm"
            >
              الذهاب للاختبار
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate("/admin")}
              size="sm"
            >
              لوحة التحكم
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
