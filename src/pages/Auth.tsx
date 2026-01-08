import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Scale, LogIn, KeyRound } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = authSchema.safeParse({ email, password: isResetting ? undefined : password });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    if (isResetting) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin/update-password',
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset instructions sent to your email');
        setIsResetting(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error('Invalid credentials. Please try again.');
      }
    }
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
              <Scale className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Federal Court - Finote Selam Branch</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isResetting && (
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {isResetting ? <KeyRound className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
            {loading ? (isResetting ? 'Sending...' : 'Signing in...') : (isResetting ? 'Send Reset Link' : 'Sign In')}
          </Button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsResetting(!isResetting)}
              className="text-sm text-primary hover:underline bg-transparent border-none cursor-pointer"
            >
              {isResetting ? 'Back to Sign In' : 'Forgot Password?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
