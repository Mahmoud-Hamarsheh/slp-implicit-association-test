
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, EyeOff } from "lucide-react";

// Define the table name for settings
const SETTINGS_TABLE = "app_settings";
const TEST_ENABLED_KEY = "test_enabled";

interface TestAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestAvailabilityDialog({ open, onOpenChange }: TestAvailabilityDialogProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Fetch current test availability setting
  useEffect(() => {
    if (open) {
      fetchTestAvailability();
    }
  }, [open]);

  const fetchTestAvailability = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from(SETTINGS_TABLE)
        .select("*")
        .eq("key", TEST_ENABLED_KEY)
        .single();

      if (error) {
        // If no setting exists, create default (enabled=true)
        if (error.code === "PGRST116") {  // Code for "no rows returned"
          await supabase
            .from(SETTINGS_TABLE)
            .insert([{ key: TEST_ENABLED_KEY, value: true }]);
          setIsEnabled(true);
        } else {
          console.error("Error fetching test availability:", error);
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء تحميل إعدادات الاختبار",
            variant: "destructive",
          });
        }
      } else {
        // Fixed: Parse boolean value from the value field (which could be a JSON value)
        const valueAsBoolean = typeof data.value === 'boolean' ? data.value : 
                              data.value === true || data.value === 'true' || data.value === 1;
        setIsEnabled(valueAsBoolean);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (newState: boolean) => {
    // Show confirmation dialog
    setIsConfirmDialogOpen(true);
    setPendingState(newState);
  };

  const confirmToggle = async () => {
    if (pendingState === null) return;
    
    try {
      setIsLoading(true);
      
      // Fixed: Ensure we're storing the value consistently - always as a boolean
      const { error } = await supabase
        .from(SETTINGS_TABLE)
        .upsert([{ 
          key: TEST_ENABLED_KEY, 
          value: pendingState 
        }]);

      if (error) {
        throw error;
      }

      setIsEnabled(pendingState);
      toast({
        title: pendingState ? "تم تفعيل الاختبار" : "تم تعطيل الاختبار",
        description: pendingState 
          ? "يمكن للمستخدمين الآن الوصول إلى الاختبار" 
          : "تم إيقاف وصول المستخدمين إلى الاختبار",
      });
    } catch (error) {
      console.error("Error updating test availability:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث إعدادات الاختبار",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
      setPendingState(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl">إعدادات توفر الاختبار</DialogTitle>
          </DialogHeader>

          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium">حالة الاختبار</h4>
                <p className="text-sm text-gray-500">
                  {isEnabled ? "الاختبار متاح حاليًا للمستخدمين" : "الاختبار معطل حاليًا"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEnabled ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                )}
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingState ? "تأكيد تفعيل الاختبار" : "تأكيد تعطيل الاختبار"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingState
                ? "هل أنت متأكد من رغبتك في تفعيل الاختبار؟ سيتمكن جميع المستخدمين من الوصول إلى الاختبار."
                : "هل أنت متأكد من رغبتك في تعطيل الاختبار؟ لن يتمكن المستخدمون من الوصول إلى الاختبار."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row-reverse justify-start gap-2">
            <AlertDialogAction onClick={confirmToggle}>
              {pendingState ? "تفعيل الاختبار" : "تعطيل الاختبار"}
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
