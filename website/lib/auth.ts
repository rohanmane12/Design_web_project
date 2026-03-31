import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import Admin from '@/models/Admin';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();
        const admin = await Admin.findOne({ email: credentials.email });
        
        if (!admin) {
          throw new Error('Invalid email or password');
        }
        
        const isValid = await bcrypt.compare(credentials.password as string, admin.passwordHash);
        
        if (!isValid) {
          throw new Error('Invalid email or password');
        }
        
        return {
          id: admin._id.toString(),
          email: admin.email,
          role: admin.role,
          name: admin.email
        };
      }
    })
  ],
  pages: { 
    signIn: '/en/admin/login',
    error: '/en/admin/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'admin';
        token.email = user.email as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
});
