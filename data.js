// ============================================================
// SkillMap AI — Data Layer (data.js)
// 10 career roles with skill weights
// 72 skills in 6 buckets (clusters)
// 40+ synonym normalization rules
// ============================================================

// ── Skill Dictionary: 72 skills across 6 clusters ──────────
export const skillDictionary = {
  "Programming Languages": [
    "python", "javascript", "java", "c++", "c#", "typescript",
    "go", "rust", "ruby", "php", "swift", "kotlin"
  ],
  "Web Development": [
    "html", "css", "react", "angular", "vue", "node.js",
    "express", "django", "flask", "next.js", "tailwind", "bootstrap"
  ],
  "Data Science & ML": [
    "machine learning", "deep learning", "nlp", "pandas",
    "numpy", "scikit-learn", "tensorflow", "pytorch",
    "data visualization", "statistics", "r", "computer vision"
  ],
  "Cloud & DevOps": [
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd",
    "terraform", "linux", "git", "jenkins", "ansible", "nginx"
  ],
  "Databases": [
    "sql", "mongodb", "postgresql", "mysql", "redis",
    "firebase", "elasticsearch", "graphql", "oracle", "sqlite",
    "dynamodb", "cassandra"
  ],
  "Soft Skills & Tools": [
    "problem solving", "communication", "teamwork", "agile",
    "scrum", "jira", "figma", "leadership", "project management",
    "critical thinking", "time management", "presentation"
  ]
};

// ── Synonym Map: 40+ normalization rules ────────────────────
export const synonymMap = {
  // Programming Languages
  "js": "javascript",
  "ts": "typescript",
  "py": "python",
  "c sharp": "c#",
  "csharp": "c#",
  "cpp": "c++",
  "cplusplus": "c++",
  "golang": "go",
  "rb": "ruby",

  // Web Development
  "reactjs": "react",
  "react.js": "react",
  "angularjs": "angular",
  "angular.js": "angular",
  "vuejs": "vue",
  "vue.js": "vue",
  "nodejs": "node.js",
  "node": "node.js",
  "expressjs": "express",
  "express.js": "express",
  "nextjs": "next.js",
  "tailwindcss": "tailwind",
  "tailwind css": "tailwind",

  // Data Science & ML
  "ml": "machine learning",
  "dl": "deep learning",
  "natural language processing": "nlp",
  "sklearn": "scikit-learn",
  "scikit learn": "scikit-learn",
  "tf": "tensorflow",
  "torch": "pytorch",
  "data viz": "data visualization",
  "dataviz": "data visualization",
  "stats": "statistics",
  "cv": "computer vision",

  // Cloud & DevOps
  "amazon web services": "aws",
  "microsoft azure": "azure",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "k8s": "kubernetes",
  "cicd": "ci/cd",
  "ci cd": "ci/cd",
  "continuous integration": "ci/cd",

  // Databases
  "postgres": "postgresql",
  "mongo": "mongodb",
  "mongo db": "mongodb",
  "elastic search": "elasticsearch",
  "dynamo db": "dynamodb",
  "dynamo": "dynamodb",
  "gql": "graphql",

  // Soft Skills
  "pm": "project management",
  "team work": "teamwork",
  "problem-solving": "problem solving",
  "critical-thinking": "critical thinking",
  "time-management": "time management"
};

