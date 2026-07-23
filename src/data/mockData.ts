import { Lecture, Flashcard, QuizQuestion } from '../types';

export const DAILY_PEARLS = [
  {
    title: "Sgarbossa Criteria for LBBB",
    pearl: "Concordant ST elevation ≥ 1 mm in any lead with a positive QRS is 98% specific for acute MI in the presence of a Left Bundle Branch Block!",
    author: "Dr. ECG Mentor",
    category: "STEMI"
  },
  {
    title: "Inferior STEMI & Nitroglycerin Caution",
    pearl: "ST elevation in II, III, aVF requires checking lead V4R for RV involvement. RV infarction is preload dependent—giving NTG can trigger severe hypotension!",
    author: "Dr. ECG Mentor",
    category: "Ischemia"
  },
  {
    title: "Wellens' Syndrome Warning",
    pearl: "Deeply inverted or biphasic T waves in V2-V3 in a pain-free patient indicates critical LAD stenosis (90%+). Do NOT perform stress testing—arrange emergent angiography!",
    author: "Dr. ECG Mentor",
    category: "High Yield"
  },
  {
    title: "Brugada Sign Identification",
    pearl: "Type 1 Brugada pattern features coved ST elevation ≥ 2mm in V1-V2 followed by a negative T wave. It poses a high risk of sudden cardiac death due to VFib.",
    author: "Dr. ECG Mentor",
    category: "Electrophysiology"
  }
];

