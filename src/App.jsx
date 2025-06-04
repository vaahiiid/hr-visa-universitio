import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import EmployeeList from "@/components/EmployeeList";
import LoginForm from "@/components/LoginForm";
import EmployeeAttendancePage from "@/pages/EmployeeAttendancePage";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Power, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const APP_SESSION_KEY = "hrAppLoggedIn";
const ADMIN_PASSWORD = "Universitio2002@";

const AdminLayout = ({ onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching employees:", error);
          toast({
            title: "Error",
            description: "Could not fetch employee data. " + error.message,
            variant: "destructive",
          });
          setEmployees([]);
        } else {
          const formattedData = data.map(emp => ({
            ...emp,
            joinDate: emp.join_date, 
            visaExpiry: emp.visa_expiry
          }));
          setEmployees(formattedData);

          const criticalEmployees = formattedData.filter(
            (emp) => new Date(emp.visaExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && new Date(emp.visaExpiry) > new Date()
          );

          if (criticalEmployees.length > 0) {
            toast({
              title: "Critical Visa Alert",
              description: `${criticalEmployees.length} employee(s) have visas expiring within 30 days.`,
              variant: "destructive",
              duration: 8000,
            });
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching data.",
          variant: "destructive",
        });
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background grid-pattern">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Employee Data...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center bg-card rounded-xl p-6 shadow-lg border border-border/10">
            <Header employeeCount={employees.length} />
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 text-primary hover:text-primary/90 flex items-center gap-2 transition-all duration-200"
            >
              <Power className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Employee List Section - Wider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-12"
            >
              <div className="bg-card rounded-xl shadow-lg border border-border/10 p-6">
                <EmployeeList employees={employees} />
              </div>
            </motion.div>
          </div>

          {/* Stats or Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-card rounded-xl shadow-lg border border-border/10 p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Employees</h3>
                  <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-card rounded-xl shadow-lg border border-border/10 p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Visa Warnings</h3>
                  <p className="text-2xl font-bold text-foreground">
                    {employees.filter(emp => {
                      const visaExpiry = new Date(emp.visaExpiry);
                      const now = new Date();
                      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                      return visaExpiry <= thirtyDays && visaExpiry > now;
                    }).length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-card rounded-xl shadow-lg border border-border/10 p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Active Employees</h3>
                  <p className="text-2xl font-bold text-foreground">
                    {employees.filter(emp => emp.status === 'Active').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center text-sm text-muted-foreground pt-6 border-t border-border/10"
          >
            <p>HR Visa Management System © {new Date().getFullYear()} Universitio</p>
            <p className="text-xs">Data powered by Supabase</p>
          </motion.footer>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Check role based on email
  const userEmail = session.user?.email;
  const isAdmin = userEmail === 'info@universitio.com';

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'employee' && isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const isAdmin = session.user.email === 'info@universitio.com';
        if (isAdmin) {
          navigate('/');
        } else {
          const { data: employee } = await supabase
            .from('employees')
            .select('id')
            .eq('email', session.user.email)
            .single();
          
          if (employee) {
            navigate(`/attendance/${employee.id}`);
          }
        }
      }
      setIsAppInitialized(true);
    };

    initializeApp();
  }, [navigate]);

  const handleLogin = async (role = "admin", employeeId = null) => {
    sessionStorage.setItem(APP_SESSION_KEY, "true");
    sessionStorage.setItem("userRole", role);
    if (role === "admin") {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the HR Management System.",
      });
      navigate("/");
    } else if (role === "employee" && employeeId) {
      sessionStorage.setItem("employeeId", employeeId);
      toast({
        title: "Employee Login Successful",
        description: "Welcome to your attendance portal.",
      });
      navigate(`/attendance/${employeeId}`);
    }
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      sessionStorage.removeItem(APP_SESSION_KEY);
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("employeeId");
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAppInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background grid-pattern">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Initializing Application...</p>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} adminPassword={ADMIN_PASSWORD} />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/attendance/:employeeId" 
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeAttendancePage onLogout={handleLogout} employeePassword={ADMIN_PASSWORD}/>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;