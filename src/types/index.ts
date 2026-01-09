export interface LandingScreenData {
    myNickname: string;
    gender: string;
    partnerName: string;
    relationship: string;
    worryContent: string;
    sessionId?: string;
}

export interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}
