SkillMap AI
│
├── Frontend (HTML + CSS + JS)          ← Antigravity builds this
│   ├── sidebar.html                    (nav, logo, tabs)
│   ├── career-match.html               (input + results)
│   ├── job-match.html                  (resume + JD scanner)
│   ├── skill-insights.html             (cluster chart + roadmap)
│   └── ml-engine.html                  (explanation page)
│
├── ML Logic (ml-engine.js)             ← Antigravity writes + tests this
│   ├── tokenize(text)
│   ├── normalize(tokens)              (synonym map)
│   ├── buildVector(tokens)            (TF-IDF style weights)
│   ├── cosineSimilarity(vecA, vecB)
│   ├── rankRoles(userVector)          (against 10 role templates)
│   ├── gapAnalysis(userVector, role)  (missing skill extraction)
│   └── resumeJobMatch(resume, jd)     (JD vs resume similarity)
│
├── Data Layer (data.js)               ← You write this once
│   ├── careerRoles[]                  (10 roles with skill weights)
│   ├── skillDictionary{}              (72 skills in 6 buckets)
│   └── synonymMap{}                   (40+ normalization rules)
│
└── Charts (chart.js CDN)              ← Antigravity integrates this
    └── clusterBarChart