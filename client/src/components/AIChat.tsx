import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Target, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

type GoalCategory = 'SAVINGS' | 'TRAVEL' | 'TRANSPORTATION' | 'HOME' | 'EDUCATION' | 'OTHER';

interface GoalFormData {
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
  category: GoalCategory;
  description: string;
}

interface FormField {
  name: keyof GoalFormData;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: { value: string; label: string }[];
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIChatProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
}

type ChatMode = 'chat' | 'goal_form' | 'confirm_goal';

interface FormStep {
  field: keyof GoalFormData;
  question: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}

export default function AIChat({ showChat, setShowChat }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your finance assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('chat');
  const [goalForm, setGoalForm] = useState<GoalFormData>({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: 'SAVINGS',
    description: '',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const goalFormSteps: FormStep[] = [
    {
      field: 'name',
      question: 'What would you like to name your goal?',
      type: 'text',
    },
    {
      field: 'targetAmount',
      question: 'What is your target amount?',
      type: 'number',
    },
    {
      field: 'currentAmount',
      question: 'How much have you saved so far? (Enter 0 if starting fresh)',
      type: 'number',
    },
    {
      field: 'deadline',
      question: 'When would you like to achieve this goal? (YYYY-MM-DD)',
      type: 'date',
    },
    {
      field: 'category',
      question: 'What category does this goal belong to?',
      type: 'select',
      options: [
        { value: 'SAVINGS', label: '💰 Savings' },
        { value: 'TRAVEL', label: '✈️ Travel' },
        { value: 'TRANSPORTATION', label: '🚗 Transportation' },
        { value: 'HOME', label: '🏠 Home' },
        { value: 'EDUCATION', label: '🎓 Education' },
        { value: 'OTHER', label: '📌 Other' },
      ],
    },
    {
      field: 'description',
      question: 'Add a short description (optional)',
      type: 'textarea',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (chatMode === 'goal_form') {
      if (currentStep < goalFormSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit the goal
        setChatMode('confirm_goal');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Great! Here's your goal:\n\n` +
              `🏷️ **Name:** ${goalForm.name}\n` +
              `🎯 **Target:** $${parseFloat(goalForm.targetAmount).toFixed(2)}\n` +
              `💰 **Saved:** $${parseFloat(goalForm.currentAmount).toFixed(2)}\n` +
              `📅 **Deadline:** ${new Date(goalForm.deadline).toLocaleDateString()}\n` +
              `📂 **Category:** ${goalForm.category.charAt(0) + goalForm.category.slice(1).toLowerCase()}\n` +
              (goalForm.description ? `📝 **Notes:** ${goalForm.description}\n\n` : '\n') +
              'Would you like to create this goal?',
          },
        ]);
      }
      return;
    }

    if (chatMode === 'confirm_goal') {
      if (input.toLowerCase().startsWith('y') || input.toLowerCase().includes('yes')) {
        try {
          await handleCreateGoal();
        } catch (error) {
          console.error('Error creating goal:', error);
          toast.error('Failed to create goal');
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Okay, I won\'t create the goal. Would you like to start over?' },
        ]);
      }
      setInput('');
      return;
    }

    // Regular chat mode
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending request to AI endpoint...');
      const response = await api.post('/ai/chat', {
        messages: updatedMessages.map(({ role, content }) => ({ role, content })),
      });

      console.log('AI Response:', response.data);

      if (response.data.success) {
        const assistantMessage = { role: 'assistant' as const, content: response.data.message };
        setMessages((prev) => [...prev, assistantMessage]);

        // Check if AI suggests creating a goal
        if (
          response.data.message.toLowerCase().includes('create a goal') ||
          response.data.message.toLowerCase().includes('set a goal')
        ) {
          startGoalCreation();
        }
      } else {
        throw new Error(response.data.message || 'Failed to process AI response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  const startGoalCreation = () => {
    setChatMode('goal_form');
    setCurrentStep(0);
    setGoalForm({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
      category: 'SAVINGS',
      description: '',
    });
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'I can help you create a new financial goal. Let\'s get started!\n\n' +
          'What would you like to name your goal?',
      },
    ]);
  };

  const handleCreateGoal = async () => {
    try {
      const response = await api.post('/api/goals', {
        name: goalForm.name,
        targetAmount: parseFloat(goalForm.targetAmount),
        currentAmount: parseFloat(goalForm.currentAmount) || 0,
        deadline: goalForm.deadline,
        description: goalForm.description,
        category: goalForm.category,
      });

      toast.success('Goal created successfully!');
      setChatMode('chat');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ Goal "${goalForm.name}" has been created successfully! ` +
            `You've set a target of $${parseFloat(goalForm.targetAmount).toFixed(2)} ` +
            `by ${new Date(goalForm.deadline).toLocaleDateString()}. ` +
            'How else can I assist you?',
        },
      ]);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error while creating your goal. Would you like to try again?',
        },
      ]);
    }
  };

  const handleGoalFormChange = (field: keyof GoalFormData, value: string) => {
    setGoalForm((prev) => ({ ...prev, [field]: value }));

    // Auto-submit for form steps
    if (chatMode === 'goal_form' && currentStep < goalFormSteps.length - 1) {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < goalFormSteps.length) {
          // Auto-ask the next question
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: goalFormSteps[nextStep].question },
          ]);
        }
        return nextStep;
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="p-3 sm:p-4 bg-indigo-600 text-white flex justify-between items-center">
        <h2 className="text-base sm:text-lg font-semibold">Finance Assistant</h2>
        <button
          onClick={() => setShowChat(false)}
          className="text-white hover:text-gray-200 focus:outline-none p-1"
          aria-label="Close chat"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-2 sm:p-4 overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[90%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex-shrink-0 mr-2">
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                ) : (
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-2 sm:p-3 max-w-[90%] sm:max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-indigo-600" />
                <span className="text-sm sm:text-base">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-2 sm:p-3 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex space-x-2 w-full">
            {chatMode === 'goal_form' && currentStep < goalFormSteps.length ? (
              <div className="w-full">
                <p className="text-sm text-gray-700 mb-2">{goalFormSteps[currentStep].question}</p>
                {goalFormSteps[currentStep].type === 'select' ? (
                  <select
                    value={goalForm[goalFormSteps[currentStep].field]}
                    onChange={(e) => handleGoalFormChange(goalFormSteps[currentStep].field, e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    autoFocus
                  >
                    {goalFormSteps[currentStep].options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : goalFormSteps[currentStep].type === 'textarea' ? (
                  <textarea
                    value={goalForm[goalFormSteps[currentStep].field]}
                    onChange={(e) => handleGoalFormChange(goalFormSteps[currentStep].field, e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    autoFocus
                  />
                ) : (
                  <input
                    type={goalFormSteps[currentStep].type}
                    value={goalForm[goalFormSteps[currentStep].field]}
                    onChange={(e) => handleGoalFormChange(goalFormSteps[currentStep].field, e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={`Enter ${goalFormSteps[currentStep].field}`}
                    autoFocus
                    min={goalFormSteps[currentStep].field.includes('Amount') ? '0' : undefined}
                    step={goalFormSteps[currentStep].field.includes('Amount') ? '0.01' : undefined}
                  />
                )}
              </div>
            ) : (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  chatMode === 'confirm_goal'
                    ? 'Type yes to confirm or no to cancel...'
                    : 'Ask me anything about your finances...'
                }
                className="text-black flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
                aria-label="Type your message"
                autoFocus
              />
            )}
            {chatMode === 'goal_form' ? (
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    aria-label="Previous step"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    (currentStep < goalFormSteps.length - 1 &&
                      !goalForm[goalFormSteps[currentStep].field as keyof GoalFormData])
                  }
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  aria-label={
                    currentStep < goalFormSteps.length - 1 ? 'Next step' : 'Submit goal'
                  }
                >
                  {currentStep < goalFormSteps.length - 1 ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading || (chatMode === 'confirm_goal' && !input.trim())}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
