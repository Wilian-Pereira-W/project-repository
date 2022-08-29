export interface IIssue {
  id: number;
  user: {
    avatar_url: string;
    login: string;
  };
  html_url: string;
  title: string;
  labels: {
    id: number;
    name: string;
  }[];
}
