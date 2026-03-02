import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPredictionHistory } from '@/lib/riskCalculator';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const history = getPredictionHistory();

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const chartData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: h.score,
    bp: h.ap_hi,
    bmi: +(h.weight / ((h.height / 100) ** 2)).toFixed(1),
  }));

  const exportCSV = () => {
    const header = 'Date,Score,Level,Age,BP_Systolic,BP_Diastolic,Cholesterol,Glucose,BMI\n';
    const rows = history.map(h => {
      const bmi = (h.weight / ((h.height / 100) ** 2)).toFixed(1);
      return `${h.date},${h.score},${h.level},${h.age},${h.ap_hi},${h.ap_lo},${h.cholesterol},${h.gluc},${bmi}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cardioguard_history.csv'; a.click();
    toast.success('History exported!');
  };

  const clearHistory = () => {
    localStorage.removeItem('cardioguard_history');
    window.location.reload();
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Health History</h1>
            <p className="text-muted-foreground">{history.length} assessments recorded</p>
          </div>
          <div className="flex gap-2">
            {history.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1"><Download className="h-4 w-4" /> Export CSV</Button>
                <Button variant="ghost" size="sm" onClick={clearHistory} className="gap-1 text-destructive"><Trash2 className="h-4 w-4" /> Clear</Button>
              </>
            )}
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center card-glow">
            <Activity className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No assessments yet</h3>
            <p className="text-muted-foreground mb-4">Complete your first cardiovascular risk assessment to start tracking.</p>
            <Link to="/predict"><Button>Start Assessment</Button></Link>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6 card-glow">
                <h3 className="font-heading font-semibold text-foreground mb-4">Risk Score Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 card-glow">
                <h3 className="font-heading font-semibold text-foreground mb-4">Systolic BP Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="bp" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border card-glow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Level</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">BP</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">BMI</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cholesterol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice().reverse().map(h => (
                      <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-foreground">{new Date(h.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-heading font-bold text-foreground">{h.score}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            h.level === 'low' ? 'bg-risk-low/10 risk-low' : h.level === 'medium' ? 'bg-risk-medium/10 risk-medium' : 'bg-risk-high/10 risk-high'
                          }`}>
                            {h.level.charAt(0).toUpperCase() + h.level.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{h.ap_hi}/{h.ap_lo}</td>
                        <td className="px-4 py-3 text-muted-foreground">{(h.weight / ((h.height / 100) ** 2)).toFixed(1)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{h.cholesterol === 1 ? 'Normal' : h.cholesterol === 2 ? 'Above' : 'High'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
