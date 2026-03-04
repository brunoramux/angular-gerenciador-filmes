export interface IUserLoginSuccessResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
