export interface Platform {
  name: string;
  icon: string;
  url: string;
  description: string;
  badge: 'live' | 'tool' | 'wip';
}
