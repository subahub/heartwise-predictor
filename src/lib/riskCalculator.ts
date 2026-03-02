export interface PatientData {
  age: number;
  gender: number; // 1=female, 2=male
  height: number;
  weight: number;
  ap_hi: number; // systolic BP
  ap_lo: number; // diastolic BP
  cholesterol: number; // 1=normal, 2=above, 3=well above
  gluc: number; // 1=normal, 2=above, 3=well above
  smoke: number;
  alco: number;
  active: number;
}

export interface RiskResult {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
  factors: { name: string; impact: 'positive' | 'negative' | 'neutral'; detail: string }[];
  recommendations: string[];
}

export function calculateRisk(data: PatientData): RiskResult {
  let score = 0;
  const factors: RiskResult['factors'] = [];

  // BMI
  const bmi = data.weight / ((data.height / 100) ** 2);
  if (bmi >= 30) { score += 18; factors.push({ name: 'BMI', impact: 'negative', detail: `Obese (${bmi.toFixed(1)})` }); }
  else if (bmi >= 25) { score += 10; factors.push({ name: 'BMI', impact: 'negative', detail: `Overweight (${bmi.toFixed(1)})` }); }
  else { factors.push({ name: 'BMI', impact: 'positive', detail: `Normal (${bmi.toFixed(1)})` }); }

  // Systolic BP
  if (data.ap_hi >= 160) { score += 22; factors.push({ name: 'Systolic BP', impact: 'negative', detail: `Stage 2 Hypertension (${data.ap_hi})` }); }
  else if (data.ap_hi >= 140) { score += 16; factors.push({ name: 'Systolic BP', impact: 'negative', detail: `Stage 1 Hypertension (${data.ap_hi})` }); }
  else if (data.ap_hi >= 130) { score += 8; factors.push({ name: 'Systolic BP', impact: 'negative', detail: `Elevated (${data.ap_hi})` }); }
  else { factors.push({ name: 'Systolic BP', impact: 'positive', detail: `Normal (${data.ap_hi})` }); }

  // Diastolic BP
  if (data.ap_lo >= 100) { score += 15; factors.push({ name: 'Diastolic BP', impact: 'negative', detail: `High (${data.ap_lo})` }); }
  else if (data.ap_lo >= 90) { score += 10; factors.push({ name: 'Diastolic BP', impact: 'negative', detail: `Elevated (${data.ap_lo})` }); }
  else { factors.push({ name: 'Diastolic BP', impact: 'positive', detail: `Normal (${data.ap_lo})` }); }

  // Cholesterol
  if (data.cholesterol === 3) { score += 20; factors.push({ name: 'Cholesterol', impact: 'negative', detail: 'Well Above Normal' }); }
  else if (data.cholesterol === 2) { score += 12; factors.push({ name: 'Cholesterol', impact: 'negative', detail: 'Above Normal' }); }
  else { factors.push({ name: 'Cholesterol', impact: 'positive', detail: 'Normal' }); }

  // Glucose
  if (data.gluc === 3) { score += 15; factors.push({ name: 'Glucose', impact: 'negative', detail: 'Well Above Normal' }); }
  else if (data.gluc === 2) { score += 8; factors.push({ name: 'Glucose', impact: 'negative', detail: 'Above Normal' }); }
  else { factors.push({ name: 'Glucose', impact: 'positive', detail: 'Normal' }); }

  // Age
  if (data.age >= 60) { score += 15; factors.push({ name: 'Age', impact: 'negative', detail: `${data.age} years (high risk)` }); }
  else if (data.age >= 45) { score += 8; factors.push({ name: 'Age', impact: 'negative', detail: `${data.age} years (moderate risk)` }); }
  else { factors.push({ name: 'Age', impact: 'positive', detail: `${data.age} years` }); }

  // Lifestyle
  if (data.smoke) { score += 10; factors.push({ name: 'Smoking', impact: 'negative', detail: 'Active smoker' }); }
  else { factors.push({ name: 'Smoking', impact: 'positive', detail: 'Non-smoker' }); }

  if (data.alco) { score += 5; factors.push({ name: 'Alcohol', impact: 'negative', detail: 'Regular consumption' }); }
  else { factors.push({ name: 'Alcohol', impact: 'positive', detail: 'Low/No consumption' }); }

  if (!data.active) { score += 10; factors.push({ name: 'Physical Activity', impact: 'negative', detail: 'Sedentary lifestyle' }); }
  else { factors.push({ name: 'Physical Activity', impact: 'positive', detail: 'Active lifestyle' }); }

  // Male gender slightly higher risk
  if (data.gender === 2) score += 3;

  score = Math.min(100, Math.max(0, score));

  const level: RiskResult['level'] = score < 30 ? 'low' : score < 60 ? 'medium' : 'high';

  const recommendations: string[] = [];
  if (bmi >= 25) recommendations.push('Work towards a healthy BMI through balanced diet and exercise.');
  if (data.ap_hi >= 130) recommendations.push('Monitor blood pressure regularly. Consider dietary changes to reduce sodium.');
  if (data.cholesterol > 1) recommendations.push('Consult your doctor about cholesterol management and lipid-lowering strategies.');
  if (data.gluc > 1) recommendations.push('Monitor blood glucose levels. Consider screening for diabetes.');
  if (data.smoke) recommendations.push('Quitting smoking is the single most impactful change for heart health.');
  if (!data.active) recommendations.push('Aim for at least 150 minutes of moderate exercise per week.');
  if (data.alco) recommendations.push('Limit alcohol intake to reduce cardiovascular strain.');
  if (recommendations.length === 0) recommendations.push('Maintain your healthy lifestyle! Continue regular check-ups.');

  return { score, level, factors, recommendations };
}

export function savePrediction(data: PatientData, result: RiskResult) {
  const history = getPredictionHistory();
  history.push({ ...data, ...result, date: new Date().toISOString(), id: crypto.randomUUID() });
  localStorage.setItem('cardioguard_history', JSON.stringify(history));
}

export function getPredictionHistory(): (PatientData & RiskResult & { date: string; id: string })[] {
  try {
    return JSON.parse(localStorage.getItem('cardioguard_history') || '[]');
  } catch { return []; }
}
