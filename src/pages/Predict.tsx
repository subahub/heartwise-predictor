import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { calculateRisk, savePrediction, PatientData, RiskResult } from '@/lib/riskCalculator';
import RiskGauge from '@/components/RiskGauge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Minus, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const steps = ['Personal Info', 'Blood Pressure', 'Lab Results', 'Lifestyle'];

export default function Predict() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [data, setData] = useState<PatientData>({
    age: 45, gender: 1, height: 165, weight: 70,
    ap_hi: 120, ap_lo: 80, cholesterol: 1, gluc: 1,
    smoke: 0, alco: 0, active: 1,
  });

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const update = (key: keyof PatientData, val: number) => setData(prev => ({ ...prev, [key]: val }));

  const handlePredict = () => {
    const r = calculateRisk(data);
    setResult(r);
    savePrediction(data, r);
    toast.success('Assessment complete!');
  };

  const reset = () => { setResult(null); setStep(0); };

  if (result) {
    return (
      <div className="min-h-screen pt-20 pb-10 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold text-foreground">Your Risk Assessment</h1>
              <p className="text-muted-foreground mt-1">Based on 11 cardiovascular risk factors</p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 card-glow">
              <div className="flex justify-center mb-6">
                <RiskGauge score={result.score} level={result.level} size={260} />
              </div>

              {/* Risk Factors */}
              <h3 className="font-heading font-semibold text-foreground mb-3">Risk Factor Breakdown</h3>
              <div className="grid gap-2 mb-6">
                {result.factors.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      {f.impact === 'positive' ? <CheckCircle2 className="h-4 w-4 text-risk-low" /> :
                       f.impact === 'negative' ? <AlertTriangle className="h-4 w-4 text-risk-high" /> :
                       <Minus className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                    </div>
                    <span className={`text-sm ${f.impact === 'positive' ? 'risk-low' : f.impact === 'negative' ? 'risk-high' : 'text-muted-foreground'}`}>
                      {f.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <h3 className="font-heading font-semibold text-foreground mb-3">Recommendations</h3>
              <ul className="space-y-2 mb-6">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <Button onClick={reset} variant="outline" className="gap-2"><RotateCcw className="h-4 w-4" /> New Assessment</Button>
                <Button onClick={() => navigate('/dashboard')} className="gap-2">Go to Dashboard <ArrowRight className="h-4 w-4" /></Button>
                <Button variant="outline" className="gap-2" onClick={() => {
                  const csv = `Date,Score,Level\n${new Date().toISOString()},${result.score},${result.level}`;
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cardioguard_report.csv'; a.click();
                  toast.success('Report downloaded!');
                }}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              ⚠️ This is a screening tool and does not replace professional medical advice. Consult a healthcare provider for clinical decisions.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">Heart Disease Risk Assessment</h1>
          <p className="text-muted-foreground mt-1">Enter your health parameters for an AI-powered risk evaluation</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
              <p className={`text-xs mt-1.5 ${i <= step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 card-glow">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Personal Information</h2>
                  <Field label="Age (years)"><Input type="number" value={data.age} onChange={e => update('age', +e.target.value)} min={1} max={120} /></Field>
                  <Field label="Gender">
                    <Select value={String(data.gender)} onValueChange={v => update('gender', +v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="1">Female</SelectItem><SelectItem value="2">Male</SelectItem></SelectContent>
                    </Select>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Height (cm)"><Input type="number" value={data.height} onChange={e => update('height', +e.target.value)} min={100} max={250} /></Field>
                    <Field label="Weight (kg)"><Input type="number" value={data.weight} onChange={e => update('weight', +e.target.value)} min={20} max={300} /></Field>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Blood Pressure</h2>
                  <Field label="Systolic (ap_hi) mmHg"><Input type="number" value={data.ap_hi} onChange={e => update('ap_hi', +e.target.value)} min={60} max={250} /></Field>
                  <Field label="Diastolic (ap_lo) mmHg"><Input type="number" value={data.ap_lo} onChange={e => update('ap_lo', +e.target.value)} min={40} max={200} /></Field>
                  <div className="bg-accent/50 rounded-lg p-4 text-sm text-accent-foreground">
                    <p className="font-medium">Blood Pressure Guidelines:</p>
                    <p className="text-xs mt-1 text-muted-foreground">Normal: &lt;120/80 • Elevated: 120-129/&lt;80 • High: ≥130/80</p>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Lab Results</h2>
                  <Field label="Cholesterol Level">
                    <Select value={String(data.cholesterol)} onValueChange={v => update('cholesterol', +v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Normal</SelectItem>
                        <SelectItem value="2">Above Normal</SelectItem>
                        <SelectItem value="3">Well Above Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Glucose Level">
                    <Select value={String(data.gluc)} onValueChange={v => update('gluc', +v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Normal</SelectItem>
                        <SelectItem value="2">Above Normal</SelectItem>
                        <SelectItem value="3">Well Above Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Lifestyle</h2>
                  <ToggleField label="Do you smoke?" value={data.smoke} onChange={v => update('smoke', v)} />
                  <ToggleField label="Do you consume alcohol regularly?" value={data.alco} onChange={v => update('alco', v)} />
                  <ToggleField label="Are you physically active?" value={data.active} onChange={v => update('active', v)} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
            ) : (
              <Button onClick={handlePredict} className="gap-2"><Heart className="h-4 w-4" /> Predict Risk</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">{label}</label>{children}</div>;
}

function ToggleField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex gap-2">
        <button onClick={() => onChange(0)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${!value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>No</button>
        <button onClick={() => onChange(1)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>Yes</button>
      </div>
    </div>
  );
}
