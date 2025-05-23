import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Eye, EyeOff, Users, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient'; 
import { useParams, useLocation } from 'react-router-dom';


const LoginForm = ({ onLogin, adminPassword, isEmployeeLogin = false }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loginType, setLoginType] = useState('admin'); 
  const { toast } = useToast();
  const location = useLocation();
  const pathEmployeeId = location.pathname.startsWith('/attendance/') ? location.pathname.split('/')[2] : null;


  useEffect(() => {
    if (pathEmployeeId) {
        setLoginType('employee');
        setSelectedEmployeeId(pathEmployeeId);
    }

    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .in('name', ['Hanieh Kamari', 'Manuel Ohanjanians']);
      
      if (error) {
        console.error("Fetch error from Supabase:", error);
        toast({ title: 'Error', description: `Could not fetch employee list. ${error.message}`, variant: 'destructive' });
      } else {
        setEmployees(data);
        if (pathEmployeeId && data.some(e => e.id === pathEmployeeId)) {
             
        } else if (pathEmployeeId) {
            toast({ title: 'Error', description: 'Invalid employee link.', variant: 'destructive' });
        }
      }
    };
    fetchEmployees();
  }, [toast, pathEmployeeId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "Universitio2002@";

    if (password === correctPassword) {
      if (loginType === 'admin') {
        onLogin('admin');
      } else if (loginType === 'employee' && selectedEmployeeId) {
        onLogin('employee', selectedEmployeeId);
      } else if (loginType === 'employee' && !selectedEmployeeId) {
        toast({ title: 'Login Failed', description: 'Please select an employee.', variant: 'destructive' });
      }
    } else {
      toast({
        title: 'Login Failed',
        description: 'Incorrect password. Please try again.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  return (
    <div className="password-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="password-card"
      >
        <CardHeader className="items-center">
          <div className="logo-container-login">
            <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3fc2bcbf-9ff5-4dd1-b724-ac34eb3d196e/2a0983f9ffbd6d222994de9f3e4c1c9f.png" alt="Universitio Logo" className="h-20 w-auto" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            {loginType === 'admin' ? 'Admin Access' : 'Employee Attendance Login'}
          </CardTitle>
          <CardDescription>
            {loginType === 'admin' 
              ? 'Enter admin password for HR Management System.'
              : 'Enter password to access your attendance portal.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pathEmployeeId && (
            <div className="flex justify-center space-x-4 mb-6">
              <Button 
                onClick={() => setLoginType('admin')} 
                variant={loginType === 'admin' ? 'default' : 'outline'}
                className="flex-1"
              >
                <Users className="mr-2 h-4 w-4" /> Admin Login
              </Button>
              <Button 
                onClick={() => setLoginType('employee')} 
                variant={loginType === 'employee' ? 'default' : 'outline'}
                className="flex-1"
              >
                <UserCheck className="mr-2 h-4 w-4" /> Employee Login
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginType === 'employee' && !pathEmployeeId && (
              <div className="space-y-2">
                <label htmlFor="employeeSelect" className="text-sm font-medium text-muted-foreground">Select Employee</label>
                <select
                  id="employeeSelect"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="" disabled>-- Select your name --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 password-input h-12 text-lg"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            <Button type="submit" className="login-button h-12 text-lg">
              Login
            </Button>
          </form>
        </CardContent>
      </motion.div>
    </div>
  );
};

export default LoginForm;