import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';

const handler = NextAuth({
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
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
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

export { handler as GET, handler as POST };
