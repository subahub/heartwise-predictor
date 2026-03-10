import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-heading font-bold text-xl">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              CardioGuard
            </div>
            <p className="text-sm opacity-70">AI-powered cardiovascular disease risk prediction. Empowering early detection for healthier lives.</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm opacity-70">
              <Link to="/" className="block hover:opacity-100 transition-opacity">Home</Link>
              <Link to="/predict" className="block hover:opacity-100 transition-opacity">Risk Assessment</Link>
              <Link to="/hospitals" className="block hover:opacity-100 transition-opacity">Find Hospitals</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Resources</h4>
            <div className="space-y-2 text-sm opacity-70">
              <a href="#" className="block hover:opacity-100 transition-opacity">CVD Awareness</a>
              <a href="#" className="block hover:opacity-100 transition-opacity">Prevention Guidelines</a>
              <a href="#" className="block hover:opacity-100 transition-opacity">Heart Health Tips</a>
              <a href="#" className="block hover:opacity-100 transition-opacity">Emergency Symptoms</a>
              <a href="#" className="block hover:opacity-100 transition-opacity">Research References</a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm opacity-70">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> cardioguard.project@gmail.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 93377 55999</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Tamil Nadu, India</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/10 text-center text-sm opacity-50 space-y-1">
          <p>For queries regarding the Cardiovascular Disease Early Detection system, dataset usage, or technical details, please contact the development team.</p>
          <p>This platform provides educational information only and does not replace professional medical consultation.</p>
          <p>© 2026 CardioGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
