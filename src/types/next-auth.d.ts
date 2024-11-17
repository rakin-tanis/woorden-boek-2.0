import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      role?: string;
      image?: string;
      name?: string;
      status?: string;
      isEmailVerified: boolean;
    };
  }

  interface User {
    id?: string;
    email?: string;
    role?: string;
    image?: string;
    name?: string;
    status?: string;
    isEmailVerified: boolean;
  }
}
