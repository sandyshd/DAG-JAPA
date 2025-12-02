// This file is deprecated - using NextAuth.js instead
// See lib/auth.ts for NextAuth configuration

export const getServerSession = async () => {
  throw new Error('Use NextAuth getServerSession instead');
};

export const getCurrentUser = async () => {
  throw new Error('Use NextAuth useSession hook instead');
};
