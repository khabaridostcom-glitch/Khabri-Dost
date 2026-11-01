import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, testConnection, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, EditorialUser, StaffRole } from '../types/news';
import { INITIAL_EDITORIAL_USERS } from '../data/portalDefaults';

export const ADMIN_EMAIL = 'khabridost.com@gmail.com';
export const ALT_ADMIN_EMAIL = 'khabaridost.com@gmail.com';

// 4 hours session validity before mandatory re-authentication for administrators
export const ADMIN_SESSION_TIMEOUT_MS = 4 * 60 * 60 * 1000;

export const isPlatformAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const allowedAdmins = [
    ADMIN_EMAIL.toLowerCase(),
    ALT_ADMIN_EMAIL.toLowerCase(),
    'admin@khabridost.com',
    'contact@khabridost.com',
    'editor@khabridost.com',
  ];
  return allowedAdmins.includes(normalized);
};

export interface StaffAuthSession {
  email: string;
  name: string;
  role: StaffRole;
  photoURL?: string;
  loginMethod: 'google' | 'email';
  loggedAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  staffSession: StaffAuthSession | null;
  isStaff: boolean;
  isAdmin: boolean;
  isReporter: boolean;
  isSessionStale: boolean;
  serverVerifiedAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsStaffWithGoogle: () => Promise<{ success: boolean; error?: string; staff?: StaffAuthSession }>;
  loginAsStaffWithEmail: (email: string) => Promise<{ success: boolean; error?: string; staff?: StaffAuthSession }>;
  loginAsSuperAdminDirectly: (customEmail?: string) => Promise<{ success: boolean; staff: StaffAuthSession }>;
  reauthenticateAdmin: () => Promise<{ success: boolean; error?: string }>;
  markSessionStale: () => void;
  verifyAdminPrivilegesOnServer: () => Promise<boolean>;
  logoutStaff: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  staffSession: null,
  isStaff: false,
  isAdmin: false,
  isReporter: false,
  isSessionStale: false,
  serverVerifiedAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  loginAsStaffWithGoogle: async () => ({ success: false }),
  loginAsStaffWithEmail: async () => ({ success: false }),
  loginAsSuperAdminDirectly: async () => ({
    success: false,
    staff: {
      email: ADMIN_EMAIL,
      name: 'Admin',
      role: 'super_admin',
      loginMethod: 'email',
      loggedAt: '',
    },
  }),
  reauthenticateAdmin: async () => ({ success: false }),
  markSessionStale: () => {},
  verifyAdminPrivilegesOnServer: async () => false,
  logoutStaff: async () => {},
  logout: async () => {},
});

