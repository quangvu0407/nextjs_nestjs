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
          url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          body: {
            username: credentials.email,
            password: credentials.password,
          },
        });

        if (res.statusCode === 200 || res.statusCode === 201) {
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
        // Decode access_token để lấy exp
        const accessToken = (user as any).access_token as string;
        const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
        token.user = {
          _id: user.id,
          name: user.name!,
          email: user.email!,
          access_token: accessToken,
        } as IUser;
        token.access_expire = payload.exp * 1000; // convert to ms
      }

      // Token hết hạn → đánh dấu error
      if (Date.now() > (token.access_expire as number)) {
        token.error = "TokenExpired";
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: token.user,
        error: token.error,
      };
    },
    authorized: async ({ auth, request }) => {
      if (!auth) return false;
      // Nếu token hết hạn, redirect về login
      if ((auth as any).error === "TokenExpired") {
        const loginUrl = new URL("/auth/login", request.url);
        return Response.redirect(loginUrl);
      }
      return true;
    },
  },
});
