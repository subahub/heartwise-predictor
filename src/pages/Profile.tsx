import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Calendar, Save, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setName(user.name || '');
    setPhone(user.phone || '');
    setAge(user.age ? String(user.age) : '');
    setGender(user.gender || '');
    const saved = localStorage.getItem(`cardioguard_photo_${user.id}`);
    if (saved) setPhoto(saved);
  }, [user, navigate]);

  if (!user) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Please select a JPG or PNG image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      localStorage.setItem(`cardioguard_photo_${user.id}`, dataUrl);
      toast.success('Profile photo updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile({ name, phone, age: age ? +age : undefined, gender });
    toast.success('Profile updated!');
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      <div className="container mx-auto px-4 max-w-xl space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal and health details</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 card-glow space-y-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                title="Change photo"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground text-lg">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={name} onChange={e => setName(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={user.email} disabled className="pl-10 opacity-60" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="pl-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="45" className="pl-10" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Gender</label>
              <Input value={gender} onChange={e => setGender(e.target.value)} placeholder="Male / Female" />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full gap-2 mt-2"><Save className="h-4 w-4" /> Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
