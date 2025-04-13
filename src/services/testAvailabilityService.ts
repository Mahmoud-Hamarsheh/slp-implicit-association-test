
import { supabase } from "@/lib/supabase";

// Settings constants 
const SETTINGS_TABLE = "app_settings";
const TEST_ENABLED_KEY = "test_enabled";

/**
 * Service to check if the IAT test is enabled in the system settings
 */
export const checkTestAvailability = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select("*")
      .eq("key", TEST_ENABLED_KEY)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No setting found, assume enabled by default
        return true;
      } else {
        console.error("Error checking test availability:", error);
        // If there's an error, assume the test is enabled to prevent blocking users
        return true;
      }
    } else {
      // Parse boolean value properly based on the type
      let enabled = false;
      
      if (typeof data.value === 'boolean') {
        enabled = data.value;
      } else if (typeof data.value === 'string') {
        enabled = data.value === 'true';
      } else if (typeof data.value === 'number') {
        enabled = data.value === 1;
      }
      
      return enabled;
    }
  } catch (error) {
    console.error("Error:", error);
    // If there's an error, assume the test is enabled to prevent blocking users
    return true;
  }
};
