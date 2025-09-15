import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const DebugSupabase: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addLog("🧪 Starting Supabase connection tests...");

    try {
      // Test 1: Basic connection
      addLog("Test 1: Basic connection to app_settings");
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .limit(1);

      if (settingsError) {
        addLog(`❌ Settings test failed: ${settingsError.message}`);
      } else {
        addLog(`✅ Settings test passed. Found ${settings?.length || 0} records`);
      }

      // Test 2: Check iat_results table structure
      addLog("Test 2: Checking iat_results table access");
      const { data: countData, error: countError } = await supabase
        .from('iat_results')
        .select('id', { count: 'exact', head: true });

      if (countError) {
        addLog(`❌ Count test failed: ${countError.message}`);
      } else {
        addLog(`✅ Count test passed. Table accessible.`);
      }

      // Test 3: Try a simple insert with minimal data
      addLog("Test 3: Attempting minimal insert test");
      const testData = {
        d_score: 0.5,
        age: 25,
        years_experience: 2,
        degree: "2",
        gender: 1,
        response_times: [1.0, 0.8, 0.9],
        responses: [{ block: 1, responseTime: 1.0, correct: true }],
        test_model: "A"
      };

      const { error: insertError } = await supabase
        .from('iat_results')
        .insert([testData], { returning: 'minimal' });

      if (insertError) {
        addLog(`❌ Insert test failed: ${insertError.message} (Code: ${insertError.code})`);
        if (insertError.details) {
          addLog(`Details: ${insertError.details}`);
        }
        if (insertError.hint) {
          addLog(`Hint: ${insertError.hint}`);
        }
      } else {
        addLog(`✅ Insert test passed! (returning minimal)`);
      }

      // Test 4: Check auth status
      addLog("Test 4: Checking auth status");
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        addLog(`❌ Auth error: ${authError.message}`);
      } else {
        addLog(`✅ Auth status: ${user ? 'Authenticated' : 'Anonymous'}`);
      }

    } catch (error) {
      addLog(`💥 Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
      addLog("🏁 Test completed");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Connection Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Run Connection Tests'}
          </Button>
          <Button onClick={clearLogs} variant="outline">
            Clear Logs
          </Button>
        </div>
        
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="text-gray-500">Click "Run Connection Tests" to start debugging...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p><strong>How to use:</strong> Run the tests to diagnose Supabase connection issues.</p>
          <p><strong>Note:</strong> This component is for debugging only and should be removed in production.</p>
        </div>
      </CardContent>
    </Card>
  );
};