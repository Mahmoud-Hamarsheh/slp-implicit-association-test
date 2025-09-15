import { supabase } from "@/lib/supabase";
import { Response } from "../IATTypes";
import { IATProps } from "../IATTypes";

type ToastFunction = (props: { 
  title: string; 
  description: string; 
  variant?: "default" | "destructive" 
}) => void;

// Keep track of processed submissions to avoid duplicates
let processedSubmissions = new Set();

export const saveIATResults = async (
  dScore: number,
  responses: Response[],
  surveyData: IATProps["surveyData"],
  toast: ToastFunction
) => {
  try {
    console.log("=== SAVING COMPLETE STUDY RESULTS ===");
    console.log("D-Score:", dScore);
    console.log("Survey data:", JSON.stringify(surveyData, null, 2));
    console.log("Responses count:", responses.length);
    
    // Test Supabase connection first
    console.log("=== TESTING SUPABASE CONNECTION ===");
    try {
      const { data: testData, error: testError } = await supabase
        .from('app_settings')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error("Supabase connection test failed:", testError);
        throw new Error("Database connection failed: " + testError.message);
      }
      console.log("✅ Supabase connection successful");
    } catch (connError) {
      console.error("❌ Supabase connection error:", connError);
      toast({
        title: "خطأ في الاتصال",
        description: "فشل الاتصال بقاعدة البيانات: " + connError.message,
        variant: "destructive",
      });
      return dScore;
    }
    
    // Only save data for non-specialists
    if (surveyData.isSpecialist) {
      console.log("❌ User is a specialist, skipping database save (specialists data not saved)");
      toast({
        title: "تم تخطي الحفظ",
        description: "لن يتم حفظ بيانات المتخصصين في قاعدة البيانات",
      });
      return dScore;
    }
    
    console.log("✅ User is NOT a specialist, proceeding with data save");
    
    // Create a unique submission identifier based on responses and user data
    // This helps prevent duplicate submissions within the same session
    const submissionKey = `${dScore}-${surveyData.age}-${surveyData.gender}-${surveyData.yearsExperience}-${surveyData.degree}-${responses.length}`;
    
    // Check if this submission was already processed in current session
    if (processedSubmissions.has(submissionKey)) {
      console.log("❌ Duplicate submission detected in current session, skipping database save");
      toast({
        title: "تنبيه",
        description: "تم معالجة هذه البيانات مسبقًا في هذه الجلسة، لن يتم حفظها مرة أخرى.",
        variant: "destructive",
      });
      return dScore;
    }
    
    // Check database for existing submissions with same characteristics to prevent duplicates
    try {
      const { data: existingResults, error: checkError } = await supabase
        .from('iat_results')
        .select('id')
        .eq('d_score', dScore)
        .eq('age', surveyData.age || 0)
        .eq('years_experience', surveyData.yearsExperience || 0)
        .eq('degree', surveyData.degree)
        .eq('gender', typeof surveyData.gender === 'number' ? surveyData.gender : (surveyData.gender === 'female' ? 2 : 1))
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .limit(1);
      
      if (!checkError && existingResults && existingResults.length > 0) {
        console.log("❌ Similar submission found in database within last hour, likely duplicate");
        toast({
          title: "تنبيه",
          description: "يبدو أنك قد أكملت الاختبار مؤخراً. لمنع التكرار، لن يتم حفظ هذه البيانات.",
          variant: "destructive",
        });
        return dScore;
      }
    } catch (dbCheckError) {
      console.warn("Could not check for duplicates in database:", dbCheckError);
      // Continue with save if duplicate check fails
    }
    
    // Add this submission to processed set for session-based duplicate prevention
    processedSubmissions.add(submissionKey);
    
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
      if (degreeValue === "طالب بكالوريوس سمع ونطق") degreeValue = "1";
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
    
    // Capture the test model used (A or B)
    const testModel = surveyData.testModel || "A";
    console.log("Test model used:", testModel);
    
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
      
      // Items that need reverse scoring - none of the new questions need reverse scoring
      // as they all measure positive attitudes toward people with communication disorders
      const reverseItems: string[] = [];
      
      let totalScore = 0;
      let answeredQuestions = 0;
      
      for (let i = 1; i <= 14; i++) {
        const questionId = `q${i}`;
        const response = biasAwarenessResponses[questionId];
        
        if (response) {
          answeredQuestions++;
          let score = responseValues[response] || 0;
          
          // Apply reverse scoring for negative items
          if (reverseItems.includes(questionId)) {
            score = 6 - score; // Reverse the score: 6 - original score
          }
          
          totalScore += score;
        }
      }
      
      // Calculate average score
      if (answeredQuestions > 0) {
        biasScore = Number((totalScore / answeredQuestions).toFixed(2));
      } else {
        biasScore = 0; // Default fallback if no questions answered
      }
      
      console.log("Calculated bias score:", biasScore);
    }
    
    console.log("Final extracted bias score:", biasScore);
    
    // Format the survey responses for database storage
    let formattedSurveyResponses: any = null;
    if (Object.keys(questionResponsesOnly).length > 0) {
      formattedSurveyResponses = questionResponsesOnly; // store as JSON object, not string
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
      response_times: responseTimes,
      responses: responses as any, // store as JSON object
      survey_responses: formattedSurveyResponses as any,
      survey_score: biasScore,
      test_model: testModel
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
      console.log("=== ATTEMPTING DATABASE INSERT ===");
      console.log("Insert data validation:");
      console.log("- D-Score:", dataToSave.d_score, typeof dataToSave.d_score);
      console.log("- Age:", dataToSave.age, typeof dataToSave.age);
      console.log("- Experience:", dataToSave.years_experience, typeof dataToSave.years_experience);
      console.log("- Degree:", dataToSave.degree, typeof dataToSave.degree);
      console.log("- Gender:", dataToSave.gender, typeof dataToSave.gender);
      console.log("- Response times count:", dataToSave.response_times.length);
      console.log("- Test model:", dataToSave.test_model);
      
      // Insert the data
      const { error } = await supabase
        .from('iat_results')
        .insert([dataToSave], { returning: 'minimal' });

      if (error) {
        console.error('❌ Supabase INSERT error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        // Check if it's an RLS policy error
        if (error.code === '42501' || error.message.includes('row-level security')) {
          console.error('🔒 RLS Policy violation detected');
          
          // Test if we can read from the table
          const { data: readTest, error: readError } = await supabase
            .from('iat_results')
            .select('count')
            .limit(1);
          
          if (readError) {
            console.error('❌ Cannot read from iat_results table:', readError);
          } else {
            console.log('✅ Can read from iat_results table');
          }
        }
        
        toast({
          title: "خطأ في حفظ النتائج",
          description: `حدث خطأ أثناء حفظ النتائج: ${error.message} (كود: ${error.code})`,
          variant: "destructive",
        });
      } else {
        console.log("✅ Results saved successfully (returning minimal)");
        toast({
          title: "تم حفظ النتائج بنجاح",
          description: "تم تسجيل إجاباتك في قاعدة البيانات بنجاح",
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
