import { PatientData, RiskResult } from '@/lib/riskCalculator';
import { toast } from 'sonner';

function cholesterolLabel(v: number) { return v === 1 ? 'Normal' : v === 2 ? 'Above Normal' : 'Well Above Normal'; }
function glucoseLabel(v: number) { return v === 1 ? 'Normal' : v === 2 ? 'Above Normal' : 'Well Above Normal'; }
function genderLabel(v: number) { return v === 1 ? 'Female' : 'Male'; }
function bmi(d: PatientData) { return (d.weight / ((d.height / 100) ** 2)).toFixed(1); }

export async function exportPredictionCSV(data: PatientData, result: RiskResult) {
  const lines = [
    'Field,Value',
    `Date,"${new Date().toLocaleString()}"`,
    `Risk Score,${result.score}`,
    `Risk Level,${result.level}`,
    `Age,${data.age}`,
    `Gender,${genderLabel(data.gender)}`,
    `Height (cm),${data.height}`,
    `Weight (kg),${data.weight}`,
    `BMI,${bmi(data)}`,
    `Systolic BP,${data.ap_hi}`,
    `Diastolic BP,${data.ap_lo}`,
    `Cholesterol,${cholesterolLabel(data.cholesterol)}`,
    `Glucose,${glucoseLabel(data.gluc)}`,
    `Smoker,${data.smoke ? 'Yes' : 'No'}`,
    `Alcohol,${data.alco ? 'Yes' : 'No'}`,
    `Physically Active,${data.active ? 'Yes' : 'No'}`,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cardioguard_report.csv'; a.click();
  toast.success('CSV exported!');
}

export async function exportPredictionPDF(data: PatientData, result: RiskResult) {
  try {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pw = doc.internal.pageSize.getWidth();
    const now = new Date().toLocaleString();

    // Header
    doc.setFillColor(20, 83, 93);
    doc.rect(0, 0, pw, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text('CardioGuard', 15, 17);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text('Cardiovascular Risk Assessment Report', 15, 25);
    doc.setFontSize(9);
    doc.text(`Generated: ${now}`, 15, 32);

    let y = 48;
    doc.setTextColor(40, 40, 40);

    // Risk Summary
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Risk Assessment Summary', 15, y); y += 8;
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text(`Risk Score: ${result.score} / 100`, 15, y);
    doc.text(`Risk Level: ${result.level.charAt(0).toUpperCase() + result.level.slice(1)}`, pw / 2, y); y += 12;

    // Patient Data Table
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Patient Input Data', 15, y); y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Parameter', 'Value']],
      body: [
        ['Age', `${data.age} years`],
        ['Gender', genderLabel(data.gender)],
        ['Height', `${data.height} cm`],
        ['Weight', `${data.weight} kg`],
        ['BMI', bmi(data)],
        ['Systolic Blood Pressure', `${data.ap_hi} mmHg`],
        ['Diastolic Blood Pressure', `${data.ap_lo} mmHg`],
        ['Cholesterol', cholesterolLabel(data.cholesterol)],
        ['Glucose', glucoseLabel(data.gluc)],
        ['Smoking', data.smoke ? 'Yes' : 'No'],
        ['Alcohol Consumption', data.alco ? 'Yes' : 'No'],
        ['Physical Activity', data.active ? 'Yes' : 'No'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [20, 83, 93], textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 248, 250] },
      margin: { left: 15, right: 15 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } },
    });

    y = (doc as any).lastAutoTable?.finalY + 10 || y + 80;

    // Risk Factors
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Risk Factor Breakdown', 15, y); y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Factor', 'Status', 'Detail']],
      body: result.factors.map(f => [f.name, f.impact === 'positive' ? '✓ Positive' : f.impact === 'negative' ? '✗ Negative' : '— Neutral', f.detail]),
      theme: 'grid',
      headStyles: { fillColor: [20, 83, 93], textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 248, 250] },
      margin: { left: 15, right: 15 },
    });

    y = (doc as any).lastAutoTable?.finalY + 10 || y + 40;

    // Recommendations
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', 15, y); y += 7;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    result.recommendations.forEach(r => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`• ${r}`, 18, y); y += 6;
    });

    // Footer
    y += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, pw - 15, y);
    doc.setFontSize(7); doc.setTextColor(130, 130, 130);
    doc.text('This report is generated by CardioGuard for educational purposes only and does not replace professional medical consultation.', 15, y + 5);
    doc.text(`© ${new Date().getFullYear()} CardioGuard. All rights reserved.`, 15, y + 9);

    doc.save('cardioguard_report.pdf');
    toast.success('PDF report exported!');
  } catch (e) {
    console.error(e);
    toast.error('Failed to generate PDF.');
  }
}