export const LECTURES: Lecture[] = [
  {
    id: "lec-1",
    title: "Basic ECG Concepts & Systematic Interpretation",
    category: "Basic Concepts",
    durationMinutes: 12,
    summary: "Master the 5-step systematic approach: Rate, Rhythm, Axis, Intervals, and Ischemia/Hypertrophy.",
    waveType: "NSR",
    normalIntervals: {
      pr: "120 - 200 ms (3-5 small boxes)",
      qrs: "< 120 ms (< 3 small boxes)",
      qtc: "< 440 ms (Men) / < 460 ms (Women)",
      rate: "60 - 100 bpm"
    },
    abnormalIntervals: {
      pr: "> 200 ms (1st Degree AV Block)",
      qrs: "≥ 120 ms (Bundle Branch Block / Ventricular origin)",
      qtc: "> 480 ms (Risk for Torsades de Pointes)",
      rate: "< 60 bpm (Bradycardia) or > 100 bpm (Tachycardia)"
    },
    contentSections: [
      {
        heading: "The 12-Lead ECG Layout & Paper Speed",
        body: "Standard ECG paper runs at 25 mm/s with voltage calibration of 10 mm = 1 mV. Each small 1 mm box represents 0.04 seconds (40 ms) horizontally and 0.1 mV vertically. A large 5 mm box equals 0.20 seconds (200 ms).",
        bullets: [
          "1 small box = 0.04 seconds (40 ms)",
          "1 large box = 0.20 seconds (200 ms)",
          "5 large boxes = 1.0 second",
          "Voltage: 2 large boxes vertically = 1 mV"
        ]
      },
      {
        heading: "Systematic 5-Step Interpretation Rule",
        body: "To avoid missing critical findings, always follow this order:",
        bullets: [
          "1. Rate: Calculate using 300 / (large boxes between R-R intervals) or count R waves in 6 sec strip x 10.",
          "2. Rhythm: Regular vs. irregular? Look for upright P waves in Lead II, followed by every QRS.",
          "3. Cardiac Axis: Evaluate Lead I and Lead aVF to classify Normal, LAD, RAD, or Extreme.",
          "4. Intervals: Measure PR (120-200ms), QRS (<120ms), and QTc (<440ms).",
          "5. Waveform & ST Analysis: Check for ST elevation/depression, T-wave inversion, or hypertrophy."
        ]
      }
    ],
    keyPearls: [
      "Always verify paper speed (25 mm/s) and calibration (10 mm/mV) before interpreting!",
      "A normal PR interval spans 3 to 5 small squares (120-200ms).",
      "Lead II is the best lead to assess P-wave morphology and rhythm."
    ],
    quizCheck: {
      question: "On standard ECG paper at 25 mm/s, if there are 4 large boxes between consecutive R waves, what is the heart rate?",
      options: ["60 bpm", "75 bpm", "100 bpm", "150 bpm"],
      correctIndex: 1,
      explanation: "300 divided by 4 large boxes equals 75 beats per minute (bpm)."
    }
  },
  {
    id: "lec-2",
    title: "12-Lead Placement & Anatomic Lead Views",
    category: "Lead Placement",
    durationMinutes: 15,
    summary: "Learn anatomical correlations: Inferior (II, III, aVF), Septal (V1-V2), Anterior (V3-V4), Lateral (I, aVL, V5-V6).",
    waveType: "NSR",
    normalIntervals: {
      pr: "120 - 200 ms",
      qrs: "80 - 100 ms",
      qtc: "380 - 440 ms",
      rate: "60 - 100 bpm"
    },
    abnormalIntervals: {
      pr: "Variable",
      qrs: "Wide (>120ms)",
      qtc: "Prolonged (>460ms)",
      rate: "Abnormal"
    },
    contentSections: [
      {
        heading: "Limb Leads & Precordial Leads Groupings",
        body: "The 12 leads view the heart from 12 distinct anatomical directions, grouping into specific coronary artery territories:",
        bullets: [
          "Inferior Leads (II, III, aVF) -> Right Coronary Artery (RCA)",
          "Septal Leads (V1, V2) -> Left Anterior Descending (LAD) septal branches",
          "Anterior Leads (V3, V4) -> LAD main branch",
          "High Lateral Leads (I, aVL) -> Left Circumflex Artery (LCx)",
          "Low Lateral Leads (V5, V6) -> LCx or distal LAD"
        ]
      },
      {
        heading: "Precordial Electrode Landmarks",
        body: "Correct V1-V6 placement prevents artifact and false diagnosis of ischemia or infarction:",
        bullets: [
          "V1: 4th intercostal space, right sternal border",
          "V2: 4th intercostal space, left sternal border",
          "V3: Midway between V2 and V4",
          "V4: 5th intercostal space, left midclavicular line",
          "V5: 5th intercostal space, anterior axillary line",
          "V6: 5th intercostal space, mid-axillary line"
        ]
      }
    ],
    keyPearls: [
      "V1 and V2 view the septum; V3 and V4 view the anterior wall of the left ventricle.",
      "Reciprocal ST depression in I and aVL strongly confirms Inferior STEMI (II, III, aVF)."
    ],
    quizCheck: {
      question: "Which coronary artery is typically occluded when ST elevation is seen in leads II, III, and aVF?",
      options: ["Left Anterior Descending (LAD)", "Right Coronary Artery (RCA)", "Left Circumflex Artery (LCx)", "Left Main Coronary Artery"],
      correctIndex: 1,
      explanation: "Leads II, III, and aVF look at the inferior wall, supplied by the Right Coronary Artery (RCA) in ~85-90% of individuals."
    }
  },
  {
    id: "lec-3",
    title: "Acute Ischemia & STEMI Patterns",
    category: "Ischemia/MI",
    durationMinutes: 20,
    summary: "Recognize hyperacute T-waves, J-point ST elevation, reciprocal depression, and infarction evolution.",
    waveType: "STEMI",
    normalIntervals: {
      pr: "120 - 200 ms",
      qrs: "< 120 ms",
      qtc: "< 440 ms",
      rate: "60 - 100 bpm"
    },
    abnormalIntervals: {
      pr: "Normal or prolonged",
      qrs: "Wide if concomitant BBB",
      qtc: "Ischemia-prolonged",
      rate: "Variable"
    },
    contentSections: [
      {
        heading: "The ECG Evolution of Acute Myocardial Infarction",
        body: "Acute transmural ischemia progresses through well-defined ECG stages:",
        bullets: [
          "Minutes: Hyperacute T waves (broad-based, tall, symmetric T waves)",
          "Minutes to Hours: J-point ST elevation with convex ('tombstone') appearance",
          "Hours: Pathological Q waves develop (>1mm wide or >25% QRS height) indicating tissue necrosis",
          "Days: T-wave inversion as ST segment returns to baseline",
          "Months/Years: Q waves persist as permanent scar tissue"
        ]
      },
      {
        heading: "Reciprocal ST Depression",
        body: "ST depression in leads opposite to the territory with ST elevation confirms acute MI rather than pericarditis or benign repolarization.",
        bullets: [
          "Inferior STEMI (II, III, aVF) -> Reciprocal ST depression in I and aVL",
          "Anterior STEMI (V1-V4) -> Reciprocal ST depression in II, III, aVF"
        ]
      }
    ],
    keyPearls: [
      "Pericarditis features widespread concave ST elevation with PR depression and NO reciprocal changes!",
      "Hyperacute T waves are the earliest sign of acute vessel occlusion."
    ],
    quizCheck: {
      question: "What ECG finding distinguishes Acute Pericarditis from a classic STEMI?",
      options: [
        "Concave diffuse ST elevation with PR segment depression and no reciprocal changes",
        "Convex ST elevation with pathological Q waves in leads V1-V4",
        "ST elevation confined strictly to leads II, III, aVF",
        "New onset Right Bundle Branch Block"
      ],
      correctIndex: 0,
      explanation: "Acute Pericarditis classically exhibits widespread concave ST elevation, PR segment depression, and an absence of reciprocal ST depression (except in aVR)."
    }
  },
  {
    id: "lec-4",
    title: "Arrhythmias: AFib, Flutter, VT, & SVT",
    category: "Arrhythmias",
    durationMinutes: 18,
    summary: "Differentiate narrow vs. wide complex tachycardias, regular vs. irregular rhythms, and AV nodal reentry.",
    waveType: "AFIB",
    normalIntervals: {
      pr: "Unmeasurable in AFib",
      qrs: "< 120 ms (Narrow)",
      qtc: "Variable",
      rate: "110 - 160 bpm (RVR)"
    },
    abnormalIntervals: {
      pr: "Absent",
      qrs: "Wide (>120ms in VT)",
      qtc: "Prolonged",
      rate: "> 100 bpm"
    },
    contentSections: [
      {
        heading: "Narrow-Complex Tachycardias (< 120 ms)",
        body: "Originates above the Bundle of His (Supraventricular):",
        bullets: [
          "Atrial Fibrillation: Irregularly irregular, absent P waves.",
          "Atrial Flutter: Sawtooth F-waves, regular ventricular response (~150 bpm in 2:1 block).",
          "AVNRT / AVRT: Regular, rapid (~160-220 bpm), retrograde or hidden P waves."
        ]
      },
      {
        heading: "Wide-Complex Tachycardias (≥ 120 ms)",
        body: "Must assume Ventricular Tachycardia (VT) until proven otherwise:",
        bullets: [
          "Ventricular Tachycardia: Rapid regular broad QRS (>120ms), AV dissociation, fusion/capture beats.",
          "Torsades de Pointes: Polymorphic VT with twisting QRS axis around isoelectric line, preceded by Long QT."
        ]
      }
    ],
    keyPearls: [
      "Any wide-complex tachycardia in a patient with structural heart disease or prior MI is VT until proven otherwise!",
      "Adenosine breaks AV-node dependent reentrant SVT, but will NOT cardiovert VT or AFib."
    ],
    quizCheck: {
      question: "A 65-year-old female presents with palpitations and an ECG showing a regular, narrow-complex tachycardia at 150 bpm with sawtooth baseline in leads II, III, aVF. What is the diagnosis?",
      options: ["Atrial Fibrillation", "Atrial Flutter with 2:1 conduction", "AVNRT", "Ventricular Tachycardia"],
      correctIndex: 1,
      explanation: "Sawtooth flutter waves at ~300 bpm with 2:1 AV block results in a characteristic regular ventricular rate of ~150 bpm."
    }
  },
  {
    id: "lec-5",
    title: "Bundle Branch Blocks & Conduction Defects",
    category: "Block Patterns",
    durationMinutes: 16,
    summary: "Master LBBB vs. RBBB morphology, fascicular blocks, and Sgarbossa criteria.",
    waveType: "LBBB",
    normalIntervals: {
      pr: "120 - 200 ms",
      qrs: "≥ 120 ms (Wide)",
      qtc: "390 - 450 ms",
      rate: "60 - 100 bpm"
    },
    abnormalIntervals: {
      pr: "Normal or prolonged",
      qrs: "≥ 120 ms",
      qtc: "Secondary prolongation",
      rate: "Normal or bradycardic"
    },
    contentSections: [
      {
        heading: "Left Bundle Branch Block (LBBB)",
        body: "Disruption of impulse conduction down the main left bundle branch:",
        bullets: [
          "QRS duration ≥ 120 ms",
          "Deep, broad S wave in lead V1 (QS or rS pattern)",
          "Broad, notched or slurred R waves in lateral leads (I, aVL, V5, V6) with absent Q waves",
          "Secondary ST-T wave changes discordant to QRS direction"
        ]
      },
      {
        heading: "Right Bundle Branch Block (RBBB)",
        body: "Delayed activation of the right ventricle:",
        bullets: [
          "QRS duration ≥ 120 ms",
          "rsR' pattern in lead V1-V3 ('rabbit ears')",
          "Slurred S wave in lateral leads (I, V5, V6)"
        ]
      }
    ],
    keyPearls: [
      "Mnemonic: WiLLiaM MaRLeY -> LBBB has W in V1 and M in V6; RBBB has M in V1 and W in V6!",
      "New LBBB accompanied by chest pain must be evaluated urgently for acute coronary occlusion using Sgarbossa criteria."
    ],
    quizCheck: {
      question: "Which lead morphology is characteristic of a Right Bundle Branch Block (RBBB)?",
      options: [
        "Deep S wave in V1 and broad notched R in V6",
        "rsR' 'rabbit ears' pattern in lead V1 with slurred S wave in lead I and V6",
        "Delta wave with short PR interval",
        "Biphasic T wave in leads V2-V3"
      ],
      correctIndex: 1,
      explanation: "RBBB features a QRS ≥ 120ms, an rsR' pattern in V1 ('rabbit ears'), and a deep, slurred S wave in lateral leads I and V6."
    }
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    category: "ST Segment & Ischemia",
    title: "Acute Anterior STEMI",
    snippet: "Convex ST elevation in leads V1 to V4 with reciprocal ST depression in inferior leads.",
    waveType: "STEMI",
    diagnosis: "Acute Anterior Wall STEMI (LAD Occlusion)",
    keyCriteria: [
      "J-point ST elevation ≥ 1mm in ≥ 2 anatomically contiguous leads (V1-V4)",
      "Reciprocal ST depression in II, III, aVF",
      "Hyperacute T waves early; Q waves late"
    ],
    clinicalAction: "Activate Cardiac Cath Lab immediately for primary PCI within 90 mins; give Aspirin + P2Y12 inhibitor.",
    learned: false
  },
  {
    id: "fc-2",
    category: "Arrhythmias",
    title: "Atrial Fibrillation with RVR",
    snippet: "Irregularly irregular narrow-complex rhythm, absent P waves, ventricular rate > 110 bpm.",
    waveType: "AFIB",
    diagnosis: "Atrial Fibrillation with Rapid Ventricular Response",
    keyCriteria: [
      "No discrete P waves, coarse or fine fibrillatory baseline",
      "Variable R-R intervals (Irregularly irregular)",
      "Ventricular rate typically 110–180 bpm"
    ],
    clinicalAction: "Rate control with IV Diltiazem or Metoprolol. Assess stroke risk via CHA₂DS₂-VASc score for OAC.",
    learned: false
  },
  {
    id: "fc-3",
    category: "Conduction Blocks",
    title: "Left Bundle Branch Block (LBBB)",
    snippet: "Wide QRS (≥ 120ms), deep S wave in V1, broad notched R wave in I, aVL, V5-V6.",
    waveType: "LBBB",
    diagnosis: "Complete Left Bundle Branch Block",
    keyCriteria: [
      "QRS duration ≥ 120 ms",
      "QS or rS pattern in lead V1",
      "Broad, notched R waves in I, aVL, V5, V6 without Q waves"
    ],
    clinicalAction: "Evaluate for underlying structural heart disease/ischemia. Apply Sgarbossa criteria if chest pain present.",
    learned: false
  },
  {
    id: "fc-4",
    category: "Electrolytes & Drugs",
    title: "Hyperkalemia (Severe)",
    snippet: "Tall peaked T waves, prolonged PR, widened QRS progressing towards sine wave.",
    waveType: "HYPERKALEMIA",
    diagnosis: "Severe Hyperkalemia (K+ > 6.5 mEq/L)",
    keyCriteria: [
      "Tall, narrow, symmetrical peaked T waves (V2-V4)",
      "Flattening of P waves, PR lengthening",
      "QRS widening (>120ms) merging with T wave"
    ],
    clinicalAction: "EMERGENCY: IV Calcium Gluconate 10% to stabilize cardiac membrane, followed by Insulin + D50W & Albuterol.",
    learned: false
  },
  {
    id: "fc-5",
    category: "Wave Anomalies",
    title: "Wolff-Parkinson-White (WPW)",
    snippet: "Short PR interval (< 120ms), Delta wave (slurred QRS upstroke), wide QRS complex.",
    waveType: "WPW",
    diagnosis: "Wolff-Parkinson-White Syndrome",
    keyCriteria: [
      "PR interval < 120 ms",
      "Delta wave (slurring of the initial QRS complex)",
      "QRS duration > 110 ms with secondary ST-T changes"
    ],
    clinicalAction: "AVOID AV nodal blockers (Verapamil, Diltiazem, Digoxin, Adenosine) if AFib occurs! Use Procainamide or Cardioversion.",
    learned: false
  },
  {
    id: "fc-6",
    category: "Arrhythmias",
    title: "Ventricular Tachycardia (Monomorphic)",
    snippet: "Wide QRS tachycardia (>120ms) at rate > 120 bpm with AV dissociation.",
    waveType: "VT",
    diagnosis: "Monomorphic Ventricular Tachycardia",
    keyCriteria: [
      "Regular wide-complex tachycardia (> 120 ms)",
      "Extreme cardiac axis deviation",
      "Presence of capture or fusion beats"
    ],
    clinicalAction: "Unstable: Immediate Synchronized Cardioversion. Stable: IV Amiodarone or Procainamide.",
    learned: false
  },
  {
    id: "fc-7",
    category: "ST Segment & Ischemia",
    title: "Acute Pericarditis",
    snippet: "Widespread concave ST elevation with PR segment depression across multiple territories.",
    waveType: "PERICARDITIS",
    diagnosis: "Acute Pericarditis",
    keyCriteria: [
      "Diffuse, concave ('saddle-back') ST elevation in leads I, II, III, aVF, V2-V6",
      "PR segment depression in limb and precordial leads",
      "PR segment elevation and ST depression in lead aVR"
    ],
    clinicalAction: "First-line therapy: NSAIDs (e.g., Ibuprofen) + Colchicine. Avoid thrombolytics/anticoagulation.",
    learned: false
  },
  {
    id: "fc-8",
    category: "Conduction Blocks",
    title: "Mobitz Type II 2nd-Degree AV Block",
    snippet: "Constant PR interval before dropped QRS complexes without preceding PR lengthening.",
    waveType: "AVBLOCK",
    diagnosis: "Second-Degree AV Block (Mobitz Type II)",
    keyCriteria: [
      "Constant PR intervals before non-conducted P waves",
      "Sudden dropped QRS complex without PR prolongation",
      "Infranodal block (high risk of progressing to Complete Heart Block)"
    ],
    clinicalAction: "Prepare transcutaneous pacing. Transvenous pacing and permanent pacemaker indication!",
    learned: false
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    title: "Crushing Substernal Chest Pain",
    difficulty: "Intermediate",
    category: "Ischemia/MI",
    clinicalHistory: "A 58-year-old male with hypertension and heavy smoking history presents to the ED with 2 hours of crushing substernal chest pain radiating to his left jaw and diaphoresis. Vitals: BP 142/88, HR 82, SpO2 97%.",
    waveType: "STEMI",
    options: [
      "Acute Inferior STEMI (RCA Occlusion)",
      "Acute Anterior STEMI (LAD Occlusion)",
      "Acute Pericarditis",
      "Normal Variant Early Repolarization"
    ],
    correctIndex: 1,
    explanation: "The ECG demonstrates convex J-point ST elevation in leads V1 through V4 with reciprocal ST depression in leads II, III, and aVF, characteristic of an acute anterior STEMI secondary to Left Anterior Descending (LAD) coronary artery occlusion.",
    keyFindings: {
      rate: "82 bpm, Regular Sinus",
      rhythm: "Sinus Rhythm",
      stSegment: "Convex ST elevation in V1-V4, Reciprocal ST depression in II, III, aVF"
    }
  },
  {
    id: "q-2",
    title: "Palpitations & Irregular Pulse",
    difficulty: "Beginner",
    category: "Arrhythmias",
    clinicalHistory: "A 72-year-old female presents with palpitations, mild fatigue, and shortness of breath upon walking. On examination, her pulse is irregularly irregular at a rate of 135 bpm.",
    waveType: "AFIB",
    options: [
      "Atrial Flutter with 3:1 Block",
      "Atrial Fibrillation with Rapid Ventricular Response (RVR)",
      "Sinus Tachycardia with Frequent PACs",
      "Multifocal Atrial Tachycardia (MAT)"
    ],
    correctIndex: 1,
    explanation: "The rhythm is narrow-complex, irregularly irregular, and shows an absolute absence of distinct P waves, replaced by chaotic fibrillatory baseline waves. This is classic Atrial Fibrillation with RVR.",
    keyFindings: {
      rate: "135 bpm",
      rhythm: "Irregularly Irregular",
      stSegment: "Isoelectric with non-specific rate-related T-wave flattening"
    }
  },
  {
    id: "q-3",
    title: "Dizziness in a Dialysis Patient",
    difficulty: "Advanced",
    category: "Electrolytes",
    clinicalHistory: "A 62-year-old male with End-Stage Renal Disease (ESRD) missed two hemodialysis sessions. He reports severe muscle weakness and lightheadedness. Serum K+ is pending.",
    waveType: "HYPERKALEMIA",
    options: [
      "Acute Inferior STEMI",
      "Severe Hyperkalemia",
      "Hypocalcemia",
      "Digitalis Toxicity"
    ],
    correctIndex: 1,
    explanation: "The ECG demonstrates tall, symmetrical, narrow peaked T waves across V2-V4, flattening of P waves, and PR prolongation. In an ESRD patient with missed dialysis, severe hyperkalemia is the diagnosis until proven otherwise.",
    keyFindings: {
      rate: "54 bpm",
      rhythm: "Sinus Bradycardia",
      stSegment: "Tall peaked T waves, prolonged PR interval"
    }
  },
  {
    id: "q-4",
    title: "Syncope in a 24-Year-Old Athlete",
    difficulty: "Intermediate",
    category: "Pre-excitation",
    clinicalHistory: "A 24-year-old male collegiate soccer player experienced a brief episode of lightheadedness during training. Baseline screening ECG is obtained.",
    waveType: "WPW",
    options: [
      "Left Ventricular Hypertrophy",
      "Wolff-Parkinson-White (WPW) Syndrome",
      "Right Bundle Branch Block",
      "Brugada Syndrome"
    ],
    correctIndex: 1,
    explanation: "The ECG shows a short PR interval (< 120 ms), a classic Delta wave (slurred initial upstroke of the QRS complex), and QRS prolongation (> 110 ms), confirming Wolff-Parkinson-White accessory pathway pre-excitation.",
    keyFindings: {
      rate: "68 bpm",
      rhythm: "Normal Sinus",
      stSegment: "Delta wave upstroke, shortened PR < 120 ms"
    }
  },
  {
    id: "q-5",
    title: "Wide-Complex Tachycardia in Post-MI Patient",
    difficulty: "Advanced",
    category: "Arrhythmias",
    clinicalHistory: "A 68-year-old male with a prior anterior myocardial infarction 5 years ago presents with sudden onset palpitations and BP 95/60. ECG shows a regular wide-complex tachycardia at 170 bpm.",
    waveType: "VT",
    options: [
      "SVT with Aberrancy",
      "Monomorphic Ventricular Tachycardia (VT)",
      "Atrial Fibrillation with LBBB",
      "Sinus Tachycardia"
    ],
    correctIndex: 1,
    explanation: "A regular wide-complex tachycardia (QRS > 120ms) at 170 bpm in a patient with prior MI scar is Ventricular Tachycardia until proven otherwise (> 95% probability).",
    keyFindings: {
      rate: "170 bpm",
      rhythm: "Regular Wide Complex Tachycardia",
      stSegment: "Wide QRS complexes with discordant ST-T changes"
    }
  }
];

