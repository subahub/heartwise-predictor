import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPredictionHistory } from '@/lib/riskCalculator';
import { Activity, BarChart3, Heart, ArrowRight, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const history = getPredictionHistory();
  const latest = history[history.length - 1];

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const chartData = history.slice(-10).map(h => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: h.score,
  }));

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Welcome, {user.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Your cardiovascular health dashboard</p>
          </div>
          <Link to="/predict">
            <Button className="gap-2">
              <Activity className="h-4 w-4" /> New Assessment <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Heart}
            label="Latest Risk Score"
            value={latest ? `${latest.score}/100` : '—'}
            sub={latest ? latest.level.charAt(0).toUpperCase() + latest.level.slice(1) + ' Risk' : 'No assessment yet'}
            color={latest?.level === 'high' ? 'destructive' : latest?.level === 'medium' ? 'warning' : 'primary'}
          />
          <StatCard icon={BarChart3} label="Total Assessments" value={String(history.length)} sub="All time" color="primary" />
          <StatCard icon={TrendingUp} label="Trend" value={history.length >= 2 ? (history[history.length - 1].score <= history[history.length - 2].score ? 'Improving' : 'Worsening') : '—'} sub="vs last assessment" color="primary" />
          <StatCard icon={Clock} label="Last Check" value={latest ? new Date(latest.date).toLocaleDateString() : 'Never'} sub={latest ? 'Last assessment date' : 'Start your first assessment'} color="primary" />
        </div>

        {/* Chart + Recent */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 card-glow">
            <h3 className="font-heading font-semibold text-foreground mb-4">Risk Score Trend</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
                <p>No assessment data yet.</p>
                <Link to="/predict"><Button variant="outline" size="sm" className="mt-3">Take your first assessment</Button></Link>
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 card-glow">
            <h3 className="font-heading font-semibold text-foreground mb-4">Recent Assessments</h3>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.slice(-5).reverse().map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{new Date(h.date).toLocaleDateString()}</p>
                      <p className={`text-xs ${h.level === 'high' ? 'risk-high' : h.level === 'medium' ? 'risk-medium' : 'risk-low'}`}>
                        {h.level.charAt(0).toUpperCase() + h.level.slice(1)} Risk
                      </p>
                    </div>
                    <span className={`font-heading font-bold text-lg ${h.level === 'high' ? 'risk-high' : h.level === 'medium' ? 'risk-medium' : 'risk-low'}`}>
                      {h.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No assessments yet.</p>
            )}
            {history.length > 0 && (
              <Link to="/history"><Button variant="ghost" size="sm" className="w-full mt-4">View All History</Button></Link>
            )}
          </div>
        </div>

        {/* Alerts */}
        {latest && latest.level === 'high' && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">High Risk Alert</h4>
              <p className="text-sm text-muted-foreground mt-1">Your latest assessment indicates elevated cardiovascular risk. We strongly recommend consulting a cardiologist.</p>
              <Link to="/hospitals"><Button variant="outline" size="sm" className="mt-3">Find Nearby Hospitals</Button></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 card-glow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color === 'destructive' ? 'bg-destructive/10' : 'bg-accent'}`}>
          <Icon className={`h-5 w-5 ${color === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
