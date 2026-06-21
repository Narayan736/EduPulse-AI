import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  MessageSquarePlus, 
  MonitorPlay,
  BarChart3,
  BrainCircuit
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  
  if (!user) return null;

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
    { name: 'Standups', path: '/student/standup', icon: MessageSquarePlus },
    { name: 'Demos', path: '/student/demo', icon: MonitorPlay },
  ];

  const instructorLinks = [
    { name: 'Dashboard', path: '/instructor/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', path: '/instructor/attendance', icon: CalendarCheck },
    { name: 'Standups', path: '/instructor/standups', icon: MessageSquarePlus },
    { name: 'Demos', path: '/instructor/demos', icon: MonitorPlay },
    { name: 'Analytics', path: '/instructor/analytics', icon: BarChart3 },
    { name: 'AI Insights', path: '/instructor/ai-insights', icon: BrainCircuit },
  ];

  const links = user.role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 pt-20 transition-transform -translate-x-full bg-white border-r border-gray-100 shadow-sm md:translate-x-0">
      <div className="overflow-y-auto py-5 px-4 h-full">
        <div className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-3">
          Menu
        </div>
        <ul className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 transition duration-200 group-hover:scale-110" />
                  <span className="ml-3 tracking-wide">{link.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
