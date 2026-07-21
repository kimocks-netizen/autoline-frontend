import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { FileText, Image, Wrench, MessageSquare } from 'lucide-react';

const sections = [
  {
    to: '/admin/quotes',
    icon: <MessageSquare className="w-8 h-8" />,
    label: 'Quote Requests',
    desc: 'View and manage incoming quote requests from customers.',
    color: 'bg-primary-blue',
  },
  {
    to: '/admin/invoices',
    icon: <FileText className="w-8 h-8" />,
    label: 'Invoices & Quotes',
    desc: 'Create, edit and manage invoices and quote documents.',
    color: 'bg-primary-red',
  },
  {
    to: '/admin/gallery-edit',
    icon: <Image className="w-8 h-8" />,
    label: 'Gallery',
    desc: 'Upload and manage project gallery images.',
    color: 'bg-primary-blue',
  },
  {
    to: '/admin/services-edit',
    icon: <Wrench className="w-8 h-8" />,
    label: 'Services',
    desc: 'Add, edit or remove services shown on the website.',
    color: 'bg-primary-red',
  },
];

const AdminLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authStr = localStorage.getItem('auth');
    if (!authStr) { navigate('/admin'); return; }
    try {
      const { token, expiresAt } = JSON.parse(authStr);
      if (!token || Date.now() > expiresAt) { localStorage.removeItem('auth'); navigate('/admin'); }
    } catch { navigate('/admin'); }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-primary-red font-semibold text-sm uppercase tracking-widest mb-1">Admin Portal</p>
          <h1 className="text-2xl font-black text-gray-900">
            Welcome back, <span className="text-primary-blue">Admin</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Select a section below to get started.</p>
        </div>

        {/* Accent stripe */}
        <div
          className="h-1 w-full rounded-full mb-10"
          style={{ background: 'linear-gradient(90deg, #2563EB 0%, #DC2626 100%)' }}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map(s => (
            <Link
              key={s.to}
              to={s.to}
              className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-5"
            >
              <div className={`${s.color} text-white rounded-lg p-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                {s.icon}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-1">{s.label}</h2>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLanding;
