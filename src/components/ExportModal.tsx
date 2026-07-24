import React, { useState } from 'react';
import { WeatherData, WeatherIntelligence } from '../types/weather';
import { generateTextReport, generateCsvReport, downloadFile } from '../utils/exportReport';
import { FileText, FileSpreadsheet, Download, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  data: WeatherData;
  intelligence: WeatherIntelligence | null;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ data, intelligence, onClose }) => {
  const [format, setFormat] = useState<'txt' | 'csv'>('txt');
  const [copied, setCopied] = useState(false);

  const textReport = generateTextReport(data, intelligence);
  const csvReport = generateCsvReport(data);

  const handleDownload = () => {
    const cityNameSanitized = data.city.name.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];

    if (format === 'txt') {
      downloadFile(textReport, `Weather_Report_${cityNameSanitized}_${dateStr}.txt`, 'text/plain;charset=utf-8');
    } else {
      downloadFile(csvReport, `Weather_Data_${cityNameSanitized}_${dateStr}.csv`, 'text/csv;charset=utf-8');
    }
  };

  const handleCopy = () => {
    const content = format === 'txt' ? textReport : csvReport;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0f0f0f]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Export Weather Report • {data.city.name}
              </h3>
              <p className="text-xs text-slate-400">
                Generate professional txt summary or csv dataset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Switcher */}
        <div className="p-4 bg-[#141414] border-b border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0f0f0f] border border-white/5">
            <button
              onClick={() => setFormat('txt')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'txt'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" /> Text Report (.txt)
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'csv'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> Raw CSV (.csv)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" /> Download {format.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Report Text Preview Container */}
        <div className="p-5 flex-1 overflow-y-auto bg-[#0a0a0a] font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
          <pre className="whitespace-pre-wrap font-mono">
            {format === 'txt' ? textReport : csvReport}
          </pre>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0f0f0f] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Formatted for enterprise compliance & reporting
          </span>
          <span>{format === 'txt' ? `${textReport.length} characters` : `${csvReport.length} bytes`}</span>
        </div>
      </div>
    </div>
  );
};