export const CLINICAL_PRESETS = [
  {
    name: "Acute Anterior STEMI",
    data: {
      heartRate: 88,
      rhythm: "Sinus",
      pWavePresent: "Present",
      qrsWidth: "Normal (<120ms)",
      stChanges: "Convex ST Elevation in V1-V4",
      axisDeviation: "Normal (0 to +90°)",
      notes: "58yo M with crushing substernal chest pain for 90 mins, diaphoresis."
    }
  },
  {
    name: "AFib with RVR",
    data: {
      heartRate: 142,
      rhythm: "Irregularly Irregular",
      pWavePresent: "Absent (Fibrillatory)",
      qrsWidth: "Normal (<120ms)",
      stChanges: "Isoelectric / Slight Depression",
      axisDeviation: "Normal (0 to +90°)",
      notes: "72yo F with palpitations and fatigue. Irregular pulse."
    }
  },
  {
    name: "Severe Hyperkalemia",
    data: {
      heartRate: 52,
      rhythm: "Sinus Bradycardia",
      pWavePresent: "Flattened / Minimal",
      qrsWidth: "Prolonged (≥120ms)",
      stChanges: "Tall Peaked T Waves in V2-V5",
      axisDeviation: "Left Axis Deviation (-30 to -90°)",
      notes: "Missed hemodialysis x 2 sessions. Weakness, serum K+ 7.2 mEq/L."
    }
  },
  {
    name: "LBBB with Sgarbossa",
    data: {
      heartRate: 80,
      rhythm: "Sinus",
      pWavePresent: "Present",
      qrsWidth: "Wide (140ms)",
      stChanges: "Concordant ST Elevation 2mm in V5-V6",
      axisDeviation: "Left Axis Deviation",
      notes: "New onset severe chest pain with baseline LBBB."
    }
  },
  {
    name: "Wolff-Parkinson-White",
    data: {
      heartRate: 72,
      rhythm: "Sinus",
      pWavePresent: "Present (Short PR <120ms)",
      qrsWidth: "Wide (115ms) with Delta wave",
      stChanges: "Isoelectric",
      axisDeviation: "Normal",
      notes: "Asymptomatic 22yo athlete routine pre-participation ECG."
    }
  }
];
