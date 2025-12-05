import React from 'react';
import { Database, Key, Server, CheckCircle, Copy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SetupGuide: React.FC = () => {
  const sqlScript = `
-- 1. Create a table for user progress
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  course_id text not null,
  module_id text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, course_id, module_id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_progress enable row level security;

-- 3. Create Policy: Users can view their own progress
create policy "Users can view own progress" on public.user_progress
  for select using (auth.uid() = user_id);

-- 4. Create Policy: Users can update their own progress
create policy "Users can update own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);
  `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    alert('SQL copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/settings" className="p-2 hover:bg-slate-100 rounded-full transition">
             <ArrowLeft className="w-6 h-6 text-slate-500" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Supabase Setup Guide</h1>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex items-start gap-4">
        <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
            <Server className="w-6 h-6 text-white" />
        </div>
        <div>
            <h3 className="font-bold text-indigo-900 text-lg">Why do I need this?</h3>
            <p className="text-indigo-700 mt-1">
                To save user progress, handle real authentication, and sync data across devices, 
                this app needs to connect to a Supabase backend.
            </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm">1</span>
                Create Project
            </h3>
            <p className="text-slate-600 ml-11">
                Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">supabase.com</a> and create a new project.
            </p>
        </section>

        {/* Step 2 */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm">2</span>
                Run SQL Schema
            </h3>
            <div className="ml-11 space-y-4">
                <p className="text-slate-600">
                    Navigate to the <strong>SQL Editor</strong> in your Supabase dashboard and paste the following script to create the necessary tables.
                </p>
                <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                        {sqlScript}
                    </pre>
                    <button 
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded transition"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>

        {/* Step 3 */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm">3</span>
                Connect Environment Variables
            </h3>
            <div className="ml-11 space-y-4">
                <p className="text-slate-600">
                    Go to <strong>Project Settings &gt; API</strong>. Copy the URL and "anon" public key.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase">Project URL</span>
                        <div className="flex items-center gap-2 mt-1 text-slate-800 font-mono text-sm">
                            <Server className="w-4 h-4 text-slate-400" />
                            VITE_SUPABASE_URL
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase">Anon / Public Key</span>
                        <div className="flex items-center gap-2 mt-1 text-slate-800 font-mono text-sm">
                            <Key className="w-4 h-4 text-slate-400" />
                            VITE_SUPABASE_ANON_KEY
                        </div>
                    </div>
                </div>
                <p className="text-slate-600 text-sm">
                    If deploying to Netlify, add these to <strong>Site Settings &gt; Environment Variables</strong>. <br/>
                    If running locally, create a <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> file in the root.
                </p>
            </div>
        </section>
      </div>
    </div>
  );
};

export default SetupGuide;