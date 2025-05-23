import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Eye, EyeOff, Users, UserCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient'; 
import { useParams, useLocation } from 'react-router-dom';
import { Label } from '@/components/ui/label';

const LoginForm = ({ onLogin, adminPassword, isEmployeeLogin = false }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validations
      if (!email) {
        throw new Error('Please enter your email address');
      }

      if (!password) {
        throw new Error('Please enter your password');
      }

      // Validate email format
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // For admin, ensure using info@universitio.com
      if (loginType === 'admin' && email !== 'info@universitio.com') {
        throw new Error('Admin must use info@universitio.com');
      }

      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: 'Universitio2002@'
      });

      if (error) {
        // Only create account if it doesn't exist
        if (error.message === 'Invalid login credentials') {
          const { error: signUpError } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: 'Universitio2002@',
            options: {
              data: {
                role: loginType
              }
            }
          });

          if (signUpError) {
            throw signUpError;
          }

          toast({
            title: 'Account Created',
            description: 'Please check your email to confirm your account.',
            duration: 5000,
          });
          setIsLoading(false);
          return;
        }
        throw error;
      }

      if (!data?.user) {
        throw new Error('No user data received');
      }

      // Successfully logged in
      toast({
        title: 'Login Successful',
        description: loginType === 'admin' ? 'Welcome Admin!' : 'Welcome!',
      });

      // Call the appropriate callback
      if (loginType === 'admin') {
        // For admin, just proceed with login
        onLogin('admin');
      } else {
        // For employees, look up their ID by email
        const { data: employee, error: employeeError } = await supabase
          .from('employees')
          .select('id')
          .eq('email', email.toLowerCase())
          .single();

        if (employeeError || !employee) {
          throw new Error('Employee not found. Please contact HR.');
        }

        onLogin('employee', employee.id);
      }

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize admin email when switching to admin mode
  useEffect(() => {
    if (loginType === 'admin') {
      setEmail('info@universitio.com');
    } else {
      setEmail('');
    }
  }, [loginType]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-2">
          <CardHeader className="space-y-6 items-center pb-8">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center p-4"
            >
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3fc2bcbf-9ff5-4dd1-b724-ac34eb3d196e/2a0983f9ffbd6d222994de9f3e4c1c9f.png" 
                alt="Universitio Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {loginType === 'admin' ? 'Admin Access' : 'Employee Login'}
              </CardTitle>
              <CardDescription className="text-base">
                {loginType === 'admin' 
                  ? 'Use info@universitio.com to login as admin'
                  : 'Access your attendance portal'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => {
                  setLoginType('admin');
                  setEmail('info@universitio.com');
                  setPassword('');
                }} 
                variant={loginType === 'admin' ? 'default' : 'outline'}
                className="w-full py-6"
              >
                <Users className="mr-2 h-5 w-5" />
                Admin
              </Button>
              <Button 
                onClick={() => {
                  setLoginType('employee');
                  setEmail('');
                  setPassword('');
                }} 
                variant={loginType === 'employee' ? 'default' : 'outline'}
                className="w-full py-6"
              >
                <UserCheck className="mr-2 h-5 w-5" />
                Employee
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address {loginType === 'admin' && <span className="text-muted-foreground">(info@universitio.com)</span>}
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      className="h-12 pl-10"
                      placeholder={loginType === 'admin' ? "info@universitio.com" : "your.name@universitio.com"}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-10"
                      placeholder="Enter password"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Clock className="h-5 w-5" />
                    </motion.div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;