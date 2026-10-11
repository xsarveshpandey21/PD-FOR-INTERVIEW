"use client";

import { useState } from "react";
import { MessageSquare, Sparkles, RefreshCw, CheckCircle2, BookOpen, Users, Code, Lightbulb, HelpCircle, ArrowRight } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  category: string;
  sampleAnswer: string;
  keyTips: string[];
}

const DEFAULT_FLASHCARDS: Record<string, Flashcard[]> = {
  "Technical Concepts": [
    {
      id: "tc-1",
      category: "Technical Concepts",
      question: "Explain the difference between Process and Thread in Operating Systems.",
      sampleAnswer: "A process is an executing program instance with isolated memory space. A thread is a lightweight execution unit within a process that shares memory and resources with sibling threads.",
      keyTips: [
        "Mention memory isolation (Process = isolated, Thread = shared).",
        "Highlight context switching overhead (higher in processes, lower in threads).",
        "Give a practical example (e.g. Chrome browser tabs vs tab threads).",
      ],
    },
    {
      id: "tc-2",
      category: "Technical Concepts",
      question: "What is Database Normalization and why is it important?",
      sampleAnswer: "Normalization is the systematic process of organizing data in relational databases to reduce data redundancy and eliminate undesirable anomalies (insert, update, delete).",
      keyTips: [
        "Mention 1NF, 2NF, 3NF, BCNF briefly.",
        "Explain key goals: eliminate duplication, maintain data integrity.",
        "Contrast with Denormalization used in read-heavy data warehouses.",
      ],
    },
    {
      id: "tc-3",
      category: "Technical Concepts",
      question: "Explain the difference between Synchronous and Asynchronous execution.",
      sampleAnswer: "Synchronous execution executes tasks sequentially, blocking execution until each task completes. Asynchronous execution executes tasks concurrently in the background without blocking the main event thread.",
      keyTips: [
        "Synchronous is blocking; Asynchronous is non-blocking.",
        "Critical for high-throughput I/O operations and API requests.",
        "Implemented via async/await, Promises, or event callbacks.",
      ],
    },
    {
      id: "tc-4",
      category: "Technical Concepts",
      question: "What are the four core pillars of Object-Oriented Programming (OOP)?",
      sampleAnswer: "The four core pillars are Encapsulation (hiding state), Abstraction (hiding complexity), Inheritance (code reuse), and Polymorphism (multiple behaviors).",
      keyTips: [
        "Define all 4 pillars clearly with 1 sentence each.",
        "Give real-world analogies (e.g., Car interface vs Engine implementation).",
        "Highlight modularity and long-term code maintainability.",
      ],
    },
  ],
  "HR & Behavioral": [
    {
      id: "hr-1",
      category: "HR & Behavioral",
      question: "Tell me about a time you faced a tough conflict in a team project and how you resolved it.",
      sampleAnswer: "During our final year project, team members disagreed on choosing MongoDB vs PostgreSQL. I organized an objective evaluation matrix comparing latency, schema flexibility, and project deadlines, allowing us to reach a consensus on PostgreSQL.",
      keyTips: [
        "Use the STAR method: Situation, Task, Action, Result.",
        "Focus on professional communication rather than emotional arguments.",
        "Emphasize positive team outcome and delivered results.",
      ],
    },
    {
      id: "hr-2",
      category: "HR & Behavioral",
      question: "Where do you see yourself in 3 to 5 years?",
      sampleAnswer: "In 3-5 years, I envision myself as a Senior Full Stack Engineer taking technical ownership of critical modules, mentoring junior developers, and contributing to scalable cloud architecture.",
      keyTips: [
        "Align your personal growth with technical excellence and leadership.",
        "Avoid giving specific salary targets or unrelated career shifts.",
        "Demonstrate commitment to long-term skill development.",
      ],
    },
    {
      id: "hr-3",
      category: "HR & Behavioral",
      question: "What is your biggest weakness and how are you actively working to improve it?",
      sampleAnswer: "I used to struggle with delegating tasks because I wanted every detail perfect. I realized this bottlenecked the team, so I started breaking deliverables into transparent task ownership metrics and trusting my peers.",
      keyTips: [
        "Choose a real professional weakness, not a fake positive.",
        "Focus 70% of your answer on actionable steps taken to improve.",
        "Demonstrate self-awareness and a growth mindset.",
      ],
    },
    {
      id: "hr-4",
      category: "HR & Behavioral",
      question: "Why should our company hire you over other candidates?",
      sampleAnswer: "I bring a solid foundation in computer science core subjects, practical project experience with modern web technologies, and a proactive problem-solving attitude demonstrated through campus technical hackathons.",
      keyTips: [
        "Highlight the intersection of technical competence and work ethic.",
        "Show genuine enthusiasm for the company's domain and mission.",
        "Be confident without sounding arrogant.",
      ],
    },
  ],
  "Group Discussion Topics": [
    {
      id: "gd-1",
      category: "Group Discussion Topics",
      question: "Artificial Intelligence: Will AI replace software engineers or augment their productivity?",
      sampleAnswer: "AI acts as a force multiplier for developers by automating boilerplate code and repetitive debugging. However, strategic software architecture, domain modeling, security compliance, and human empathy remain irreplaceable human skills.",
      keyTips: [
        "Acknowledge both perspectives: automation efficiency vs complex human judgment.",
        "Use structured points: Productivity tools (Copilot), System Design, Security.",
        "Maintain a balanced, constructive tone during group discussions.",
      ],
    },
    {
      id: "gd-2",
      category: "Group Discussion Topics",
      question: "Remote Work vs Office Work: What is the ideal future of work culture?",
      sampleAnswer: "Hybrid work models offer the optimal balance by combining the focus and flexibility of remote work with the spontaneous collaboration, mentorship, and team bonding of in-office interaction.",
      keyTips: [
        "Discuss key metrics: productivity, work-life balance, company culture.",
        "Highlight pros and cons of both models objectively.",
        "Conclude with the rise of structured hybrid policies.",
      ],
    },
    {
      id: "gd-3",
      category: "Group Discussion Topics",
      question: "Ethical Considerations in Tech: Data Privacy and AI Algorithmic Bias",
      sampleAnswer: "As technological systems handle sensitive user data, engineers must prioritize data privacy by design, transparent algorithmic auditing, and strict compliance to prevent societal bias.",
      keyTips: [
        "Cover GDPR, data protection, and fairness in machine learning.",
        "Emphasize developer responsibility in building ethical software.",
        "Provide real-world examples like facial recognition or credit scoring algorithms.",
      ],
    },
    {
      id: "gd-4",
      category: "Group Discussion Topics",
      question: "Cashless Economy & Digital Payments: Advantages and Security Challenges",
      sampleAnswer: "Digital payment ecosystems drive financial inclusion, transaction speed, and audit transparency. However, they require robust cybersecurity against phishing, fraud, and network downtime.",
      keyTips: [
        "Highlight economic convenience, audit trails, and instant speed.",
        "Address cyber risks and digital literacy gaps.",
        "Mention UPI and fintech innovations in modern banking.",
      ],
    },
  ],
  "Branch-Specific Questions": [
    {
      id: "bs-1",
      category: "Branch-Specific Questions",
      question: "Explain the concept of RESTful API design principles and statelessness.",
      sampleAnswer: "REST (Representational State Transfer) is an architectural style utilizing standard HTTP methods (GET, POST, PUT, DELETE). Statelessness dictates that each client request contains all necessary data for execution without server session state.",
      keyTips: [
        "Mention standard HTTP verbs and status codes (200, 201, 400, 404, 500).",
        "Explain JSON resource representation.",
        "Highlight scalability benefits of stateless servers.",
      ],
    },
    {
      id: "bs-2",
      category: "Branch-Specific Questions",
      question: "What is the difference between SQL (Relational) and NoSQL (Non-Relational) Databases?",
      sampleAnswer: "SQL databases use structured schemas, ACID transactions, and tables (e.g. PostgreSQL). NoSQL databases offer dynamic schemas, horizontal scaling, and document/key-value models (e.g. MongoDB, Redis).",
      keyTips: [
        "Compare schema flexibility vs strict relational consistency.",
        "Discuss scaling: vertical (SQL) vs horizontal (NoSQL).",
        "Give use cases for both (banking transactions vs real-time analytics).",
      ],
    },
    {
      id: "bs-3",
      category: "Branch-Specific Questions",
      question: "How does Microservices Architecture compare to Monolithic Architecture?",
      sampleAnswer: "Monoliths deploy all features as a single unified application, simplifying initial build. Microservices decompose functionality into independent, decoupled services communicating via lightweight APIs.",
      keyTips: [
        "Monolith: simple initial deployment, tight coupling.",
        "Microservices: independent deployment, fault isolation, operational complexity.",
        "Explain when a team should transition from monolith to microservices.",
      ],
    },
    {
      id: "bs-4",
      category: "Branch-Specific Questions",
      question: "What is indexing in relational databases and how does it optimize query performance?",
      sampleAnswer: "An index is a B-Tree data structure that accelerates data retrieval operations on a table at the cost of additional disk storage and slower write operations during INSERT/UPDATE.",
      keyTips: [
        "Explain B-Tree search optimization vs full table scan.",
        "Mention read performance boost vs write overhead penalty.",
        "Discuss composite indices and indexing best practices.",
      ],
    },
  ],
};

