import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { extractArticleHighlights } from '../utils/articleHighlights';

interface ArticleKeyHighlightsProps {
  article: {
    title?: string;
    summary?: string;
    content?: string;
    highlights?: string[];
  };
  className?: string;
}

export const ArticleKeyHighlights: React.FC<ArticleKeyHighlightsProps> = ({
  article,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Extract clean editorial bullet points
  const points = extractArticleHighlights(article);

  if (!points || points.length === 0) return null;

  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-gradient-to-r from-red-50/40 via-slate-50/70 to-transparent p-3.5 sm:p-4 shadow-2xs transition-all ${className}`}
      role="region"
      aria-label="खबर के मुख्य बिंदु"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping opacity-75 hidden sm:inline-block" />
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight font-kd-meta">
              मुख्य बिंदु <span className="text-[11px] font-medium text-slate-500">({points.length} खास बातें)</span>
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-100"
          title={isExpanded ? 'संक्षिप्त करें' : 'विस्तार करें'}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'छुपाएं' : 'देखें'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-slate-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-400" />
          )}
        </button>
      </div>

      {/* Bullets List */}
      {isExpanded && (
        <ul className="mt-3 space-y-2 text-xs sm:text-[13px] text-slate-800 leading-relaxed font-kd-body">
          {points.map((point, index) => (
            <li key={index} className="flex items-start space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0 ring-2 ring-red-100" />
              <span className="flex-1 font-medium">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
