export interface IUserRepository {
  owner?: {
    avatar_url?: string;
    login?: string;
  };
  name?: string;
  description?: string;
}
