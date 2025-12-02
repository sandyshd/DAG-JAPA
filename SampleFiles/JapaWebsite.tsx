import React, { useState, useEffect } from 'react';
import {
  Menu, X, Users, TrendingUp,
  Globe, Briefcase, Cpu, Award, Heart, Database,
  Lightbulb, Zap, Plane, Trophy, Leaf,
  ArrowRight,
  Play,
  Star,
  DollarSign,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface JapaWebsiteProps {
  onLoginClick?: () => void;
  onModuleSelect?: (moduleId: number) => void;
  onApplyClick?: () => void;
}

const JapaWebsite = ({ onLoginClick, onModuleSelect, onApplyClick }: JapaWebsiteProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const modules = [
    { id: 1, icon: <Briefcase className="w-12 h-12" />, title: "Business", fullTitle: "Business Plan & Investment", color: "from-blue-500 to-blue-600" },
    { id: 2, icon: <Cpu className="w-12 h-12" />, title: "Technology", fullTitle: "Technology Demand", color: "from-purple-500 to-purple-600" },
    { id: 3, icon: <Lightbulb className="w-12 h-12" />, title: "IPR", fullTitle: "IPR Commercialization", color: "from-yellow-500 to-yellow-600" },
    { id: 4, icon: <Zap className="w-12 h-12" />, title: "Tech Transfer", fullTitle: "Technology Transfer", color: "from-green-500 to-green-600" },
    { id: 5, icon: <Heart className="w-12 h-12" />, title: "Healthcare", fullTitle: "Healthcare", color: "from-red-500 to-red-600" },
    { id: 6, icon: <Plane className="w-12 h-12" />, title: "Visa", fullTitle: "International Visa & Residency", color: "from-indigo-500 to-indigo-600" },
    { id: 7, icon: <Trophy className="w-12 h-12" />, title: "Sports", fullTitle: "Sports", color: "from-orange-500 to-orange-600" },
    { id: 8, icon: <Database className="w-12 h-12" />, title: "Data Entry", fullTitle: "Data Entry Roles", color: "from-teal-500 to-teal-600" },
    { id: 9, icon: <Leaf className="w-12 h-12" />, title: "Raw Materials", fullTitle: "Raw Materials", color: "from-emerald-500 to-emerald-600" }
  ];

  const stats = [
    { icon: <Users />, value: "10K+", label: "Applicants" },
    { icon: <Globe />, value: "25+", label: "Countries" },
    { icon: <TrendingUp />, value: "3x", label: "Income Growth" },
    { icon: <Award />, value: "95%", label: "Success Rate" }
  ];

  const quickLinks = [
    { type: "Guide", title: "Getting Started with Japa", icon: <ArrowRight className="w-6 h-6" /> },
    { type: "Video", title: "How to Choose Your Module", icon: <Play className="w-6 h-6" /> },
    { type: "Webinar", title: "Income Strategies & Tips", icon: <DollarSign className="w-6 h-6" /> },
    { type: "Guide", title: "Visa & Immigration Guide", icon: <Globe className="w-6 h-6" /> },
    { type: "Template", title: "Business Plan Template", icon: <Briefcase className="w-6 h-6" /> },
    { type: "Resource", title: "FAQ & Support", icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-gray-800">Developing Africa</div>
                <div className="text-xs text-green-600">JAPA INITIATIVE</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => window.location.hash = '#home'} className="text-gray-700 hover:text-green-600 font-medium transition">Home</button>
              <button onClick={() => onModuleSelect?.(1)} className="text-gray-700 hover:text-green-600 font-medium transition">Modules</button>
              <a href="#resources" className="text-gray-700 hover:text-green-600 font-medium transition">Resources</a>
              <button onClick={onLoginClick} className="text-gray-700 hover:text-green-600 font-medium transition">
                Login
              </button>
              <button onClick={onApplyClick} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition">
                Apply Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
              <a href="#home" className="block text-gray-700 hover:text-green-600 font-medium">Home</a>
              <a href="#modules" className="block text-gray-700 hover:text-green-600 font-medium">Modules</a>
              <a href="#resources" className="block text-gray-700 hover:text-green-600 font-medium">Resources</a>
              <a href="#about" className="block text-gray-700 hover:text-green-600 font-medium">About</a>
              <a href="#contact" className="block text-gray-700 hover:text-green-600 font-medium">Contact</a>
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full font-semibold">
                Apply Now
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                🌍 Building Africa's Future
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Future Through
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Global Pathways</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                DAG's strategic move to Canada creates development opportunities for Africa. 
                Start earning 3x Nigeria's minimum wage while building your international career.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button onClick={onApplyClick} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition transform hover:scale-105 flex items-center">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-green-600 hover:text-green-600 transition flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Video
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Trusted by 10,000+ applicants</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition duration-500">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-6 mb-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Success Path</h3>
                  <p className="text-gray-600">Choose from 9 specialized modules designed for your unique skills and goals</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Earn while learning", value: "100%", color: "bg-green-500" },
                    { label: "International opportunities", value: "95%", color: "bg-blue-500" },
                    { label: "Income growth potential", value: "300%", color: "bg-purple-500" }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm font-bold text-gray-800">{item.value}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{width: item.value}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    {React.cloneElement(stat.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                </div>
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Japa Initiative?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a holistic solution to Africa's youth employment crisis through strategic international partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign className="w-12 h-12" />,
                title: "Earn While You Learn",
                description: "Start earning 3x Nigeria's minimum wage while still a student through our data entry and remote work programs",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Globe className="w-12 h-12" />,
                title: "Global Opportunities",
                description: "Access international visa support, digital nomad pathways, and citizenship opportunities in 25+ countries",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <TrendingUp className="w-12 h-12" />,
                title: "Create Your $40K Job",
                description: "Build and own a sustainable income stream generating $40,000+ annually before you even graduate",
                color: "from-purple-500 to-pink-500"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
                <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Modules Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Choose Your Pathway
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div className={`bg-gradient-to-br ${module.color} p-6 text-white`}>
                  <div className="mb-4">{module.icon}</div>
                  <h3 className="text-xl font-bold">{module.title}</h3>
                </div>
                <div className="p-6">
                  <button 
                    onClick={() => onModuleSelect?.(module.id)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section id="resources" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Educational Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to maximize your opportunities with our comprehensive guides and videos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-xl transition cursor-pointer group">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg text-white flex-shrink-0 group-hover:scale-110 transition">
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-green-600 mb-2 block">{link.type}</span>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">{link.title}</h3>
                    <button className="text-green-600 text-sm font-semibold flex items-center group-hover:translate-x-1 transition">
                      Access Now
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/*<section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <button onClick={onApplyClick} className="bg-white text-green-700 px-12 py-4 rounded-full font-bold text-lg hover:shadow-xl transition">
            Take Eligibility Test - $15
          </button>
        </div>
      </section> */}

      <section className="py-20 bg-gradient-to-r from-green-600 via-green-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-8 leading-relaxed">
              Take the eligibility test today and join thousands of Africans building their future through global opportunities
            </p>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white border-opacity-20">
              <div className="grid md:grid-cols-3 gap-6 text-white">
                <div>
                  <DollarSign className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">$15</div>
                  <div className="text-white text-opacity-80 text-sm">Application Fee</div>
                </div>
                <div>
                  <Clock className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">4-5 Days</div>
                  <div className="text-white text-opacity-80 text-sm">Review Time</div>
                </div>
                <div>
                  <Award className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">95%</div>
                  <div className="text-white text-opacity-80 text-sm">Success Rate</div>
                </div>
              </div>
            </div>

            <button onClick={onApplyClick} className="bg-white text-green-700 px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition transform hover:scale-105">
              Take Eligibility Test - $15
            </button>
            <p className="text-white text-opacity-75 text-sm mt-4">Non-refundable • Reviewed in 4-5 working days</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">Developing Africa</div>
                  <div className="text-xs text-green-400">JAPA INITIATIVE</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Building Africa's future through strategic global partnerships and youth empowerment.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-green-400 transition">Home</a></li>
                <li><a href="#modules" className="text-gray-400 hover:text-green-400 transition">Modules</a></li>
                <li><a href="#resources" className="text-gray-400 hover:text-green-400 transition">Resources</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-green-400 transition">About Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Modules</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onModuleSelect?.(1)} className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">Business & Investment</button></li>
                <li><button onClick={() => onModuleSelect?.(5)} className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">Healthcare</button></li>
                <li><button onClick={() => onModuleSelect?.(2)} className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">Technology</button></li>
                <li><button onClick={() => onModuleSelect?.(7)} className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">Sports</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span className="text-sm">info@developing.africa</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="text-sm">+234 XXX XXX XXXX</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-400 text-sm">
                © 2024 Developing Africa Group. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <button className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">Privacy Policy</button>
                <button className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">Terms of Service</button>
                <button className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">Cookie Policy</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JapaWebsite;
