const defaultFeedback: Feedback = {
  overallScore: 0,
  atsSpecific: {
    keywordDensity: 0,
    sectionStructure: 0,
    experienceRelevance: 0,
    formattingParsability: 0,
    actionVerbStrength: 0,
    passProbability: "Medium",
    riskFlags: []
  },
  fixItMode: [],
  persona: { type: "Experienced", description: "" },
  rejectionSimulation: [],
  intelligence: {
    passiveVoicePercentage: 0,
    quantificationScore: 0,
    leadershipScore: 0
  },
  heatmapZones: [],
  ATS: { score: 0, tips: [] },
  toneAndStyle: { score: 0, tips: [] },
  content: { score: 0, tips: [] },
  structure: { score: 0, tips: [] },
  skills: { score: 0, tips: [] }
};

export const resumes: Resume[] = [
  {
    id: "1",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: { ...defaultFeedback, overallScore: 85 },
  },
  {
    id: "2",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: { ...defaultFeedback, overallScore: 55 },
  }
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; // overall calculated score (0-100)
      atsSpecific: {
        keywordDensity: number; // 0-100
        sectionStructure: number; // 0-100
        experienceRelevance: number; // 0-100
        formattingParsability: number; // 0-100
        actionVerbStrength: number; // 0-100
        passProbability: "High" | "Medium" | "Low";
        riskFlags: string[]; // List potential ATS red flags
      };
      jobAlignment?: {
        matchingKeywords: string[];
        missingKeywords: string[];
        alignmentScore: number; // 0-100 matching resume to provided JD
        weakSections: string[];
      };
      fixItMode: {
        original: string;
        improved: string;
        reason: string;
      }[];
      persona: {
        type: "Fresher" | "Experienced" | "Career Switcher" | "Managerial";
        description: string;
      };
      rejectionSimulation: {
        reason: string;
        severity: "Critical" | "Major" | "Minor";
      }[];
      intelligence: {
        passiveVoicePercentage: number;
        quantificationScore: number;
        leadershipScore: number;
      };
      heatmapZones: {
        type: "risk" | "neutral" | "strength";
        label: string;
        explanation: string;
        top: number; // 0-100 percentage from top
        left: number; // 0-100 percentage from left
        width: number;
        height: number;
      }[];
      ATS: { score: number; tips: { type: "good" | "improve"; tip: string; }[]; };
      toneAndStyle: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
      content: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
      structure: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
      skills: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; }[]; };
    }`;

export const prepareInstructions = (jobDescription?: string, atsType: string = "Standard") =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis, specifically simulating the behavior of the ${atsType} ATS.
      Please analyze and rate this resume and suggest how to improve it.
      
      ${jobDescription
    ? `CRITICAL: Compare this resume against the following Job Description:\n${jobDescription}\nIdentify missing keywords and alignment gaps.`
    : "Analyze the resume as a general high-quality application for its target role."
  }

      Detect the persona (Fresher, Experienced, etc.) and adjust your strictness accordingly.
      Provide realistic "Fix It" suggestions for weak bullet points using high-impact, quantified language.
      
      Look for passive voice, lack of quantification, and leadership gaps.
      Simulate potential rejection reasons if it were processed by an actual ${atsType} ATS.

      Provide the feedback using the following format:
      ${AIResponseFormat}
      
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;
