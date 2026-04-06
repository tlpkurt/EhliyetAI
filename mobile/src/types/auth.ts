export type AuthProvider = 'email' | 'google' | 'guest';

export type UserProfile = {
  fullName: string;
  email: string;
  city: string;
  licenseClass: string;
};

export type AuthUser = {
  id: string;
  provider: AuthProvider;
  profile: UserProfile;
};
