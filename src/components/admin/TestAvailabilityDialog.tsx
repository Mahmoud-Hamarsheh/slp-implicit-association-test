
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
        // Parse boolean value properly based on the type
        let valueAsBoolean = false;
        
        if (typeof data.value === 'boolean') {
          valueAsBoolean = data.value;
        } else if (typeof data.value === 'string') {
          valueAsBoolean = data.value === 'true';
        } else if (typeof data.value === 'number') {
          valueAsBoolean = data.value === 1;
        } else if (typeof data.value === 'object' && data.value !== null) {
          // For JSON objects, try to extract a boolean value if possible
          // This handles the case when Supabase returns the value as a JSON object
          const jsonValue = data.value;
          if ('value' in jsonValue && typeof jsonValue.value === 'boolean') {
            valueAsBoolean = jsonValue.value;
          }
        }
        
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
      
      // First check if the setting exists
      const { data: existingData, error: checkError } = await supabase
        .from(SETTINGS_TABLE)
        .select("id")
        .eq("key", TEST_ENABLED_KEY)
        .maybeSingle();
      
      let updateError;
      
      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }
      
      // If setting exists, update it
      if (existingData?.id) {
        const { error } = await supabase
          .from(SETTINGS_TABLE)
          .update({ value: pendingState })
          .eq("id", existingData.id);
        
        updateError = error;
      } else {
        // If setting doesn't exist, insert it
        const { error } = await supabase
          .from(SETTINGS_TABLE)
          .insert([{ key: TEST_ENABLED_KEY, value: pendingState }]);
        
        updateError = error;
      }

      if (updateError) {
        throw updateError;
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
