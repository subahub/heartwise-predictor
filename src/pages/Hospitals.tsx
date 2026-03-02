import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Phone, Clock, Star, ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const hospitals = [
  { id: 1, name: 'City Heart Institute', address: '245 Medical Center Dr, San Francisco, CA', phone: '+1 (415) 555-0123', rating: 4.8, specialty: 'Interventional Cardiology', hours: 'Open 24/7', distance: '2.3 mi' },
  { id: 2, name: 'Bay Area Cardiac Center', address: '890 Health Blvd, Oakland, CA', phone: '+1 (510) 555-0456', rating: 4.6, specialty: 'Cardiac Surgery', hours: 'Mon-Sat 7AM-9PM', distance: '5.1 mi' },
  { id: 3, name: 'Pacific Cardiovascular Clinic', address: '1200 Wellness Ave, San Jose, CA', phone: '+1 (408) 555-0789', rating: 4.7, specialty: 'Preventive Cardiology', hours: 'Mon-Fri 8AM-6PM', distance: '8.4 mi' },
  { id: 4, name: 'Golden Gate Heart Hospital', address: '567 Cardiac Lane, Daly City, CA', phone: '+1 (650) 555-0321', rating: 4.9, specialty: 'Electrophysiology', hours: 'Open 24/7', distance: '3.7 mi' },
  { id: 5, name: 'Stanford Heart Center', address: '300 Pasteur Dr, Palo Alto, CA', phone: '+1 (650) 555-0654', rating: 4.9, specialty: 'Heart Failure & Transplant', hours: 'Open 24/7', distance: '12.0 mi' },
  { id: 6, name: 'UCSF Cardiac Care Unit', address: '505 Parnassus Ave, San Francisco, CA', phone: '+1 (415) 555-0987', rating: 4.8, specialty: 'Structural Heart Disease', hours: 'Open 24/7', distance: '1.8 mi' },
];

export default function Hospitals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const filtered = hospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.specialty.toLowerCase().includes(search.toLowerCase()) ||
    h.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Find Cardiac Care Centers</h1>
          <p className="text-muted-foreground">Locate nearby hospitals specializing in cardiovascular care</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, specialty, or location..." className="pl-10" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(h => (
            <div key={h.id} className="bg-card rounded-xl border border-border p-6 card-glow hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-heading font-semibold text-foreground text-lg">{h.name}</h3>
                <span className="flex items-center gap-1 text-sm text-risk-medium font-medium">
                  <Star className="h-4 w-4 fill-current" /> {h.rating}
                </span>
              </div>
              <p className="text-sm text-primary font-medium mb-3">{h.specialty}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0" /> {h.address}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0" /> {h.phone}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 flex-shrink-0" /> {h.hours}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">{h.distance} away</span>
                <Button size="sm" variant="outline" className="gap-1">
                  <ExternalLink className="h-3.5 w-3.5" /> Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No hospitals found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
