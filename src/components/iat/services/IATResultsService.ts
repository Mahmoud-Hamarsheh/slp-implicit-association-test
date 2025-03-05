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
    // Only keep response times for correct responses
    const correctResponseTimes = responses
      .filter(r => r.correct)
      .map(r => Number(r.responseTime.toFixed(3)));
    
    // Check if more than 10% of trials are below threshold
    const tooFastResponsesPercentage = responses.filter(r => r.responseTime < 0.3).length / responses.length;
    const validData = tooFastResponsesPercentage <= 0.1;

    // Ensure all demographic data is formatted as integers
    let formattedGender = 1; // Default to male (1)
    if (typeof surveyData.gender === 'number') {
      formattedGender = surveyData.gender;
    } else if (typeof surveyData.gender === 'string') {
      formattedGender = surveyData.gender === 'female' ? 2 : 1;
    }

    // Ensure all data is properly formatted with appropriate defaults
    const formattedData = {
      d_score: dScore || 0, // Ensure we never save null or undefined
      // Format all demographic data as integers
      age: Number(surveyData.age) || 1, // Default to 1 if missing
      years_experience: Number(surveyData.yearsExperience) || 1, // Default to 1 if missing
      degree: typeof surveyData.degree === 'string' ? surveyData.degree : "1", // Default to "1" if missing
      gender: formattedGender, // Should be 1 or 2
      survey_responses: surveyData.biasAwarenessResponses || {},
      survey_score: surveyData.biasAwarenessResponses?.biasScore 
        ? parseFloat(surveyData.biasAwarenessResponses.biasScore)
        : null,
      response_times: correctResponseTimes,
      responses: responses,
      valid_data: validData
    };

    // Log what we're going to save
    console.log("Saving IAT results with data:", formattedData);

    if (surveyData.hasTakenIATBefore) {
      console.log("User has taken IAT before, not saving to database");
      toast({
        title: "اكتمل الاختبار",
        description: "بما أنك قمت بالاختبار مسبقًا، لن يتم حفظ نتائجك في قاعدة البيانات.",
      });
      return dScore;
    } else {
      // Modified version that saves only the columns that exist in the database
      const dataToSave = {
        d_score: formattedData.d_score,
        age: formattedData.age,
        years_experience: formattedData.years_experience,
        degree: formattedData.degree,
        gender: formattedData.gender, // Now including the gender field
        response_times: formattedData.response_times,
        responses: formattedData.responses,
        survey_responses: formattedData.survey_responses,
        survey_score: formattedData.survey_score
      };

      console.log("Final data being sent to Supabase:", dataToSave);

      const { error } = await supabase
        .from('iat_results')
        .insert([dataToSave]);

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
      return dScore;
    }
  } catch (error) {
    console.error('Error saving results:', error);
    toast({
      title: "خطأ في حفظ النتائج",
      description: "حدث خطأ أثناء حفظ النتائج، ولكن يمكنك المتابعة مع الدراسة",
      variant: "destructive",
    });
    return dScore;
  }
};
