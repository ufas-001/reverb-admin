import { BACKEND_URL
} from "@/lib/constant";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
 providers: [
   CredentialsProvider({
     name: "Credentials",
     credentials: {
       email: {label: "email", type: "text"},
       password: {label: "password", type: "password"}
   },
     async authorize(credentials, req) {
       if (!credentials?.email || !credentials?.password){
           throw new Error("Invalid Credentials")
       };
       const { email, password } = credentials;
       const res = await fetch(BACKEND_URL + "/auth/login", {
         method: "POST",
         body: JSON.stringify({
           username: email,
           password,
         }),
         headers: {
           "Content-Type": "application/json",
         },
       });
       if (res.status == 401) {
         throw Error("Invalid Credentials");
       }
       const user = await res.json();
       return user;
     },
   }),
 ],

 callbacks: {
   async jwt({ token, user }) {
     if (user) return { ...token, ...user };
     return token
   },

   async session({ token, session }) {
     session.user = token.user;
     session.backendTokens = token.backendTokens;

     return session;
   },
 },
 session: {
   strategy: "jwt",
},
 // Ensure you have a secret for JWT encryption
 secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };