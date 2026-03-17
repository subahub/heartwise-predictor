import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Phone, Clock, Star, ExternalLink, Search, Navigation, LocateFixed, AlertCircle, Loader2, ArrowUpDown, Building2, X, Stethoscope, Siren, BedDouble } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { indiaStates, indiaStatesDistricts } from '@/data/indiaLocations';
import { indiaHospitalDatabase, IndiaHospital } from '@/data/indiaHospitals';

interface Hospital {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  rating: number;
  specialty: string;
  hours: string;
  lat: number;
  lng: number;
  distance?: string;
  _dist?: number;
  facilities: string[];
}

const hospitalDatabase: Hospital[] = [
  { id: 1, name: 'UCSF Medical Center', address: '505 Parnassus Ave', city: 'San Francisco', state: 'California', phone: '+1 (415) 476-1000', rating: 4.8, specialty: 'Structural Heart Disease', hours: 'Open 24/7', lat: 37.7631, lng: -122.4586, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Surgery', 'Cath Lab'] },
  { id: 2, name: 'Stanford Heart Center', address: '300 Pasteur Dr', city: 'Palo Alto', state: 'California', phone: '+1 (650) 723-5468', rating: 4.9, specialty: 'Heart Failure & Transplant', hours: 'Open 24/7', lat: 37.4346, lng: -122.1750, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Rehab', 'Cath Lab'] },
  { id: 3, name: 'Cedars-Sinai Heart Institute', address: '8700 Beverly Blvd', city: 'Los Angeles', state: 'California', phone: '+1 (310) 423-3277', rating: 4.8, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 34.0753, lng: -118.3800, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Electrophysiology Lab'] },
  { id: 4, name: 'UC San Diego Sulpizio Cardiovascular Center', address: '9434 Medical Center Dr', city: 'San Diego', state: 'California', phone: '+1 (858) 657-8530', rating: 4.7, specialty: 'Electrophysiology', hours: 'Open 24/7', lat: 32.8755, lng: -117.2350, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Surgery'] },
  { id: 5, name: 'Kaiser Permanente Oakland Medical Center', address: '3600 Broadway', city: 'Oakland', state: 'California', phone: '+1 (510) 752-1000', rating: 4.5, specialty: 'Preventive Cardiology', hours: 'Mon-Sat 7AM-9PM', lat: 37.8127, lng: -122.2640, facilities: ['Cardiology Dept', 'Emergency', 'Cardiac Rehab'] },
  { id: 6, name: 'Hoag Heart & Vascular Institute', address: '1 Hoag Dr', city: 'Newport Beach', state: 'California', phone: '+1 (949) 764-4624', rating: 4.7, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 33.6189, lng: -117.9298, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab'] },
  { id: 7, name: 'NewYork-Presbyterian Heart', address: '177 Fort Washington Ave', city: 'New York', state: 'New York', phone: '+1 (212) 305-7060', rating: 4.9, specialty: 'Heart Transplant', hours: 'Open 24/7', lat: 40.8405, lng: -73.9420, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery', 'Cath Lab', 'Cardiac Rehab'] },
  { id: 8, name: 'Mount Sinai Heart', address: '1 Gustave L. Levy Pl', city: 'New York', state: 'New York', phone: '+1 (212) 241-7911', rating: 4.8, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 40.7903, lng: -73.9524, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Electrophysiology Lab'] },
  { id: 9, name: 'NYU Langone Heart', address: '550 1st Ave', city: 'New York', state: 'New York', phone: '+1 (212) 263-5656', rating: 4.7, specialty: 'Structural Heart Disease', hours: 'Open 24/7', lat: 40.7421, lng: -73.9744, facilities: ['ICU', 'Emergency', 'Cardiac Surgery', 'Cath Lab'] },
  { id: 10, name: 'Texas Heart Institute', address: '6770 Bertner Ave', city: 'Houston', state: 'Texas', phone: '+1 (832) 355-3792', rating: 4.9, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 29.7079, lng: -95.3976, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery', 'Research Lab'] },
  { id: 11, name: 'Baylor Scott & White Heart Hospital', address: '621 N Hall St', city: 'Dallas', state: 'Texas', phone: '+1 (214) 820-0600', rating: 4.7, specialty: 'Electrophysiology', hours: 'Open 24/7', lat: 32.7900, lng: -96.7878, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Electrophysiology Lab'] },
  { id: 12, name: 'UT Southwestern Heart Center', address: '5323 Harry Hines Blvd', city: 'Dallas', state: 'Texas', phone: '+1 (214) 645-8300', rating: 4.8, specialty: 'Heart Failure', hours: 'Mon-Fri 8AM-5PM', lat: 32.8120, lng: -96.8410, facilities: ['ICU', 'Cardiology Dept', 'Cardiac Rehab'] },
  { id: 13, name: 'Cleveland Clinic Heart Center', address: '9500 Euclid Ave', city: 'Cleveland', state: 'Ohio', phone: '+1 (216) 444-2200', rating: 4.9, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 41.5017, lng: -81.6219, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery', 'Cath Lab', 'Research Lab'] },
  { id: 14, name: 'Mayo Clinic Heart Center', address: '200 First St SW', city: 'Rochester', state: 'Minnesota', phone: '+1 (507) 284-2511', rating: 4.9, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 44.0225, lng: -92.4668, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery', 'Cath Lab', 'Cardiac Rehab'] },
  { id: 15, name: 'Massachusetts General Hospital Heart Center', address: '55 Fruit St', city: 'Boston', state: 'Massachusetts', phone: '+1 (617) 726-2000', rating: 4.8, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 42.3631, lng: -71.0686, facilities: ['ICU', 'Emergency', 'Cardiac Surgery', 'Cath Lab'] },
  { id: 16, name: 'Brigham and Women\'s Heart & Vascular Center', address: '75 Francis St', city: 'Boston', state: 'Massachusetts', phone: '+1 (617) 732-5500', rating: 4.8, specialty: 'Preventive Cardiology', hours: 'Open 24/7', lat: 42.3358, lng: -71.1065, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Rehab'] },
  { id: 17, name: 'Mayo Clinic Florida Heart Center', address: '4500 San Pablo Rd S', city: 'Jacksonville', state: 'Florida', phone: '+1 (904) 953-0859', rating: 4.8, specialty: 'Heart Transplant', hours: 'Open 24/7', lat: 30.2600, lng: -81.4480, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cath Lab'] },
  { id: 18, name: 'Cleveland Clinic Florida Heart', address: '2950 Cleveland Clinic Blvd', city: 'Weston', state: 'Florida', phone: '+1 (954) 659-5000', rating: 4.7, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 26.0979, lng: -80.3997, facilities: ['ICU', 'Cardiac Surgery', 'Emergency'] },
  { id: 19, name: 'Northwestern Medicine Heart Center', address: '676 N St Clair St', city: 'Chicago', state: 'Illinois', phone: '+1 (312) 695-4965', rating: 4.7, specialty: 'Electrophysiology', hours: 'Open 24/7', lat: 41.8948, lng: -87.6230, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Electrophysiology Lab'] },
  { id: 20, name: 'University of Chicago Heart & Vascular Center', address: '5841 S Maryland Ave', city: 'Chicago', state: 'Illinois', phone: '+1 (773) 702-9461', rating: 4.6, specialty: 'Structural Heart Disease', hours: 'Mon-Fri 8AM-5PM', lat: 41.7874, lng: -87.6045, facilities: ['ICU', 'Cardiology Dept', 'Research Lab'] },
  { id: 21, name: 'Penn Medicine Heart Center', address: '3400 Spruce St', city: 'Philadelphia', state: 'Pennsylvania', phone: '+1 (215) 662-2000', rating: 4.8, specialty: 'Heart Transplant', hours: 'Open 24/7', lat: 39.9502, lng: -75.1935, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery'] },
  { id: 22, name: 'Johns Hopkins Heart & Vascular Institute', address: '1800 Orleans St', city: 'Baltimore', state: 'Maryland', phone: '+1 (410) 955-5000', rating: 4.9, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 39.2966, lng: -76.5930, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery', 'Research Lab'] },
  { id: 23, name: 'Virginia Mason Heart Institute', address: '1100 9th Ave', city: 'Seattle', state: 'Washington', phone: '+1 (206) 223-6600', rating: 4.6, specialty: 'Preventive Cardiology', hours: 'Mon-Fri 7AM-6PM', lat: 47.6107, lng: -122.3249, facilities: ['Cardiology Dept', 'Cardiac Rehab'] },
  { id: 24, name: 'Emory Heart & Vascular Center', address: '1364 Clifton Rd NE', city: 'Atlanta', state: 'Georgia', phone: '+1 (404) 778-5000', rating: 4.7, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 33.7930, lng: -84.3234, facilities: ['ICU', 'Emergency', 'Cardiac Surgery', 'Cath Lab'] },
  { id: 33, name: 'Royal Brompton & Harefield Hospital', address: 'Sydney St, Chelsea', city: 'London', state: 'England', phone: '+44 20 7352 8121', rating: 4.8, specialty: 'Heart & Lung Disease', hours: 'Open 24/7', lat: 51.4889, lng: -0.1711, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Surgery', 'Research Lab'] },
  { id: 34, name: 'Barts Heart Centre', address: 'W Smithfield', city: 'London', state: 'England', phone: '+44 20 3416 5000', rating: 4.7, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 51.5181, lng: -0.0998, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab', 'Electrophysiology Lab'] },
];

const allStates = [...new Set(hospitalDatabase.map(h => h.state))].sort();
const citiesByState: Record<string, string[]> = {};
hospitalDatabase.forEach(h => {
  if (!citiesByState[h.state]) citiesByState[h.state] = [];
  if (!citiesByState[h.state].includes(h.city)) citiesByState[h.state].push(h.city);
});
Object.values(citiesByState).forEach(arr => arr.sort());

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type LocationMode = 'pending' | 'granted' | 'denied' | 'manual' | 'india';
type SortMode = 'distance' | 'rating';

const facilityIcons: Record<string, typeof Stethoscope> = {
  'ICU': BedDouble,
  'Emergency': Siren,
  'default': Stethoscope,
};

export default function Hospitals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [locationMode, setLocationMode] = useState<LocationMode>('pending');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualState, setManualState] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualApplied, setManualApplied] = useState<{ city: string; state: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortMode>('distance');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // India structured search
  const [showIndiaDialog, setShowIndiaDialog] = useState(false);
  const [indiaState, setIndiaState] = useState('');
  const [indiaDistrict, setIndiaDistrict] = useState('');
  const [indiaApplied, setIndiaApplied] = useState<{ state: string; district: string } | null>(null);

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => setShowPermissionDialog(true), 600);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const requestLocation = useCallback(() => {
    setShowPermissionDialog(false);
    setLoading(true);
    if (!navigator.geolocation) {
      setLocationMode('denied');
      setShowManualDialog(true);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationMode('granted');
        setLoading(false);
      },
      () => {
        setLocationMode('denied');
        setShowManualDialog(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleDenyLocation = () => {
    setShowPermissionDialog(false);
    setLocationMode('denied');
    setShowManualDialog(true);
  };

  const applyManualLocation = () => {
    if (!manualState) return;
    setManualApplied({ city: manualCity, state: manualState });
    setIndiaApplied(null);
    setLocationMode('manual');
    setShowManualDialog(false);
  };

  const applyIndiaLocation = () => {
    if (!indiaState) return;
    setIndiaApplied({ state: indiaState, district: indiaDistrict });
    setManualApplied(null);
    setLocationMode('india');
    setShowIndiaDialog(false);
  };

  const openDirections = (h: Hospital) => {
    let url: string;
    if (userCoords) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${h.lat},${h.lng}&travelmode=driving`;
    } else {
      const q = encodeURIComponent(`${h.name}, ${h.address}, ${h.city}`);
      url = `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
    }
    window.open(url, '_blank');
  };

  if (!user) return null;

  // Build filtered & sorted list
  let results: Hospital[] = [];

  if (locationMode === 'india' && indiaApplied) {
    // Search India hospitals
    let indiaResults = indiaHospitalDatabase.filter(h =>
      h.state.toLowerCase() === indiaApplied.state.toLowerCase()
    );
    if (indiaApplied.district) {
      const districtMatch = indiaResults.filter(h =>
        h.district.toLowerCase() === indiaApplied.district.toLowerCase() ||
        h.city.toLowerCase() === indiaApplied.district.toLowerCase()
      );
      if (districtMatch.length > 0) {
        const rest = indiaResults.filter(h =>
          h.district.toLowerCase() !== indiaApplied.district.toLowerCase() &&
          h.city.toLowerCase() !== indiaApplied.district.toLowerCase()
        );
        indiaResults = [...districtMatch, ...rest];
      }
    }
    // Convert to Hospital type
    results = indiaResults.map(h => ({
      id: h.id, name: h.name, address: h.address, city: h.city, state: h.state,
      phone: h.phone, rating: h.rating, specialty: h.specialty, hours: h.hours,
      lat: h.lat, lng: h.lng, facilities: h.facilities,
    }));
  } else if (locationMode === 'granted' && userCoords) {
    // Combine both databases for distance search
    const allHospitals: Hospital[] = [
      ...hospitalDatabase,
      ...indiaHospitalDatabase.map(h => ({
        id: h.id, name: h.name, address: h.address, city: h.city, state: h.state,
        phone: h.phone, rating: h.rating, specialty: h.specialty, hours: h.hours,
        lat: h.lat, lng: h.lng, facilities: h.facilities,
      })),
    ];
    results = allHospitals.map(h => ({
      ...h,
      _dist: haversineDistance(userCoords.lat, userCoords.lng, h.lat, h.lng),
    })).map(h => ({
      ...h,
      distance: h._dist! < 1 ? `${(h._dist! * 1000).toFixed(0)} m` : h._dist! < 100 ? `${h._dist!.toFixed(1)} km` : `${h._dist!.toFixed(0)} km`,
    }));
  } else if (locationMode === 'manual' && manualApplied) {
    const stateHospitals = hospitalDatabase.filter(h =>
      h.state.toLowerCase() === manualApplied.state.toLowerCase()
    );
    if (manualApplied.city) {
      const cityMatch = stateHospitals.filter(h =>
        h.city.toLowerCase() === manualApplied.city.toLowerCase()
      );
      if (cityMatch.length > 0) {
        const rest = stateHospitals.filter(h => h.city.toLowerCase() !== manualApplied.city.toLowerCase());
        results = [...cityMatch, ...rest];
      } else {
        results = stateHospitals;
      }
    } else {
      results = stateHospitals;
    }
  } else {
    results = [...hospitalDatabase];
  }

  // Sort
  if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'distance' && locationMode === 'granted') {
    results.sort((a, b) => (a._dist || 0) - (b._dist || 0));
  }

  // Search filter
  const filtered = search
    ? results.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.specialty.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()) ||
        h.state.toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase())
      )
    : results;

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      {/* Location Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <LocateFixed className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center">Enable Location Access</DialogTitle>
            <DialogDescription className="text-center">
              Allow CardioGuard to access your location to find the nearest cardiac care centers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={requestLocation} className="w-full gap-2">
              <Navigation className="h-4 w-4" /> Allow Location Access
            </Button>
            <Button variant="outline" onClick={handleDenyLocation} className="w-full">
              Enter Location Manually
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Location Dialog (Global) */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-accent flex items-center justify-center">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center">Enter Your Location</DialogTitle>
            <DialogDescription className="text-center">
              Select your state and city to find nearby cardiac hospitals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">State / Region *</label>
              <Select value={manualState} onValueChange={(v) => { setManualState(v); setManualCity(''); }}>
                <SelectTrigger><SelectValue placeholder="Select state or region" /></SelectTrigger>
                <SelectContent>
                  {allStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">City</label>
              {manualState && citiesByState[manualState] ? (
                <Select value={manualCity} onValueChange={setManualCity}>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {citiesByState[manualState].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input placeholder="Enter city name" value={manualCity} onChange={e => setManualCity(e.target.value)} />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={applyManualLocation} disabled={!manualState} className="w-full gap-2">
              <Search className="h-4 w-4" /> Find Hospitals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* India State → District Dialog */}
      <Dialog open={showIndiaDialog} onOpenChange={setShowIndiaDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center">Search Hospitals in India</DialogTitle>
            <DialogDescription className="text-center">
              Select your state and district to find the nearest cardiac care hospitals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Country</label>
              <Input value="India" disabled className="opacity-60" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">State *</label>
              <Select value={indiaState} onValueChange={(v) => { setIndiaState(v); setIndiaDistrict(''); }}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {indiaStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">District / City</label>
              {indiaState && indiaStatesDistricts[indiaState] ? (
                <Select value={indiaDistrict} onValueChange={setIndiaDistrict}>
                  <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                  <SelectContent>
                    {indiaStatesDistricts[indiaState].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input placeholder="Enter district" value={indiaDistrict} onChange={e => setIndiaDistrict(e.target.value)} />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={applyIndiaLocation} disabled={!indiaState} className="w-full gap-2">
              <Search className="h-4 w-4" /> Find Hospitals in India
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hospital Detail Dialog */}
      <Dialog open={!!selectedHospital} onOpenChange={() => setSelectedHospital(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedHospital && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedHospital.name}</DialogTitle>
                <DialogDescription>{selectedHospital.specialty}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border border-border aspect-video">
                  <iframe
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${selectedHospital.lat},${selectedHospital.lng}&z=15&output=embed`}
                    title={`Map of ${selectedHospital.name}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" /> {selectedHospital.address}, {selectedHospital.city}</p>
                    <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 shrink-0" /> {selectedHospital.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 shrink-0" /> {selectedHospital.hours}</p>
                    <p className="flex items-center gap-2 text-muted-foreground"><Star className="h-4 w-4 shrink-0 text-primary" /> {selectedHospital.rating} / 5.0</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-2">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.facilities.map(f => {
                      const Icon = facilityIcons[f] || facilityIcons['default'];
                      return (
                        <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <Icon className="h-3 w-3" /> {f}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={() => openDirections(selectedHospital)}>
                  <Navigation className="h-4 w-4" /> Get Directions (Google Maps)
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Find Cardiac Care Centers</h1>
            <p className="text-muted-foreground">
              {locationMode === 'granted' && 'Showing hospitals nearest to your current location'}
              {locationMode === 'manual' && manualApplied && `Showing hospitals in ${manualApplied.city ? manualApplied.city + ', ' : ''}${manualApplied.state}`}
              {locationMode === 'india' && indiaApplied && `Showing hospitals in ${indiaApplied.district ? indiaApplied.district + ', ' : ''}${indiaApplied.state}, India`}
              {locationMode === 'pending' && 'Locate nearby hospitals specializing in cardiovascular care'}
              {locationMode === 'denied' && !manualApplied && 'Enter your location to find nearby hospitals'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {locationMode !== 'granted' && (
              <Button size="sm" variant="outline" onClick={requestLocation} className="gap-1.5 shrink-0">
                <LocateFixed className="h-3.5 w-3.5" /> Use My Location
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setShowManualDialog(true)} className="gap-1.5 shrink-0">
              <MapPin className="h-3.5 w-3.5" /> Global Search
            </Button>
            <Button size="sm" onClick={() => setShowIndiaDialog(true)} className="gap-1.5 shrink-0">
              <Building2 className="h-3.5 w-3.5" /> Search India
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8 gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Detecting your location...</span>
          </div>
        )}

        {locationMode === 'granted' && userCoords && (
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
            <Navigation className="h-4 w-4" />
            <span>Location detected — results sorted by distance from you</span>
          </div>
        )}

        {/* Search + Sort */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, specialty, city, or state..." className="pl-10" />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortMode)}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">By Distance</SelectItem>
              <SelectItem value="rating">By Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(h => (
            <div
              key={h.id}
              className="bg-card rounded-xl border border-border p-6 card-glow hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => setSelectedHospital(h)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-heading font-semibold text-foreground text-lg leading-tight">{h.name}</h3>
                <span className="flex items-center gap-1 text-sm text-primary font-medium shrink-0 ml-2">
                  <Star className="h-4 w-4 fill-current" /> {h.rating}
                </span>
              </div>
              <p className="text-sm text-primary font-medium mb-3">{h.specialty}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0" /> {h.address}, {h.city}, {h.state}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0" /> {h.phone}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 flex-shrink-0" /> {h.hours}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {h.facilities.slice(0, 4).map(f => (
                  <span key={f} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">{f}</span>
                ))}
                {h.facilities.length > 4 && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">+{h.facilities.length - 4}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {h.distance ? `${h.distance} away` : `${h.city}, ${h.state}`}
                </span>
                <Button size="sm" variant="outline" className="gap-1" disabled>
                  <ExternalLink className="h-3.5 w-3.5" /> Directions
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No hospitals found matching your criteria.</p>
            <p className="text-sm mt-1">Try broadening your search or changing your location.</p>
            <div className="flex gap-2 justify-center mt-4">
              <Button variant="outline" onClick={() => { setSearch(''); setShowManualDialog(true); }}>
                Global Search
              </Button>
              <Button onClick={() => { setSearch(''); setShowIndiaDialog(true); }}>
                Search India
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
