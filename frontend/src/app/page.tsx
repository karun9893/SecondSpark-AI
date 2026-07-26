"use client";

import { useState, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import {
  Battery,
  Zap,
  Activity,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Cpu,
  Globe,
  Share2,
  Download,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Types ---
type BatteryData = {
  IR: number;
  QCharge: number;
  QDischarge: number;
  Tavg: number;
  Tmax: number;
  Tmin: number;
  chargetime: number;
  cycle: number;
};

type PredictionResult = {
  soh: number;
  rul: number;
  grade: string;
  health_status: string;
  recommendation: string;
};

// --- Mock Data & Presets ---
const PRESETS = {
  healthy: {
    IR: 0.015,
    QCharge: 1.1,
    QDischarge: 1.08,
    Tavg: 30,
    Tmax: 32,
    Tmin: 28,
    chargetime: 12,
    cycle: 100,
  },
  mid: {
    IR: 0.022,
    QCharge: 0.95,
    QDischarge: 0.92,
    Tavg: 34,
    Tmax: 38,
    Tmin: 30,
    chargetime: 15,
    cycle: 450,
  },
  eol: {
    IR: 0.035,
    QCharge: 0.75,
    QDischarge: 0.72,
    Tavg: 38,
    Tmax: 42,
    Tmin: 32,
    chargetime: 20,
    cycle: 900,
  },
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState<
    "dashboard" | "analyze" | "passport"
  >("dashboard");
  const [formData, setFormData] = useState<BatteryData>(PRESETS.healthy);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  // FIX 1: Track API error state so the user knows when fallback is used
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0F172A]" />;

  const steps = [
    "Analyzing Battery Parameters...",
    "Neural Network Processing...",
    "Predicting State of Health (SOH)...",
    "Estimating Remaining Useful Life (RUL)...",
    "Generating Digital Passport...",
  ];

  // FIX 2: Handle ALL 8 fields including hidden QCharge, QDischarge, Tmax, Tmin
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setApiError(null);

    // Simulate steps animation
    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // FIX 3: Send the REAL formData (all 8 features) to the actual API
    // formData already contains all 8 fields: IR, QCharge, QDischarge,
    // Tavg, Tmax, Tmin, chargetime, cycle — no fields are omitted.
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiBase}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // FIX 4: Pass the full formData object — all 8 required model features
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      // FIX 5: Actually USE the API response — do not replace it with mock data
      const data = await response.json();
      setResult(data);
      setActivePage("passport");
    } catch (error) {
      console.error(error);
      // Fallback ONLY when API is truly offline — clearly labelled
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setApiError(`API offline – showing demo data. (${errorMsg})`);
      setResult({
        soh: 82.11,
        rul: 325,
        grade: "B",
        health_status: "Moderate (Demo)",
        recommendation: "Suitable for Solar Energy Storage (Demo – API offline)",
      });
      setActivePage("passport");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadPdf = async () => {
    const element = document.getElementById("passport-content");
    if (!element) return;

    try {
      const dataUrl = await htmlToImage.toPng(element, { pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("SecondSpark-Battery-Passport.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const text =
      `*SECONDSPARK DIGITAL BATTERY PASSPORT*\n\n` +
      `Battery ID: SS-${Math.floor(Math.random() * 100000)}\n` +
      `SOH: ${result.soh}%\n` +
      `RUL: ${result.rul} Cycles\n` +
      `Grade: ${result.grade}\n` +
      `Status: ${result.health_status}\n\n` +
      `Recommendation:\n${result.recommendation}\n\n` +
      `_Generated by SecondSpark AI_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => setActivePage("dashboard")}
        >
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            SecondSpark <span className="text-blue-500 text-sm italic">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`hover:text-blue-400 transition-colors ${activePage === "dashboard" ? "text-blue-500" : ""}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActivePage("analyze")}
            className={`hover:text-blue-400 transition-colors ${activePage === "analyze" || activePage === "passport" ? "text-blue-500" : ""}`}
          >
            Analysis
          </button>
        </div>
        <Button
          variant="outline"
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
        >
          Console
        </Button>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* DASHBOARD PAGE */}
        {activePage === "dashboard" && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center gap-12 py-10">
              <div className="flex-1 space-y-6">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 mb-4">
                  Next-Gen Battery Intelligence
                </Badge>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1]">
                  SecondSpark{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    AI
                  </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-xl">
                  Predict Battery Health, Remaining Useful Life, and Reuse
                  Potential using state-of-the-art Artificial Intelligence.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    onClick={() => setActivePage("analyze")}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg rounded-xl shadow-lg shadow-blue-500/20"
                  >
                    Analyze Battery <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full"></div>
                <div className="relative glass-card bg-[#1E293B]/80 p-8 rounded-3xl border border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-[#0F172A] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="text-blue-500" />
                        <span className="text-sm font-medium">
                          Real-time SOH Analysis
                        </span>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold">
                        LIVE
                      </span>
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-[#0F172A] p-4 rounded-xl border border-white/5 space-y-2"
                      >
                        <div className="h-1 w-8 bg-blue-500/30 rounded"></div>
                        <div className="h-1 w-full bg-slate-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Analyzed", val: "139+", icon: Battery },
                {
                  label: "Predictive Accuracy",
                  val: "96.66%",
                  icon: ShieldCheck,
                },
                { label: "Training Records", val: "116.6K", icon: Cpu },
                { label: "CO2 Saved (Est.)", val: "4.2 Tons", icon: Globe },
              ].map((s, i) => (
                <Card
                  key={i}
                  className="glass-card bg-[#1E293B] border-white/5 border-none"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <p className="text-xs font-medium text-slate-400">
                      {s.label}
                    </p>
                    <s.icon className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-extrabold">{s.val}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Process Flow */}
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Process Flow</h2>
                <p className="text-slate-400">
                  How our AI ecosystem evaluates battery lifecycle
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 bg-[#111827] rounded-3xl border border-white/5 shadow-2xl">
                {[
                  "Battery Data",
                  "SOH Engine",
                  "RUL Engine",
                  "Digital Passport",
                  "AI Recommendation",
                ].map((label, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row items-center gap-4"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${i === 4 ? "bg-emerald-500 text-white" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                    {i < 4 && (
                      <ChevronRight className="hidden md:block text-slate-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYSIS PAGE */}
        {activePage === "analyze" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                onClick={() => setActivePage("dashboard")}
                className="text-slate-400 hover:text-white"
              >
                Back
              </Button>
              <h2 className="text-3xl font-bold">Analysis Engine</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card
                className="bg-[#1E293B] border-white/5 cursor-pointer hover:border-emerald-500/50 transition-all p-4 group"
                onClick={() => setFormData(PRESETS.healthy)}
              >
                <CheckCircle2 className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold">Healthy</h3>
                <p className="text-xs text-slate-400">High SOH / Early Life</p>
              </Card>
              <Card
                className="bg-[#1E293B] border-white/5 cursor-pointer hover:border-orange-500/50 transition-all p-4 group"
                onClick={() => setFormData(PRESETS.mid)}
              >
                <TrendingUp className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold">Mid-Life</h3>
                <p className="text-xs text-slate-400">Moderate Degradation</p>
              </Card>
              <Card
                className="bg-[#1E293B] border-white/5 cursor-pointer hover:border-red-500/50 transition-all p-4 group"
                onClick={() => setFormData(PRESETS.eol)}
              >
                <AlertTriangle className="text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold">End-of-Life</h3>
                <p className="text-xs text-slate-400">
                  Critical SOH / Needs Review
                </p>
              </Card>
            </div>

            <div className="glass-card bg-[#1E293B] p-8 rounded-3xl border border-white/5">
              {/* --- PRIMARY INPUTS (visible to user) --- */}
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                Primary Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-slate-400">
                    Internal Resistance (IR) Ω
                  </Label>
                  <Input
                    name="IR"
                    type="number"
                    step="0.001"
                    value={formData.IR}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">Cycle Count</Label>
                  <Input
                    name="cycle"
                    type="number"
                    value={formData.cycle}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">Avg Temperature (°C)</Label>
                  <Input
                    name="Tavg"
                    type="number"
                    value={formData.Tavg}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">Charge Time (min)</Label>
                  <Input
                    name="chargetime"
                    type="number"
                    value={formData.chargetime}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
              </div>

              {/* --- SECONDARY INPUTS (FIX: previously missing from UI) --- */}
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-10 mb-6">
                Capacity &amp; Thermal Range
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-slate-400">
                    Charge Capacity – QCharge (Ah)
                  </Label>
                  <Input
                    name="QCharge"
                    type="number"
                    step="0.01"
                    value={formData.QCharge}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">
                    Discharge Capacity – QDischarge (Ah)
                  </Label>
                  <Input
                    name="QDischarge"
                    type="number"
                    step="0.01"
                    value={formData.QDischarge}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">Max Temperature – Tmax (°C)</Label>
                  <Input
                    name="Tmax"
                    type="number"
                    value={formData.Tmax}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-400">Min Temperature – Tmin (°C)</Label>
                  <Input
                    name="Tmin"
                    type="number"
                    value={formData.Tmin}
                    onChange={handleInputChange}
                    className="bg-[#0F172A] border-white/10 h-12"
                  />
                </div>
              </div>

              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-10 bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold rounded-xl"
              >
                {isAnalyzing ? "Processing..." : "Run AI Analysis"}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="fixed inset-0 z-[100] bg-[#0F172A]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mb-8 animate-spin" />
                <h3 className="text-2xl font-bold mb-2">
                  {steps[analysisStep]}
                </h3>
                <p className="text-slate-500 max-w-sm italic">
                  Verifying electrochemical signatures...
                </p>
              </div>
            )}
          </div>
        )}

        {/* PASSPORT PAGE */}
        {activePage === "passport" && result && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">Battery Passport</h2>
              <Button variant="ghost" onClick={() => setActivePage("analyze")}>
                <Activity size={16} className="mr-2" /> New Test
              </Button>
            </div>

            {/* FIX: Show a clear banner if API was offline and demo data is displayed */}
            {apiError && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-6 py-3 text-orange-400 text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} />
                {apiError}
              </div>
            )}

            <Card
              id="passport-content"
              className="glass-card bg-[#1E293B] border-white/10 overflow-hidden relative premium-shadow border-none shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
                <Zap size={400} />
              </div>

              <CardHeader className="border-b border-white/5 flex flex-row justify-between items-center py-6 px-8 relative z-10">
                <div>
                  <CardTitle className="text-xl font-bold tracking-widest text-slate-300 uppercase">
                    SecondSpark AI
                  </CardTitle>
                  <CardDescription className="text-blue-500 font-bold tracking-tighter uppercase">
                    Digital Compliance Passport
                  </CardDescription>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] text-slate-500 uppercase font-black">
                    Passport ID
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-300">
                    SS-{Math.floor(Math.random() * 1000000)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-10 space-y-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          className="text-slate-800"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={552}
                          strokeDashoffset={552 - (552 * result.soh) / 100}
                          className={`${result.soh > 80 ? "text-emerald-500" : result.soh > 60 ? "text-orange-500" : "text-red-500"} transition-all duration-1000 ease-out`}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-5xl font-black">
                          {result.soh.toFixed(1)}%
                        </span>
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                          SOH Level
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-[#0F172A]/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest block mb-1">
                          RUL remaining
                        </span>
                        <span className="text-4xl font-black">
                          {Math.round(result.rul)}
                        </span>
                        <span className="text-xs text-slate-500 ml-2 uppercase font-bold">
                          Cycles
                        </span>
                      </div>
                      <Badge
                        className={`px-4 py-2 rounded-lg text-lg ${
                          result.grade.startsWith("A")
                            ? "bg-emerald-500"
                            : result.grade.startsWith("B")
                              ? "bg-blue-500"
                              : result.grade.startsWith("C")
                                ? "bg-orange-500"
                                : "bg-red-500"
                        } text-white border-none`}
                      >
                        Grade {result.grade}
                      </Badge>
                    </div>
                    <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                      <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] uppercase font-black tracking-widest">
                          Status Verification
                        </span>
                      </div>
                      <p className="text-xl font-bold">
                        {result.health_status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] flex items-center gap-2">
                    <Cpu size={12} /> Deployment Recommendation
                  </h4>
                  <div className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl border border-blue-400/20">
                    <p className="text-2xl font-bold text-blue-50 leading-tight">
                      {result.recommendation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Solar Storage", sub: "Priority Opt" },
                    {
                      label: "EV Ready",
                      sub: result.soh > 85 ? "Approved" : "Restricted",
                    },
                    {
                      label: "Materials",
                      sub: result.soh < 75 ? "Available" : "Long-life",
                    },
                  ].map((app, i) => (
                    <div
                      key={i}
                      className="bg-white/5 p-4 rounded-xl border border-white/5"
                    >
                      <span className="text-xs font-bold block">
                        {app.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                        {app.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="bg-black/20 p-8 flex flex-wrap gap-4 justify-center border-t border-white/5">
                <Button
                  onClick={shareWhatsApp}
                  className="bg-[#22C55E] hover:bg-[#1ea34d] text-white font-black px-8 h-12 rounded-xl"
                >
                  <Share2 size={18} className="mr-2" /> Share WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 text-white px-6 h-12 rounded-xl font-bold"
                  onClick={downloadPdf}
                >
                  <Download size={18} className="mr-2" /> PDF
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 text-white px-6 h-12 rounded-xl font-bold"
                  onClick={() => window.print()}
                >
                  <Printer size={18} className="mr-2" /> Print
                </Button>
              </CardFooter>
            </Card>

            <Accordion type="single" collapsible className="w-full mt-10">
              <AccordionItem value="transparency" className="border-white/5">
                <AccordionTrigger className="text-slate-400 hover:text-white uppercase font-black text-[10px] tracking-widest">
                  AI Transparency Report
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 text-xs leading-relaxed space-y-4 font-medium">
                  <p>
                    Validation: 116,663 cycle baseline. R²: 0.9666. IR/Temp
                    correlation verified.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-12 px-6 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
        © 2026 SecondSpark AI. Powered by Advanced Circular Intelligence.
      </footer>
    </div>
  );
}
