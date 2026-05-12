// ============================================================
// SkillMap AI — ML Engine (ml-engine.js)
// tokenize · normalize · buildVector · cosineSimilarity
// rankRoles · gapAnalysis · resumeJobMatch
// ============================================================

import { skillDictionary, synonymMap, careerRoles, learningResources } from './data.js';

export const MLEngine = (() => {

  // ── Tokenize: split text into individual skill tokens ─────
  function tokenize(text) {
    if (!text || typeof text !== 'string') return [];

    // Lowercase and clean
    let cleaned = text.toLowerCase();

    // Replace common separators with commas
    cleaned = cleaned.replace(/[;\n\r\t|•·–—]/g, ',');

    // Preserve multi-word skills by checking known skills first
    const allSkills = [];
    Object.values(skillDictionary).forEach(skills => {
      skills.forEach(s => allSkills.push(s));
    });
    // Add synonym keys
    Object.keys(synonymMap).forEach(s => allSkills.push(s));

    // Sort by length (longest first) to match multi-word skills first
    allSkills.sort((a, b) => b.length - a.length);

    const foundSkills = [];
    let remaining = cleaned;

    // First pass: extract known multi-word skills
    allSkills.forEach(skill => {
      const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'gi');
      if (regex.test(remaining)) {
        foundSkills.push(skill.toLowerCase());
        remaining = remaining.replace(regex, ' ');
      }
    });

    // Second pass: split remaining and keep only recognized single-word skills
    const allSkillsSet = new Set(allSkills.map(s => s.toLowerCase()));
    const synKeys = new Set(Object.keys(synonymMap).map(s => s.toLowerCase()));
    const extraTokens = remaining
      .split(/[,\s]+/)
      .map(t => t.replace(/[^a-z0-9#+\/.]/g, '').trim())
      .filter(t => t.length > 1 && (allSkillsSet.has(t) || synKeys.has(t)));

    return [...new Set([...foundSkills, ...extraTokens])];
  }

  // ── Escape regex special characters ───────────────────────
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ── Normalize: apply synonym map to tokens ────────────────
  function normalize(tokens) {
    if (!Array.isArray(tokens)) return [];
    return [...new Set(tokens.map(token => {
      const lower = token.toLowerCase().trim();
      return synonymMap[lower] || lower;
    }))];
  }

  // ── Build Vector: create TF-IDF style weighted vector ─────
  // Returns an object: { skill: weight }
  // Weight is based on:
  //   1. Whether the skill is in our dictionary (boosted)
  //   2. IDF approximation based on how many roles use the skill
  function buildVector(tokens) {
    const vector = {};
    const normalizedTokens = normalize(tokens);

    // Build IDF: how many roles contain each skill
    const docFreq = {};
    const totalRoles = careerRoles.length;

    careerRoles.forEach(role => {
      Object.keys(role.skills).forEach(skill => {
        docFreq[skill] = (docFreq[skill] || 0) + 1;
      });
    });

    normalizedTokens.forEach(token => {
      // Check if this token is a known skill
      let isKnown = false;
      Object.values(skillDictionary).forEach(skills => {
        if (skills.includes(token)) isKnown = true;
      });

      // TF is 1 (binary presence)
      // IDF = log(totalRoles / (1 + docFreq))
      const idf = Math.log((totalRoles + 1) / (1 + (docFreq[token] || 0)));
      const weight = isKnown ? (1.0 * idf) : (0.3 * idf); // Reduce unknown tokens

      vector[token] = Math.max(weight, 0.1); // Minimum weight
    });

    return vector;
  }

  // ── Cosine Similarity: compute similarity between vectors ─
  function cosineSimilarity(vecA, vecB) {
    const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    allKeys.forEach(key => {
      const a = vecA[key] || 0;
      const b = vecB[key] || 0;
      dotProduct += a * b;
      magA += a * a;
      magB += b * b;
    });

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (magA * magB);
  }

  // ── Rank Roles: compare user vector against all role templates
  function rankRoles(userVector) {
    const results = careerRoles.map(role => {
      const roleVector = role.skills;
      const similarity = cosineSimilarity(userVector, roleVector);

      // Find matched and missing skills
      const userSkills = Object.keys(userVector);
      const roleSkills = Object.keys(roleVector);

      const matched = userSkills.filter(s => roleSkills.includes(s));
      const missing = roleSkills
        .filter(s => !userSkills.includes(s))
        .sort((a, b) => (roleVector[b] || 0) - (roleVector[a] || 0));

      // Calculate coverage percentage
      const totalRoleWeight = Object.values(roleVector).reduce((s, v) => s + v, 0);
      const matchedWeight = matched.reduce((s, skill) => s + (roleVector[skill] || 0), 0);
      const coverage = totalRoleWeight > 0 ? (matchedWeight / totalRoleWeight) : 0;

      return {
        role: role,
        score: Math.round(similarity * 100),
        coverage: Math.round(coverage * 100),
        matchedSkills: matched,
        missingSkills: missing,
        matchedCount: matched.length,
        totalSkills: roleSkills.length
      };
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    return results;
  }

  // ── Gap Analysis: detailed skill gap for a specific role ──
  function gapAnalysis(userVector, role) {
    const roleSkills = role.skills;
    const userSkills = Object.keys(userVector);
    const roleSkillNames = Object.keys(roleSkills);

    // Categorize skills
    const matched = [];
    const missing = [];
    const extra = [];

    roleSkillNames.forEach(skill => {
      if (userSkills.includes(skill)) {
        matched.push({
          skill: skill,
          importance: roleSkills[skill],
          level: roleSkills[skill] >= 0.8 ? 'Critical' :
                 roleSkills[skill] >= 0.6 ? 'Important' : 'Nice to Have'
        });
      } else {
        missing.push({
          skill: skill,
          importance: roleSkills[skill],
          level: roleSkills[skill] >= 0.8 ? 'Critical' :
                 roleSkills[skill] >= 0.6 ? 'Important' : 'Nice to Have',
          resource: learningResources[skill] || null
        });
      }
    });

    userSkills.forEach(skill => {
      if (!roleSkillNames.includes(skill)) {
        extra.push({ skill: skill, weight: userVector[skill] });
      }
    });

    // Sort missing by importance (highest first)
    missing.sort((a, b) => b.importance - a.importance);

    // Generate learning roadmap
    const roadmap = generateRoadmap(missing, role);

    return {
      roleName: role.name,
      roleIcon: role.icon,
      matched,
      missing,
      extra,
      roadmap,
      coveragePercent: Math.round(
        (matched.length / roleSkillNames.length) * 100
      )
    };
  }

  // ── Generate Learning Roadmap ─────────────────────────────
  function generateRoadmap(missingSkills, role) {
    const phases = [];

    // Phase 1: Critical skills (weight >= 0.8)
    const critical = missingSkills.filter(s => s.importance >= 0.8);
    if (critical.length > 0) {
      phases.push({
        phase: 1,
        title: "Foundation — Critical Skills",
        duration: estimateDuration(critical),
        skills: critical.map(s => ({
          name: s.skill,
          importance: s.importance,
          resource: s.resource
        }))
      });
    }

    // Phase 2: Important skills (0.6 <= weight < 0.8)
    const important = missingSkills.filter(s => s.importance >= 0.6 && s.importance < 0.8);
    if (important.length > 0) {
      phases.push({
        phase: phases.length + 1,
        title: "Growth — Important Skills",
        duration: estimateDuration(important),
        skills: important.map(s => ({
          name: s.skill,
          importance: s.importance,
          resource: s.resource
        }))
      });
    }

    // Phase 3: Nice-to-have skills (weight < 0.6)
    const niceToHave = missingSkills.filter(s => s.importance < 0.6);
    if (niceToHave.length > 0) {
      phases.push({
        phase: phases.length + 1,
        title: "Polish — Nice-to-Have Skills",
        duration: estimateDuration(niceToHave),
        skills: niceToHave.map(s => ({
          name: s.skill,
          importance: s.importance,
          resource: s.resource
        }))
      });
    }

    return phases;
  }

  // ── Estimate total duration for a set of skills ───────────
  function estimateDuration(skills) {
    let totalWeeks = 0;
    skills.forEach(s => {
      const resource = s.resource || learningResources[s.skill];
      if (resource && resource.est) {
        const weeks = parseInt(resource.est) || 2;
        totalWeeks += weeks;
      } else {
        totalWeeks += 2; // default
      }
    });
    return `~${totalWeeks} weeks`;
  }

  // ── Check if a token is a known skill ─────────────────────
  function isKnownSkill(token) {
    for (const skills of Object.values(skillDictionary)) {
      if (skills.includes(token)) return true;
    }
    return false;
  }

  // ── Resume ↔ Job Description Match ────────────────────────
  function resumeJobMatch(resumeText, jdText) {
    // Tokenize, normalize, and filter to known skills only
    const resumeTokens = normalize(tokenize(resumeText)).filter(isKnownSkill);
    const jdTokens = normalize(tokenize(jdText)).filter(isKnownSkill);

    // Build vectors
    const resumeVector = {};
    resumeTokens.forEach(t => { resumeVector[t] = 1; });

    const jdVector = {};
    jdTokens.forEach(t => { jdVector[t] = 1; });

    // Cosine similarity
    const similarity = cosineSimilarity(resumeVector, jdVector);

    // Keyword analysis
    const matchedKeywords = jdTokens.filter(t => resumeTokens.includes(t));
    const missingKeywords = jdTokens.filter(t => !resumeTokens.includes(t));
    const extraKeywords = resumeTokens.filter(t => !jdTokens.includes(t));

    // Categorize missing keywords by cluster
    const missingByCluster = {};
    missingKeywords.forEach(keyword => {
      let cluster = "Other";
      Object.entries(skillDictionary).forEach(([clusterName, skills]) => {
        if (skills.includes(keyword)) cluster = clusterName;
      });
      if (!missingByCluster[cluster]) missingByCluster[cluster] = [];
      missingByCluster[cluster].push(keyword);
    });

    // Generate improvement suggestions
    const suggestions = generateSuggestions(matchedKeywords, missingKeywords, jdTokens, resumeTokens);

    return {
      score: Math.round(similarity * 100),
      matchedKeywords,
      missingKeywords,
      extraKeywords,
      missingByCluster,
      suggestions,
      totalJDSkills: jdTokens.length,
      totalResumeSkills: resumeTokens.length,
      overlapCount: matchedKeywords.length,
      coveragePercent: jdTokens.length > 0
        ? Math.round((matchedKeywords.length / jdTokens.length) * 100)
        : 0
    };
  }

  // ── Generate Resume Improvement Suggestions ───────────────
  function generateSuggestions(matched, missing, jdTokens, resumeTokens) {
    const suggestions = [];

    // Critical missing skills (ones common in roles)
    const criticalMissing = missing.filter(skill => {
      let importance = 0;
      careerRoles.forEach(role => {
        if (role.skills[skill]) importance = Math.max(importance, role.skills[skill]);
      });
      return importance >= 0.7;
    });

    if (criticalMissing.length > 0) {
      suggestions.push({
        type: "critical",
        icon: "🚨",
        title: "Add High-Impact Skills",
        description: `Your resume is missing ${criticalMissing.length} critical skill(s) from the job description.`,
        actions: criticalMissing.slice(0, 5).map(skill =>
          `Add "${capitalize(skill)}" to your skills section with a specific project or experience where you used it.`
        )
      });
    }

    // Skills to highlight better
    if (matched.length > 0 && matched.length < jdTokens.length * 0.5) {
      suggestions.push({
        type: "improve",
        icon: "✨",
        title: "Strengthen Matched Skills",
        description: "You have some matching skills but could emphasize them more.",
        actions: matched.slice(0, 3).map(skill =>
          `Quantify your experience with "${capitalize(skill)}" — e.g., "Built 3 projects using ${capitalize(skill)}" or "2 years of ${capitalize(skill)} experience."`
        )
      });
    }

    // Format suggestions
    if (missing.length > matched.length) {
      suggestions.push({
        type: "format",
        icon: "📝",
        title: "Restructure Your Resume",
        description: "Consider reorganizing your resume to better match this job.",
        actions: [
          "Create a 'Technical Skills' section at the top listing all relevant technologies.",
          "Use the exact terminology from the job description where applicable.",
          "Add a 'Projects' section highlighting work related to the role's key requirements."
        ]
      });
    }

    // General tips
    const coverage = jdTokens.length > 0 ? matched.length / jdTokens.length : 0;
    if (coverage < 0.3) {
      suggestions.push({
        type: "warning",
        icon: "⚠️",
        title: "Low Match — Consider Upskilling",
        description: `Your resume covers only ${Math.round(coverage * 100)}% of the job requirements.`,
        actions: [
          "Focus on learning the top 3 missing skills before applying.",
          "Consider taking online courses or building projects with these technologies.",
          "Look for entry-level or adjacent roles that better match your current skill set."
        ]
      });
    } else if (coverage >= 0.7) {
      suggestions.push({
        type: "success",
        icon: "🎯",
        title: "Strong Match!",
        description: `Your resume covers ${Math.round(coverage * 100)}% of the requirements — great alignment.`,
        actions: [
          "Focus your cover letter on the matched skills and specific achievements.",
          "Prepare to discuss your experience with each matched skill in interviews.",
          "Consider adding any missing skills to push your match even higher."
        ]
      });
    }

    return suggestions;
  }

  // ── Analyze Full Profile (convenience wrapper) ────────────
  function analyzeProfile(text) {
    const tokens = tokenize(text);
    const normalized = normalize(tokens);
    const vector = buildVector(tokens);
    const ranked = rankRoles(vector);

    // Get detailed gap analysis for top role
    const topGap = ranked.length > 0
      ? gapAnalysis(vector, ranked[0].role)
      : null;

    // Cluster coverage
    const clusterCoverage = getClusterCoverage(normalized);

    return {
      tokens,
      normalized,
      vector,
      ranked,
      topMatch: ranked[0] || null,
      gapAnalysis: topGap,
      clusterCoverage,
      totalSkillsDetected: normalized.length
    };
  }

  // ── Get Cluster Coverage ──────────────────────────────────
  function getClusterCoverage(normalizedSkills) {
    const coverage = {};

    Object.entries(skillDictionary).forEach(([cluster, skills]) => {
      const matched = skills.filter(s => normalizedSkills.includes(s));
      coverage[cluster] = {
        total: skills.length,
        matched: matched.length,
        percent: Math.round((matched.length / skills.length) * 100),
        matchedSkills: matched,
        missingSkills: skills.filter(s => !normalizedSkills.includes(s))
      };
    });

    return coverage;
  }

  // ── Capitalize helper ─────────────────────────────────────
  function capitalize(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // ── Public API ────────────────────────────────────────────
  return {
    tokenize,
    normalize,
    buildVector,
    cosineSimilarity,
    rankRoles,
    gapAnalysis,
    resumeJobMatch,
    analyzeProfile,
    getClusterCoverage,
    capitalize
  };

})();
