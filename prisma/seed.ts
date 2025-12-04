import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.englishTest.deleteMany();
  await prisma.application.deleteMany();
  await prisma.module.deleteMany();
  await prisma.adminActivity.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Module data in EXACT homepage order
  const moduleDataInOrder = [
    // 1. Business Plan & Investment
    { name: 'Business Plan & Investment', shortDesc: 'Launch your business internationally with guaranteed investment opportunities', fullDesc: 'This module is designed for entrepreneurs with solid business plans and the drive to expand internationally. We provide the capital, mentorship, and network to turn your ideas into profitable ventures.', description: 'For entrepreneurs with viable business plans seeking investment opportunities', icon: 'Briefcase', requirement: 'Business plan + $150,000 minimum investment', color: 'from-blue-500 to-blue-600', duration: '3-6 months', successRate: '92%', avgIncome: '$60,000+', benefits: JSON.stringify(['Access to $150,000-$500,000 investment capital', 'One-on-one mentorship from successful entrepreneurs', 'Networking with 500+ investors and business leaders', 'International market expansion support', 'Legal and tax consultation services', 'Marketing and branding strategy']), requirements: JSON.stringify(['Detailed business plan document', 'Financial projections (3-5 years)', 'Market analysis and competitor research', 'Team member resumes and experience', 'Proof of initial capital commitment', 'Business registration documents']), process: JSON.stringify([{ step: 1, title: 'Submit Application', desc: 'Fill out the application form with business details and investment requirements', duration: '1 week' }, { step: 2, title: 'Initial Review', desc: 'Our team reviews your plan and determines fit for the program', duration: '2 weeks' }, { step: 3, title: 'Investor Pitch', desc: 'Present your business to a panel of investors and mentors', duration: '1 week' }, { step: 4, title: 'Due Diligence', desc: 'Legal and financial verification of your business', duration: '2 weeks' }, { step: 5, title: 'Fund Disbursement', desc: 'Receive investment capital and begin execution', duration: '1 week' }]), testimonials: JSON.stringify([{ name: 'Chidi Okonkwo', location: 'Lagos, Nigeria', rating: 5, text: 'The investment and mentorship completely transformed my business. Within 8 months, we expanded to 3 countries and doubled our revenue.' }, { name: 'Amara Okafor', location: 'Abuja, Nigeria', rating: 5, text: 'Having access to experienced mentors and a network of 500+ investors was invaluable. They helped me avoid costly mistakes.' }]), faqs: JSON.stringify([{ q: 'How much investment can I get?', a: 'Investment amounts range from $150,000 to $500,000 based on your business needs and plan quality.' }, { q: 'Is this a loan or equity?', a: 'This is structured as equity investment. You retain majority ownership while we become strategic partners.' }, { q: 'How long is the program?', a: 'The entire process from application to fund disbursement takes 3-6 months depending on complexity.' }, { q: 'What if my business fails?', a: 'We provide business continuity support, pivoting strategies, and connection to rescue capital if needed.' }]), fields: JSON.stringify(['businessName', 'businessWebsite', 'businessPlan', 'investmentAmount']) },
    // 2. Technology Demand
    { name: 'Technology Demand', shortDesc: 'Connect your technology solutions with high-demand international markets', fullDesc: 'Technology companies are experiencing explosive growth in Africa and Asia. This module connects tech innovators with markets that desperately need their solutions, providing guaranteed customer pipelines.', description: 'For tech professionals seeking technology-driven opportunities', icon: 'Cpu', requirement: 'Proven technology solution or SaaS product', color: 'from-purple-500 to-purple-600', duration: '2-4 months', successRate: '89%', avgIncome: '$75,000+', benefits: JSON.stringify(['Direct access to enterprise clients worldwide', 'Product-market fit validation in 50+ markets', 'Go-to-market strategy and execution support', 'Technical integration and API support team', 'Revenue sharing model with guaranteed minimums', 'Press coverage and media visibility']), requirements: JSON.stringify(['Working technology solution or prototype', 'Documentation of features and capabilities', 'Proof of existing customer base (ideal but not mandatory)', 'Technical team with development capacity', 'Commitment to customer support and updates', 'Scalability roadmap for next 2 years']), process: JSON.stringify([{ step: 1, title: 'Product Evaluation', desc: 'Technical assessment of your solution and market viability', duration: '1 week' }, { step: 2, title: 'Market Validation', desc: 'Testing your product with 100+ potential customers globally', duration: '2 weeks' }, { step: 3, title: 'Customer Connection', desc: 'Direct introductions to enterprise clients and integrators', duration: '1 week' }, { step: 4, title: 'Revenue Launch', desc: 'Activate customer contracts and revenue sharing agreements', duration: '1 week' }, { step: 5, title: 'Scale Support', desc: 'Ongoing support to scale operations and expand market reach', duration: 'Ongoing' }]), testimonials: JSON.stringify([{ name: 'Nnamdi Ejiofor', location: 'Port Harcourt, Nigeria', rating: 5, text: 'Our SaaS product was developed for local market. Through this program, we now have customers in 15 countries generating $200K monthly.' }, { name: 'Zainab Hassan', location: 'Kano, Nigeria', rating: 5, text: 'The global customer pipeline they provided instantly validated our product. Within 3 months, we had recurring revenue.' }]), faqs: JSON.stringify([{ q: 'Do I need a fully finished product?', a: 'No, a working prototype or MVP is sufficient. We help refine it based on customer feedback.' }, { q: 'What\'s the revenue model?', a: 'We take 10-15% commission from sales we generate. You keep 85-90% and scale your business.' }, { q: 'What markets do you operate in?', a: 'We have active customer networks in Africa, Asia, Europe, and North America.' }, { q: 'How do you handle customer support?', a: 'You maintain direct customer relationships. We provide integration and success team support.' }]), fields: JSON.stringify(['sector', 'technologyNeed', 'technologyUsage']) },
    // 3. IPR Commercialization
    { name: 'IPR Commercialization', shortDesc: 'Turn your intellectual property into valuable revenue streams globally', fullDesc: 'Intellectual property is your most valuable asset. This module helps you identify, protect, and monetize patents, copyrights, and proprietary technologies to generate passive income worldwide.', description: 'For innovators with intellectual property ready for commercialization', icon: 'Lightbulb', requirement: 'Patented or protected intellectual property with market potential', color: 'from-yellow-500 to-yellow-600', duration: '2-5 months', successRate: '84%', avgIncome: '$50,000+', benefits: JSON.stringify(['Patent protection in 150+ countries', 'Licensing to Fortune 500 companies globally', 'Passive income from royalties worldwide', 'IP valuation and due diligence support', 'Technology transfer and collaboration platforms', 'Legal protection and enforcement support']), requirements: JSON.stringify(['Patent or provisional patent documentation', 'Technical specifications and innovation summary', 'Evidence of inventorship and ownership', 'Market analysis showing commercial potential', 'Willingness to license or sell technology', 'Basic business plan for IP monetization']), process: JSON.stringify([{ step: 1, title: 'IP Assessment', desc: 'Evaluate your patent and its commercial potential', duration: '1 week' }, { step: 2, title: 'Market Identification', desc: 'Identify industries and companies seeking your technology', duration: '2 weeks' }, { step: 3, title: 'Licensing Negotiations', desc: 'Connect with major companies interested in licensing', duration: '2 weeks' }, { step: 4, title: 'Deal Structuring', desc: 'Negotiate terms and royalty structures', duration: '1 week' }, { step: 5, title: 'Revenue Activation', desc: 'Begin receiving royalty payments from licensees', duration: 'Ongoing' }]), testimonials: JSON.stringify([{ name: 'Dr. Kwame Mensah', location: 'Kumasi, Ghana', rating: 5, text: 'I had a patent that seemed worthless. They connected me with a Fortune 500 company that paid $2M upfront and 3% royalties on all sales.' }, { name: 'Prof. Nneka Okafor', location: 'Lagos, Nigeria', rating: 5, text: 'My research patent is now generating $15K monthly in passive income from licensing deals with 5 companies globally.' }]), faqs: JSON.stringify([{ q: 'Do I need an existing patent?', a: 'A granted patent is ideal, but provisional patents and copyrights are also valuable and monetizable.' }, { q: 'How much can I earn from licensing?', a: 'Royalties typically range from 1-10% of licensee sales depending on the technology\'s importance to their business.' }, { q: 'Will I lose ownership of my IP?', a: 'No, licensing keeps you as IP owner. You\'re giving others permission to use it for a royalty fee.' }, { q: 'How long until I get first royalty payment?', a: 'After licensing deal is signed, royalties typically begin within 30-90 days depending on licensee production timeline.' }]), fields: JSON.stringify(['iprDescription', 'iprType', 'iprPlan']) },
    // 4. Technology Transfer
    { name: 'Technology Transfer', shortDesc: 'Acquire cutting-edge technology and scale your business exponentially', fullDesc: 'Don\'t build from scratch. Access proven technologies from research institutions and tech companies globally. This module accelerates your business growth by 10-20x through strategic technology partnerships.', description: 'For businesses seeking cutting-edge technology solutions', icon: 'Zap', requirement: 'Business operating for 2+ years with scalable model', color: 'from-green-500 to-green-600', duration: '2-4 months', successRate: '88%', avgIncome: '$70,000+', benefits: JSON.stringify(['Access to 1000+ university and research technologies', 'Implementation support from technology creators', 'Licensing flexibility with no long-term commitments', 'Technology integration with your existing systems', 'Training and certification programs included', 'Priority access to new technologies as they\'re developed']), requirements: JSON.stringify(['Business operating for minimum 2 years', 'Clear use case for specific technology', 'Adequate infrastructure for technology integration', 'Team with technical capability to implement', 'Financial capacity for licensing and implementation', 'Commitment to achieve technology-enabled growth targets']), process: JSON.stringify([{ step: 1, title: 'Technology Scouting', desc: 'Identify technologies matching your business needs from our database', duration: '1 week' }, { step: 2, title: 'Due Diligence', desc: 'Evaluate technology readiness, patents, and implementation requirements', duration: '1 week' }, { step: 3, title: 'Licensing Agreement', desc: 'Negotiate terms with technology creators or universities', duration: '1 week' }, { step: 4, title: 'Implementation', desc: 'Deploy technology with support from creators and integration team', duration: '2 weeks' }, { step: 5, title: 'Commercialization', desc: 'Launch technology-powered products and services to market', duration: 'Ongoing' }]), testimonials: JSON.stringify([{ name: 'Chinedu Amadi', location: 'Port Harcourt, Nigeria', rating: 5, text: 'We acquired an AI technology from MIT. Within 12 months, it became 40% of our revenue. Best decision ever.' }, { name: 'Folake Okonkwo', location: 'Lagos, Nigeria', rating: 5, text: 'The technology transfer process was smooth. The university creators trained our team personally. Now we\'re the market leader.' }]), faqs: JSON.stringify([{ q: 'Can I license multiple technologies?', a: 'Absolutely! Many of our partners license 2-5 complementary technologies for business transformation.' }, { q: 'Are licensing fees expensive?', a: 'Pricing is flexible based on technology type and your revenue. Many deals include revenue-sharing options.' }, { q: 'Will creators help implement?', a: 'Yes! Technology creators usually provide 3-6 months of implementation support and training.' }, { q: 'What if the technology doesn\'t work for my business?', a: 'Most agreements have pilot periods (30-90 days) to validate fit before full-scale licensing.' }]), fields: JSON.stringify(['sector', 'technologyNeeded', 'businessPlan']) },
    // 5. Healthcare
    { name: 'Healthcare', shortDesc: 'Transform healthcare innovation into profitable enterprises globally', fullDesc: 'Healthcare is a $12 trillion global market with critical shortages. This module supports medical professionals and innovators in scaling their solutions to reach millions of patients worldwide.', description: 'For healthcare professionals and medical innovators', icon: 'Heart', requirement: 'Valid medical qualification or healthcare innovation', color: 'from-red-500 to-red-600', duration: '4-8 months', successRate: '87%', avgIncome: '$80,000+', benefits: JSON.stringify(['Regulatory compliance support for 50+ countries', 'Partnership with major hospital networks globally', 'Medical device certification expedited processing', 'Partnership with pharmaceutical distributors worldwide', 'Clinical trial and validation support', 'Healthcare insurance provider partnerships']), requirements: JSON.stringify(['Medical degree or healthcare qualification', 'Evidence of innovation or service quality', 'Regulatory pathway planning', 'Clinical evidence or testimonials', 'Business model with scalability', 'Commitment to healthcare ethics and standards']), process: JSON.stringify([{ step: 1, title: 'Qualification Review', desc: 'Verify medical credentials and innovation quality', duration: '1 week' }, { step: 2, title: 'Regulatory Assessment', desc: 'Determine requirements for target markets', duration: '2 weeks' }, { step: 3, title: 'Clinical Validation', desc: 'Support for clinical trials or effectiveness studies', duration: '4 weeks' }, { step: 4, title: 'Market Connection', desc: 'Introductions to hospitals, clinics, and distributors', duration: '2 weeks' }, { step: 5, title: 'Launch and Scale', desc: 'Revenue generation and international expansion support', duration: 'Ongoing' }]), testimonials: JSON.stringify([{ name: 'Dr. Chioma Nwankwo', location: 'Lagos, Nigeria', rating: 5, text: 'My medical device innovation was stuck in regulatory limbo. This program connected me with compliance experts and within 6 months I had FDA approval.' }, { name: 'Dr. Emeka Eze', location: 'Accra, Ghana', rating: 5, text: 'The healthcare network connections were worth 100x the program cost. I now supply to 50+ hospitals across Africa.' }]), faqs: JSON.stringify([{ q: 'Do I need FDA approval to start?', a: 'No, we guide you through the regulatory journey. Many of our innovators get approval while generating revenue.' }, { q: 'What if my innovation is service-based not product?', a: 'Healthcare services are equally welcomed. Telemedicine, diagnostics, and specialized treatments have huge global demand.' }, { q: 'How do insurance partnerships work?', a: 'We connect you with insurance networks that will reimburse your service. This drastically increases patient access.' }, { q: 'Is there patient liability coverage?', a: 'Yes, we help set up proper liability insurance and compliance frameworks before you scale.' }]), fields: JSON.stringify(['medicalQualification', 'medicalInstitutions', 'medicalDevices', 'medicalDemand']) },
    // 6. International Visa & Residency (NOT Data Entry)
    { name: 'International Visa & Residency', shortDesc: 'Secure permanent residency and work visas in high-opportunity countries', fullDesc: 'Open doors to international opportunities with permanent residency and skilled worker visas. This module guides you through visa pathways in Canada, Australia, UAE, UK, and Singapore with guaranteed success rates.', description: 'For professionals seeking international opportunities and residency', icon: 'Plane', requirement: 'Professional qualification and minimum work experience', color: 'from-indigo-500 to-indigo-600', duration: '3-6 months', successRate: '91%', avgIncome: '$100,000+', benefits: JSON.stringify(['Visa application managed by immigration experts', 'Processing in Canada, Australia, UK, Singapore, UAE', 'Permanent residency pathways available', 'Job matching in your profession globally', 'Family sponsorship support included', 'Post-migration settlement and job placement']), requirements: JSON.stringify(['Bachelor\'s degree or professional qualification', 'Minimum 2 years relevant work experience', 'English language proficiency (IELTS/TOEFL)', 'Clean criminal record and health clearance', 'Financial proof of settlement ability', 'Valid international passport']), process: JSON.stringify([{ step: 1, title: 'Profile Assessment', desc: 'Evaluate your qualifications and determine visa eligibility', duration: '1 week' }, { step: 2, title: 'Country Selection', desc: 'Identify best countries matching your profession and goals', duration: '1 week' }, { step: 3, title: 'Application Preparation', desc: 'Complete all visa documentation and requirements', duration: '2 weeks' }, { step: 4, title: 'Submission & Processing', desc: 'Submit application and coordinate with immigration authorities', duration: '4 weeks' }, { step: 5, title: 'Approval & Settlement', desc: 'Receive visa approval and guidance for relocation', duration: '2 weeks' }]), testimonials: JSON.stringify([{ name: 'Adekunle Adebayo', location: 'Lagos, Nigeria', rating: 5, text: 'Got permanent residency in Canada within 5 months. Now earning CAD $120K annually with work permit leading to citizenship.' }, { name: 'Nnamdi Onyeka', location: 'Abuja, Nigeria', rating: 5, text: 'Moved to Australia on skilled migration visa. Within 2 years, got permanent residency. Best investment in my future.' }]), faqs: JSON.stringify([{ q: 'Which countries offer the easiest visas?', a: 'Canada (Express Entry), Australia (Skilled Migration), and UAE (Visa sponsorship via employers) have highest success rates.' }, { q: 'How long does the whole process take?', a: 'Typically 3-6 months from assessment to visa approval, depending on country and application complexity.' }, { q: 'Can I bring my family?', a: 'Yes! Most visa programs allow family sponsorship. Spouses and dependent children can migrate together.' }, { q: 'What if my visa is rejected?', a: 'We analyze rejection reasons and help you reapply. With our guidance, 91% of reapplications are successful.' }]), fields: JSON.stringify(['visaType', 'targetCountry', 'workExperience']) },
    // 7. Sports Entrepreneurship (NOT Visa again)
    { name: 'Sports Entrepreneurship', shortDesc: 'Build profitable sports businesses and coaching enterprises globally', fullDesc: 'The global sports industry is worth $500+ billion with growing opportunities. This module helps sports professionals, coaches, and innovators build million-dollar sports businesses worldwide.', description: 'For sports professionals seeking to build international sports enterprises', icon: 'Trophy', requirement: 'Sports qualification or professional experience', color: 'from-orange-500 to-orange-600', duration: '2-4 months', successRate: '86%', avgIncome: '$55,000+', benefits: JSON.stringify(['Access to 200+ sports franchises globally', 'Online coaching platform integration', 'Sports equipment and sponsorship partnerships', 'Athlete talent scouting network', 'Sports events and tournament organization support', 'Global sports media and broadcasting connections']), requirements: JSON.stringify(['Professional sports qualification or 5+ years experience', 'Proven track record in sports training or management', 'Business plan for sports enterprise', 'Basic sports facility or online platform', 'Commitment to athlete development', 'Professional sports certifications (ideal)']), process: JSON.stringify([{ step: 1, title: 'Qualification Verification', desc: 'Verify sports credentials and professional experience', duration: '1 week' }, { step: 2, title: 'Business Model Design', desc: 'Develop profitable sports enterprise structure', duration: '1 week' }, { step: 3, title: 'Platform Setup', desc: 'Setup coaching platform and athlete management systems', duration: '1 week' }, { step: 4, title: 'Client Connection', desc: 'Connect with franchises and athletes seeking services', duration: '1 week' }, { step: 5, title: 'Revenue Launch', desc: 'Begin generating income from coaching and franchising', duration: 'Ongoing' }]), testimonials: JSON.stringify([{ name: 'Taiwo Oluwaseun', location: 'Lagos, Nigeria', rating: 5, text: 'Launched online football coaching academy. Through global platform, now coaching players in 15 countries earning $8K monthly.' }, { name: 'Chioma Amadi', location: 'Abuja, Nigeria', rating: 5, text: 'Built sports management agency for athletes. Now representing 50+ players and earning 15% commission on their contracts.' }]), faqs: JSON.stringify([{ q: 'Can I coach online?', a: 'Yes! Online coaching is our fastest-growing segment. Set your own schedule and reach students globally.' }, { q: 'Do I need physical facility?', a: 'No, but it helps. Pure online coaching or hybrid models work equally well on our platform.' }, { q: 'What if I want to operate a franchise?', a: 'We have 200+ franchises available. We handle the business setup while you focus on sports excellence.' }, { q: 'How do I get paid?', a: 'We handle student/client payments. You receive 80-85% of coaching fees. Automatic weekly payouts.' }]), fields: JSON.stringify(['sportsType', 'targetLevel', 'coachingModel', 'availableTime']) },
    // 8. Data Entry (NOT Sports)
    { name: 'Data Entry', shortDesc: 'High-volume data entry with consistent income streams and growth opportunities', fullDesc: 'Data entry is a proven, scalable business model with predictable income. This module connects you with enterprise clients needing data processing services with volumes supporting 50-200 person teams.', description: 'For data processing professionals seeking scalable opportunities', icon: 'Database', requirement: 'Team of 10+ data entry professionals and basic processing infrastructure', color: 'from-teal-500 to-teal-600', duration: '1-3 months', successRate: '95%', avgIncome: '$40,000+', benefits: JSON.stringify(['Guaranteed minimum volume of 50,000+ entries/month', 'Payment guaranteed within 7 days of completion', 'Scalable from 10 to 500+ team members', 'Training and quality assurance framework', 'Advanced work allocation and tracking software', 'Automatic payment processing and invoicing']), requirements: JSON.stringify(['Team of at least 10 trained data entry professionals', 'Basic computer lab with internet connectivity', 'Quality assurance processes in place', 'Time tracking and productivity systems', 'Ability to handle 95%+ accuracy rates', 'Scalable office space or remote setup']), process: JSON.stringify([{ step: 1, title: 'Partner Onboarding', desc: 'Setup your account and receive training on client specifications', duration: '3 days' }, { step: 2, title: 'Team Configuration', desc: 'Configure your team members and allocate work assignments', duration: '1 week' }, { step: 3, title: 'Volume Activation', desc: 'Start receiving work from enterprise client pool', duration: '1 day' }, { step: 4, title: 'Performance Optimization', desc: 'Improve speed and accuracy with our training support', duration: 'Ongoing' }, { step: 5, title: 'Scaling Operations', desc: 'Expand to 100+ team members handling multiple clients', duration: 'Ongoing' }]), testimonials: JSON.stringify([{ name: 'Ibrahim Adamu', location: 'Kano, Nigeria', rating: 5, text: 'Started with 10 team members. Within 18 months, we scaled to 85 people and are generating consistent $4K+ monthly revenue.' }, { name: 'Blessing Oparaji', location: 'Enugu, Nigeria', rating: 5, text: 'The guaranteed payment and steady work volume allowed me to expand my team confidently without business risk.' }]), faqs: JSON.stringify([{ q: 'What types of data entry work is available?', a: 'Forms processing, document digitization, research data input, database maintenance, and specialized industry-specific entry.' }, { q: 'What accuracy rate is required?', a: 'Most clients require 95-99% accuracy. We provide tools and training to help you achieve these standards.' }, { q: 'Can I work remotely?', a: 'Yes! Remote teams are welcome. You just need reliable internet and monitoring systems for quality assurance.' }, { q: 'How do I get paid?', a: 'Payments are processed weekly or biweekly depending on client agreement. Direct bank transfer.' }]), fields: JSON.stringify(['teamSize', 'dataExperience', 'softwareTools', 'officeLocation']) },
    // 9. Raw Materials & Supply
    { name: 'Raw Materials & Supply', shortDesc: 'Source and supply raw materials globally with guaranteed contracts', fullDesc: 'Manufacturing companies need reliable raw material suppliers. This module connects producers with manufacturing contracts worth millions, enabling scalable supply business with minimal risk.', description: 'For producers and suppliers of raw materials', icon: 'Leaf', requirement: 'Raw material production or sourcing capacity', color: 'from-emerald-500 to-emerald-600', duration: '2-3 months', successRate: '90%', avgIncome: '$45,000+', benefits: JSON.stringify(['Direct contracts with Fortune 500 manufacturers', 'Volume guarantees of 10+ tons monthly', 'Premium pricing for consistent quality supply', 'Quality certification support', 'Logistics and export documentation assistance', 'Supply chain financing up to $500K']), requirements: JSON.stringify(['Raw material production or sourcing capability', 'Capacity to produce/supply 10+ tons monthly initially', 'Quality control and certification systems', 'Reliable transportation and logistics', 'Basic business registration and compliance', 'Scalability plan for 100+ tons monthly']), process: JSON.stringify([{ step: 1, title: 'Capacity Assessment', desc: 'Evaluate your production/sourcing capacity and quality', duration: '1 week' }, { step: 2, title: 'Certification', desc: 'Obtain quality certifications needed by manufacturers', duration: '2 weeks' }, { step: 3, title: 'Manufacturer Matching', desc: 'Connect with manufacturers needing your materials', duration: '1 week' }, { step: 4, title: 'Contract Negotiation', desc: 'Finalize supply contracts with price and volume terms', duration: '1 week' }, { step: 5, title: 'Revenue Supply', desc: 'Begin regular supply shipments and receive payments', duration: 'Ongoing' }]), testimonials: JSON.stringify([{ name: 'Hassan Adeyemi', location: 'Jos, Nigeria', rating: 5, text: 'Started supplying cocoa beans to international manufacturers. Now exporting 50 tons monthly earning $120K quarterly.' }, { name: 'Amina Kamal', location: 'Kano, Nigeria', rating: 5, text: 'My textile raw material supply business grew 10x through these manufacturer contracts. Stable, predictable income.' }]), faqs: JSON.stringify([{ q: 'What raw materials are in demand?', a: 'Agricultural products, metals, textiles, chemicals, plastics, and industrial minerals. Very diverse demand.' }, { q: 'Do I need export licenses?', a: 'Yes, we help you obtain all necessary licenses and comply with international trade regulations.' }, { q: 'How much investment is needed?', a: 'Depends on material type. Finance is available up to $500K to scale production if needed.' }, { q: 'What if quality doesn\'t meet standards?', a: 'We provide quality training and certification support. Our 90% success rate is based on meeting consistent quality.' }]), fields: JSON.stringify(['materialType', 'productionCapacity', 'qualityCertification', 'exportExperience']) },
  ];

  // Create modules sequentially in correct order
  const modules = [];
  for (const data of moduleDataInOrder) {
    const module = await prisma.module.create({ data });
    modules.push(module);
  }

  // Hash passwords for test users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123456', 10);
  const tempPassword = await bcrypt.hash('TempPassword123!', 10);

  // Seed test users
  const admin = await prisma.user.create({
    data: {
      userId: `USR-${Date.now().toString().slice(-6)}`,
      email: 'admin@dagjapa.com',
      password: adminPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
      phone: '+234123456789',
      education: 'MBA',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      userId: `USR-${(Date.now() + 1).toString().slice(-6)}`,
      email: 'user1@example.com',
      password: userPassword,
      fullName: 'John Doe',
      phone: '+234912345678',
      education: 'BSc Computer Science',
      description: 'Full-stack developer with 5 years experience',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      userId: `USR-${(Date.now() + 2).toString().slice(-6)}`,
      email: 'user2@example.com',
      password: userPassword,
      fullName: 'Jane Smith',
      phone: '+234987654321',
      education: 'MSc Business Administration',
      description: 'Entrepreneur interested in tech innovations',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      userId: 'USR-000001',
      email: 'user3@example.com',
      password: tempPassword,
      fullName: 'UN 3',
      phone: '+234901234567',
      education: 'Bachelor of Science',
      description: 'Test user for application submission',
    },
  });

  // Seed sample applications
  await prisma.application.create({
    data: {
      applicationId: 'APP-000001',
      userId: user1.id,
      moduleId: modules[1].id,
      status: 'PENDING',
      formData: JSON.stringify({
        sector: 'FinTech',
        technologyNeed: 'AI-powered fraud detection',
        technologyUsage: 'Integration with existing banking systems',
      }),
    },
  });

  await prisma.application.create({
    data: {
      applicationId: 'APP-000002',
      userId: user2.id,
      moduleId: modules[0].id,
      status: 'UNDER_REVIEW',
      reviewedBy: admin.id,
      formData: JSON.stringify({
        businessName: 'TechStart Nigeria',
        businessWebsite: 'https://techstart-ng.com',
        businessPlan: 'E-commerce platform for African SMEs',
        investmentAmount: '250000',
      }),
    },
  });

  await prisma.application.create({
    data: {
      applicationId: 'APP-603756',
      userId: user3.id,
      moduleId: modules[0].id,
      status: 'UNDER_REVIEW',
      formData: JSON.stringify({
        businessName: 'UN 3 Enterprise',
        businessWebsite: 'https://un3enterprise.com',
        businessPlan: 'Innovative business solution',
        investmentAmount: '500000',
      }),
    },
  });

  // Seed English test
  await prisma.englishTest.create({
    data: {
      userId: user1.id,
      score: 85,
      passed: true,
      completedAt: new Date(),
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Modules created in order:');
  modules.forEach((m) => {
    console.log(`  [ID: ${m.id}] ${m.name}`);
  });
  console.log('\n📝 Test Credentials:');
  console.log('Admin:');
  console.log('  Email: admin@dagjapa.com');
  console.log('  Password: admin123');
  console.log('\nUsers:');
  console.log('  Email: user1@example.com');
  console.log('  Password: user123456');
  console.log('  OR');
  console.log('  Email: user2@example.com');
  console.log('  Password: user123456');
  console.log('  OR');
  console.log('  Email: user3@example.com');
  console.log('  Password: TempPassword123!');
  console.log('  (App ID: APP-603756)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
