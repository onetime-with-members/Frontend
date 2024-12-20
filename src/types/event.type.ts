export interface EventType {
  title: string;
  start_time: string;
  end_time: string;
  category: 'DATE' | 'DAY';
  ranges: string[];
  event_status: 'CREATOR' | 'PARTICIPANT';
}

export interface EventValue {
  title: string;
  start_time: string;
  end_time: string;
  category: 'DATE' | 'DAY';
  ranges: string[];
}

export interface MyEvent {
  title: string;
  participant_count: number;
  created_date: string;
  event_id: string;
  category: 'DATE' | 'DAY';
  most_possible_times: {
    time_point: string;
    start_time: string;
    end_time: string;
  }[];
}
