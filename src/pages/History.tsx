import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPredictionHistory } from '@/lib/riskCalculator';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Download, Trash2, FileText, FileSpreadsheet, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const history = getPredictionHistory();
  const [showExportDialog, setShowExportDialog] = useState(false);

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
    toast.success('CSV exported!');
    setShowExportDialog(false);
  };

  const exportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const data = history.map(h => ({
        Date: new Date(h.date).toLocaleDateString(),
        'Risk Score': h.score,
        'Risk Level': h.level.charAt(0).toUpperCase() + h.level.slice(1),
        Age: h.age,
        'BP Systolic': h.ap_hi,
        'BP Diastolic': h.ap_lo,
        Cholesterol: h.cholesterol === 1 ? 'Normal' : h.cholesterol === 2 ? 'Above Normal' : 'High',
        Glucose: h.gluc === 1 ? 'Normal' : h.gluc === 2 ? 'Above Normal' : 'High',
        BMI: +(h.weight / ((h.height / 100) ** 2)).toFixed(1),
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: 16 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Health History');
      XLSX.writeFile(wb, 'cardioguard_history.xlsx');
      toast.success('Excel exported!');
      setShowExportDialog(false);
    } catch {
      toast.error('Failed to export Excel.');
    }
  };

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(20, 83, 93);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CardioGuard', 15, 16);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Cardiovascular Health Report', 15, 24);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 30);

      // Patient Info
      doc.setTextColor(40, 40, 40);
      let y = 45;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Patient Summary', 15, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Patient: ${user?.email || 'N/A'}`, 15, y);
      doc.text(`Total Assessments: ${history.length}`, pageWidth / 2, y);
      y += 6;

      if (history.length > 0) {
        const latest = history[history.length - 1];
        doc.text(`Latest Score: ${latest.score}/100 (${latest.level.charAt(0).toUpperCase() + latest.level.slice(1)} Risk)`, 15, y);
        doc.text(`Latest BP: ${latest.ap_hi}/${latest.ap_lo} mmHg`, pageWidth / 2, y);
        y += 6;
        const bmi = (latest.weight / ((latest.height / 100) ** 2)).toFixed(1);
        doc.text(`BMI: ${bmi}`, 15, y);
        doc.text(`Age: ${latest.age}`, pageWidth / 2, y);
      }

      y += 12;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Assessment History', 15, y);
      y += 4;

      // Table
      const tableData = history.slice().reverse().map(h => [
        new Date(h.date).toLocaleDateString(),
        String(h.score),
        h.level.charAt(0).toUpperCase() + h.level.slice(1),
        String(h.age),
        `${h.ap_hi}/${h.ap_lo}`,
        h.cholesterol === 1 ? 'Normal' : h.cholesterol === 2 ? 'Above' : 'High',
        (h.weight / ((h.height / 100) ** 2)).toFixed(1),
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Date', 'Score', 'Risk', 'Age', 'BP', 'Cholesterol', 'BMI']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [20, 83, 93], textColor: 255, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 248, 250] },
        margin: { left: 15, right: 15 },
      });

      // Footer disclaimer
      const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, finalY + 10, pageWidth - 15, finalY + 10);
      doc.setFontSize(7);
      doc.setTextColor(130, 130, 130);
      doc.text('This report is generated by CardioGuard for educational purposes only and does not replace professional medical consultation.', 15, finalY + 15);
      doc.text(`© ${new Date().getFullYear()} CardioGuard. All rights reserved.`, 15, finalY + 19);

      doc.save('cardioguard_report.pdf');
      toast.success('PDF report exported!');
      setShowExportDialog(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF.');
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('cardioguard_history');
    window.location.reload();
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Export Health Report</DialogTitle>
            <DialogDescription>Choose your preferred export format.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={exportPDF}>
              <FileText className="h-5 w-5 text-destructive" /> PDF Report
              <span className="ml-auto text-xs text-muted-foreground">Professional format</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" onClick={exportExcel}>
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Excel (.xlsx)
              <span className="ml-auto text-xs text-muted-foreground">Spreadsheet</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" onClick={exportCSV}>
              <FileDown className="h-5 w-5 text-muted-foreground" /> CSV
              <span className="ml-auto text-xs text-muted-foreground">Raw data</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Health History</h1>
            <p className="text-muted-foreground">{history.length} assessments recorded</p>
          </div>
          <div className="flex gap-2">
            {history.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)} className="gap-1"><Download className="h-4 w-4" /> Export Report</Button>
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