export default function MockInterviewPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Technical Concepts");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>(DEFAULT_FLASHCARDS["Technical Concepts"]);
  
  // Track all questions displayed in current session to prevent repetitions
  const [seenQuestions, setSeenQuestions] = useState<Set<string>>(() => {
    const initialSeen = new Set<string>();
    Object.values(DEFAULT_FLASHCARDS).forEach((categoryList) => {
      categoryList.forEach((c) => initialSeen.add(c.question.trim().toLowerCase()));
    });
    return initialSeen;
  });

  const categories = [
    { name: "Technical Concepts", icon: Code, color: "text-amber-400 border-amber-500/40 bg-amber-950/40" },
    { name: "HR & Behavioral", icon: Users, color: "text-purple-400 border-purple-500/40 bg-purple-950/40" },
    { name: "Group Discussion Topics", icon: BookOpen, color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40" },
    { name: "Branch-Specific Questions", icon: Lightbulb, color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40" },
  ];

  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    setFlippedCards({});
    const categoryCards = DEFAULT_FLASHCARDS[catName] || DEFAULT_FLASHCARDS["Technical Concepts"];
    setCards(categoryCards);
    setSeenQuestions((prev) => {
      const updated = new Set(prev);
      categoryCards.forEach((c) => updated.add(c.question.trim().toLowerCase()));
      return updated;
    });
  };

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleGenerateNewSet = async () => {
    setIsGenerating(true);
    setFlippedCards({});
    try {
      const currentSeen = Array.from(seenQuestions);
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch: "CS",
          field: selectedCategory,
          count: 4,
          mode: "practice",
          excludeQuestions: currentSeen,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const newCards: Flashcard[] = data.questions.map((q: any, i: number) => ({
          id: q.id || `gen-${Date.now()}-${i}`,
          category: selectedCategory,
          question: q.questionText || q.question,
          sampleAnswer: q.sampleAnswer || (q.options ? `Correct Option: ${q.options[q.correctOptionIndex]}` : "Practice answering this question out loud!"),
          keyTips: Array.isArray(q.keyTips) ? q.keyTips : (q.explanation ? [q.explanation] : ["Structure your response clearly.", "State core principles."]),
        }));

        setCards(newCards);

        setSeenQuestions((prev) => {
          const updated = new Set(prev);
          newCards.forEach((c) => updated.add(c.question.trim().toLowerCase()));
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[140px]" />

      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-950/50 px-4 py-1 text-xs font-bold text-amber-300">
            <MessageSquare className="h-4 w-4 text-amber-400" />
            <span>Module 03 • Low-Pressure Practice Space</span>
          </div>
          <h1 className="text-3xl font-black text-white sm:text-4xl">Mock Interview Flashcards</h1>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Practice answer delivery at your own pace. Click any flashcard to flip and reveal expert sample answers & key tips!
          </p>
        </div>

        {/* Category Pills & Regenerate Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? cat.color + " shadow-lg"
                      : "bg-[#0e1726] border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleGenerateNewSet}
            disabled={isGenerating}
            className="inline-flex items-center space-x-2 rounded-xl border border-amber-500/40 bg-amber-950/60 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>Generate New Questions</span>
          </button>
        </div>

        {/* Flashcards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const isFlipped = !!flippedCards[card.id];
            return (
              <div
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="cursor-pointer group relative min-h-[280px] rounded-3xl border border-slate-800 bg-gradient-to-b from-[#141224]/90 to-[#0c0a17]/90 p-7 shadow-2xl hover:border-amber-500/50 hover:shadow-amber-500/10 transition-all backdrop-blur-xl flex flex-col justify-between"
              >
                {!isFlipped ? (
                  /* FRONT OF FLASHCARD */
                  <div className="space-y-4 my-auto">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-amber-950/80 border border-amber-500/30 px-3 py-0.5 text-[10px] font-bold text-amber-300">
                        {card.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
                        Click card to flip 🔄
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                        <HelpCircle className="h-4 w-4" />
                        <span>Question</span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-relaxed">
                        "{card.question}"
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-400 italic pt-2">
                      💡 Take a moment to articulate your answer out loud before flipping!
                    </p>
                  </div>
                ) : (
                  /* BACK OF FLASHCARD (SAMPLE ANSWER & TIPS) */
                  <div className="space-y-4 my-auto text-left">
                    <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                      <span className="text-xs font-bold text-purple-300 flex items-center space-x-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                        <span>Expert Answer Tips</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">Click to flip back</span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-200 leading-relaxed bg-purple-950/30 border border-purple-500/20 p-3 rounded-xl">
                        "{card.sampleAnswer}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400">Key Points to Highlight:</span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {card.keyTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-purple-400 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span>{isFlipped ? "Showing Sample Solution" : "Practice Mode"}</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                    <span>{isFlipped ? "Flip to Question" : "Reveal Answer"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
