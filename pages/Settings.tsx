import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, isMock } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {user?.email?.[0].toUpperCase()}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900">{user?.user_metadata?.full_name || 'Student'}</h2>
                <p className="text-slate-500">{user?.email}</p>
                {isMock && <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Demo User</span>}
            </div>
        </div>

        <div className="p-6 space-y-6">
            <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" /> Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input type="text" disabled value={user?.user_metadata?.full_name || 'Alex Johnson'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input type="email" disabled value={user?.email || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                    </div>
                </div>
            </section>
            
            <hr className="border-slate-100" />

            <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-500" /> Notifications
                </h3>
                <div className="space-y-3">
                    {['Email me about new courses', 'Notify me when I complete a module', 'Weekly progress summary'].map((label, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition">
                            <span className="text-slate-700">{label}</span>
                            <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out">
                                <input type="checkbox" id={`toggle-${idx}`} className="peer absolute opacity-0 w-0 h-0" defaultChecked />
                                <label htmlFor={`toggle-${idx}`} className="block w-full h-full rounded-full bg-slate-200 peer-checked:bg-indigo-600 cursor-pointer transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></label>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-slate-100" />

            <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-500" /> Database Connection
                </h3>
                
                {isMock ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                        <div className="flex-1">
                            <h4 className="font-bold text-amber-900">Not Connected to Supabase</h4>
                            <p className="text-sm text-amber-800 mt-1 mb-3">
                                You are currently in <strong>Demo Mode</strong>. Data will strictly be saved to your local browser storage and will not sync across devices.
                            </p>
                            <Link to="/setup" className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition">
                                Connect Database
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                        <div>
                            <h4 className="font-bold text-emerald-900">Connected Successfully</h4>
                            <p className="text-sm text-emerald-700">
                                Your account is synced with Supabase. All progress is saved to the cloud.
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;