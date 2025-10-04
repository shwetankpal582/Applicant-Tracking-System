interface Resume {
    id: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
    companyName?: string;
    jobTitle?: string;
}

interface Feedback {
    overallScore: number;
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
