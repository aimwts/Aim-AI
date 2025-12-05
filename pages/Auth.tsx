import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Loader2, ArrowRight, UserCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const { loginAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    // If Supabase is not configured, fallback to guest login logic automatically
    if (!supabase) {
        loginAsGuest();
        return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      setIsSent(true);
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                <GraduationCap className="w-10 h-10 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {mode === 'signin' ? 'Welcome back' : 'Start learning today'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="font-medium text-indigo-600 hover:text-indigo-500">
                {mode === 'signin' ? 'Sign up for free' : 'Sign in'}
            </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {isSent ? (
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <ArrowRight className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-slate-900">Check your email</h3>
                <p className="mt-2 text-sm text-slate-500">
                    We sent a magic link to <strong>{email}</strong>. <br/>
                    Click the link to sign in.
                </p>
                <button 
                    onClick={() => setIsSent(false)}
                    className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Try another email
                </button>
            </div>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleAuth}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'signin' ? 'Sign in with Magic Link' : 'Create Account')}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or continue without signing in</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={loginAsGuest}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                  >
                    <UserCircle className="w-5 h-5 text-slate-500" />
                    Continue as Guest
                  </button>
                </div>
              </div>
            </>
          )}

          {!supabase && !isSent && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs text-amber-800 text-center">
                      <strong>Demo Mode:</strong> App running without backend. Guest Login recommended.
                  </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;