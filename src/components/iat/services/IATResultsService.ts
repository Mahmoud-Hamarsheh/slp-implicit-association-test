
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
    console.log("=== SAVING COMPLETE STUDY RESULTS ===");
    console.log("D-Score:", dScore);
    console.log("Responses:", responses);
    console.log("Survey data:", JSON.stringify(surveyData, null, 2));
    
    // Ensure valid D-score (never null)
    const finalDScore = dScore || 0;
    
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

    // Extract only the question responses from biasAwarenessResponses
    const biasAwarenessResponses = surveyData.biasAwarenessResponses || {};
    
    // Create an object that will contain ONLY the question/answer pairs
    const questionResponsesOnly = {};
    
    // Extract all question answers (q1, q2, etc.)
    Object.keys(biasAwarenessResponses).forEach(key => {
      if (key.startsWith('q') && !isNaN(parseInt(key.substring(1)))) {
        questionResponsesOnly[key] = biasAwarenessResponses[key];
      }
    });
    
    console.log("Question responses only:", JSON.stringify(questionResponsesOnly, null, 2));
    
    // Extract bias score directly from the biasAwarenessResponses
    let biasScore = null;
    
    // Check if biasScore exists in biasAwarenessResponses
    if (biasAwarenessResponses.biasScore !== undefined) {
      if (typeof biasAwarenessResponses.biasScore === 'number') {
        biasScore = biasAwarenessResponses.biasScore;
      } else if (typeof biasAwarenessResponses.biasScore === 'string') {
        biasScore = parseFloat(biasAwarenessResponses.biasScore);
      }
    }
    
    // Check if we have a valid score, if not, calculate it
    if (biasScore === null || isNaN(biasScore)) {
      console.log("No valid bias score found, calculating from responses");
      
      // Use the same calculation logic as in scoreUtils.ts
      const responseValues = {
        'أوافق بشدة': 5,
        'أوافق': 4,
        'محايد': 3,
        'لا أوافق': 2,
        'لا أوافق بشدة': 1,
      };
      
      const reverseItems = ['q5', 'q8'];
      let totalScore = 0;
      let answeredQuestions = 0;
      
      for (let i = 1; i <= 12; i++) {
        const questionId = `q${i}`;
        const response = biasAwarenessResponses[questionId];
        
        if (response) {
          answeredQuestions++;
          let score = responseValues[response] || 0;
          
          if (reverseItems.includes(questionId)) {
            score = 6 - score;
          }
          
          totalScore += score;
        }
      }
      
      // Calculate average score
      if (answeredQuestions > 0) {
        biasScore = Number((totalScore / answeredQuestions).toFixed(2));
      } else {
        biasScore = 3.0; // Default fallback if no questions answered
      }
      
      console.log("Calculated bias score:", biasScore);
    }
    
    console.log("Final extracted bias score:", biasScore);
    
    // Format the survey responses for database storage
    let formattedSurveyResponses = null;
    if (Object.keys(questionResponsesOnly).length > 0) {
      formattedSurveyResponses = JSON.stringify(questionResponsesOnly);
    }
    
    console.log("Survey responses to save:", formattedSurveyResponses);
    console.log("Bias score to save:", biasScore);

    // Extract response times as an array for the database
    const responseTimes = responses.map(r => r.responseTime);
    console.log("Response times to save:", responseTimes);

    // Prepare data for saving
    const dataToSave = {
      d_score: finalDScore,
      age: Number(surveyData.age) || 1,
      years_experience: Number(surveyData.yearsExperience) || 0,
      degree: degreeValue,
      gender: formattedGender,
      response_times: responseTimes, // Save the response times array
      responses: JSON.stringify(responses), // Save all detailed responses
      survey_responses: formattedSurveyResponses,
      survey_score: biasScore
    };

    console.log("=== FINAL DATA TO SAVE ===");
    console.log(JSON.stringify(dataToSave, null, 2));

    if (surveyData.hasTakenIATBefore) {
      console.log("User has taken IAT before, not saving to database");
      toast({
        title: "اكتمل الاختبار",
        description: "بما أنك قمت بالاختبار مسبقًا، لن يتم حفظ نتائجك في قاعدة البيانات.",
      });
      return finalDScore;
    } else {
      // Insert the data
      const { data, error } = await supabase
        .from('iat_results')
        .insert([dataToSave]) // Using array notation to ensure proper insert format
        .select('id');

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "خطأ في حفظ النتائج",
          description: "حدث خطأ أثناء حفظ النتائج: " + error.message,
          variant: "destructive",
        });
      } else {
        console.log("Results saved successfully with ID:", data[0]?.id);
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
