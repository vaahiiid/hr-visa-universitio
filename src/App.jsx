import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import EmployeeList from "@/components/EmployeeList";
import LoginForm from "@/components/LoginForm";
import EmployeeAttendancePage from "@/pages/EmployeeAttendancePage";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

const APP_SESSION_KEY = "hrAppLoggedIn";
const ADMIN_PASSWORD = "Universitio2002@";

const AdminLayout = () => {
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
    <div className="min-h-screen bg-background grid-pattern">
      <div className="container mx-auto px-4 py-8">
        <Header employeeCount={employees.length} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card/90 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8"
        >
          <EmployeeList employees={employees} />
        </motion.main>
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>HR Visa Management System © {new Date().getFullYear()} Universitio</p>
          <p>Data powered by Supabase</p>
        </motion.footer>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const sessionLoggedIn = sessionStorage.getItem(APP_SESSION_KEY) === "true";
  const sessionRole = sessionStorage.getItem("userRole"); // "admin" or "employee"

  if (!sessionLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && sessionRole !== requiredRole) {
     return <Navigate to="/login" replace />; // Or an unauthorized page
  }
  return children;
};

const App = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionLoggedIn = sessionStorage.getItem(APP_SESSION_KEY);
    if (sessionLoggedIn === "true") {
       // No automatic navigation here, let routes handle it
    }
    setIsAppInitialized(true); 
  }, []);


  const handleLogin = (role = "admin", employeeId = null) => {
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
  
  const handleLogout = () => {
    sessionStorage.removeItem(APP_SESSION_KEY);
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("employeeId");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
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