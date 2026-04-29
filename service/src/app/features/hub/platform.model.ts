export interface Platform {
  name: string;
  icon: string;
  url: string;
  description: string;
  badge: 'live' | 'tool' | 'wip';
  audience: 'public' | 'internal';
  category?: string | null;
  auth_required?: boolean;
  listed?: boolean;
}
