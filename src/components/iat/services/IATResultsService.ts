
import { supabase } from "@/lib/supabase";
import { Response } from "../IATTypes";
import { IATProps } from "../IATTypes";

type ToastFunction = (props: { 
  title: string; 
  description: string; 
  variant?: "default" | "destructive" 
}) => void;

export const saveIATResults = async (
  dScore: number,
  responses: Response[],
  surveyData: IATProps["surveyData"],
  toast: ToastFunction
) => {
  try {
    // Ensure valid D-score (never null)
    const finalDScore = dScore || 0;
    
    // Only keep response times for correct responses (in seconds)
    const correctResponseTimes = responses
      .filter(r => r.correct)
      .map(r => Number(r.responseTime.toFixed(3)));
    
    // Check for too many fast responses
    const tooFastResponsesPercentage = responses.filter(r => r.responseTime < 0.3).length / responses.length;
    const validData = tooFastResponsesPercentage <= 0.1;

    // Format demographic data properly
    let formattedGender = 1; // Default to male (1)
    if (typeof surveyData.gender === 'number') {
      formattedGender = surveyData.gender;
    } else if (typeof surveyData.gender === 'string') {
      formattedGender = surveyData.gender === 'female' ? 2 : 1;
    }

    // Convert degree to numeric value if it's not already
    let degreeValue = surveyData.degree;
    if (!degreeValue.match(/^[0-9]+$/)) {
      if (degreeValue === "طالب") degreeValue = "1";
      else if (degreeValue === "بكالوريوس") degreeValue = "2";
      else if (degreeValue === "ماجستير") degreeValue = "3";
      else if (degreeValue === "دكتوراه") degreeValue = "4";
    }

    // Properly extract and format bias awareness data
    const biasAwarenessResponses = surveyData.biasAwarenessResponses || {};
    
    // Ensure biasScore is properly extracted and formatted
    let biasScore: number | null = null;
    if (biasAwarenessResponses.biasScore) {
      biasScore = parseFloat(biasAwarenessResponses.biasScore);
      if (isNaN(biasScore)) biasScore = null;
    }

    // Ensure survey responses are properly formatted
    const formattedSurveyResponses = Object.keys(biasAwarenessResponses).length > 0 
      ? biasAwarenessResponses 
      : null;

    // Prepare data for saving
    const dataToSave = {
      d_score: finalDScore,
      age: Number(surveyData.age) || 1,
      years_experience: Number(surveyData.yearsExperience) || 0,
      degree: degreeValue,
      gender: formattedGender,
      response_times: correctResponseTimes,
      responses: JSON.stringify(responses),
      survey_responses: formattedSurveyResponses ? JSON.stringify(formattedSurveyResponses) : null,
      survey_score: biasScore
    };

    console.log("Saving IAT results with data:", dataToSave);

    if (surveyData.hasTakenIATBefore) {
      console.log("User has taken IAT before, not saving to database");
      toast({
        title: "اكتمل الاختبار",
        description: "بما أنك قمت بالاختبار مسبقًا، لن يتم حفظ نتائجك في قاعدة البيانات.",
      });
      return finalDScore;
    } else {
      console.log("Final data being sent to Supabase:", dataToSave);

      // Use the supabase client from @/integrations/supabase/client if it exists, otherwise fall back to @/lib/supabase
      const supabaseClient = supabase;

      // Check if there's already a record for this user before inserting
      // Without a user ID (anonymous usage), we'll use other identifying data
      const { data: existingEntries, error: searchError } = await supabaseClient
        .from('iat_results')
        .select('id')
        .eq('d_score', dataToSave.d_score)
        .eq('age', dataToSave.age)
        .eq('years_experience', dataToSave.years_experience)
        .eq('gender', dataToSave.gender)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (searchError) {
        console.error('Error checking for existing entries:', searchError);
      }
      
      // Only insert if no similar record exists
      if (!existingEntries || existingEntries.length === 0) {
        const { error } = await supabaseClient
          .from('iat_results')
          .insert(dataToSave);

        if (error) {
          console.error('Supabase error:', error);
          toast({
            title: "خطأ في حفظ النتائج",
            description: "حدث خطأ أثناء حفظ النتائج: " + error.message,
            variant: "destructive",
          });
        } else {
          console.log("Results saved successfully");
          toast({
            title: "تم حفظ النتائج بنجاح",
            description: "تم تسجيل إجاباتك في قاعدة البيانات",
          });
        }
      } else {
        console.log("Skipping insert - similar record already exists:", existingEntries[0]);
        toast({
          title: "تم حفظ النتائج بنجاح",
          description: "تم تسجيل إجاباتك في قاعدة البيانات",
        });
      }
      return finalDScore;
    }
  } catch (error) {
    console.error('Error saving results:', error);
    toast({
      title: "خطأ في حفظ النتائج",
      description: "حدث خطأ أثناء حفظ النتائج، ولكن يمكنك المتابعة مع الدراسة",
      variant: "destructive",
    });
    return dScore || 0;
  }
};
