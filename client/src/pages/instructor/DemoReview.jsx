import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { getAllDemos, reviewDemo } from '../../api/demoService';
import { MonitorPlay, Loader2, ExternalLink, Code, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function DemoReview() {
  const { data, loading, refetch } = useFetch(getAllDemos);
  const demos = data?.demos || [];
  const [reviewingId, setReviewingId] = useState(null);

  const handleReview = async (id, status, score) => {
    setReviewingId(id);
    try {
      await reviewDemo(id, { status, score, feedback: 'Reviewed by instructor' });
      refetch();
    } catch (err) {
      alert('Failed to update demo status');
    } finally {
      setReviewingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'reviewing': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'changes_requested': return 'bg-rose-100 text-rose-700';
      case 'rejected': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <MonitorPlay size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Demos</h1>
          <p className="text-gray-500 font-medium">Review and grade student project submissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
        ) : demos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100">No demos submitted yet.</div>
        ) : (
          demos.map((demo) => (
            <div key={demo._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(demo.status)}`}>
                  {demo.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400 font-medium">{formatDate(demo.createdAt)}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{demo.title}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">by {demo.student?.name || 'Unknown'}</p>
              
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex-1">
                {demo.description}
              </p>

              <div className="flex gap-3 mb-6">
                {demo.repoUrl && (
                  <a href={demo.repoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 transition-colors">
                    <Code size={16} /> Repo
                  </a>
                )}
                {demo.deployedUrl && (
                  <a href={demo.deployedUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-200 transition-colors">
                    <ExternalLink size={16} /> Live App
                  </a>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 flex gap-2">
                {demo.status === 'submitted' && (
                  <button onClick={() => handleReview(demo._id, 'reviewing', demo.score)} disabled={reviewingId === demo._id} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                    {reviewingId === demo._id ? 'Updating...' : 'Start Review'}
                  </button>
                )}
                {demo.status === 'reviewing' && (
                  <>
                    <button onClick={() => handleReview(demo._id, 'approved', 100)} disabled={reviewingId === demo._id} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button onClick={() => handleReview(demo._id, 'changes_requested', demo.score)} disabled={reviewingId === demo._id} className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                      Req. Changes
                    </button>
                  </>
                )}
                {demo.status === 'approved' && (
                  <div className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold text-center border border-emerald-100">
                    Approved (Score: {demo.score})
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
