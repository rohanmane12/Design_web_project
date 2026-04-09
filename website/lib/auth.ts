import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import { getReadableAuthError } from './auth-errors';
import Admin from '@/models/Admin';
import { assertRateLimit, buildRateLimitKey, getClientIp } from './rate-limit';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const ipAddress = getClientIp(request.headers);
          const rateLimitKey = buildRateLimitKey('admin-login', credentials.email, ipAddress);
          const rateLimitResult = assertRateLimit(rateLimitKey, 5, 5 * 60 * 1000);

          if (!rateLimitResult.allowed) {
            throw new Error('Too many login attempts. Please try again later.');
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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '';

          if (
            errorMessage.includes('querySrv') ||
            errorMessage.includes('ECONNREFUSED') ||
            errorMessage.includes('ENOTFOUND') ||
            errorMessage.includes('MongoServerSelectionError')
          ) {
            throw new Error('Database connection error. Please try again later.');
          }

          throw new Error(getReadableAuthError(errorMessage));
        }
      }
    })
  ],
  pages: {
    signIn: '/en/admin/login',
    error: '/en/admin/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
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
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
};
