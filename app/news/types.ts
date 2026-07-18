export interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  datetime_utc: string;
  impact: 'High' | 'Medium' | 'Low' | 'Holiday' | string;
  forecast: string;
  previous: string;
  actual: string;
  is_released: boolean;
}

export interface AnalysisPair {
  pair: string;
  outlook: string;
  level: string;
}

export interface AnalysisScenario {
  probability: string;
  pairs: AnalysisPair[];
  insight: string;
}

export interface EventAnalysisContent {
  why_matters: string;
  bullish: AnalysisScenario;
  bearish: AnalysisScenario;
  key_insight: string;
}

export interface EventAnalysis {
  event: CalendarEvent;
  analysis: {
    en: EventAnalysisContent;
    fa: EventAnalysisContent;
  };
}

export interface ForexNewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: string;
  image: string;
  headline_fa?: string;
  summary_fa?: string;
}
