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

    // Convert degree to numeric value
    let degreeValue = "1"; // Default to student (1)
    if (surveyData.degree === "طالب") degreeValue = "1";
    else if (surveyData.degree === "بكالوريوس") degreeValue = "2";
    else if (surveyData.degree === "ماجستير") degreeValue = "3";
    else if (surveyData.degree === "دكتوراه") degreeValue = "4";
    else degreeValue = surveyData.degree;

    // Prepare data for saving
    const formattedData = {
      d_score: finalDScore,
      age: Number(surveyData.age) || 1,
      years_experience: Number(surveyData.yearsExperience) || 0,
      degree: degreeValue,
      gender: formattedGender,
      survey_responses: surveyData.biasAwarenessResponses || {},
      survey_score: surveyData.biasAwarenessResponses?.biasScore 
        ? parseFloat(surveyData.biasAwarenessResponses.biasScore)
        : null,
      response_times: correctResponseTimes,
      responses: responses,
      valid_data: validData
    };

    console.log("Saving IAT results with data:", formattedData);

    if (surveyData.hasTakenIATBefore) {
      console.log("User has taken IAT before, not saving to database");
      toast({
        title: "اكتمل الاختبار",
        description: "بما أنك قمت بالاختبار مسبقًا، لن يتم حفظ نتائجك في قاعدة البيانات.",
      });
      return finalDScore;
    } else {
      // Create a single data object with only the columns that exist in the database
      const dataToSave = {
        d_score: formattedData.d_score,
        age: formattedData.age,
        years_experience: formattedData.years_experience,
        degree: formattedData.degree,
        gender: formattedData.gender,
        response_times: formattedData.response_times,
        responses: formattedData.responses,
        survey_responses: formattedData.survey_responses,
        survey_score: formattedData.survey_score
      };

      console.log("Final data being sent to Supabase:", dataToSave);

      // Fix duplication by ensuring we only make one insert request
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
