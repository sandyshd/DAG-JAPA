'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Logo from '@/app/components/Logo';
import {
  ArrowLeft, CheckCircle, AlertCircle, Clock, DollarSign, Users,
  Star, ChevronDown, ChevronUp, Send, Target, TrendingUp,
  BookOpen, MessageSquare,
  // icons for modules
  Briefcase, Cpu, Heart, Database, Lightbulb, Zap, Plane, Trophy, Leaf,
} from 'lucide-react';

interface Module {
  id: number;
  name: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  color: string;
  requirement: string;
  duration: string;
  successRate: string;
  avgIncome: string;
  benefits: string[];
  requirements: string[];
  process: Array<{
    step: number;
    title: string;
    desc: string;
    duration: string;
  }>;
  testimonials: Array<{
    name: string;
    location: string;
    rating: number;
    text: string;
  }>;
  faqs: Array<{
    q: string;
    a: string;
  }>;
}

interface ModuleListItem {
  id: number;
  name: string;
  icon: string;
}

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [module, setModule] = useState<Module | null>(null);
  const [allModules, setAllModules] = useState<ModuleListItem[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all modules on mount
    fetchAllModules();
  }, []);

  useEffect(() => {
    if (params?.id) {
      fetchModuleDetail();
      setSelectedModuleId(parseInt(params?.id as string, 10));
    }
  }, [params?.id]);

  const fetchAllModules = async () => {
    try {
      const response = await fetch('/api/modules');
      if (response.ok) {
        const result = await response.json();
        console.log('Modules response:', result);
        if (result.success && Array.isArray(result.data)) {
          const modulesList = result.data.map((m: Module) => ({
            id: m.id,
            name: m.name,
            icon: m.icon,
          }));
          setAllModules(modulesList);
          console.log('Modules loaded:', modulesList);
        } else {
          console.error('Invalid response format:', result);
        }
      } else {
        console.error('Failed to fetch modules:', response.status);
      }
    } catch (error) {
      console.error('Error fetching modules list:', error);
    }
  };

  const handleModuleSelect = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    router.push(`/modules/${moduleId}`);
  };

  const fetchModuleDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure moduleId is properly parsed
      const moduleId = parseInt(params?.id as string, 10);
      
      if (isNaN(moduleId)) {
        setError('Invalid module ID');
        setIsLoading(false);
        return;
      }

      console.log(`Fetching module with ID: ${moduleId}`);
      
      const response = await fetch(`/api/modules/${moduleId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch module (HTTP ${response.status})`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setModule(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error fetching module:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    const moduleId = parseInt(params?.id as string, 10);
    if (session) {
      router.push(`/application/apply?moduleId=${moduleId}`);
    } else {
      router.push('/auth/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading module details...</p>
        </div>
      </div>
    );
  }

  if (!module || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Module not found</h2>
          {error && <p className="text-sm text-gray-600 mb-4">Error: {error}</p>}
          <p className="text-gray-600 mb-4">The module you're looking for doesn't exist or couldn't be loaded.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            ← Return to Home
          </button>
        </div>
      </div>
    );
  }

  const getIconComponent = (iconName: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeMap: Record<string, string> = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-16 h-16',
    };

    const cls = sizeMap[size] || sizeMap.md;

    // Map icon names to lucide-react components
    const iconMap: Record<string, React.ReactNode> = {
      Briefcase: <Briefcase className={cls} />,
      Cpu: <Cpu className={cls} />,
      Heart: <Heart className={cls} />,
      Lightbulb: <Lightbulb className={cls} />,
      Database: <Database className={cls} />,
      Zap: <Zap className={cls} />,
      Plane: <Plane className={cls} />,
      Trophy: <Trophy className={cls} />,
      Leaf: <Leaf className={cls} />,
    };

    return iconMap[iconName] || <div className={cls} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <Logo variant="full" href="/" clickable={true} />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Sidebar - All Modules (Desktop Only) */}
          <div className="hidden md:block md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">All Modules</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {allModules.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading modules...</p>
                  </div>
                ) : (
                  allModules.map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => handleModuleSelect(mod.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedModuleId === mod.id
                          ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 ${selectedModuleId === mod.id ? 'opacity-100' : 'opacity-50'}`}>
                          {getIconComponent(mod.icon, 'sm')}
                        </div>
                        <span className="text-sm font-medium">{mod.name}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => router.push('/auth/register')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Module Selector */}
          <div className="bg-white border-b md:hidden mb-6">
            <div className="flex overflow-x-auto pb-2">
              <select 
                value={selectedModuleId || ''}
                onChange={(e) => handleModuleSelect(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a module</option>
                {allModules.map(mod => (
                  <option key={mod.id} value={mod.id}>{mod.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9">
            {/* Hero Section */}
            <div
              className={`bg-gradient-to-br ${module.color} rounded-2xl p-8 md:p-12 text-white mb-8`}
            >
              <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{getIconComponent(module.icon, 'lg')}</div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{module.name}</h1>
                    <p className="text-white text-opacity-90 text-lg">{module.shortDesc}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Clock className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Duration</div>
                  <div className="font-bold">{module.duration}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Star className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Success Rate</div>
                  <div className="font-bold">{module.successRate}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <DollarSign className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Avg Income</div>
                  <div className="font-bold">{module.avgIncome}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Users className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Requirement</div>
                  <div className="font-bold text-sm">{module.requirement.split(' ').slice(0, 2).join(' ')}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="flex overflow-x-auto">
                {['overview', 'benefits', 'requirements', 'process', 'testimonials', 'faq'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-semibold capitalize whitespace-nowrap transition ${
                      activeTab === tab
                        ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Overview</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{module.fullDesc}</p>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Requirement</p>
                        <p className="text-gray-700 text-sm">{module.requirement}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                      <Target className="w-8 h-8 text-green-600 mb-3" />
                      <h3 className="font-bold text-gray-900 mb-2">Success Focused</h3>
                      <p className="text-sm text-gray-600">Proven pathways with {module.successRate} success rate</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                      <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-bold text-gray-900 mb-2">Income Growth</h3>
                      <p className="text-sm text-gray-600">Average income of {module.avgIncome}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                      <BookOpen className="w-8 h-8 text-purple-600 mb-3" />
                      <h3 className="font-bold text-gray-900 mb-2">Full Support</h3>
                      <p className="text-sm text-gray-600">Comprehensive guidance throughout your journey</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h2>
                  <div className="space-y-4">
                    {module.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-gray-800 font-medium">{benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'requirements' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                  <div className="space-y-4">
                    {module.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{req}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                  {activeTab === 'process' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Process</h2>
                  <div className="space-y-6">
                    {module.process.map((step, idx) => (
                      <div key={idx} className="relative pl-12">
                        <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        {idx < module.process.length - 1 && (
                          <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-200"></div>
                        )}
                        <div className="pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                            <span className="text-sm text-gray-500">{step.duration}</span>
                          </div>
                          <p className="text-gray-600">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h2>
                  <div className="space-y-6">
                    {module.testimonials.map((testimonial, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                            <p className="text-sm text-gray-600">{testimonial.location}</p>
                          </div>
                          <div className="flex space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 italic">"{testimonial.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {module.faqs.map((faq, idx) => (
                      <div key={idx} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                        >
                          <h3 className="font-semibold text-gray-900 pr-4">{faq.q}</h3>
                          {expandedFaq === idx ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === idx && (
                          <div className="px-4 pb-4 pt-0">
                            <p className="text-gray-600">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Get Started?</h2>
                  <p className="text-white text-opacity-90">Apply now and begin your journey to financial freedom</p>
                </div>
                <button
                  onClick={handleApply}
                  className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:scale-105 flex items-center whitespace-nowrap"
                >
                  Apply to This Module
                  <Send className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <MessageSquare className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Have Questions?</h3>
                  <p className="text-gray-600 mb-4">Our team is here to help you understand which module is right for you.</p>
                  <button className="text-green-600 font-semibold hover:underline">Contact Support →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
