import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Menu, X, LogOut, User, BarChart3, Activity, MapPin, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/predict', label: 'Predict', icon: Activity },
        { to: '/history', label: 'History', icon: BarChart3 },
        { to: '/hospitals', label: 'Hospitals', icon: MapPin },
        { to: '/profile', label: 'Profile', icon: User },
      ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-foreground">
          <Heart className="h-7 w-7 text-primary fill-primary heartbeat-glow" />
          CardioGuard
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">Hi, {user.name.split(' ')[0]}</span>
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/register"><Button size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            {user ? (
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm" className="w-full">Sign In</Button></Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Get Started</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
