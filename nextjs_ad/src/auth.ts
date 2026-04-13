import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        //call backend
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          body: {
            username: credentials.email,
            password: credentials.password,
          },
        });

        if (res.statusCode === 201) {
          return {
            id: res.data?.user._id,
            name: res.data?.user.name,
            email: res.data?.user.email,
            access_token: res.data?.access_token,
          };
        } else if (+res.statusCode === 400) {
          throw new InvalidEmailPasswordError();
        } else if (+res.statusCode === 401) {
          throw new InactiveAccountError();
        } else {
          throw new Error("Internal server");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = {
          _id: user.id,
          name: user.name!,
          email: user.email!,
          access_token: (user as any).access_token,
        } as IUser;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: token.user,
        access_token: token.access_token,
      };
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});
