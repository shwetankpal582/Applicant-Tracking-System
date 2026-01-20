interface Resume {
    id: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
    companyName?: string;
    jobTitle?: string;
    atsType?: string;
    jobDescription?: string;
    fileHash?: string;
    timestamp?: number;
}

interface Feedback {
    overallScore: number;
    atsSpecific: {
        keywordDensity: number;
        sectionStructure: number;
        experienceRelevance: number;
        formattingParsability: number;
        actionVerbStrength: number;
        passProbability: "High" | "Medium" | "Low";
        riskFlags: string[];
    };
    jobAlignment?: {
        matchingKeywords: string[];
        missingKeywords: string[];
        alignmentScore: number;
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
        top: number;
        left: number;
        width: number;
        height: number;
    }[];
    // Legacy support (to be phased out or updated)
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}

interface PuterUser {
    id: string;
    username: string;
    email: string;
}

interface FSItem {
    path: string;
    name: string;
    size: number;
    isDirectory: boolean;
}

interface KVItem {
    key: string;
    value: string;
}

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string | Array<{
        type: "text" | "file";
        text?: string;
        puter_path?: string;
    }>;
}

interface AIResponse {
    message: {
        content: string | Array<{
            text: string;
        }>;
    };
}

interface PuterChatOptions {
    model?: string;
    temperature?: number;
    max_tokens?: number;
}
