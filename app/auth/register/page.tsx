'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ChevronRight, ChevronLeft, CheckCircle, Send, Home,
  Briefcase, Cpu, CreditCard, User, AlertCircle, Upload,
  FileText, Lightbulb, Zap, Plane, Trophy, Leaf, Heart, Database
} from 'lucide-react';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    email: '',
    nationalId: '',
    phone: '',
    education: '',
    cvFile: null as File | null,
    description: '',
    
    // Step 2: Module Selection
    selectedModule: null as number | null,
    
    // Step 3: Module-Specific Fields (varies by module)
    moduleFields: {} as Record<string, string>,
    
    // Step 4: Payment
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string | null | undefined>>({});
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allModules = [
    { 
      id: 1, 
      name: 'Business Plan & Investment', 
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      requirement: 'Business plan + $150K investment',
      fields: ['businessName', 'businessWebsite', 'businessPlan', 'investmentAmount']
    },
    { 
      id: 2, 
      name: 'Technology Demand', 
      icon: <Cpu className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      requirement: 'Field specialization',
      fields: ['sector', 'technologyNeed', 'technologyUsage']
    },
    { 
      id: 3, 
      name: 'IPR Commercialization', 
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      requirement: 'Valid intellectual property',
      fields: ['iprDescription', 'iprType', 'iprPlan']
    },
    { 
      id: 4, 
      name: 'Technology Transfer', 
      icon: <Zap className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      requirement: 'Sector specialization',
      fields: ['sector', 'technologyNeeded', 'businessPlan']
    },
    { 
      id: 5, 
      name: 'Healthcare', 
      icon: <Heart className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      requirement: 'Valid medical qualification',
      fields: ['medicalQualification', 'medicalInstitutions', 'medicalDevices', 'medicalDemand']
    },
    { 
      id: 6, 
      name: 'International Visa & Residency', 
      icon: <Plane className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600',
      requirement: '$4,000+ monthly income',
      fields: ['monthlyIncome', 'incomeProof', 'countryPreference']
    },
    { 
      id: 7, 
      name: 'Sports', 
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      requirement: 'National-level achievements',
      fields: ['sportingCareer', 'awardingBodies']
    },
    { 
      id: 8, 
      name: 'Data Entry Roles', 
      icon: <Database className="w-6 h-6" />,
      color: 'from-teal-500 to-teal-600',
      requirement: 'Internet access & basic computer skills',
      fields: ['phoneType', 'internetAccess', 'hoursPerDay', 'availableHours', 'cityServices']
    },
    { 
      id: 9, 
      name: 'Raw Materials', 
      icon: <Leaf className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      requirement: '5+ local raw materials',
      fields: ['rawMaterials']
    }
  ];

  const steps = [
    { title: 'Personal Info', icon: <User /> },
    { title: 'Module Selection', icon: <Home /> },
    { title: 'Module Details', icon: <FileText /> },
    { title: 'Payment', icon: <CreditCard /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleModuleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      moduleFields: {
        ...prev.moduleFields,
        [fieldName]: value
      }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cvFile: file
      }));
      if (errors.cvFile) {
        setErrors(prev => ({
          ...prev,
          cvFile: null
        }));
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Personal Information validation
      if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
      if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.education.trim()) newErrors.education = 'Educational record is required';
      if (!formData.cvFile) newErrors.cvFile = 'CV upload is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!emailVerified) newErrors.email = 'Please verify your email first';
    } else if (step === 1) {
      // Module Selection validation
      if (!formData.selectedModule) newErrors.selectedModule = 'Please select a module';
    } else if (step === 2) {
      // Module-specific fields validation
      const selectedModuleData = allModules.find(m => m.id === formData.selectedModule);
      if (selectedModuleData) {
        selectedModuleData.fields.forEach(field => {
          if (!formData.moduleFields[field] || !formData.moduleFields[field].trim()) {
            newErrors[field] = 'This field is required';
          }
        });
      }
    } else if (step === 3) {
      // Payment validation
      if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setSubmitting(true);
      try {
        // Step 1: Create checkout session with Stripe
        const checkoutResponse = await fetch('/api/payments/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
          }),
          credentials: 'include', // Include session cookies in the request
        });

        if (!checkoutResponse.ok) {
          const data = await checkoutResponse.json();
          setErrors({ submit: data.error || 'Failed to initialize payment' });
          setSubmitting(false);
          return;
        }

        const { url, sessionId } = await checkoutResponse.json();

        // Step 2: Save application data to session/cache for after payment
        // Store in session storage to retrieve after payment redirect
        sessionStorage.setItem('pendingApplicationData', JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          nationalId: formData.nationalId,
          phone: formData.phone,
          education: formData.education,
          description: formData.description,
          moduleId: formData.selectedModule,
          moduleFields: formData.moduleFields,
          cvFile: formData.cvFile,
          stripeSessionId: sessionId,
        }));

        // Step 3: Redirect to Stripe checkout
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (err: any) {
        setErrors({ submit: err.message || 'An error occurred' });
        setSubmitting(false);
      }
    }
  };

  const selectedModuleData = allModules.find(m => m.id === formData.selectedModule);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm sticky top-0 z-50 mb-8 rounded-xl">
          <div className="px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src="/dag_logo.JPG"
                  alt="Developing Africa JAPA Initiative"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-800">Developing Africa</div>
                <div className="text-xs text-green-600 font-semibold">JAPA INITIATIVE</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between mb-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition ${
                    idx <= currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx <= currentStep ? (
                    idx === currentStep ? (
                      <div className="w-6 h-6">{step.icon}</div>
                    ) : (
                      <CheckCircle className="w-6 h-6" />
                    )
                  ) : (
                    <div className="w-6 h-6">{step.icon}</div>
                  )}
                </div>
                <div className={`text-sm font-semibold text-center ${
                  idx <= currentStep ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-12 mt-3 ${
                    idx < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={emailVerifying || emailVerified}
                      onClick={async () => {
                        if (!formData.email.includes('@')) {
                          setErrors(prev => ({ ...prev, email: 'Valid email required' }));
                          return;
                        }

                        setEmailVerifying(true);
                        try {
                          const response = await fetch('/api/auth/check-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: formData.email }),
                          });

                          const data = await response.json();

                          if (!response.ok) {
                            setErrors(prev => ({ ...prev, email: data.error || 'Email verification failed' }));
                            setEmailVerified(false);
                            return;
                          }

                          setEmailVerified(true);
                          if (errors.email) {
                            setErrors(prev => ({ ...prev, email: null }));
                          }
                        } catch (err) {
                          setErrors(prev => ({ ...prev, email: 'Failed to verify email. Please try again.' }));
                          setEmailVerified(false);
                        } finally {
                          setEmailVerifying(false);
                        }
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                        emailVerified 
                          ? 'bg-green-500 text-white cursor-default' 
                          : emailVerifying
                          ? 'bg-blue-600 text-white cursor-wait'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } ${(emailVerifying || emailVerified) ? 'opacity-75' : ''}`}
                    >
                      {emailVerifying ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Verifying...
                        </>
                      ) : emailVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          ✓ Verified
                        </>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* National ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">National ID *</label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    placeholder="Enter your national ID"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.nationalId ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.nationalId && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.nationalId}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telephone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 800 000 0000"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Educational Record *</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="e.g., Bachelor's in Computer Science"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.education ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.education && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.education}
                    </p>
                  )}
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CV *</label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                    errors.cvFile ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-green-500'
                  }`}>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="cvUpload"
                    />
                    <label htmlFor="cvUpload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {formData.cvFile ? formData.cvFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (max 5MB)</p>
                    </label>
                  </div>
                  {errors.cvFile && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.cvFile}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Describe Yourself & What You Seek *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your goals..."
                    rows={5}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Module Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Module</h2>
              <p className="text-gray-600 mb-8">Choose the pathway that best fits your profile and goals:</p>

              <div className="grid md:grid-cols-2 gap-4">
                {allModules.map(module => (
                  <div
                    key={module.id}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, selectedModule: module.id, moduleFields: {} }));
                      if (errors.selectedModule) {
                        setErrors(prev => ({ ...prev, selectedModule: null }));
                      }
                    }}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition ${
                      formData.selectedModule === module.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-500'
                    }`}
                  >
                    <div className={`bg-gradient-to-br ${module.color} text-white p-4 rounded-lg mb-4 inline-block`}>
                      {module.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{module.name}</h3>
                    <p className="text-sm text-gray-600">{module.requirement}</p>
                  </div>
                ))}
              </div>

              {errors.selectedModule && (
                <p className="text-red-600 text-sm mt-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.selectedModule}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Module-Specific Fields */}
          {currentStep === 2 && selectedModuleData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedModuleData.name} Details</h2>

              <div className="space-y-6">
                {selectedModuleData.id === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                      <input
                        type="text"
                        value={formData.moduleFields.businessName || ''}
                        onChange={(e) => handleModuleFieldChange('businessName', e.target.value)}
                        placeholder="Enter your business name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.businessName && <p className="text-red-600 text-sm mt-1">{errors.businessName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Website</label>
                      <input
                        type="url"
                        value={formData.moduleFields.businessWebsite || ''}
                        onChange={(e) => handleModuleFieldChange('businessWebsite', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Business Plan *</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Upload your business plan (PDF)</p>
                      </div>
                      {errors.businessPlan && <p className="text-red-600 text-sm mt-1">{errors.businessPlan}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Amount (min $150,000) *</label>
                      <input
                        type="number"
                        value={formData.moduleFields.investmentAmount || ''}
                        onChange={(e) => handleModuleFieldChange('investmentAmount', e.target.value)}
                        placeholder="150000"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.investmentAmount && <p className="text-red-600 text-sm mt-1">{errors.investmentAmount}</p>}
                    </div>
                  </>
                )}

                {selectedModuleData.id === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Sector *</label>
                      <textarea
                        value={formData.moduleFields.sector || ''}
                        onChange={(e) => handleModuleFieldChange('sector', e.target.value)}
                        placeholder="Describe your sector..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.sector && <p className="text-red-600 text-sm mt-1">{errors.sector}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Technology Need *</label>
                      <textarea
                        value={formData.moduleFields.technologyNeed || ''}
                        onChange={(e) => handleModuleFieldChange('technologyNeed', e.target.value)}
                        placeholder="What technology is needed?"
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.technologyNeed && <p className="text-red-600 text-sm mt-1">{errors.technologyNeed}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">How Will Technology Be Used? *</label>
                      <textarea
                        value={formData.moduleFields.technologyUsage || ''}
                        onChange={(e) => handleModuleFieldChange('technologyUsage', e.target.value)}
                        placeholder="Describe the application..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.technologyUsage && <p className="text-red-600 text-sm mt-1">{errors.technologyUsage}</p>}
                    </div>
                  </>
                )}

                {selectedModuleData.id === 5 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Qualification *</label>
                      <input
                        type="text"
                        value={formData.moduleFields.medicalQualification || ''}
                        onChange={(e) => handleModuleFieldChange('medicalQualification', e.target.value)}
                        placeholder="e.g., MBBS, Nursing, Pharmacy"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.medicalQualification && <p className="text-red-600 text-sm mt-1">{errors.medicalQualification}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Institutions Attended *</label>
                      <input
                        type="text"
                        value={formData.moduleFields.medicalInstitutions || ''}
                        onChange={(e) => handleModuleFieldChange('medicalInstitutions', e.target.value)}
                        placeholder="List institutions..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.medicalInstitutions && <p className="text-red-600 text-sm mt-1">{errors.medicalInstitutions}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Devices of Interest *</label>
                      <textarea
                        value={formData.moduleFields.medicalDevices || ''}
                        onChange={(e) => handleModuleFieldChange('medicalDevices', e.target.value)}
                        placeholder="Describe the devices you wish to work with..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.medicalDevices && <p className="text-red-600 text-sm mt-1">{errors.medicalDevices}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Demand in Your Area *</label>
                      <textarea
                        value={formData.moduleFields.medicalDemand || ''}
                        onChange={(e) => handleModuleFieldChange('medicalDemand', e.target.value)}
                        placeholder="Describe the demand for medical solutions..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.medicalDemand && <p className="text-red-600 text-sm mt-1">{errors.medicalDemand}</p>}
                    </div>
                  </>
                )}

                {selectedModuleData.id === 8 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Type *</label>
                      <input
                        type="text"
                        value={formData.moduleFields.phoneType || ''}
                        onChange={(e) => handleModuleFieldChange('phoneType', e.target.value)}
                        placeholder="e.g., iPhone 12, Samsung Galaxy"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.phoneType && <p className="text-red-600 text-sm mt-1">{errors.phoneType}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Internet Access *</label>
                      <select
                        value={formData.moduleFields.internetAccess || ''}
                        onChange={(e) => handleModuleFieldChange('internetAccess', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select access type</option>
                        <option value="mobile">Mobile Data</option>
                        <option value="wifi">WiFi</option>
                        <option value="both">Both</option>
                      </select>
                      {errors.internetAccess && <p className="text-red-600 text-sm mt-1">{errors.internetAccess}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Per Day Available *</label>
                      <input
                        type="number"
                        value={formData.moduleFields.hoursPerDay || ''}
                        onChange={(e) => handleModuleFieldChange('hoursPerDay', e.target.value)}
                        placeholder="4"
                        min="1"
                        max="24"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.hoursPerDay && <p className="text-red-600 text-sm mt-1">{errors.hoursPerDay}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Available Hours *</label>
                      <input
                        type="text"
                        value={formData.moduleFields.availableHours || ''}
                        onChange={(e) => handleModuleFieldChange('availableHours', e.target.value)}
                        placeholder="e.g., 9AM-1PM, 3PM-6PM"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.availableHours && <p className="text-red-600 text-sm mt-1">{errors.availableHours}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Services Needed in Your City/Town *</label>
                      <textarea
                        value={formData.moduleFields.cityServices || ''}
                        onChange={(e) => handleModuleFieldChange('cityServices', e.target.value)}
                        placeholder="What services are needed?"
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      {errors.cityServices && <p className="text-red-600 text-sm mt-1">{errors.cityServices}</p>}
                    </div>
                  </>
                )}

                {selectedModuleData.id === 9 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">List Raw Materials (minimum 5) *</label>
                    <p className="text-sm text-gray-600 mb-4">Enter each raw material with name, description, and cost per unit</p>
                    <textarea
                      value={formData.moduleFields.rawMaterials || ''}
                      onChange={(e) => handleModuleFieldChange('rawMaterials', e.target.value)}
                      placeholder="Material 1: Description | Cost&#10;Material 2: Description | Cost"
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.rawMaterials && <p className="text-red-600 text-sm mt-1">{errors.rawMaterials}</p>}
                  </div>
                )}

                {/* Generic fields for other modules */}
                {![1, 2, 5, 8, 9].includes(selectedModuleData.id) && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Module Information *</label>
                    <textarea
                      value={formData.moduleFields.moduleInfo || ''}
                      onChange={(e) => handleModuleFieldChange('moduleInfo', e.target.value)}
                      placeholder="Provide relevant information for this module..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.moduleInfo && <p className="text-red-600 text-sm mt-1">{errors.moduleInfo}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Confirmation</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-2">Eligibility Test Fee</h3>
                <p className="text-sm text-gray-700 mb-4">
                  There is a $15 non-refundable fee for the eligibility test. This fee ensures that you qualify for the module you have selected.
                </p>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span className="text-green-600">$15</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Important Information</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex space-x-3">
                      <span className="font-bold text-yellow-600 flex-shrink-0">✓</span>
                      <span>Your test will be reviewed within 4-5 working days</span>
                    </li>
                    <li className="flex space-x-3">
                      <span className="font-bold text-yellow-600 flex-shrink-0">✓</span>
                      <span>Results will be sent to your email</span>
                    </li>
                    <li className="flex space-x-3">
                      <span className="font-bold text-yellow-600 flex-shrink-0">✓</span>
                      <span>If you pass, we will contact you with next steps</span>
                    </li>
                    <li className="flex space-x-3">
                      <span className="font-bold text-yellow-600 flex-shrink-0">✓</span>
                      <span>If you don't qualify, we'll recommend remedial actions</span>
                    </li>
                  </ul>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the terms and conditions, and I understand that this is a $15 non-refundable fee.
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.agreedToTerms}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-75"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
