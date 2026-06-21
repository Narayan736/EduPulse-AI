import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getAllAttendance } from '../../api/attendanceService';
import { getAllStandups } from '../../api/standupService';
import { getAllDemos } from '../../api/demoService';
import { generateBatchReport } from '../../api/aiService';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import { Users, AlertTriangle, CheckCircle, BrainCircuit, Loader2, ArrowRight, PlayCircle } from 'lucide-react';

export default function InstructorDashboard() {
  const { data: attendanceData } = useFetch(getAllAttendance);
  const { data: demoData } = useFetch(getAllDemos);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  // Compute stats
  const records = attendanceData?.records || [];
  const uniqueStudents = new Set(records.map(r => r.student?._id)).size || 15;
  const attendanceRate = records.length ? Math.round((records.filter(r => r.status === 'present').length / records.length) * 100) + '%' : '0%';
  const activeDemos = demoData?.demos?.length || 0;
  
  // Mock chart data for visuals
  const attendanceTrend = [
    { name: 'Mon', value: 85 },
    { name: 'Tue', value: 90 },
    { name: 'Wed', value: 92 },
    { name: 'Thu', value: 88 },
    { name: 'Fri', value: 95 },
  ];

  const handleGenerateInsights = async () => {
    setAiLoading(true);
    try {
      await generateBatchReport();
      navigate('/instructor/ai-insights');
    } catch (err) {
      console.error(err);
      alert('Failed to generate insights. Check console.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Instructor Overview</h1>
          <p className="text-gray-500 font-medium">Monitor class health and generate actionable insights.</p>
        </div>
        <button
          onClick={handleGenerateInsights}
          disabled={aiLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {aiLoading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
          {aiLoading ? 'Analyzing Class Data...' : 'Generate AI Insights'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={uniqueStudents} 
          subtitle="Active in cohort" 
          icon={Users} 
          color="indigo" 
        />
        <StatCard 
          title="Attendance Rate" 
          value={attendanceRate} 
          subtitle="This week's average" 
          icon={CheckCircle} 
          color="emerald" 
        />
        <StatCard 
          title="At-Risk Students" 
          value="3" 
          subtitle="Requires attention" 
          icon={AlertTriangle} 
          color="rose" 
        />
        <StatCard 
          title="Demos Submitted" 
          value={activeDemos} 
          subtitle="Pending review" 
          icon={PlayCircle} 
          color="blue" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ChartCard 
          title="Weekly Attendance Trend" 
          data={attendanceTrend} 
          color="#10b981" 
        />
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-50"></div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
              <BrainCircuit size={32} className="text-indigo-200" />
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Unlock Deep Class Insights with Gemini AI</h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-md">
              Our AI engine analyzes attendance, stand-up consistency, and project progress to identify struggling students before they fall behind.
            </p>
            <button 
              onClick={handleGenerateInsights}
              disabled={aiLoading}
              className="group flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold w-max hover:bg-indigo-50 transition-colors"
            >
              {aiLoading ? 'Processing...' : 'Run Full Analysis'}
              {!aiLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
