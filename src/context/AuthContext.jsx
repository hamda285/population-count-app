import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const authUser = session.user;
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          setUser(authUser);
        } else {
          const combinedUser = {
            ...authUser,
            ...profile,
            first_name: profile.first_name,
            email: authUser.email,
            role: profile.role || "user",
          };
          setUser(combinedUser);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const authUser = session.user;
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            setUser(authUser);
          } else {
            const combinedUser = {
              ...authUser,
              ...profile,
              first_name: profile.first_name,
              email: authUser.email,
              role: profile.role || "user",
            };
            setUser(combinedUser);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  //logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error.message);
    } else {
      setUser(null); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

