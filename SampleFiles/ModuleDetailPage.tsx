import { useState } from 'react';
import { 
  ArrowLeft, CheckCircle, AlertCircle, Clock, DollarSign, Users,
  Star, ChevronDown, ChevronUp, Send, Briefcase, Cpu,
  Heart, Database, Globe, Award, TrendingUp, Target, BookOpen, MessageSquare,
  Zap, Lightbulb, Plane, Trophy, Leaf
} from 'lucide-react';

interface ModuleDetailPageProps {
  selectedModuleId?: number;
}

const ModuleDetailPage = ({ selectedModuleId = 1 }: ModuleDetailPageProps) => {
  const [selectedModule, setSelectedModule] = useState(selectedModuleId);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const modules = [
    {
      id: 1,
      name: "Business Plan & Investment",
      icon: <Briefcase className="w-16 h-16" />,
      color: "from-blue-500 to-blue-600",
      shortDesc: "Launch your business internationally with strategic investment",
      fullDesc: "This module is designed for entrepreneurs and business owners who are ready to expand their operations internationally. We help you validate your business plan, secure the necessary investment, and navigate the complex process of international business establishment. Our team works with you to ensure your business meets all requirements for international visa sponsorship.",
      requirement: "Business plan + $150,000 minimum investment",
      duration: "3-6 months",
      successRate: "92%",
      avgIncome: "$60,000+",
      benefits: [
        "International visa sponsorship support",
        "Business plan validation and refinement",
        "Investment structuring guidance",
        "Legal entity setup assistance",
        "Market entry strategy development",
        "Access to international business networks"
      ],
      requirements: [
        "Comprehensive business plan (minimum 20 pages)",
        "Proof of investment capacity ($150,000+)",
        "Business registration documents",
        "Financial projections (3-5 years)",
        "Market research documentation",
        "Management team credentials"
      ],
      process: [
        { step: 1, title: "Initial Assessment", desc: "Submit business plan and investment proof", duration: "1 week" },
        { step: 2, title: "Business Validation", desc: "Our team reviews and validates your business model", duration: "2 weeks" },
        { step: 3, title: "Refinement Phase", desc: "Work with advisors to optimize your plan", duration: "3-4 weeks" },
        { step: 4, title: "Investment Structuring", desc: "Structure investment for visa requirements", duration: "2 weeks" },
        { step: 5, title: "Visa Application", desc: "Submit visa application with business documentation", duration: "8-12 weeks" }
      ],
      testimonials: [
        { name: "Adebayo Johnson", location: "Lagos → Toronto", rating: 5, text: "The DAG team helped me refine my tech startup plan and secure my Canadian work visa within 5 months." },
        { name: "Chioma Okonkwo", location: "Abuja → Vancouver", rating: 5, text: "Professional guidance every step of the way. My e-commerce business is now thriving in Canada." }
      ],
      faqs: [
        { q: "What type of businesses qualify?", a: "Most legitimate businesses qualify, including tech startups, retail, services, manufacturing, and consulting. The business must be viable and create employment opportunities." },
        { q: "Is the $150,000 investment required upfront?", a: "You need to demonstrate access to the funds. The actual transfer timing depends on visa requirements and business setup milestones." },
        { q: "Can I apply with a business partner?", a: "Yes, partnerships are accepted. Combined investment and shared ownership structures are common." },
        { q: "What countries are available?", a: "Primary focus is Canada, but we also support applications for UK, Australia, and select European countries." }
      ]
    },
    {
      id: 2,
      name: "Technology Demand",
      icon: <Cpu className="w-16 h-16" />,
      color: "from-purple-500 to-purple-600",
      shortDesc: "Identify and fulfill critical technology needs in your sector",
      fullDesc: "This module connects technology professionals with sectors experiencing critical technology gaps. Whether you're in software development, IT infrastructure, cybersecurity, or emerging tech, we help you identify market demands and position yourself as the solution provider. Our approach creates sustainable income through technology consulting and implementation projects.",
      requirement: "Technology specialization with demonstrable expertise",
      duration: "2-4 months",
      successRate: "88%",
      avgIncome: "$45,000+",
      benefits: [
        "Sector-specific technology demand analysis",
        "Connection with clients needing your expertise",
        "Project management support",
        "Intellectual property protection guidance",
        "Remote work infrastructure setup",
        "International client acquisition strategies"
      ],
      requirements: [
        "Technology field specialization (software, hardware, cybersecurity, etc.)",
        "Portfolio of previous work or projects",
        "Technical certifications (preferred but not required)",
        "Description of technology solutions you can provide",
        "Understanding of target sector needs",
        "Communication and documentation skills"
      ],
      process: [
        { step: 1, title: "Expertise Assessment", desc: "Evaluate your technical skills and experience", duration: "3-5 days" },
        { step: 2, title: "Market Matching", desc: "Identify sectors needing your expertise", duration: "1 week" },
        { step: 3, title: "Portfolio Development", desc: "Build compelling portfolio and proposals", duration: "2 weeks" },
        { step: 4, title: "Client Connection", desc: "Connect with potential clients and projects", duration: "2-4 weeks" },
        { step: 5, title: "Project Initiation", desc: "Begin work with support and oversight", duration: "Ongoing" }
      ],
      testimonials: [
        { name: "Ibrahim Yusuf", location: "Kano → Remote", rating: 5, text: "As a software developer, this program connected me with 3 international clients. I'm now earning 5x my previous salary." },
        { name: "Ngozi Eze", location: "Port Harcourt → Remote", rating: 5, text: "The cybersecurity sector matching was perfect. I found my niche and clients within weeks." }
      ],
      faqs: [
        { q: "What technology fields are in demand?", a: "High-demand areas include: software development, cybersecurity, cloud computing, data analytics, AI/ML, mobile app development, and IT infrastructure." },
        { q: "Do I need formal certifications?", a: "While helpful, practical experience and a strong portfolio are often more valuable. We assess based on demonstrable skills." },
        { q: "Can I work remotely?", a: "Yes, most technology demand projects are remote-friendly, allowing you to work from anywhere." },
        { q: "How are clients found?", a: "We leverage our network of international businesses, sectoral partnerships, and active client acquisition strategies." }
      ]
    },
    {
      id: 5,
      name: "Healthcare",
      icon: <Heart className="w-16 h-16" />,
      color: "from-red-500 to-red-600",
      shortDesc: "Digital medical services connecting African healthcare professionals globally",
      fullDesc: "The Healthcare module revolutionizes medical service delivery by connecting qualified Nigerian medical professionals with cutting-edge medical devices and international healthcare networks. Through digital interfaces and remote diagnostic capabilities, you can provide high-quality medical services while earning international-level income. This program addresses the healthcare crisis while creating unprecedented opportunities for medical professionals.",
      requirement: "Valid medical qualification and active practice license",
      duration: "1-3 months",
      successRate: "94%",
      avgIncome: "$5,000+/month",
      benefits: [
        "Access to advanced medical diagnostic devices",
        "Digital healthcare platform integration",
        "International telemedicine opportunities",
        "Remote diagnostics capabilities",
        "Continuous medical education support",
        "Medical device manufacturer partnerships"
      ],
      requirements: [
        "Valid medical qualification (MBBS, nursing, pharmacy, lab tech, etc.)",
        "Current practice license in Nigeria",
        "Description of medical specialization",
        "Location and practice setup details",
        "Willingness to adopt digital health technologies",
        "Basic computer literacy"
      ],
      process: [
        { step: 1, title: "Credential Verification", desc: "Verify medical qualifications and licenses", duration: "3-5 days" },
        { step: 2, title: "Specialization Matching", desc: "Match with relevant medical device systems", duration: "1 week" },
        { step: 3, title: "Technology Training", desc: "Training on digital health platforms", duration: "2 weeks" },
        { step: 4, title: "Infrastructure Setup", desc: "Install devices and establish digital interfaces", duration: "2-3 weeks" },
        { step: 5, title: "Service Launch", desc: "Begin providing enhanced medical services", duration: "Ongoing" }
      ],
      testimonials: [
        { name: "Dr. Amara Nwosu", location: "Enugu", rating: 5, text: "The digital diagnostic tools transformed my practice. I can now offer services previously unavailable in my area and my income tripled." },
        { name: "Nurse Fatima Abbas", location: "Sokoto", rating: 5, text: "Working with Latin American medical devices has been incredible. Rural patients now access world-class diagnostics." }
      ],
      faqs: [
        { q: "What medical fields qualify?", a: "All medical professions qualify: doctors, nurses, pharmacists, lab technicians, radiologists, physiotherapists, and other licensed healthcare providers." },
        { q: "What medical devices are available?", a: "We partner with manufacturers for diagnostic equipment, laboratory analyzers, imaging devices, and telemedicine platforms." },
        { q: "Do I need to be in a city?", a: "No! This program specifically targets underserved areas. Rural and semi-urban practitioners are highly encouraged to apply." },
        { q: "How quickly can I start earning?", a: "After setup (4-6 weeks), most practitioners see immediate income increases of 200-400% within the first 3 months." }
      ]
    },
    {
      id: 8,
      name: "Data Entry Roles",
      icon: <Database className="w-16 h-16" />,
      color: "from-teal-500 to-teal-600",
      shortDesc: "Flexible remote work opportunities for students and beginners",
      fullDesc: "The Data Entry module is designed as the most accessible entry point into the Japa Initiative. Whether you're a student, recent graduate, or simply seeking flexible income, this program provides immediate earning opportunities while building your professional profile. Tasks range from simple data entry to product reviews, research, and intelligence gathering for international clients.",
      requirement: "Internet access and basic computer skills",
      duration: "Immediate start",
      successRate: "98%",
      avgIncome: "3x minimum wage",
      benefits: [
        "Flexible working hours",
        "No prior experience required",
        "Multiple concurrent projects",
        "Skill development opportunities",
        "Earn while studying",
        "Pathway to higher-paying roles"
      ],
      requirements: [
        "Reliable internet access (mobile data or WiFi)",
        "Computer, tablet, or smartphone",
        "Availability commitment (minimum hours per day)",
        "Basic reading and writing skills",
        "Ability to follow instructions",
        "Geographic location in Nigeria"
      ],
      process: [
        { step: 1, title: "Registration", desc: "Complete profile with availability details", duration: "Same day" },
        { step: 2, title: "Skill Assessment", desc: "Basic assessment of computer literacy", duration: "1-2 days" },
        { step: 3, title: "Task Assignment", desc: "Receive first tasks based on availability", duration: "Immediate" },
        { step: 4, title: "Work & Earn", desc: "Complete tasks and receive payment", duration: "Ongoing" },
        { step: 5, title: "Skill Advancement", desc: "Access higher-paying specialized tasks", duration: "Ongoing" }
      ],
      testimonials: [
        { name: "Blessing Adeyemi", location: "Ibadan, Student", rating: 5, text: "I'm earning while studying! The flexible hours mean I can work around my classes and still make 3x minimum wage." },
        { name: "Emeka Okafor", location: "Lagos, Graduate", rating: 5, text: "Started with simple data entry. Now I'm doing product research and earning even more. Great stepping stone!" }
      ],
      faqs: [
        { q: "What type of phone do I need?", a: "Any smartphone with internet access works. However, a computer or tablet is better for most tasks." },
        { q: "How much can I really earn?", a: "Earnings depend on hours worked and task types. Average is 3x minimum wage, but dedicated workers earn significantly more." },
        { q: "What tasks will I do?", a: "Tasks include: data entry, product reviews, research, survey completion, social media monitoring, and local intelligence gathering." },
        { q: "When do I get paid?", a: "Payments are processed weekly or bi-weekly depending on project terms and payment thresholds." }
      ]
    },
    {
      id: 3,
      name: "IPR Commercialization",
      icon: <Lightbulb className="w-16 h-16" />,
      color: "from-yellow-500 to-yellow-600",
      shortDesc: "Monetize your intellectual property and innovations",
      fullDesc: "Transform your intellectual property into income-generating assets. Whether you hold patents, trademarks, copyrights, designs, or agricultural IPR, this module helps you commercialize your innovations globally. We connect you with markets and partners who value your intellectual property and are willing to license or invest in your creations.",
      requirement: "Valid intellectual property (Patent, Trademark, Copyright, Design, or Agricultural IPR)",
      duration: "2-6 months",
      successRate: "90%",
      avgIncome: "$50,000+",
      benefits: [
        "IPR valuation and assessment",
        "Global marketplace exposure",
        "Licensing negotiation support",
        "Royalty management",
        "Legal protection guidance",
        "International partnership facilitation"
      ],
      requirements: [
        "Clear description of your IP",
        "Type of intellectual property (Patent, Trademark, Copyright, Design, or Agricultural)",
        "Documentation of IP ownership",
        "Current or potential commercialization plans",
        "Understanding of your IP value",
        "Willingness to license or collaborate"
      ],
      process: [
        { step: 1, title: "IP Assessment", desc: "Evaluate your intellectual property", duration: "1 week" },
        { step: 2, title: "Valuation", desc: "Determine market value of your IP", duration: "2 weeks" },
        { step: 3, title: "Market Matching", desc: "Connect with interested partners", duration: "3-4 weeks" },
        { step: 4, title: "Negotiation Support", desc: "Assist in licensing and partnership deals", duration: "2-3 weeks" },
        { step: 5, title: "Commercialization", desc: "Begin earning from your IP", duration: "Ongoing" }
      ],
      testimonials: [
        { name: "Dr. Folake Adeyemi", location: "Lagos → Global", rating: 5, text: "My patent found buyers within 3 months. Now I'm receiving royalties from 4 different companies worldwide." },
        { name: "Tunde Oladele", location: "Ibadan → Europe", rating: 5, text: "Never thought my design would be this valuable. The DAG team helped me license it to major manufacturers." }
      ],
      faqs: [
        { q: "What types of IP qualify?", a: "Patents, trademarks, copyrights, industrial designs, trade secrets, and agricultural innovations all qualify for commercialization." },
        { q: "How is my IP protected?", a: "We ensure proper documentation and legal protection before any commercial activities. Your IP rights are paramount." },
        { q: "Can I license my IP to multiple partners?", a: "Yes, depending on your IP type and agreements. We help negotiate terms that maximize your earnings." },
        { q: "How long does commercialization take?", a: "Timeline varies, but most applicants see first income within 2-6 months of joining the program." }
      ]
    },
    {
      id: 4,
      name: "Technology Transfer",
      icon: <Zap className="w-16 h-16" />,
      color: "from-green-500 to-green-600",
      shortDesc: "Access and implement cutting-edge technologies",
      fullDesc: "Technology Transfer connects innovators with advanced technologies and tools. If you have identified a specific technology need in your sector, we procure licenses and create projects around those technologies. This often involves collaborating with other professionals to fully realize the technology's potential and create sustainable income.",
      requirement: "Sector specialization and clear technology need description",
      duration: "3-8 months",
      successRate: "85%",
      avgIncome: "$40,000+",
      benefits: [
        "Access to cutting-edge technology licenses",
        "Technology integration support",
        "Project development assistance",
        "Cross-sector collaboration opportunities",
        "Training and onboarding",
        "Ongoing technical support"
      ],
      requirements: [
        "Clear description of your field/specialization",
        "Specific technology needs identified",
        "Business plan for technology implementation",
        "Understanding of target market",
        "Willingness to collaborate with partners",
        "Project management capability"
      ],
      process: [
        { step: 1, title: "Technology Identification", desc: "Define the technology you need", duration: "1 week" },
        { step: 2, title: "Market Analysis", desc: "Analyze market demand for the technology", duration: "2 weeks" },
        { step: 3, title: "License Procurement", desc: "DAG secures technology licenses", duration: "2-3 weeks" },
        { step: 4, title: "Team Formation", desc: "Assemble required team members", duration: "2-3 weeks" },
        { step: 5, title: "Project Launch", desc: "Begin commercial implementation", duration: "Ongoing" }
      ],
      testimonials: [
        { name: "Chinedu Obi", location: "Port Harcourt → International", rating: 5, text: "The technology transfer program gave me access to industrial software worth $50,000. Our productivity increased 10x!" },
        { name: "Aisha Mohammed", location: "Kano → Global", rating: 5, text: "I identified the technology gap, DAG found the solution, and now I'm running a successful implementation center." }
      ],
      faqs: [
        { q: "Who decides what technology to transfer?", a: "You identify the technology need, and we help source and license the appropriate solutions." },
        { q: "Do I need other team members?", a: "Depending on the technology scope, you may need to collaborate with specialists. We help assemble the right team." },
        { q: "What if the technology fails commercially?", a: "We provide ongoing support and can adjust strategies to ensure commercial viability." },
        { q: "Can I export products using transferred technology?", a: "Yes, most technology licenses allow for international business development." }
      ]
    },
    {
      id: 6,
      name: "International Visa & Residency",
      icon: <Plane className="w-16 h-16" />,
      color: "from-indigo-500 to-indigo-600",
      shortDesc: "Secure international visas and residency opportunities",
      fullDesc: "This module is for those who have demonstrated consistent income and are ready for international opportunities. Once you establish $4,000+ monthly income through any Japa module, we support your application for international work visas, digital nomad visas, and population decline city invitations. We handle the complex paperwork and requirements with country-specific expertise.",
      requirement: "Demonstrated income of ~$4,000+ per month",
      duration: "2-4 months",
      successRate: "96%",
      avgIncome: "International employment + residency",
      benefits: [
        "Visa application support",
        "Documentation and paperwork assistance",
        "Interview preparation",
        "Multiple country options",
        "Digital nomad visa guidance",
        "Population decline city opportunities"
      ],
      requirements: [
        "Proof of consistent monthly income ($4,000+)",
        "Contract with DAG or income documentation",
        "Valid passport with 6+ months validity",
        "Medical examination (varies by country)",
        "Background check clearance",
        "Basic English proficiency"
      ],
      process: [
        { step: 1, title: "Income Verification", desc: "Confirm you meet income requirements", duration: "3-5 days" },
        { step: 2, title: "Country Selection", desc: "Choose your destination country", duration: "1 week" },
        { step: 3, title: "Application Preparation", desc: "Prepare all required documents", duration: "2-3 weeks" },
        { step: 4, title: "Visa Submission", desc: "Submit complete application", duration: "1 week" },
        { step: 5, title: "Visa Approval", desc: "Receive visa and make travel plans", duration: "6-12 weeks" }
      ],
      testimonials: [
        { name: "Obinna Nkrumah", location: "Nigeria → Canada", rating: 5, text: "After proving my income through the program, I got my Canadian work permit in 3 months. Life-changing!" },
        { name: "Zainab Ismail", location: "Nigeria → Portugal", rating: 5, text: "The D-7 passive income visa opened doors I never imagined. Now I'm a resident of Portugal!" }
      ],
      faqs: [
        { q: "Which countries are available?", a: "We support applications to Canada, UK, Australia, Germany, Portugal, and several others. Availability depends on income level." },
        { q: "What if my income is from multiple sources?", a: "Combined income from DAG modules counts. We document all income sources for visa applications." },
        { q: "How long does visa processing take?", a: "Timeline varies by country: Canada (8-12 weeks), Portugal (4-8 weeks), others vary accordingly." },
        { q: "Do I need to work for the country's company?", a: "Depends on visa type. Some work visas require employment contracts, while others are based on income level." }
      ]
    },
    {
      id: 7,
      name: "Sports",
      icon: <Trophy className="w-16 h-16" />,
      color: "from-orange-500 to-orange-600",
      shortDesc: "Leverage athletic talent for international opportunities",
      fullDesc: "The Sports module is for athletes with national-level achievements. We validate your athletic credentials with relevant awarding bodies, create professional profiles, and showcase your talent to international organizations, clubs, and countries seeking sports talent. This opens doors to professional contracts and citizenship opportunities.",
      requirement: "Competed at national level with validated achievements",
      duration: "1-3 months",
      successRate: "89%",
      avgIncome: "Professional contracts + sponsorships",
      benefits: [
        "Credential validation with awarding bodies",
        "Professional profile creation",
        "International talent showcase",
        "Contract negotiation support",
        "Sponsorship opportunities",
        "Citizenship pathways for elite athletes"
      ],
      requirements: [
        "National-level competition achievements",
        "Validation from recognized awarding body",
        "Video footage of athletic performance",
        "Medical clearance",
        "Current athletic status",
        "Commitment to professional athletics"
      ],
      process: [
        { step: 1, title: "Achievement Validation", desc: "Verify achievements with awarding bodies", duration: "1-2 weeks" },
        { step: 2, title: "Profile Creation", desc: "Develop professional athlete profile", duration: "1 week" },
        { step: 3, title: "Showcase Preparation", desc: "Prepare materials for international scouts", duration: "1-2 weeks" },
        { step: 4, title: "International Exposure", desc: "Present profile to international organizations", duration: "2-4 weeks" },
        { step: 5, title: "Contract Negotiations", desc: "Facilitate contract discussions", duration: "Ongoing" }
      ],
      testimonials: [
        { name: "Seun Adelayo", location: "Lagos → Dubai", rating: 5, text: "DAG validated my football achievements and connected me with Dubai clubs. I'm now a professional player earning $15,000/month!" },
        { name: "Amina Haruna", location: "Jos → Australia", rating: 5, text: "My tennis credentials led to an Australian contract. Plus, residency sponsorship as an elite athlete!" }
      ],
      faqs: [
        { q: "What sports qualify?", a: "Individual and team sports qualify - football, basketball, tennis, volleyball, athletics, swimming, martial arts, and more." },
        { q: "Do I need to be professional already?", a: "No, national-level amateur achievements qualify. We help transition you to professional status." },
        { q: "Can I get citizenship through sports?", a: "Yes, many countries offer citizenship or residency to elite athletes. We facilitate these opportunities." },
        { q: "What if I have injuries?", a: "Medical clearance is required. We connect you with sports medicine professionals if needed." }
      ]
    },
    {
      id: 9,
      name: "Raw Materials",
      icon: <Leaf className="w-16 h-16" />,
      color: "from-emerald-500 to-emerald-600",
      shortDesc: "Trade local raw materials on global marketplace",
      fullDesc: "The Raw Materials module invites Nigerians to identify and trade raw materials available in their locality. We list your materials on our global raw materials marketplace. When clients express interest, we facilitate the entire transaction - from engagement with manufacturers to contract setup - ensuring you earn commissions as an agent.",
      requirement: "Ability to identify and describe 5+ local raw materials",
      duration: "Immediate start",
      successRate: "91%",
      avgIncome: "Commission-based earnings",
      benefits: [
        "Global marketplace listing",
        "Order fulfillment support",
        "Contract facilitation",
        "Commission-based earnings",
        "Manufacturer connections",
        "No upfront inventory required"
      ],
      requirements: [
        "Minimum 5 raw materials identified",
        "Detailed material descriptions",
        "Unit pricing for each material",
        "Photo/video documentation",
        "Location details",
        "Access to manufacturers/suppliers"
      ],
      process: [
        { step: 1, title: "Material Identification", desc: "List raw materials from your area", duration: "1 week" },
        { step: 2, title: "Documentation", desc: "Submit descriptions, photos, prices", duration: "3-5 days" },
        { step: 3, title: "Marketplace Listing", desc: "Materials listed on global marketplace", duration: "Immediate" },
        { step: 4, title: "Client Interest", desc: "Clients express interest in materials", duration: "Ongoing" },
        { step: 5, title: "Transaction & Commission", desc: "Facilitate sale and receive commission", duration: "Per order" }
      ],
      testimonials: [
        { name: "Kazeem Okafor", location: "Lagos", rating: 5, text: "I listed 6 raw materials and within 2 weeks got my first order. Commission payment was instant!" },
        { name: "Chidinma Eze", location: "Enugu", rating: 5, text: "Never knew the raw materials in my area were valuable internationally. Now I'm earning consistently as an agent." }
      ],
      faqs: [
        { q: "Do I need to hold inventory?", a: "No. You identify materials and manufacturers. The client pays, and you facilitate delivery. You earn commission." },
        { q: "What raw materials qualify?", a: "Agricultural products, minerals, textiles, timber, craft materials - anything locally available with commercial value." },
        { q: "How much commission can I earn?", a: "Commission depends on order size and material type. Typically 5-15% of transaction value." },
        { q: "Who is responsible for shipping?", a: "Clients arrange shipping directly with manufacturers. You coordinate as the agent." }
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === selectedModule) || modules[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-green-600 transition"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Home</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                <span>Modules</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                <span className="text-green-600 font-semibold">{currentModule.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="font-bold text-sm text-gray-800">Developing Africa</div>
                <div className="text-xs text-green-600 font-semibold">JAPA INITIATIVE</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Module Selector (Mobile) */}
      <div className="bg-white border-b md:hidden">
        <div className="container mx-auto px-4 py-3">
          <select 
            value={selectedModule}
            onChange={(e) => setSelectedModule(Number(e.target.value))}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {modules.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">All Modules</h3>
              <div className="space-y-2">
                {modules.map(module => (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModule(module.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedModule === module.id
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 ${selectedModule === module.id ? 'opacity-100' : 'opacity-50'}`}>
                        {module.icon}
                      </div>
                      <span className="text-sm">{module.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9">
            {/* Hero Section */}
            <div className={`bg-gradient-to-br ${currentModule.color} rounded-2xl p-8 md:p-12 text-white mb-8`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {currentModule.icon}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentModule.name}</h1>
                    <p className="text-white text-opacity-90 text-lg">{currentModule.shortDesc}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Clock className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Duration</div>
                  <div className="font-bold">{currentModule.duration}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Award className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Success Rate</div>
                  <div className="font-bold">{currentModule.successRate}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <DollarSign className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Avg Income</div>
                  <div className="font-bold">{currentModule.avgIncome}</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Users className="w-6 h-6 mb-2" />
                  <div className="text-sm opacity-90">Requirement</div>
                  <div className="font-bold text-sm">{currentModule.requirement.split(' ').slice(0, 2).join(' ')}</div>
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
            <div className="bg-white rounded-xl shadow-sm p-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Overview</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{currentModule.fullDesc}</p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Requirement</p>
                        <p className="text-gray-700 text-sm">{currentModule.requirement}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                      <Target className="w-8 h-8 text-green-600 mb-3" />
                      <h3 className="font-bold text-gray-900 mb-2">Success Focused</h3>
                      <p className="text-sm text-gray-600">Proven pathways with {currentModule.successRate} success rate</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                      <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-bold text-gray-900 mb-2">Income Growth</h3>
                      <p className="text-sm text-gray-600">Average income of {currentModule.avgIncome}</p>
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
                    {currentModule.benefits.map((benefit, idx) => (
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
                    {currentModule.requirements.map((req, idx) => (
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
                    {currentModule.process.map((step, idx) => (
                      <div key={idx} className="relative pl-12">
                        <div className="absolute left-0 top-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        {idx < currentModule.process.length - 1 && (
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
                    {currentModule.testimonials.map((testimonial, idx) => (
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
                    {currentModule.faqs.map((faq, idx) => (
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
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mt-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Get Started?</h2>
                  <p className="text-white text-opacity-90">Apply now and begin your journey to financial freedom</p>
                </div>
                <button className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:scale-105 flex items-center whitespace-nowrap">
                  Apply to This Module
                  <Send className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
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
};

export default ModuleDetailPage;