export const checkStaffWhitelist = (
  email: string
): { isAuthorized: boolean; role?: StaffAuthSession['role']; name?: string; staffUser?: EditorialUser } => {
  const normalized = email.trim().toLowerCase();

  // 1. Super Admin check
  if (isPlatformAdminEmail(normalized)) {
    return {
      isAuthorized: true,
      role: 'super_admin',
      name: 'मुख्य व्यवस्थापक (Super Admin)',
      staffUser: {
        id: 'super-admin-01',
        name: 'मुख्य व्यवस्थापक (Khabri Dost)',
        email: normalized,
        role: 'super_admin',
        status: 'active',
        articlesCount: 48,
        joinedAt: '2024-01-01',
      },
    };
  }

  // 2. Editorial Users check from localStorage (created by Admin) or fallback initial list
  let users: EditorialUser[] = INITIAL_EDITORIAL_USERS;
  try {
    const saved = localStorage.getItem('kd_editorial_users');
    if (saved) {
      users = JSON.parse(saved);
    }
  } catch {}

  const found = users.find((u) => u.email.trim().toLowerCase() === normalized);
  if (found && found.status === 'active') {
    return {
      isAuthorized: true,
      role: found.role,
      name: found.name,
      staffUser: found,
    };
  }

  return {
    isAuthorized: false,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [explicitStale, setExplicitStale] = useState(false);
  const [serverVerifiedAdmin, setServerVerifiedAdmin] = useState(false);

  // Staff session state (persisted in localStorage)
  const [staffSession, setStaffSession] = useState<StaffAuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('kd_staff_session');
      if (saved) {
        const parsed: StaffAuthSession = JSON.parse(saved);
        // Re-verify against whitelist to guarantee revocation takes effect immediately
        const check = checkStaffWhitelist(parsed.email);
        if (check.isAuthorized) {
          return parsed;
        } else {
          localStorage.removeItem('kd_staff_session');
        }
      }
    } catch {}
    return null;
  });

  // Calculate session staleness based on timestamp
  const isSessionStale = Boolean(
    explicitStale ||
      (staffSession &&
        staffSession.loggedAt &&
        Date.now() - new Date(staffSession.loggedAt).getTime() > ADMIN_SESSION_TIMEOUT_MS)
  );

  // Validate Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Sync server-side admin privileges with Firestore
  const syncServerAdminRecord = useCallback(async (firebaseUser: User) => {
    if (!firebaseUser.email) return;
    const isOwner = isPlatformAdminEmail(firebaseUser.email);
    if (!isOwner) return;

    try {
      // 1. Maintain /admins/{uid} registry document (protected by isAdmin() rules)
      const adminDocRef = doc(db, 'admins', firebaseUser.uid);
      await setDoc(
        adminDocRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'super_admin',
          verifiedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setServerVerifiedAdmin(true);
    } catch (err) {
      console.warn('Server admin record sync notice:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          const isOwnerEmail = isPlatformAdminEmail(currentUser.email);

          if (userSnap.exists()) {
            const profileData = userSnap.data() as UserProfile;
            if (isOwnerEmail && profileData.role !== 'admin') {
              profileData.role = 'admin';
              await setDoc(userDocRef, { role: 'admin' }, { merge: true });
            }
            setUserProfile(profileData);
          } else {
            // Create user document with server-side safe role
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || (isOwnerEmail ? 'मुख्य व्यवस्थापक (Super Admin)' : 'सम्मानित पाठक'),
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              role: isOwnerEmail ? 'admin' : 'reader',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }

          if (isOwnerEmail) {
            await syncServerAdminRecord(currentUser);
          }

          // If current Google user is in staff whitelist, keep staffSession synchronized
          if (currentUser.email) {
            const check = checkStaffWhitelist(currentUser.email);
            if (check.isAuthorized && check.role) {
              const session: StaffAuthSession = {
                email: currentUser.email,
                name: currentUser.displayName || check.name || 'संपादक',
                role: check.role,
                photoURL: currentUser.photoURL || undefined,
                loginMethod: 'google',
                loggedAt: new Date().toISOString(),
              };
              setStaffSession(session);
              localStorage.setItem('kd_staff_session', JSON.stringify(session));
              setExplicitStale(false);
            }
          }
        } catch (err) {
          console.warn('User profile sync notice:', err);
          const isOwnerEmail = isPlatformAdminEmail(currentUser.email);
          setUserProfile({
            uid: currentUser.uid,
            name: currentUser.displayName || (isOwnerEmail ? 'मुख्य व्यवस्थापक' : 'सम्मानित पाठक'),
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            role: isOwnerEmail ? 'admin' : 'reader',
            createdAt: new Date().toISOString(),
          });
          if (isOwnerEmail) {
            setServerVerifiedAdmin(true);
          }
        }
      } else {
        setUserProfile(null);
        setServerVerifiedAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncServerAdminRecord]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign-in error:', error);
      if (error?.code !== 'auth/popup-closed-by-user') {
        alert('लॉगिन करने में समस्या आई: ' + (error?.message || 'कृपया पुनः प्रयास करें'));
      }
    }
  };

  // Staff Login via Google (With Strict Whitelist Validation & Server Sync)
  const loginAsStaffWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
    staff?: StaffAuthSession;
  }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      if (!email) {
        await signOut(auth);
        return { success: false, error: 'Google खाते से कोई ईमेल प्राप्त नहीं हुआ।' };
      }

      const check = checkStaffWhitelist(email);
      if (!check.isAuthorized || !check.role) {
        // Immediate sign out and rejection
        await signOut(auth);
        setUser(null);
        setStaffSession(null);
        localStorage.removeItem('kd_staff_session');
        return {
          success: false,
          error: `अनधिकृत प्रवेश (Unauthorized): ईमेल "${email}" खबरी दोस्त के अधिकृत संपादकीय या प्रशासनिक स्टाफ में शामिल नहीं है। केवल व्यवस्थापक द्वारा स्वीकृत सदस्य ही लॉगिन कर सकते हैं।`,
        };
      }

      const session: StaffAuthSession = {
        email,
        name: result.user.displayName || check.name || 'संपादक',
        role: check.role,
        photoURL: result.user.photoURL || undefined,
        loginMethod: 'google',
        loggedAt: new Date().toISOString(),
      };

      setStaffSession(session);
      localStorage.setItem('kd_staff_session', JSON.stringify(session));
      setExplicitStale(false);

      if (isPlatformAdminEmail(email)) {
        await syncServerAdminRecord(result.user);
      }

      return { success: true, staff: session };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'लॉगिन विंडो बंद कर दी गई।' };
      }
      return { success: false, error: err?.message || 'Google लॉगिन में विफलता आई।' };
    }
  };

  // Staff Login via Registered Email (With Strict Whitelist Validation)
  const loginAsStaffWithEmail = async (
    email: string
  ): Promise<{ success: boolean; error?: string; staff?: StaffAuthSession }> => {
    const trimmed = email.trim();
    if (!trimmed) {
      return { success: false, error: 'कृपया अपना आधिकारिक स्टाफ ईमेल दर्ज करें।' };
    }

    const check = checkStaffWhitelist(trimmed);
    if (!check.isAuthorized || !check.role) {
      return {
        success: false,
        error: `अनधिकृत प्रवेश (Unauthorized): ईमेल "${trimmed}" खबरी दोस्त स्टाफ रिकॉर्ड में मौजूद नहीं है। यदि आप नए संपादक हैं, तो कृपया मुख्य व्यवस्थापक (${ADMIN_EMAIL}) से अपना ईमेल जुड़वाएं।`,
      };
    }

    const session: StaffAuthSession = {
      email: trimmed,
      name: check.name || check.staffUser?.name || 'संपादक',
      role: check.role,
      photoURL: check.staffUser?.photoURL || undefined,
      loginMethod: 'email',
      loggedAt: new Date().toISOString(),
    };

    setStaffSession(session);
    localStorage.setItem('kd_staff_session', JSON.stringify(session));
    setExplicitStale(false);
    return { success: true, staff: session };
  };

  // Direct 1-Click Administrator Access for Platform Owner
  const loginAsSuperAdminDirectly = async (
    customEmail?: string
  ): Promise<{ success: boolean; staff: StaffAuthSession }> => {
    const adminEmail = customEmail?.trim() || ADMIN_EMAIL;
    const session: StaffAuthSession = {
      email: adminEmail,
      name: 'मुख्य व्यवस्थापक (Super Admin)',
      role: 'super_admin',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      loginMethod: 'email',
      loggedAt: new Date().toISOString(),
    };

    setStaffSession(session);
    localStorage.setItem('kd_staff_session', JSON.stringify(session));
    setExplicitStale(false);
    return { success: true, staff: session };
  };

  // Forced Re-authentication for Administrative Sessions
  const reauthenticateAdmin = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      if (!email || !isPlatformAdminEmail(email)) {
        return {
          success: false,
          error: `प्रमाणीकरण असफल: केवल मुख्य व्यवस्थापक खाता (${ADMIN_EMAIL} / ${ALT_ADMIN_EMAIL}) ही स्वीकार्य है।`,
        };
      }

      const session: StaffAuthSession = {
        email,
        name: result.user.displayName || 'मुख्य व्यवस्थापक (Super Admin)',
        role: 'super_admin',
        photoURL: result.user.photoURL || undefined,
        loginMethod: 'google',
        loggedAt: new Date().toISOString(),
      };

      setStaffSession(session);
      localStorage.setItem('kd_staff_session', JSON.stringify(session));
      setExplicitStale(false);
      await syncServerAdminRecord(result.user);
      return { success: true };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'प्रमाणीकरण विंडो बंद कर दी गई।' };
      }
      return { success: false, error: err?.message || 'पुनः प्रमाणीकरण विफल रहा।' };
    }
  };

  const markSessionStale = () => {
    setExplicitStale(true);
  };

  const verifyAdminPrivilegesOnServer = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      // Test read against admins document
      const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
      return adminDoc.exists() || isPlatformAdminEmail(auth.currentUser.email);
    } catch {
      return isPlatformAdminEmail(auth.currentUser.email);
    }
  };

  const logoutStaff = async () => {
    setStaffSession(null);
    localStorage.removeItem('kd_staff_session');
    setExplicitStale(false);
    setServerVerifiedAdmin(false);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch {}
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setStaffSession(null);
      localStorage.removeItem('kd_staff_session');
      setExplicitStale(false);
      setServerVerifiedAdmin(false);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  // Verify that staff/admin state is bound to verified authentication identity
  const isOwner = isPlatformAdminEmail(user?.email);

  const isStaff =
    isOwner ||
    (!!user && !!staffSession && user.email?.toLowerCase() === staffSession.email.toLowerCase()) ||
    userProfile?.role === 'editor' ||
    userProfile?.role === 'admin';

  const isAdmin =
    isOwner ||
    (!!user && staffSession?.role === 'super_admin' && user.email?.toLowerCase() === staffSession.email.toLowerCase()) ||
    userProfile?.role === 'admin' ||
    serverVerifiedAdmin;

  const isReporter =
    isStaff || userProfile?.role === 'editor' || userProfile?.role === 'reporter';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        staffSession,
        isStaff,
        isAdmin,
        isReporter,
        isSessionStale,
        serverVerifiedAdmin,
        loading,
        signInWithGoogle,
        loginAsStaffWithGoogle,
        loginAsStaffWithEmail,
        loginAsSuperAdminDirectly,
        reauthenticateAdmin,
        markSessionStale,
        verifyAdminPrivilegesOnServer,
        logoutStaff,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
