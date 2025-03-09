
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6 flex items-center justify-center" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">تسجيل الدخول للوحة التحكم</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
