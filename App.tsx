import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings as SettingsIcon, LogOut, GraduationCap, Bell, Loader2 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import CourseDetails from './pages/CourseDetails';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import SetupGuide from './pages/SetupGuide';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getUserProgress } from './services/progressService';

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, signOut, isMock } = useAuth();
  
  // Hide sidebar for Course Player to give more room for content
  // But show header for navigation if needed, or custom header in Player
  const hideSidebar = location.pathname.includes('/course/') && !location.pathname.includes('/course-details/');
  
  // Header-only layout for player or specific pages
  if (hideSidebar) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 tracking-tight">Aim AI</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-sm text-slate-600 font-medium">
                        {user?.user_metadata?.full_name || user?.email || 'Student'}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                        <img src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random`} alt="Avatar" />
                    </div>
                </div>
            </header>
            {children}
        </div>
    );
  }

  // Main Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col z-30">
        <div className="p-6">
            <Link to="/" className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">Aim AI</span>
            </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/'} />
            <NavItem to="/courses" icon={<BookOpen size={20} />} label="My Courses" active={location.pathname === '/courses'} />
            <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" active={location.pathname === '/settings'} />
        </nav>

        <div className="p-4 border-t border-slate-100">
            {isMock && (
                <Link to="/setup" className="block mb-4 px-3 py-2 bg-amber-50 text-amber-700 text-xs rounded border border-amber-100 hover:bg-amber-100 transition text-center font-medium">
                    Using Mock Data (Setup)
                </Link>
            )}
            <button 
                onClick={signOut}
                className="flex items-center gap-3 text-slate-500 hover:text-red-500 w-full p-2 rounded-lg transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Student Portal</h2>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition">
                    <Bell size={20} />
                </button>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 hidden sm:block">
                         {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=6366f1&color=fff`} alt="User" />
                    </div>
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
            {children}
        </main>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ to, icon, label, active }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
            ${active 
                ? 'bg-indigo-50 text-indigo-600 font-medium' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        {icon}
        <span>{label}</span>
    </Link>
);


// Container ensuring data loading
const AuthenticatedApp: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [dataLoading, setDataLoading] = useState(true);

    // Fetch progress when user changes
    useEffect(() => {
        if (user) {
            setDataLoading(true);
            getUserProgress(user.id)
                .then(setProgress)
                .finally(() => setDataLoading(false));
        }
    }, [user]);

    if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    if (!user) return <Auth />;

    if (dataLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard progress={progress} />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/setup" element={<SetupGuide />} />
                <Route path="/course-details/:courseId" element={<CourseDetails />} />
                <Route path="/course/:courseId" element={<CoursePlayer progress={progress} onProgressUpdate={() => getUserProgress(user.id).then(setProgress)} />} />
                <Route path="*" element={<div className="p-8 text-center text-slate-500">Page under construction</div>} />
            </Routes>
        </Layout>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
            <AuthenticatedApp />
        </Router>
    </AuthProvider>
  );
};

export default App;