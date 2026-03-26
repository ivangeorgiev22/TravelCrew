export interface MemberData {
  id: number;
  name: string;
  email: string;
  TripMember: {
    role: string;
  };
}

export interface TripData {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  Users: MemberData[];
}
