import { useFetch } from '../../hooks/useFetch';
import { getAllStandups } from '../../api/standupService';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { MOOD_OPTIONS } from '../../utils/constants';

export default function StandupReview() {
  const { data, loading } = useFetch(getAllStandups);
  const standups = data?.standups || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
          <MessageSquarePlus size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Stand-ups</h1>
          <p className="text-gray-500 font-medium">Review student progress and blockers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
        ) : standups.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100">No stand-ups found.</div>
        ) : (
          standups.map((standup) => {
            const moodObj = MOOD_OPTIONS.find(m => m.value === standup.mood);
            return (
              <div key={standup._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 border-r border-gray-100 pr-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{standup.student?.name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500 mb-4">{formatDate(standup.date)}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700 capitalize">Mood: {moodObj ? moodObj.label : standup.mood}</span>
                  </div>
                </div>
                <div className="md:w-3/4 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Yesterday</h4>
                    <p className="text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100">{standup.yesterday}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Today</h4>
                    <p className="text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100">{standup.today}</p>
                  </div>
                  {standup.blockers && standup.blockers !== 'None' && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1">Blockers</h4>
                      <p className="text-red-700 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">{standup.blockers}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
