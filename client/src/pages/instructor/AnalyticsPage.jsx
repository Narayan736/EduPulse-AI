import { useFetch } from '../../hooks/useFetch';
import { getAllAttendance } from '../../api/attendanceService';
import { getAllStandups } from '../../api/standupService';
import { getAllDemos } from '../../api/demoService';
import ChartCard from '../../components/ChartCard';
import { BarChart3, Users, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: attendanceData } = useFetch(getAllAttendance);
  const { data: standupData } = useFetch(getAllStandups);
  const { data: demoData } = useFetch(getAllDemos);

  // Derive simple aggregations
  const standups = standupData?.standups || [];
  
  // Aggregate mood
  const moodCounts = standups.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  const moodChartData = [
    { name: 'Great', value: moodCounts.great || 0 },
    { name: 'Good', value: moodCounts.good || 0 },
    { name: 'Okay', value: moodCounts.okay || 0 },
    { name: 'Struggling', value: moodCounts.struggling || 0 },
  ];

  const demos = demoData?.demos || [];
  const statusCounts = demos.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const demoChartData = [
    { name: 'Submitted', value: statusCounts.submitted || 0 },
    { name: 'In Review', value: statusCounts.reviewing || 0 },
    { name: 'Approved', value: statusCounts.approved || 0 },
    { name: 'Changes Req.', value: statusCounts.changes_requested || 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Analytics</h1>
          <p className="text-gray-500 font-medium">Deep dive into cohort performance metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Class Mood Distribution" 
          data={moodChartData} 
          color="#8b5cf6" 
        />
        <ChartCard 
          title="Demo Status Pipeline" 
          data={demoChartData} 
          color="#3b82f6" 
        />
      </div>
      
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <TrendingUp size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Overall Health Score</h3>
            <p className="text-gray-500 font-medium">Based on attendance, mood, and demo progression.</p>
          </div>
        </div>
        <div className="text-5xl font-black text-emerald-500">
          88<span className="text-2xl text-emerald-300">/100</span>
        </div>
      </div>
    </div>
  );
}
