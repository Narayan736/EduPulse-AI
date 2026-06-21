import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { markAttendance, getMyAttendance } from '../../api/attendanceService';
import { submitStandup, getMyStandups } from '../../api/standupService';
import { submitDemo } from '../../api/demoService';
import { Flame, CalendarCheck, MessageSquarePlus, MonitorPlay, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { MOOD_OPTIONS } from '../../utils/constants';

export default function StudentDashboard() {
  const { user } = useAuth();

  // Fetch Attendance to calculate streak and check if marked today
  const { data: attendanceData, refetch: refetchAttendance } = useFetch(getMyAttendance);
  const { data: standupData, refetch: refetchStandups } = useFetch(getMyStandups);

  // States for forms
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');

  const [standupForm, setStandupForm] = useState({ yesterday: '', today: '', blockers: '', mood: 'good' });
  const [standupLoading, setStandupLoading] = useState(false);
  const [standupSuccess, setStandupSuccess] = useState(false);
  const [standupError, setStandupError] = useState('');

  const [demoForm, setDemoForm] = useState({ title: '', description: '', repoUrl: '', deployedUrl: '' });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState('');

  // Derived states
  const records = attendanceData?.records || [];
  const today = new Date().setUTCHours(0, 0, 0, 0);
  const streak = calculateStreak(records);

  const hasMarkedAttendanceToday = records.some(r => {
    const rDate = new Date(r.date).setUTCHours(0, 0, 0, 0);
    return rDate === today;
  });

  const standups = standupData?.standups || [];
  const hasSubmittedStandupToday = standups.some(s => {
    const sDate = new Date(s.date).setUTCHours(0, 0, 0, 0);
    return sDate === today;
  });

  function calculateStreak(records) {
    if (!records.length) return 0;
    let currentStreak = 0;
    const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Check if latest is today or yesterday to continue streak
    const latestDate = new Date(sorted[0].date).setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (latestDate !== today && latestDate !== yesterday.setUTCHours(0, 0, 0, 0)) return 0;

    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].status === 'present') {
        currentStreak++;
      } else {
        break; // Streak broken
      }
    }
    return currentStreak;
  }

  const handleMarkAttendance = async () => {
    setAttendanceLoading(true);
    setAttendanceError('');
    try {
      await markAttendance({ status: 'present' });
      setAttendanceSuccess(true);
      refetchAttendance();
    } catch (err) {
      setAttendanceError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleStandupSubmit = async (e) => {
    e.preventDefault();
    setStandupLoading(true);
    setStandupError('');
    try {
      await submitStandup(standupForm);
      setStandupSuccess(true);
      refetchStandups();
    } catch (err) {
      setStandupError(err.response?.data?.message || 'Failed to submit standup');
    } finally {
      setStandupLoading(false);
    }
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setDemoLoading(true);
    setDemoError('');
    try {
      await submitDemo(demoForm);
      setDemoSuccess(true);
      setDemoForm({ title: '', description: '', repoUrl: '', deployedUrl: '' });
      setTimeout(() => setDemoSuccess(false), 3000);
    } catch (err) {
      setDemoError(err.response?.data?.message || 'Failed to submit demo');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-500 font-medium">Ready to crush your goals today?</p>
        </div>

        <div className="relative z-10 flex items-center gap-4 bg-gradient-to-br from-orange-50 to-rose-50 px-6 py-4 rounded-2xl border border-orange-100 shadow-inner">
          <div className="p-3 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl text-white shadow-md shadow-orange-200">
            <Flame size={28} className={streak > 0 ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-0.5">Current Streak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900">{streak}</span>
              <span className="text-sm font-semibold text-gray-500">days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Attendance & Demo */}
        <div className="space-y-6">

          {/* Attendance Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full filter blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CalendarCheck size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Today's Attendance</h2>
              </div>

              {attendanceError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl font-medium flex items-center gap-2"><AlertCircle size={16} />{attendanceError}</div>}

              {hasMarkedAttendanceToday || attendanceSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="text-emerald-800 font-bold text-lg">Attendance Marked</h3>
                  <p className="text-emerald-600 text-sm font-medium mt-1">You're all set for today!</p>
                </div>
              ) : (
                <button
                  onClick={handleMarkAttendance}
                  disabled={attendanceLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center disabled:opacity-70 transform hover:-translate-y-0.5"
                >
                  {attendanceLoading ? <Loader2 className="animate-spin mr-2" /> : 'Mark Present'}
                </button>
              )}
            </div>
          </div>

          {/* Demo Submission Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <MonitorPlay size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Submit Project Demo</h2>
              </div>

              {demoSuccess && <div className="mb-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl font-medium flex items-center gap-2"><CheckCircle2 size={16} />Demo submitted successfully!</div>}
              {demoError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl font-medium flex items-center gap-2"><AlertCircle size={16} />{demoError}</div>}

              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title</label>
                  <input required value={demoForm.title} onChange={e => setDemoForm({ ...demoForm, title: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="e.g. E-Commerce Backend" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea required value={demoForm.description} onChange={e => setDemoForm({ ...demoForm, description: e.target.value })} rows="2" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" placeholder="Briefly describe your project..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Repo URL</label>
                    <input type="url" value={demoForm.repoUrl} onChange={e => setDemoForm({ ...demoForm, repoUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Live URL</label>
                    <input type="url" value={demoForm.deployedUrl} onChange={e => setDemoForm({ ...demoForm, deployedUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="https://..." />
                  </div>
                </div>
                <button disabled={demoLoading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md shadow-blue-200 transition-all disabled:opacity-70 flex justify-center mt-2">
                  {demoLoading ? <Loader2 className="animate-spin" /> : 'Submit Demo'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Standup */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <MessageSquarePlus size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Daily Stand-up</h2>
          </div>

          {standupError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl font-medium flex items-center gap-2"><AlertCircle size={16} />{standupError}</div>}

          {hasSubmittedStandupToday || standupSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-purple-50/50 rounded-2xl border border-purple-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-white">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-purple-900 font-bold text-xl mb-2">Stand-up Submitted!</h3>
              <p className="text-purple-600/80 font-medium">Great job logging your progress. Keep up the momentum!</p>
            </div>
          ) : (
            <form onSubmit={handleStandupSubmit} className="flex-1 flex flex-col space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">What did you do yesterday?</label>
                <textarea required value={standupForm.yesterday} onChange={e => setStandupForm({ ...standupForm, yesterday: e.target.value })} rows="2" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none" placeholder="Completed API routes..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">What will you do today?</label>
                <textarea required value={standupForm.today} onChange={e => setStandupForm({ ...standupForm, today: e.target.value })} rows="2" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none" placeholder="Working on the frontend UI..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Any blockers?</label>
                <textarea value={standupForm.blockers} onChange={e => setStandupForm({ ...standupForm, blockers: e.target.value })} rows="2" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none" placeholder="None"></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">How are you feeling today?</label>
                <div className="grid grid-cols-4 gap-2">
                  {MOOD_OPTIONS.map(mood => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setStandupForm({ ...standupForm, mood: mood.value })}
                      className={`p-2 rounded-xl text-sm font-medium transition-all border ${standupForm.mood === mood.value ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm ring-1 ring-purple-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button disabled={standupLoading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all disabled:opacity-70 flex justify-center">
                  {standupLoading ? <Loader2 className="animate-spin" /> : 'Submit Stand-up'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