// ── Career Roles: 10 roles with weighted skill vectors ──────
// Each role has:
//   - name, description, cluster (primary domain)
//   - skills: { skillName: weight (0–1) }  — higher = more important
//   - icon: emoji for display
export const careerRoles = [
  {
    id: "frontend-dev",
    name: "Frontend Developer",
    icon: "🎨",
    cluster: "Web Development",
    description: "Build beautiful, responsive user interfaces and web experiences.",
    skills: {
      "javascript": 1.0, "html": 0.95, "css": 0.95, "react": 0.9,
      "typescript": 0.8, "vue": 0.6, "angular": 0.6, "next.js": 0.7,
      "tailwind": 0.65, "bootstrap": 0.5, "figma": 0.6, "git": 0.7,
      "node.js": 0.5, "problem solving": 0.6, "communication": 0.5,
      "agile": 0.5
    }
  },
  {
    id: "backend-dev",
    name: "Backend Developer",
    icon: "⚙️",
    cluster: "Web Development",
    description: "Design and build server-side logic, APIs, and databases.",
    skills: {
      "python": 0.8, "java": 0.8, "node.js": 0.9, "express": 0.85,
      "django": 0.7, "flask": 0.65, "sql": 0.9, "postgresql": 0.8,
      "mongodb": 0.75, "redis": 0.6, "docker": 0.7, "git": 0.8,
      "linux": 0.7, "ci/cd": 0.6, "problem solving": 0.7,
      "agile": 0.5
    }
  },
  {
    id: "fullstack-dev",
    name: "Full Stack Developer",
    icon: "🔄",
    cluster: "Web Development",
    description: "End-to-end web app development from UI to database.",
    skills: {
      "javascript": 0.95, "html": 0.85, "css": 0.85, "react": 0.85,
      "node.js": 0.9, "express": 0.8, "python": 0.6, "sql": 0.8,
      "mongodb": 0.75, "postgresql": 0.7, "git": 0.8, "docker": 0.6,
      "typescript": 0.7, "next.js": 0.65, "agile": 0.5,
      "problem solving": 0.65
    }
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    icon: "📊",
    cluster: "Data Science & ML",
    description: "Extract insights from data using statistics and machine learning.",
    skills: {
      "python": 1.0, "machine learning": 0.95, "statistics": 0.9,
      "pandas": 0.9, "numpy": 0.85, "scikit-learn": 0.85,
      "data visualization": 0.8, "sql": 0.75, "r": 0.6,
      "deep learning": 0.65, "tensorflow": 0.6, "nlp": 0.5,
      "problem solving": 0.8, "communication": 0.6,
      "critical thinking": 0.7
    }
  },
  {
    id: "ml-engineer",
    name: "ML Engineer",
    icon: "🤖",
    cluster: "Data Science & ML",
    description: "Build and deploy machine learning models at scale.",
    skills: {
      "python": 1.0, "machine learning": 1.0, "deep learning": 0.9,
      "tensorflow": 0.85, "pytorch": 0.85, "scikit-learn": 0.8,
      "docker": 0.75, "kubernetes": 0.6, "aws": 0.65,
      "pandas": 0.7, "numpy": 0.7, "sql": 0.6, "git": 0.7,
      "ci/cd": 0.55, "linux": 0.6, "problem solving": 0.8
    }
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    icon: "🚀",
    cluster: "Cloud & DevOps",
    description: "Automate deployments, manage infrastructure, and ensure reliability.",
    skills: {
      "docker": 1.0, "kubernetes": 0.95, "linux": 0.9, "aws": 0.9,
      "ci/cd": 0.95, "terraform": 0.85, "git": 0.85, "jenkins": 0.7,
      "ansible": 0.7, "python": 0.65, "nginx": 0.6, "azure": 0.6,
      "gcp": 0.55, "problem solving": 0.7, "agile": 0.5
    }
  },
  {
    id: "cloud-architect",
    name: "Cloud Architect",
    icon: "☁️",
    cluster: "Cloud & DevOps",
    description: "Design scalable cloud infrastructure and migration strategies.",
    skills: {
      "aws": 1.0, "azure": 0.85, "gcp": 0.8, "docker": 0.8,
      "kubernetes": 0.85, "terraform": 0.9, "linux": 0.75,
      "ci/cd": 0.7, "nginx": 0.55, "python": 0.5, "sql": 0.55,
      "leadership": 0.6, "communication": 0.65, "problem solving": 0.75,
      "project management": 0.6
    }
  },
  {
    id: "mobile-dev",
    name: "Mobile Developer",
    icon: "📱",
    cluster: "Programming Languages",
    description: "Build native and cross-platform mobile applications.",
    skills: {
      "kotlin": 0.9, "swift": 0.9, "javascript": 0.75, "react": 0.8,
      "typescript": 0.7, "firebase": 0.75, "git": 0.7, "figma": 0.6,
      "sql": 0.5, "java": 0.65, "html": 0.4, "css": 0.4,
      "agile": 0.5, "problem solving": 0.65, "teamwork": 0.5
    }
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Analyst",
    icon: "🔒",
    cluster: "Cloud & DevOps",
    description: "Protect systems and data from security threats and vulnerabilities.",
    skills: {
      "linux": 0.95, "python": 0.8, "networking": 0.9,
      "sql": 0.6, "docker": 0.5, "aws": 0.6, "git": 0.55,
      "problem solving": 0.9, "critical thinking": 0.85,
      "communication": 0.6, "c++": 0.4, "java": 0.4,
      "ci/cd": 0.4, "agile": 0.35
    }
  },
  {
    id: "product-manager",
    name: "Product Manager",
    icon: "📋",
    cluster: "Soft Skills & Tools",
    description: "Define product vision, strategy, and roadmap to deliver user value.",
    skills: {
      "project management": 1.0, "communication": 0.95,
      "leadership": 0.9, "agile": 0.9, "scrum": 0.85,
      "jira": 0.8, "figma": 0.7, "problem solving": 0.8,
      "critical thinking": 0.75, "teamwork": 0.8,
      "presentation": 0.75, "time management": 0.7,
      "sql": 0.4, "python": 0.3, "data visualization": 0.5
    }
  }
];

// ── Skill Quick-Add Chips (popular skills for fast input) ───
export const quickAddSkills = [
  "Python", "JavaScript", "React", "Node.js", "SQL",
  "Machine Learning", "Docker", "AWS", "Git", "HTML/CSS",
  "TypeScript", "Java", "MongoDB", "Figma", "Agile",
  "Deep Learning", "Kubernetes", "PostgreSQL", "C++", "TensorFlow"
];

