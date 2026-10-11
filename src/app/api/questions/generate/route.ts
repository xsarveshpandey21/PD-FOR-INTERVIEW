import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

export interface MCQQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

// Extensive, multi-category question bank categorized by Year & Target Domain
const MASTER_QUESTION_BANK: Record<string, MCQQuestion[]> = {
  // --- 1st YEAR BASIC FUNDAMENTALS ---
  "1st Year": [
    {
      id: "yr1-1",
      questionText: "Which of the following data types in C typically occupies 4 bytes on modern 64-bit systems?",
      options: ["char", "int", "double", "short"],
      correctOptionIndex: 1,
      explanation: "On standard 64-bit architecture compilers, 'int' occupies 4 bytes (32 bits), 'char' 1 byte, 'short' 2 bytes, and 'double' 8 bytes.",
    },
    {
      id: "yr1-2",
      questionText: "What will be the result of integer division `7 / 2` in C/C++?",
      options: ["3.5", "3", "4", "3.0"],
      correctOptionIndex: 1,
      explanation: "Integer division truncates the decimal part, resulting in integer quotient 3.",
    },
    {
      id: "yr1-3",
      questionText: "Which of the following is an example of a secondary storage device?",
      options: ["RAM", "Cache Memory", "Solid State Drive (SSD)", "CPU Registers"],
      correctOptionIndex: 2,
      explanation: "SSDs are non-volatile secondary storage, whereas RAM, Cache, and Registers are volatile primary memory.",
    },
    {
      id: "yr1-4",
      questionText: "In Python, which function is used to convert a string representation of a number into an integer?",
      options: ["to_int()", "parseInteger()", "int()", "cast(int)"],
      correctOptionIndex: 2,
      explanation: "The built-in `int()` function converts compatible strings or floats to an integer in Python.",
    },
    {
      id: "yr1-5",
      questionText: "What does CPU stand for in computer systems?",
      options: [
        "Central Processing Unit",
        "Control Program Unit",
        "Computer Processing Union",
        "Central Performance Utility",
      ],
      correctOptionIndex: 0,
      explanation: "CPU stands for Central Processing Unit, the primary component executing instructions.",
    },
    {
      id: "yr1-6",
      questionText: "Which symbol is used for logical AND operator in C, C++, and Java?",
      options: ["&", "&&", "|", "||"],
      correctOptionIndex: 1,
      explanation: "`&&` is the logical AND operator, while `&` is the bitwise AND operator.",
    },
    {
      id: "yr1-7",
      questionText: "What is the primary function of an operating system's compiler?",
      options: [
        "Translates high-level source code into machine code",
        "Manages network IP addresses",
        "Executes HTML pages in a browser",
        "Cleans up temporary disk files",
      ],
      correctOptionIndex: 0,
      explanation: "Compilers translate human-readable source code into binary machine instructions executable by CPU.",
    },
    {
      id: "yr1-8",
      questionText: "In C++, which keyword is used to allocate memory dynamically on the heap?",
      options: ["malloc", "alloc", "new", "create"],
      correctOptionIndex: 2,
      explanation: "The `new` operator in C++ dynamically allocates memory for objects/variables on the heap.",
    },
    {
      id: "yr1-9",
      questionText: "What is the binary representation of the decimal number 13?",
      options: ["1100", "1101", "1011", "1110"],
      correctOptionIndex: 1,
      explanation: "13 in binary is 8 + 4 + 0 + 1 = 1101.",
    },
    {
      id: "yr1-10",
      questionText: "Which loop in programming is guaranteed to execute its body at least once?",
      options: ["for loop", "while loop", "do-while loop", "foreach loop"],
      correctOptionIndex: 2,
      explanation: "A `do-while` loop evaluates its termination condition at the bottom, ensuring at least one execution.",
    },
  ],

  // --- 2nd YEAR CORE COMPUTER SCIENCE ---
  "2nd Year": [
    {
      id: "yr2-1",
      questionText: "Which data structure is strictly required to implement Breadth-First Search (BFS) traversal on a graph?",
      options: ["Stack", "Queue", "Priority Queue", "Binary Search Tree"],
      correctOptionIndex: 1,
      explanation: "BFS explores graph nodes level-by-level using a FIFO Queue data structure.",
    },
    {
      id: "yr2-2",
      questionText: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST) containing N nodes?",
      options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
      correctOptionIndex: 2,
      explanation: "In a balanced BST, height is log₂N, making search time complexity O(log N).",
    },
    {
      id: "yr2-3",
      questionText: "In Object-Oriented Programming, what is Encapsulation?",
      options: [
        "Deriving a child class from a parent class",
        "Binding data members and methods together into a single unit (class)",
        "Overloading functions with different parameter types",
        "Hiding runtime exceptions behind try-catch blocks",
      ],
      correctOptionIndex: 1,
      explanation: "Encapsulation wraps data and methods into a unit while restricting direct external access to private fields.",
    },
    {
      id: "yr2-4",
      questionText: "Which SQL join returns all rows from the left table and matching rows from the right table?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correctOptionIndex: 1,
      explanation: "LEFT JOIN retains all left table rows, placing NULLs where right table matches are absent.",
    },
    {
      id: "yr2-5",
      questionText: "What is the primary characteristic of a Stack data structure?",
      options: ["FIFO (First In First Out)", "LIFO (Last In First Out)", "Random Access", "Priority Based Access"],
      correctOptionIndex: 1,
      explanation: "Stacks operate on LIFO principle (push and pop at top of stack).",
    },
    {
      id: "yr2-6",
      questionText: "In DBMS, which Normal Form eliminates transitive dependencies?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctOptionIndex: 2,
      explanation: "Third Normal Form (3NF) requires a table to be in 2NF with no non-prime attributes transitively dependent on candidate keys.",
    },
    {
      id: "yr2-7",
      questionText: "Which sorting algorithm has a best-case time complexity of O(N) when the input array is already sorted?",
      options: ["Quick Sort", "Merge Sort", "Bubble Sort (optimized)", "Selection Sort"],
      correctOptionIndex: 2,
      explanation: "Optimized Bubble Sort stops early if no swaps occur during a pass, yielding O(N) best case.",
    },
    {
      id: "yr2-8",
      questionText: "What is the worst-case space complexity of Recursive Depth-First Search (DFS) on a tree of depth H?",
      options: ["O(1)", "O(H)", "O(2^H)", "O(H log H)"],
      correctOptionIndex: 1,
      explanation: "The call stack memory footprint proportional to max recursion depth H gives O(H) space complexity.",
    },
    {
      id: "yr2-9",
      questionText: "Which JavaScript keyword declares a block-scoped variable that cannot be re-assigned?",
      options: ["var", "let", "const", "static"],
      correctOptionIndex: 2,
      explanation: "`const` declares block-scoped read-only references in modern JavaScript.",
    },
    {
      id: "yr2-10",
      questionText: "What is Method Overriding in Java / C++?",
      options: [
        "Defining multiple methods in the same class with identical names but different parameter lists",
        "Redefining a base class virtual method in a derived class with exact same signature",
        "Calling a function from inside another function recursively",
        "Converting one object reference type to another at compile time",
      ],
      correctOptionIndex: 1,
      explanation: "Overriding occurs when a child class provides a specialized implementation for a method declared in parent class.",
    },
  ],

  // --- 3rd YEAR ADVANCED DOMAIN SKILLS ---
  "Software Developer": [
    {
      id: "sd-1",
      questionText: "Which design pattern ensures a class has only one instance while providing a global point of access?",
      options: ["Factory Pattern", "Singleton Pattern", "Observer Pattern", "Adapter Pattern"],
      correctOptionIndex: 1,
      explanation: "Singleton pattern restricts instantiation to a single object instance across the application lifecycle.",
    },
    {
      id: "sd-2",
      questionText: "In RESTful API design, which HTTP verb should be used for idempotent full replacements of a resource?",
      options: ["POST", "PUT", "PATCH", "GET"],
      correctOptionIndex: 1,
      explanation: "PUT is idempotent and replaces the target resource representation in full.",
    },
    {
      id: "sd-3",
      questionText: "What is a major advantage of using Git rebase over Git merge?",
      options: [
        "It eliminates merge conflicts automatically",
        "It maintains a linear, clean commit history without extraneous merge commits",
        "It runs faster on large repositories",
        "It automatically deploys code to remote staging servers",
      ],
      correctOptionIndex: 1,
      explanation: "Git rebase reapplies commits on top of another base branch, creating a flat linear log.",
    },
    {
      id: "sd-4",
      questionText: "In relational database indexing, why are B-Trees preferred over Hash Indexes for general database queries?",
      options: [
        "Hash indexes use more storage space than B-Trees",
        "B-Trees efficiently support range queries (e.g. BETWEEN, >, <) and sorting",
        "Hash indexes do not support primary keys",
        "B-Trees lock fewer rows during write operations",
      ],
      correctOptionIndex: 1,
      explanation: "B-Trees keep data ordered, enabling O(log N) lookup and efficient range scanning.",
    },
    {
      id: "sd-5",
      questionText: "What is the primary difference between Process and Thread in Operating Systems?",
      options: [
        "Processes share memory, whereas Threads have completely isolated virtual memory",
        "Processes have isolated virtual address spaces, while Threads share address space within same process",
        "Threads cannot run concurrently on multi-core CPUs",
        "Processes have lower context-switching overhead than threads",
      ],
      correctOptionIndex: 1,
      explanation: "Processes operate in isolated memory spaces, whereas threads within a process share memory and heap.",
    },
    {
      id: "sd-6",
      questionText: "Which memory region stores local function variables, parameter values, and return addresses?",
      options: ["Heap", "Call Stack", "Data Segment", "BSS Segment"],
      correctOptionIndex: 1,
      explanation: "The Call Stack manages function stack frames containing local variables and return addresses.",
    },
    {
      id: "sd-7",
      questionText: "What does the SOLID principle 'Open/Closed Principle' state?",
      options: [
        "Software entities should be open for modification, closed for extension",
        "Software entities should be open for extension, but closed for modification",
        "Classes should have open public fields and closed private methods",
        "Database connections should open on demand and close automatically",
      ],
      correctOptionIndex: 1,
      explanation: "Open/Closed Principle specifies modules should allow extending behavior without altering existing source code.",
    },
    {
      id: "sd-8",
      questionText: "In Docker, what is the key difference between an Image and a Container?",
      options: [
        "An Image is a running process; a Container is a static blueprint file",
        "An Image is a static, read-only package blueprint; a Container is an isolated runnable instance of that image",
        "Containers run only on Linux, whereas Images run only on Windows",
        "Images store database data; Containers store application code",
      ],
      correctOptionIndex: 1,
      explanation: "An Image is a read-only template with application code and dependencies; a Container is a runtime execution instance.",
    },
  ],

  "Data Scientist": [
    {
      id: "ds-1",
      questionText: "Which machine learning evaluation metric is most suitable when dealing with highly imbalanced datasets?",
      options: ["Accuracy", "F1-Score / Area Under ROC Curve (AUC-ROC)", "Mean Squared Error", "R-Squared"],
      correctOptionIndex: 1,
      explanation: "Accuracy can be misleading on imbalanced classes; F1-score balances precision and recall effectively.",
    },
    {
      id: "ds-2",
      questionText: "What causes Overfitting in a Machine Learning model?",
      options: [
        "Model is too simple to capture underlying patterns",
        "Model learns training data noise and random details instead of generalizable patterns",
        "Training data size is too large",
        "Learning rate hyperparameter is set too small",
      ],
      correctOptionIndex: 1,
      explanation: "Overfitting occurs when high model complexity causes fitting to noise, leading to high variance on test sets.",
    },
    {
      id: "ds-3",
      questionText: "In Random Forest classifiers, what technique is used to create diverse individual decision trees?",
      options: ["Gradient Boosting", "Bootstrap Aggregating (Bagging) & Random Feature Selection", "L1 Regularization", "Principal Component Analysis"],
      correctOptionIndex: 1,
      explanation: "Random Forest builds trees on bootstrapped data samples with random subsets of features per split.",
    },
    {
      id: "ds-4",
      questionText: "Which algorithm is commonly used for unsupervised dimensionality reduction while preserving maximum data variance?",
      options: ["K-Means Clustering", "Principal Component Analysis (PCA)", "Linear Regression", "Naive Bayes"],
      correctOptionIndex: 1,
      explanation: "PCA projects high-dimensional data onto orthogonal principal components maximizing variance.",
    },
  ],

  "Data Analyst": [
    {
      id: "da-1",
      questionText: "Which SQL aggregate function computes the statistical middle value of an ordered numerical dataset?",
      options: ["AVG()", "MEDIAN() / PERCENTILE_CONT(0.5)", "MODE()", "SUM()"],
      correctOptionIndex: 1,
      explanation: "Median identifies the exact 50th percentile midpoint in ordered distribution, unlike AVG which calculates mean.",
    },
    {
      id: "da-2",
      questionText: "In PowerBI or Tableau, what is the primary purpose of a Data Model dimension table?",
      options: [
        "Stores numerical metrics and transactional facts",
        "Contains descriptive attributes used for slicing, filtering, and grouping fact data",
        "Executes background ETL scripts",
        "Stores user authorization security rules",
      ],
      correctOptionIndex: 1,
      explanation: "Dimension tables hold contextual attributes (e.g. Customer, Date, Product) to slice fact table quantitative values.",
    },
  ],

  "Cybersecurity": [
    {
      id: "sec-1",
      questionText: "What type of attack involves injecting malicious SQL commands into input fields to bypass authentication or extract database contents?",
      options: ["Cross-Site Scripting (XSS)", "SQL Injection (SQLi)", "Man-in-the-Middle (MitM)", "Distributed Denial of Service (DDoS)"],
      correctOptionIndex: 1,
      explanation: "SQLi manipulates backend SQL queries by inserting unvalidated payload strings into user inputs.",
    },
    {
      id: "sec-2",
      questionText: "Which cryptographic algorithm is asymmetric (uses a keypair of public and private keys)?",
      options: ["AES-256", "RSA", "DES", "Blowfish"],
      correctOptionIndex: 1,
      explanation: "RSA uses asymmetric key pairs (public for encryption, private for decryption), whereas AES and DES are symmetric.",
    },
  ],

  "4th Year": [
    {
      id: "yr4-1",
      questionText: "According to the CAP Theorem for distributed systems, which two properties can a distributed database guarantee simultaneously during a network partition?",
      options: [
        "Consistency and Availability (CP or AP)",
        "Consistency and Performance",
        "Availability and Latency",
        "Partition Tolerance and Zero Storage Overhead",
      ],
      correctOptionIndex: 0,
      explanation: "During a network Partition (P), distributed systems must trade off between Consistency (C) or Availability (A).",
    },
    {
      id: "yr4-2",
      questionText: "Which caching strategy writes updated data to the cache first and asynchronously updates the database in the background?",
      options: ["Cache-Aside", "Write-Through", "Write-Behind (Write-Back)", "Read-Through"],
      correctOptionIndex: 2,
      explanation: "Write-Behind acknowledges writes immediately after writing to cache, flushing updates to disk asynchronously.",
    },
    {
      id: "yr4-3",
      questionText: "What is Database Sharding?",
      options: [
        "Replicating read-only copies of database across multiple regions",
        "Horizontally partitioning large tables across multiple database server instances",
        "Compressing old rows into cold optical storage",
        "Creating indexes on foreign key columns",
      ],
      correctOptionIndex: 1,
      explanation: "Sharding splits data horizontally across independent servers by a partition/shard key to scale write capacity.",
    },
    {
      id: "yr4-4",
      questionText: "In a microservices architecture, what is the main responsibility of an API Gateway?",
      options: [
        "Compiling frontend assets into static files",
        "Acting as a reverse proxy to route client requests, enforce rate limiting, handle authentication, and SSL termination",
        "Executing heavy background database backups",
        "Running local Docker daemons on developer laptops",
      ],
      correctOptionIndex: 1,
      explanation: "API Gateways sit between clients and microservices to centralize routing, security, metrics, and rate limiting.",
    },
  ],
};

