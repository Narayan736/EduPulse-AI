import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Sidebar />
      <div className="p-4 md:p-8 md:ml-64 mt-16 min-h-screen">
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
