import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download,
  RotateCcw,
  FileText
} from "lucide-react";

interface TestCase {
  id: string;
  title: string;
  objective: string;
  preconditions: string;
  steps: string[];
  expectedResults: string[];
  status: 'pass' | 'fail' | 'untested';
}

const TestScript = () => {
  const [testCases, setTestCases] = useState<Record<string, TestCase>>({
    'auth-001': {
      id: 'auth-001',
      title: 'New User Sign Up',
      objective: 'Verify that a new user can successfully create an account',
      preconditions: 'User does not have an existing account',
      steps: [
        'Navigate to https://neurooz.com',
        'Complete the character splash intro (if shown)',
        'Complete the story slides about Oz/ADHD',
        'Click "Continue" to proceed to authentication',
        'Toggle to "Sign Up" mode',
        'Enter a valid email address',
        'Enter a password (minimum 6 characters)',
        'Enter your full name',
        'Click "Sign Up" button'
      ],
      expectedResults: [
        'Success toast message appears: "Account created! You\'re all set."',
        'User is redirected to the home dashboard',
        'Logo appears in the header with user email',
        'No error messages are displayed'
      ],
      status: 'untested'
    },
    'auth-002': {
      id: 'auth-002',
      title: 'Existing User Sign In',
      objective: 'Verify that an existing user can successfully log in',
      preconditions: 'User has a valid account',
      steps: [
        'Navigate to https://neurooz.com',
        'Skip intro if already seen',
        'Click "Already have an account? Sign in"',
        'Enter registered email address',
        'Enter correct password',
        'Click "Sign In" button'
      ],
      expectedResults: [
        'Success toast message appears: "Welcome back!"',
        'User is redirected to the home dashboard',
        'User\'s email appears in the header',
        'Previous data/tasks are visible (if any)'
      ],
      status: 'untested'
    },
    'task-001': {
      id: 'task-001',
      title: 'Create Task on Short List',
      objective: 'Verify user can create a task on the Short List',
      preconditions: 'User is logged in and on the Short List page',
      steps: [
        'Navigate to /tasks/today or click "Short List" card',
        'Click "Add Task" button',
        'Enter task title: "Test Task 1"',
        'Enter task description: "This is a test task"',
        'Select priority: "High"',
        'Select category: "Work"',
        'Click "Create Task" button'
      ],
      expectedResults: [
        'Task creation dialog opens',
        'All fields are editable',
        'Task is created successfully',
        'Success toast appears',
        'New task appears in the Short List',
        'Task count updates in the header'
      ],
      status: 'untested'
    },
    'task-002': {
      id: 'task-002',
      title: 'Short List 5-Item Limit',
      objective: 'Verify Short List enforces the 5-item maximum (ADHD-specific design)',
      preconditions: 'User is logged in',
      steps: [
        'Navigate to Short List (/tasks/today)',
        'Create 5 tasks using the "Add Task" button',
        'Attempt to create a 6th task'
      ],
      expectedResults: [
        'First 5 tasks are created successfully',
        'After 5 tasks, "Add Task" button is disabled or shows warning',
        'Warning message appears: "Short List is full! (5/5 max)"',
        'User is prompted to move tasks to Long List or complete existing tasks'
      ],
      status: 'untested'
    },
    'brain-001': {
      id: 'brain-001',
      title: 'Access Brain Dump (Tornado Alley)',
      objective: 'Verify user can access the Brain Dump feature',
      preconditions: 'User is logged in',
      steps: [
        'Click the floating tornado button (🌪️) in the bottom right',
        'Alternatively, navigate to /tornado-alley',
        'Alternatively, click "New Dump" from dashboard Brain Dump card'
      ],
      expectedResults: [
        'Brain Dump interface loads successfully',
        'Chat-style interface is displayed',
        'Welcome message appears: "Hey there! So glad you\'re here..."',
        'Input field is ready for user input',
        'Voice input button is visible',
        'Upload button is visible'
      ],
      status: 'untested'
    },
    'gamify-001': {
      id: 'gamify-001',
      title: 'Earn Points by Completing Tasks',
      objective: 'Verify points are awarded when tasks are completed',
      preconditions: 'User has incomplete tasks',
      steps: [
        'Note current point total',
        'Complete a task',
        'Observe point increase',
        'Check if level increased'
      ],
      expectedResults: [
        'Points are awarded immediately',
        'Toast notification shows points earned',
        'Points total updates in stats',
        'Level progression is calculated correctly (square root formula)',
        'Oz-themed congratulatory message appears'
      ],
      status: 'untested'
    },
    'nav-001': {
      id: 'nav-001',
      title: 'Header Logo Display',
      objective: 'Verify the Neurooz logo displays correctly in the header',
      preconditions: 'User is logged in',
      steps: [
        'Observe the header on any authenticated page',
        'Check for logo in the top left corner',
        'Verify logo quality and alignment'
      ],
      expectedResults: [
        'Neurooz logo (Emerald City) is visible',
        'Logo is circular with white border and shadow',
        'Logo is 48x48 pixels',
        'Logo is positioned next to user email',
        'Logo is clear and not pixelated'
      ],
      status: 'untested'
    },
    'nav-002': {
      id: 'nav-002',
      title: 'Responsive Design - Mobile',
      objective: 'Verify app works correctly on mobile devices',
      preconditions: 'Access app from mobile device or use browser dev tools',
      steps: [
        'Resize browser to mobile viewport (375x667)',
        'Navigate through key pages',
        'Test touch interactions',
        'Verify layout adapts'
      ],
      expectedResults: [
        'Layout is responsive and adapts to mobile',
        'Text is readable without zooming',
        'Buttons are touch-friendly (minimum 44x44px)',
        'Navigation is accessible',
        'No horizontal scrolling',
        'Images scale appropriately'
      ],
      status: 'untested'
    }
  });

  const updateTestStatus = (id: string, status: 'pass' | 'fail' | 'untested') => {
    setTestCases(prev => ({
      ...prev,
      [id]: { ...prev[id], status }
    }));
  };

  const resetAllTests = () => {
    const reset = Object.keys(testCases).reduce((acc, key) => ({
      ...acc,
      [key]: { ...testCases[key], status: 'untested' }
    }), {});
    setTestCases(reset);
  };

  const getStats = () => {
    const total = Object.keys(testCases).length;
    const passed = Object.values(testCases).filter(tc => tc.status === 'pass').length;
    const failed = Object.values(testCases).filter(tc => tc.status === 'fail').length;
    const untested = Object.values(testCases).filter(tc => tc.status === 'untested').length;
    return { total, passed, failed, untested };
  };

  const stats = getStats();

  const categories = {
    'Authentication': ['auth-001', 'auth-002'],
    'Task Management': ['task-001', 'task-002'],
    'Brain Dump': ['brain-001'],
    'Gamification': ['gamify-001'],
    'Navigation & UI': ['nav-001', 'nav-002']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                Neurooz Manual Test Script
              </h1>
              <p className="text-slate-300">
                Interactive testing checklist for QA and validation
              </p>
            </div>
            <Button
              onClick={resetAllTests}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400">Total Tests</div>
              </CardContent>
            </Card>
            <Card className="bg-green-900/30 border-green-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-400">{stats.passed}</div>
                <div className="text-sm text-slate-400">Passed</div>
              </CardContent>
            </Card>
            <Card className="bg-red-900/30 border-red-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
                <div className="text-sm text-slate-400">Failed</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-slate-400">{stats.untested}</div>
                <div className="text-sm text-slate-400">Untested</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Test Cases by Category */}
        <Tabs defaultValue="Authentication" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            {Object.keys(categories).map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categories).map(([category, testIds]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {testIds.map(id => {
                const test = testCases[id];
                return (
                  <Card key={id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-slate-300">
                              {test.id.toUpperCase()}
                            </Badge>
                            {test.status === 'pass' && (
                              <Badge className="bg-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Passed
                              </Badge>
                            )}
                            {test.status === 'fail' && (
                              <Badge className="bg-red-600">
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-white">{test.title}</CardTitle>
                          <CardDescription className="text-slate-400 mt-2">
                            <strong>Objective:</strong> {test.objective}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">
                          Preconditions:
                        </h4>
                        <p className="text-slate-400 text-sm">{test.preconditions}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">
                          Steps:
                        </h4>
                        <ol className="list-decimal list-inside space-y-1">
                          {test.steps.map((step, idx) => (
                            <li key={idx} className="text-slate-400 text-sm">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">
                          Expected Results:
                        </h4>
                        <ul className="space-y-1">
                          {test.expectedResults.map((result, idx) => (
                            <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-700">
                        <Button
                          onClick={() => updateTestStatus(id, 'pass')}
                          className={`flex-1 ${
                            test.status === 'pass'
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-slate-700 hover:bg-green-600'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Pass
                        </Button>
                        <Button
                          onClick={() => updateTestStatus(id, 'fail')}
                          className={`flex-1 ${
                            test.status === 'fail'
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-slate-700 hover:bg-red-600'
                          }`}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Fail
                        </Button>
                        <Button
                          onClick={() => updateTestStatus(id, 'untested')}
                          variant="outline"
                          className="flex-1"
                        >
                          Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <Card className="mt-8 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-slate-300">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Testing Notes</p>
                <p className="text-sm text-slate-400 mt-1">
                  This is a simplified test script. For the complete version with all 33 test cases,
                  bug reporting templates, and detailed instructions, download the full PDF document.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestScript;
