import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Send, 
  RotateCcw, 
  Layers, 
  ArrowRight,
  Info,
  Loader2
} from 'lucide-react';
import { EcgAnalysisInput, EcgAnalysisResult, UrgencyLevel } from '../types';
import { CLINICAL_PRESETS } from '../data/mockData';
import { EcgCanvas } from './EcgCanvas';

interface AiAssistantScreenProps {
  onNavigateToChat: (initialMessage?: string) => void;
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({ onNavigateToChat }) => {
  const [formData, setFormData] = useState<EcgAnalysisInput>({
    heartRate: 75,
    rhythm: 'Sinus',
    pWavePresent: 'Present',
    qrsWidth: 'Normal (<120ms)',
    stChanges: 'None (Isoelectric)',
    axisDeviation: 'Normal (0 to +90°)',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EcgAnalysisResult | null>(null);
  const [activeWaveType, setActiveWaveType] = useState('NSR');

  const handlePresetSelect = (preset: typeof CLINICAL_PRESETS[0]) => {
    setFormData({
      heartRate: preset.data.heartRate,
      rhythm: preset.data.rhythm,
      pWavePresent: preset.data.pWavePresent,
      qrsWidth: preset.data.qrsWidth,
      stChanges: preset.data.stChanges,
      axisDeviation: preset.data.axisDeviation,
      notes: preset.data.notes,
    });

    if (preset.name.includes('STEMI')) setActiveWaveType('STEMI');
    else if (preset.name.includes('AFib')) setActiveWaveType('AFIB');
    else if (preset.name.includes('Hyperkalemia')) setActiveWaveType('HYPERKALEMIA');
    else if (preset.name.includes('LBBB')) setActiveWaveType('LBBB');
    else if (preset.name.includes('WPW')) setActiveWaveType('WPW');
    else setActiveWaveType('NSR');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/analyze-ecg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
      }
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-300 font-extrabold';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'Moderate':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                Gemini AI Decision Support
              </span>
              <span className="text-xs text-slate-500 font-mono">Clinical Parameter Analysis Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              AI ECG Interpretation Assistant
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select or input key ECG parameters to generate a structured medical report with differentials and next steps.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Pre-loaded Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {CLINICAL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-teal-800 text-[11px] font-bold border border-slate-200 transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parameter Form & Simulated Tracing */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleAnalyze} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>ECG Parameter Input Form</span>
            </h2>

            {/* Heart Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Heart Rate (BPM)</span>
                <span className="text-teal-700 font-extrabold">{formData.heartRate} bpm</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                value={formData.heartRate}
                onChange={(e) => setFormData({ ...formData, heartRate: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Rhythm Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Rhythm Regularity</label>
              <select
                value={formData.rhythm}
                onChange={(e) => setFormData({ ...formData, rhythm: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-teal-500 outline-none"
              >
                <option value="Sinus">Sinus (Regular)</option>
                <option value="Irregularly Irregular">Irregularly Irregular (AFib)</option>
                <option value="Regular Tachycardia">Regular Tachycardia (SVT/VT)</option>
                <option value="Sinus Bradycardia">Sinus Bradycardia</option>
                <option value="Junctional">Junctional / Paced</option>
              </select>
            </div>

            {/* P-wave Presence */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">P-Wave Morphology</label>
              <select
                value={formData.pWavePresent}
                onChange={(e) => setFormData({ ...formData, pWavePresent: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-teal-500 outline-none"
              >
                <option value="Present">Present (Normal Upright in II)</option>
                <option value="Absent (Fibrillatory)">Absent / Fibrillatory Baseline</option>
                <option value="Sawtooth (Flutter)">Sawtooth F-Waves (Atrial Flutter)</option>
                <option value="Short PR <120ms (Delta wave)">Short PR + Delta Wave (WPW)</option>
                <option value="Inverted / Retrograde">Inverted / Retrograde</option>
              </select>
            </div>

            {/* QRS Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">QRS Duration / Width</label>
              <select
                value={formData.qrsWidth}
                onChange={(e) => setFormData({ ...formData, qrsWidth: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-teal-500 outline-none"
              >
                <option value="Normal (<120ms)">Normal (&lt;120ms)</option>
                <option value="Prolonged (≥120ms) - LBBB">Prolonged (≥120ms) - LBBB Pattern</option>
                <option value="Prolonged (≥120ms) - RBBB">Prolonged (≥120ms) - RBBB Pattern</option>
                <option value="Wide Monomorphic Complex">Wide Monomorphic Complex (VT)</option>
              </select>
            </div>

            {/* ST-Segment Changes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">ST-Segment Changes</label>
              <select
                value={formData.stChanges}
                onChange={(e) => setFormData({ ...formData, stChanges: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-teal-500 outline-none"
              >
                <option value="None (Isoelectric)">None (Isoelectric)</option>
                <option value="Convex ST Elevation in V1-V4">Convex ST Elevation in V1-V4 (Anterior)</option>
                <option value="ST Elevation in II, III, aVF">ST Elevation in II, III, aVF (Inferior)</option>
                <option value="Diffuse Concave ST Elevation">Diffuse Concave ST Elevation (Pericarditis)</option>
                <option value="ST Depression / T-Wave Inversion">ST Depression / T-Wave Inversion (Ischemia)</option>
                <option value="Tall Peaked T Waves in V2-V5">Tall Peaked T Waves (Hyperkalemia)</option>
              </select>
            </div>

            {/* Cardiac Axis */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Cardiac Axis</label>
              <select
                value={formData.axisDeviation}
                onChange={(e) => setFormData({ ...formData, axisDeviation: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-teal-500 outline-none"
              >
                <option value="Normal (0 to +90°)">Normal Axis (0° to +90°)</option>
                <option value="Left Axis Deviation (-30 to -90°)">Left Axis Deviation (-30° to -90°)</option>
                <option value="Right Axis Deviation (+90 to +180°)">Right Axis Deviation (+90° to +180°)</option>
                <option value="Extreme / Northwest Axis">Extreme / Northwest Axis (-90° to 180°)</option>
              </select>
            </div>

            {/* Clinical Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Patient Symptoms & Context</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g., 58yo male with 2 hours of crushing chest pain radiating to left arm..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-teal-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition shadow-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Parameters via Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Medical Report</span>
                </>
              )}
            </button>
          </form>

          {/* Dynamic ECG Waveform Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Simulated Dynamic Waveform
            </span>
            <EcgCanvas waveType={activeWaveType} height={160} bpm={formData.heartRate} title="Real-time Parameter Wave Trace" />
          </div>
        </div>

        {/* Right Column: AI Analysis Report Output */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm animate-fadeIn">
              {/* Header Badge & Urgency Tag */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AI Diagnostic Report
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{result.primaryDiagnosis}</h2>
                </div>

                <div className={`px-3.5 py-1.5 rounded-full border font-bold text-xs flex items-center space-x-1.5 shrink-0 ${getUrgencyBadge(result.urgencyLevel)}`}>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Urgency: {result.urgencyLevel}</span>
                </div>
              </div>

              {/* Differential Diagnoses Tags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Differential Diagnoses</span>
                <div className="flex flex-wrap gap-2">
                  {result.differentialDiagnoses.map((diff, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
                      {diff}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Findings Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Structured Findings Breakdown</span>
                </h3>

                <div className="space-y-2 text-xs text-slate-700 font-sans">
                  <p><strong>Rate & Rhythm:</strong> {result.keyFindings.rateAndRhythm}</p>
                  <p><strong>Intervals:</strong> {result.keyFindings.intervals}</p>
                  <p><strong>ST-T Changes:</strong> {result.keyFindings.stTChanges}</p>
                  <p><strong>Cardiac Axis:</strong> {result.keyFindings.axisAnalysis}</p>
                </div>
              </div>

              {/* Next Steps & Management Plan */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Immediate Clinical Management & Next Steps</span>
                </h3>

                <ul className="space-y-2">
                  {result.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Pearls Callout */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-2">
                <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center space-x-2">
                  <Info className="w-4 h-4 text-teal-600" />
                  <span>Teaching Pearls</span>
                </h3>
                <ul className="space-y-1.5">
                  {result.clinicalPearls.map((pearl, idx) => (
                    <li key={idx} className="text-xs text-slate-800 flex items-start space-x-2">
                      <span className="text-teal-600 font-bold shrink-0">★</span>
                      <span>{pearl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chat Deep Dive Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateToChat(`I'm reviewing the AI report for ${result.primaryDiagnosis}. Could you explain the management protocol step-by-step?`)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs transition flex items-center space-x-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Discuss Report in Dr. ECG Mentor Chat</span>
                </button>
              </div>
            </div>
          ) : (
            /* PLACEHOLDER WHEN NO ANALYSIS RUN YET */
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[480px] shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900">Ready for Analysis</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a clinical preset on top or adjust the parameter sliders on the left, then click <strong>"Generate Medical Report"</strong> to generate an instant diagnosis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