export async function exportPredictionDOCX(data: PatientData, result: RiskResult) {
  try {
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } = await import('docx');
    const { saveAs } = await import('file-saver');
    const now = new Date().toLocaleString();

    const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
    const cellBorders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };

    function makeRow(label: string, value: string) {
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22 })] })], borders: cellBorders, width: { size: 40, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: value, size: 22 })] })], borders: cellBorders, width: { size: 60, type: WidthType.PERCENTAGE } }),
        ],
      });
    }

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: 'CardioGuard', bold: true, size: 36, color: '14535D' })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: 'Cardiovascular Risk Assessment Report', size: 24, color: '666666' })], alignment: AlignmentType.CENTER, spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: `Generated: ${now}`, size: 20, color: '999999' })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }),

          new Paragraph({ text: 'Risk Assessment Summary', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `Risk Score: ${result.score} / 100`, bold: true, size: 24 }), new TextRun({ text: `   |   Risk Level: ${result.level.charAt(0).toUpperCase() + result.level.slice(1)}`, size: 24 })] }),

          new Paragraph({ text: 'Patient Input Data', heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeRow('Age', `${data.age} years`),
              makeRow('Gender', genderLabel(data.gender)),
              makeRow('Height', `${data.height} cm`),
              makeRow('Weight', `${data.weight} kg`),
              makeRow('BMI', bmi(data)),
              makeRow('Systolic BP', `${data.ap_hi} mmHg`),
              makeRow('Diastolic BP', `${data.ap_lo} mmHg`),
              makeRow('Cholesterol', cholesterolLabel(data.cholesterol)),
              makeRow('Glucose', glucoseLabel(data.gluc)),
              makeRow('Smoking', data.smoke ? 'Yes' : 'No'),
              makeRow('Alcohol', data.alco ? 'Yes' : 'No'),
              makeRow('Physical Activity', data.active ? 'Yes' : 'No'),
            ],
          }),

          new Paragraph({ text: 'Risk Factor Breakdown', heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
          ...result.factors.map(f =>
            new Paragraph({
              children: [
                new TextRun({ text: `${f.impact === 'positive' ? '✓' : f.impact === 'negative' ? '✗' : '—'} ${f.name}: `, bold: true, size: 22 }),
                new TextRun({ text: f.detail, size: 22 }),
              ],
              spacing: { after: 60 },
            })
          ),

          new Paragraph({ text: 'Recommendations', heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }),
          ...result.recommendations.map(r =>
            new Paragraph({ children: [new TextRun({ text: `• ${r}`, size: 22 })], spacing: { after: 60 } })
          ),

          new Paragraph({ children: [new TextRun({ text: '', size: 10 })], spacing: { before: 400 } }),
          new Paragraph({ children: [new TextRun({ text: 'This report is generated by CardioGuard for educational purposes only and does not replace professional medical consultation.', size: 16, color: '999999', italics: true })], alignment: AlignmentType.CENTER }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'cardioguard_report.docx');
    toast.success('Word document exported!');
  } catch (e) {
    console.error(e);
    toast.error('Failed to generate Word document.');
  }
}