// ── Learning Resources for Roadmap Generation ──────────────
export const learningResources = {
  "python": { url: "https://docs.python.org/3/tutorial/", est: "4 weeks" },
  "javascript": { url: "https://javascript.info/", est: "4 weeks" },
  "java": { url: "https://dev.java/learn/", est: "6 weeks" },
  "c++": { url: "https://www.learncpp.com/", est: "8 weeks" },
  "typescript": { url: "https://www.typescriptlang.org/docs/", est: "3 weeks" },
  "go": { url: "https://go.dev/tour/", est: "3 weeks" },
  "rust": { url: "https://doc.rust-lang.org/book/", est: "6 weeks" },
  "html": { url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", est: "2 weeks" },
  "css": { url: "https://developer.mozilla.org/en-US/docs/Learn/CSS", est: "3 weeks" },
  "react": { url: "https://react.dev/learn", est: "4 weeks" },
  "angular": { url: "https://angular.io/tutorial", est: "5 weeks" },
  "vue": { url: "https://vuejs.org/guide/", est: "3 weeks" },
  "node.js": { url: "https://nodejs.org/en/learn", est: "3 weeks" },
  "express": { url: "https://expressjs.com/en/starter/", est: "2 weeks" },
  "django": { url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/", est: "4 weeks" },
  "flask": { url: "https://flask.palletsprojects.com/en/latest/tutorial/", est: "2 weeks" },
  "next.js": { url: "https://nextjs.org/learn", est: "3 weeks" },
  "tailwind": { url: "https://tailwindcss.com/docs", est: "1 week" },
  "machine learning": { url: "https://www.coursera.org/learn/machine-learning", est: "8 weeks" },
  "deep learning": { url: "https://www.deeplearning.ai/", est: "10 weeks" },
  "nlp": { url: "https://huggingface.co/learn/nlp-course", est: "6 weeks" },
  "pandas": { url: "https://pandas.pydata.org/docs/getting_started/", est: "2 weeks" },
  "numpy": { url: "https://numpy.org/doc/stable/user/absolute_beginners.html", est: "1 week" },
  "scikit-learn": { url: "https://scikit-learn.org/stable/tutorial/", est: "4 weeks" },
  "tensorflow": { url: "https://www.tensorflow.org/tutorials", est: "6 weeks" },
  "pytorch": { url: "https://pytorch.org/tutorials/", est: "6 weeks" },
  "data visualization": { url: "https://www.d3-graph-gallery.com/", est: "3 weeks" },
  "statistics": { url: "https://www.khanacademy.org/math/statistics-probability", est: "4 weeks" },
  "aws": { url: "https://aws.amazon.com/getting-started/", est: "6 weeks" },
  "azure": { url: "https://learn.microsoft.com/en-us/azure/", est: "6 weeks" },
  "gcp": { url: "https://cloud.google.com/docs/get-started", est: "6 weeks" },
  "docker": { url: "https://docs.docker.com/get-started/", est: "2 weeks" },
  "kubernetes": { url: "https://kubernetes.io/docs/tutorials/", est: "4 weeks" },
  "ci/cd": { url: "https://docs.github.com/en/actions", est: "2 weeks" },
  "terraform": { url: "https://learn.hashicorp.com/terraform", est: "3 weeks" },
  "linux": { url: "https://linuxjourney.com/", est: "3 weeks" },
  "git": { url: "https://git-scm.com/book/en/v2", est: "1 week" },
  "sql": { url: "https://www.w3schools.com/sql/", est: "2 weeks" },
  "mongodb": { url: "https://university.mongodb.com/", est: "3 weeks" },
  "postgresql": { url: "https://www.postgresqltutorial.com/", est: "3 weeks" },
  "redis": { url: "https://redis.io/docs/getting-started/", est: "1 week" },
  "firebase": { url: "https://firebase.google.com/docs", est: "2 weeks" },
  "graphql": { url: "https://graphql.org/learn/", est: "2 weeks" },
  "figma": { url: "https://help.figma.com/hc/en-us/categories/", est: "2 weeks" },
  "agile": { url: "https://www.atlassian.com/agile", est: "1 week" },
  "scrum": { url: "https://www.scrum.org/resources/what-scrum-module", est: "1 week" },
  "kotlin": { url: "https://kotlinlang.org/docs/getting-started.html", est: "4 weeks" },
  "swift": { url: "https://docs.swift.org/swift-book/", est: "4 weeks" },
  "problem solving": { url: "https://leetcode.com/", est: "ongoing" },
  "communication": { url: "https://www.coursera.org/learn/wharton-communication", est: "3 weeks" },
  "leadership": { url: "https://www.coursera.org/specializations/leading-people-teams", est: "4 weeks" },
  "project management": { url: "https://www.coursera.org/professional-certificates/google-project-management", est: "6 weeks" },
  "computer vision": { url: "https://www.coursera.org/learn/convolutional-neural-networks", est: "5 weeks" },
  "r": { url: "https://www.r-project.org/other-docs.html", est: "4 weeks" },
  "critical thinking": { url: "https://www.coursera.org/learn/critical-thinking-skills", est: "3 weeks" }
};


