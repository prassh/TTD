export interface DarshanCategory {
  waitTimeHours: number;
  compartmentsFilled?: number;
  crowdStatus?: "Normal" | "Moderate" | "Heavy" | "Very Heavy";
  status: string;
  statusDescription: string;
}

export interface DarshanStatusData {
  lastUpdated: string;
  source: string;
  darshan: {
    sarvadarsanam: DarshanCategory & { compartmentsFilled: number; crowdStatus: string };
    specialEntry: DarshanCategory & { slotStatus: "Open" | "Booked" | "Upcoming" };
    divyaDarshan: DarshanCategory & { status: "Active" | "Suspended" | "Limited" };
  };
  services: {
    kalyanakatta: {
      waitTimeHours: number;
      status: "Normal" | "Moderate" | "Heavy";
    };
    accommodation: {
      status: "Available" | "High Demand" | "Full";
      statusDescription: string;
    };
    laddu: {
      status: "Sufficient" | "Limited";
      statusDescription: string;
    };
  };
  stats: {
    yesterdayPilgrims: number;
    yesterdayHundiCrores: number;
    ladduDistributed: number;
  };
  recentAnnouncements: string[];
  isAiGenerated: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: { title: string; url: string }[];
}

export interface TrendDataPoint {
  time: string;
  sarvaWait: number;
  specialWait: number;
}
