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

    // Process the bias awareness data
    console.log("Raw survey data structure:", JSON.stringify(surveyData, null, 2));
    
    const biasAwarenessResponses = surveyData.biasAwarenessResponses || {};
    console.log("Extracted biasAwarenessResponses:", JSON.stringify(biasAwarenessResponses, null, 2));
    
    // Get just the question responses (q1, q2, etc.)
    const questionResponses = {};
    Object.keys(biasAwarenessResponses).forEach(key => {
      // Only include actual question responses (not metadata like biasScore or biasLevel)
      if (key.startsWith('q') && !isNaN(parseInt(key.substring(1)))) {
        questionResponses[key] = biasAwarenessResponses[key];
      }
    });
    
    // Extract bias score directly
    let biasScore = null;
    if (biasAwarenessResponses && typeof biasAwarenessResponses.biasScore === 'string') {
      biasScore = parseFloat(biasAwarenessResponses.biasScore);
      // Ensure it's a valid number
      if (isNaN(biasScore)) biasScore = null;
    }
    
    console.log("Extracted question responses:", JSON.stringify(questionResponses, null, 2));
    console.log("Extracted bias score:", biasScore);
    
    // Only stringify if we have actual responses
    let formattedSurveyResponses = null;
    if (Object.keys(questionResponses).length > 0) {
      formattedSurveyResponses = JSON.stringify(questionResponses);
    }

    // Prepare data for saving
    const dataToSave = {
      d_score: finalDScore,
      age: Number(surveyData.age) || 1,
      years_experience: Number(surveyData.yearsExperience) || 0,
      degree: degreeValue,
      gender: formattedGender,
      response_times: correctResponseTimes,
      responses: JSON.stringify(responses),
      survey_responses: formattedSurveyResponses,
      survey_score: biasScore
    };

    console.log("Final data being saved to database:", JSON.stringify(dataToSave, null, 2));

    if (surveyData.hasTakenIATBefore) {
      console.log("User has taken IAT before, not saving to database");
      toast({
        title: "اكتمل الاختبار",
        description: "بما أنك قمت بالاختبار مسبقًا، لن يتم حفظ نتائجك في قاعدة البيانات.",
      });
      return finalDScore;
    } else {
      // Check if there's already a record before inserting to prevent duplicates
      // We'll compare key values to determine if this is likely a duplicate submission
      const { data: existingEntries, error: searchError } = await supabase
        .from('iat_results')
        .select('id')
        .eq('d_score', dataToSave.d_score)
        .eq('age', dataToSave.age)
        .eq('gender', dataToSave.gender)
        .limit(1);
        
      if (searchError) {
        console.error('Error checking for existing entries:', searchError);
      }
      
      // Only insert if no similar record exists
      if (!existingEntries || existingEntries.length === 0) {
        const { error } = await supabase
          .from('iat_results')
          .insert([dataToSave]); // Use array to ensure proper insert format

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
        console.log("Skipping insert - similar record already exists");
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
