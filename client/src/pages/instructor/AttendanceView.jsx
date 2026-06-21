import { useFetch } from '../../hooks/useFetch';
import { getAllAttendance } from '../../api/attendanceService';
import { CalendarCheck, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function AttendanceView() {
  const { data, loading } = useFetch(getAllAttendance);
  const records = data?.records || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
          <CalendarCheck size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Log</h1>
          <p className="text-gray-500 font-medium">Review all student attendance records.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    <Loader2 className="animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">No records found.</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{record.student?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-500">{record.student?.email}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(record.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