// Dynamic Parametric Question Generator: Produces fresh, non-repeating dynamic questions algorithmically
function generateParametricQuestions(
  year: string,
  field: string,
  targetCount: number,
  excludeSet: Set<string>
): MCQQuestion[] {
  const generated: MCQQuestion[] = [];
  const seedStamp = Date.now();

  const concepts = [
    {
      topic: "Time Complexity Analysis",
      templates: [
        (val: number) => ({
          questionText: `What is the tightest worst-case time complexity of an algorithm performing nested loops where outer loop runs ${val} times and inner loop runs log₂(N) times?`,
          options: [`O(N)`, `O(${val} log N)`, `O(N²)`, `O(${val}N)`],
          correctOptionIndex: 1,
          explanation: `Outer loop fixed iteration of ${val} multiplied by inner loop log(N) gives O(${val} log N) which simplifies asymptotically.`,
        }),
        (val: number) => ({
          questionText: `A linear search algorithm is performed on an unsorted array of size ${val * 100} elements. What is the maximum number of comparisons required in the worst-case scenario?`,
          options: [`${val * 50}`, `${val * 100 - 1}`, `${val * 100}`, `log₂(${val * 100})`],
          correctOptionIndex: 2,
          explanation: `In the worst case of linear search, the target element is at the last index or absent, requiring exactly N (${val * 100}) comparisons.`,
        }),
      ],
    },
    {
      topic: "Memory & Data Structures",
      templates: [
        (val: number) => ({
          questionText: `Given a 2D array Matrix[${val}][${val}] of 32-bit integers stored in row-major order starting at base address 1000, what is the byte offset of element Matrix[${Math.floor(val / 2)}][${Math.floor(val / 2)}]?`,
          options: [
            `${(Math.floor(val / 2) * val + Math.floor(val / 2)) * 4}`,
            `${(Math.floor(val / 2) * val) * 4}`,
            `${(val * val) * 4}`,
            `${Math.floor(val / 2) * 4}`,
          ],
          correctOptionIndex: 0,
          explanation: `Row-major index formula: (i * COLS + j) * size = (${Math.floor(val / 2)} * ${val} + ${Math.floor(val / 2)}) * 4 bytes.`,
        }),
        (val: number) => ({
          questionText: `A Circular Queue of capacity ${val * 5} elements currently has front index at ${val} and rear index at ${(val + 3) % (val * 5)}. How many elements are currently stored in the queue?`,
          options: [`3`, `4`, `${val}`, `${val * 2}`],
          correctOptionIndex: 1,
          explanation: `Formula for circular queue size: (rear - front + capacity) % capacity + 1 = 4 elements.`,
        }),
      ],
    },
    {
      topic: "Database & SQL Operations",
      templates: [
        (val: number) => ({
          questionText: `Consider a database table 'Employees' with ${val * 50} rows. If a query with 'WHERE salary > ${val * 1000}' matches ${val * 10} rows, how many rows will be returned by 'SELECT DISTINCT department_id FROM Employees WHERE salary > ${val * 1000}' if there are 5 unique departments?`,
          options: [`At most 5`, `Exactly ${val * 10}`, `${val * 50}`, `0`],
          correctOptionIndex: 0,
          explanation: `The DISTINCT keyword removes duplicates across returned records; since only 5 unique departments exist, output can contain at most 5 rows.`,
        }),
        (val: number) => ({
          questionText: `In a relational database transaction executing under ISOLATION LEVEL 'READ COMMITTED', which concurrency anomaly is prevented?`,
          options: ["Dirty Read", "Non-Repeatable Read", "Phantom Read", "Serialization Anomaly"],
          correctOptionIndex: 0,
          explanation: "READ COMMITTED prevents Dirty Reads by ensuring queries only read uncommitted data written by active transactions.",
        }),
      ],
    },
    {
      topic: "Web & Networking Concepts",
      templates: [
        (val: number) => ({
          questionText: `An HTTP response header contains 'Cache-Control: max-age=${val * 3600}'. How many hours will a client browser consider the cached resource fresh?`,
          options: [`${val} hour(s)`, `${val * 60} hour(s)`, `${val * 3600} hour(s)`, `Indefinitely`],
          correctOptionIndex: 0,
          explanation: `max-age specifies freshness lifetime in seconds. ${val * 3600} seconds divided by 3600 seconds/hour equals ${val} hour(s).`,
        }),
        (val: number) => ({
          questionText: `Which TCP port is the standard default port for secure HTTPS traffic communication?`,
          options: ["80", "443", "8080", "22"],
          correctOptionIndex: 1,
          explanation: "HTTPS defaults to port 443, whereas unencrypted HTTP uses port 80 and SSH uses port 22.",
        }),
      ],
    },
  ];

  let iteration = 1;
  while (generated.length < targetCount && iteration <= 50) {
    for (const group of concepts) {
      for (const tpl of group.templates) {
        if (generated.length >= targetCount) break;
        const paramVal = (iteration * 3 + generated.length + 2) % 17 + 2;
        const qObj = tpl(paramVal);
        const qTextClean = qObj.questionText.trim().toLowerCase();

        if (!excludeSet.has(qTextClean)) {
          excludeSet.add(qTextClean);
          generated.push({
            id: `dyn-param-${seedStamp}-${iteration}-${generated.length}`,
            questionText: qObj.questionText,
            options: qObj.options,
            correctOptionIndex: qObj.correctOptionIndex,
            explanation: qObj.explanation,
          });
        }
      }
    }
    iteration++;
  }

  return generated;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      branch,
      field,
      year,
      count = 10,
      studentIdentifier = "",
      email = "",
      rollNumber = "",
      phone = "",
      mode = "technical",
      excludeQuestions = [],
    } = body;

    const targetCount = Number(count) || 10;
    const cleanBranch = String(branch || "CS").trim();
    const cleanField = String(field || "Software Developer").trim();
    const cleanYear = String(year || "3rd Year").trim();

    // Collect all candidate identifiers to ensure strict cross-attempt deduplication
    const identifiers = Array.from(
      new Set(
        [studentIdentifier, email, rollNumber, phone]
          .map((id) => String(id || "").trim().toLowerCase())
          .filter(Boolean)
      )
    );

    const clientExcluded = Array.isArray(excludeQuestions)
      ? excludeQuestions.map((q: any) => String(q).trim().toLowerCase())
      : [];

    const isFlashcardMode = mode === "practice" || mode === "flashcard";

    // 1. Fetch all past answered question texts across QuestionHistory, TechnicalAttempt, and ScheduledAttempt
    const historyQuestions: string[] = [];

    if (identifiers.length > 0) {
      try {
        // Query QuestionHistory table
        const historyRecords = await prisma.questionHistory.findMany({
          where: {
            studentIdentifier: { in: identifiers },
          },
          select: { questionText: true },
        });
        historyRecords.forEach((h) => {
          if (h.questionText) historyQuestions.push(h.questionText.trim().toLowerCase());
        });

        // Query TechnicalAttempt table
        const techAttempts = await prisma.technicalAttempt.findMany({
          where: {
            OR: [
              { email: { in: identifiers } },
              { rollNumber: { in: identifiers } },
              { phone: { in: identifiers } },
            ],
          },
          select: { questionsJson: true },
        });

        techAttempts.forEach((att) => {
          try {
            const qList = JSON.parse(att.questionsJson);
            if (Array.isArray(qList)) {
              qList.forEach((q: any) => {
                if (q.questionText) historyQuestions.push(String(q.questionText).trim().toLowerCase());
              });
            }
          } catch (e) {}
        });

        // Query ScheduledAttempt table
        const schedAttempts = await prisma.scheduledAttempt.findMany({
          where: {
            OR: [
              { email: { in: identifiers } },
              { rollNumber: { in: identifiers } },
              { phone: { in: identifiers } },
            ],
          },
          select: { questionsJson: true },
        });

        schedAttempts.forEach((att) => {
          try {
            const qList = JSON.parse(att.questionsJson);
            if (Array.isArray(qList)) {
              qList.forEach((q: any) => {
                if (q.questionText) historyQuestions.push(String(q.questionText).trim().toLowerCase());
              });
            }
          } catch (e) {}
        });
      } catch (dbErr) {
        console.warn("Database lookup for past student questions encountered a minor issue, continuing:", dbErr);
      }
    }

    const allExcludedSet = new Set<string>([...clientExcluded, ...historyQuestions]);
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let finalQuestions: MCQQuestion[] = [];
    let responseSource = "dynamic-engine";

    // 2. Try Gemini AI Generation if Key is Provided
    if (apiKey && apiKey.startsWith("AIzaSy")) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const historyArray = Array.from(allExcludedSet);
        const historyNotice = historyArray.length > 0
          ? `CRITICAL REQUIREMENT: Candidate has ALREADY answered these questions in past attempts. Do NOT repeat any of these question texts:\n${historyArray.slice(0, 40).map((q) => `- "${q}"`).join("\n")}`
          : "";

        const yearPromptInfo = `CANDIDATE YEAR: ${cleanYear}. TARGET DOMAIN: "${cleanField}" (Branch: ${cleanBranch}).`;

        const prompt = `You are a Senior Technical Interview Examiner for Engineering Placements.
${yearPromptInfo}

Generate EXACTLY ${targetCount} DISTINCT, UNSEEN multiple-choice questions (MCQs) specially crafted for a ${cleanYear} student targeting a "${cleanField}" role.
${historyNotice}

Requirements:
1. Return ONLY a valid JSON array of objects with no markdown formatting.
2. Each object must have:
   - "questionText": Clear technical question string.
   - "options": Array of 4 distinct string choices.
   - "correctOptionIndex": Integer index (0, 1, 2, or 3) of correct option.
   - "explanation": Brief 1-2 sentence solution explanation.

JSON Schema:
[
  {
    "questionText": "Question text?",
    "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
    "correctOptionIndex": 0,
    "explanation": "Explanation here"
  }
]`;

        const result = await model.generateContent(prompt);
        let rawText = result.response.text().trim();
        if (rawText.startsWith("```")) {
          rawText = rawText.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "").trim();
        }
        const parsed = JSON.parse(rawText);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const validGenerated = parsed
            .filter(
              (q: any) =>
                q &&
                q.questionText &&
                Array.isArray(q.options) &&
                q.options.length === 4 &&
                !allExcludedSet.has(String(q.questionText).trim().toLowerCase())
            )
            .map((q: any, idx: number) => ({
              id: `gemini-${Date.now()}-${idx}`,
              questionText: String(q.questionText).trim(),
              options: q.options.map(String),
              correctOptionIndex: Number(q.correctOptionIndex) || 0,
              explanation: String(q.explanation || "Detailed solution explanation."),
            }));

          if (validGenerated.length >= targetCount) {
            finalQuestions = validGenerated.slice(0, targetCount);
            responseSource = "gemini-ai";
          }
        }
      } catch (geminiErr: any) {
        console.warn("Gemini AI generation note (falling back to built-in non-repeating question engine):", geminiErr.message || geminiErr);
      }
    }

    // 3. Fallback / Core Dynamic Question Engine (Guarantees 100% Non-Repeating Questions)
    if (finalQuestions.length < targetCount) {
      // Gather pool candidate questions from MASTER_QUESTION_BANK
      const pool: MCQQuestion[] = [];

      // Collect domain specific questions first
      if (MASTER_QUESTION_BANK[cleanField]) {
        pool.push(...MASTER_QUESTION_BANK[cleanField]);
      }
      // Collect year specific questions
      if (MASTER_QUESTION_BANK[cleanYear]) {
        pool.push(...MASTER_QUESTION_BANK[cleanYear]);
      }
      // Collect 2nd/3rd/1st year general questions
      if (MASTER_QUESTION_BANK["2nd Year"]) pool.push(...MASTER_QUESTION_BANK["2nd Year"]);
      if (MASTER_QUESTION_BANK["1st Year"]) pool.push(...MASTER_QUESTION_BANK["1st Year"]);
      if (MASTER_QUESTION_BANK["4th Year"]) pool.push(...MASTER_QUESTION_BANK["4th Year"]);

      // Filter out questions already answered by the student
      const unseenBank = pool.filter(
        (q) => !allExcludedSet.has(q.questionText.trim().toLowerCase())
      );

      // Deduplicate by question text
      const seenText = new Set<string>();
      const uniqueUnseen: MCQQuestion[] = [];
      for (const item of unseenBank) {
        const norm = item.questionText.trim().toLowerCase();
        if (!seenText.has(norm)) {
          seenText.add(norm);
          uniqueUnseen.push(item);
        }
      }

      // Add unique unseen questions from bank to final list
      for (const item of uniqueUnseen) {
        if (finalQuestions.length >= targetCount) break;
        allExcludedSet.add(item.questionText.trim().toLowerCase());
        finalQuestions.push({
          ...item,
          id: `bank-${Date.now()}-${finalQuestions.length}`,
        });
      }

      // If still need more questions to hit targetCount (e.g. 10), fill dynamically using Parametric Generator
      if (finalQuestions.length < targetCount) {
        const fillNeeded = targetCount - finalQuestions.length;
        const parametricQuestions = generateParametricQuestions(
          cleanYear,
          cleanField,
          fillNeeded,
          allExcludedSet
        );
        finalQuestions.push(...parametricQuestions);
      }
    }

    // Ensure exact count
    finalQuestions = finalQuestions.slice(0, targetCount);

    // 4. Immediately record these generated questions to QuestionHistory for all student identifiers
    if (identifiers.length > 0 && finalQuestions.length > 0) {
      try {
        const recordsToInsert: { studentIdentifier: string; questionText: string }[] = [];
        for (const idStr of identifiers) {
          for (const q of finalQuestions) {
            recordsToInsert.push({
              studentIdentifier: idStr,
              questionText: q.questionText.trim(),
            });
          }
        }

        await prisma.questionHistory.createMany({
          data: recordsToInsert,
        });
      } catch (saveErr) {
        // Silently handle duplicate key collisions
      }
    }

    return NextResponse.json({
      questions: finalQuestions,
      source: responseSource,
      count: finalQuestions.length,
      adaptiveYear: cleanYear,
      domain: cleanField,
    });
  } catch (error: any) {
    console.error("Question generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate test questions." },
      { status: 500 }
    );
  }
}
