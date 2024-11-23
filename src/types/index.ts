export interface MongoDBId {
  $oid: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  provider: string;
  role: string;
  image: string;
  status: string;
  isEmailVerified: boolean;
}

export interface Example {
  _id?: string;
  dutch: string;
  turkish: string;
  level: string;
  source: string;
  words: string[];
  tags: string[];
  theme: string;
  status: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  level?: string;
  source?: string;
  status?: string;
}

export interface ExamplesFilters {
  levels: string[];
  sources: string[];
  statuses: string[];
}

export interface ExamplesResponse {
  data: Example[];
  total: number;
  filters: ExamplesFilters;
}

export interface ApiErrorResponse {
  error: string;
  status: number;
}

// For use in the ExamplesPanel component
export interface FilterState {
  level: string;
  source: string;
  status: string;
}

// For the DataTable props
export interface TableFilters {
  levels: string[];
  sources: string[];
  statuses: string[];
}

export interface Player {
  userId: string;
  name: string;
  level: number;
  score: number;
}

export interface ThemeDistribution {
  theme: number;
  questionCount: number;
}

export interface Joker {
  order: number;
  name: string;
  action: () => void;
  count: number;
  disabled: boolean;
  variant: "yellow" | "purple" | "lime" | "blue";
  animationVariant: "bubbly";
  icon: React.ReactNode;
}
