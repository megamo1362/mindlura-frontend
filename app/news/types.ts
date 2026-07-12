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
