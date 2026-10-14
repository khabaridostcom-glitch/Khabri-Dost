import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, RotateCcw, BarChart2, Flame, Sliders } from 'lucide-react';

export interface PollOptionItem {
  id: string;
  label: string;
  votes: number;
}

export interface OpinionPollWidgetProps {
  pollId?: string;
  question?: string;
  options?: PollOptionItem[];
  // Backwards compatibility with A, B, C, D props
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  isAdmin?: boolean;
  onOpenAdminSettings?: () => void;
  className?: string;
}

const DEFAULT_POLL_ID = 'poll_2026_digital_media';
const DEFAULT_QUESTION = 'क्या 2026 में डिजिटल मीडिया पारंपरिक प्रिंट अखबारों से आगे निकल जाएगा?';

const DEFAULT_OPTIONS: PollOptionItem[] = [
  { id: 'opt_a', label: 'हाँ, पूरी तरह डिजिटल का दबदबा होगा', votes: 1248 },
  { id: 'opt_b', label: 'नहीं, प्रिंट की विश्वसनीयता बनी रहेगी', votes: 612 },
  { id: 'opt_c', label: 'दोनों का संतुलन (हाइब्रिड मॉडल) चलेगा', votes: 430 },
  { id: 'opt_d', label: 'अभी निश्चित रूप से कहना मुश्किल है', votes: 120 },
];

export const OpinionPollWidget: React.FC<OpinionPollWidgetProps> = ({
  pollId = DEFAULT_POLL_ID,
  question,
  options,
  optionA,
  optionB,
  optionC,
  optionD,
  isAdmin,
  onOpenAdminSettings,
  className = '',
}) => {
  // Build effective options list
  const initialOptions: PollOptionItem[] = React.useMemo(() => {
    if (options && options.length > 0) {
      return options;
    }
    // If individual option strings are provided
    if (optionA || optionB) {
      const list: PollOptionItem[] = [];
      if (optionA) list.push({ id: 'opt_a', label: optionA, votes: 1248 });
      if (optionB) list.push({ id: 'opt_b', label: optionB, votes: 612 });
      if (optionC && optionC.trim()) list.push({ id: 'opt_c', label: optionC, votes: 430 });
      if (optionD && optionD.trim()) list.push({ id: 'opt_d', label: optionD, votes: 120 });
      return list;
    }
    return DEFAULT_OPTIONS;
  }, [options, optionA, optionB, optionC, optionD]);

  const activeQuestion = question || DEFAULT_QUESTION;
  const storageKey = `kd_poll_vote_${pollId}`;

  const [pollOptions, setPollOptions] = useState<PollOptionItem[]>(initialOptions);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);

  // Check localStorage on mount or pollId change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setVotedOptionId(saved);
        setHasVoted(true);
      } else {
        setVotedOptionId(null);
        setHasVoted(false);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [storageKey]);

  // Keep options in sync if props change
  useEffect(() => {
    setPollOptions(initialOptions);
  }, [initialOptions]);

  // Calculate total votes and percentage breakdown
  const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    setAnimating(true);
    // Update local state vote count
    setPollOptions((prev) =>
      prev.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt))
    );
    setVotedOptionId(optionId);
    setHasVoted(true);

    try {
      localStorage.setItem(storageKey, optionId);
    } catch {
      // Ignore
    }

    setTimeout(() => setAnimating(false), 600);
  };

  const handleResetVote = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
    setHasVoted(false);
    setVotedOptionId(null);
    setSelectedOption(null);
  };

  return (
    <div
      className={`bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md space-y-4 animate-fadeIn ${className}`}
      data-widget="opinion-poll"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <HelpCircle className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-amber-400 font-kd-meta uppercase tracking-wider">
            आज का जनमत पोल (Opinion Poll)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[9px] bg-red-600/30 text-red-400 border border-red-500/40 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            LIVE
          </span>
          {isAdmin && onOpenAdminSettings && (
            <button
              type="button"
              onClick={onOpenAdminSettings}
              className="text-slate-400 hover:text-amber-400 p-1 rounded transition cursor-pointer"
              title="Edit Opinion Poll Question & Options"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Poll Question */}
      <div className="space-y-1">
        <p className="text-xs sm:text-sm font-bold font-kd-headline text-slate-100 leading-snug">
          {activeQuestion}
        </p>
        <span className="text-[10px] text-slate-400 font-kd-meta block flex items-center gap-1.5">
          <BarChart2 className="w-3 h-3 text-slate-500" />
          <span>कुल मत: {totalVotes.toLocaleString('hi-IN')}</span>
          <span>•</span>
          <span>ताजा आंकड़े</span>
        </span>
      </div>

      {/* Body: Voting Options vs Results Percentage Bars */}
      {hasVoted ? (
        <div className="space-y-3 pt-1 animate-fadeIn font-kd-meta">
          {/* Success Banner */}
          <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>आपकी राय दर्ज कर ली गई है! धन्यवाद।</span>
            </span>
            <button
              type="button"
              onClick={handleResetVote}
              className="text-[11px] text-emerald-200 hover:text-white underline ml-2 flex items-center gap-1 cursor-pointer shrink-0"
              title="Change your vote"
            >
              <RotateCcw className="w-3 h-3" />
              <span>बदलें</span>
            </button>
          </div>

          {/* Results Percentage Bars for Each Option */}
          <div className="space-y-2.5">
            {pollOptions.map((opt, idx) => {
              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              const isUserChoice = votedOptionId === opt.id;
              const optionLetters = ['A', 'B', 'C', 'D', 'E'];

              return (
                <div
                  key={opt.id}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    isUserChoice
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-xs'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 font-mono ${
                          isUserChoice
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {optionLetters[idx] || idx + 1}
                      </span>
                      <span
                        className={`truncate text-xs ${
                          isUserChoice ? 'text-amber-300 font-bold' : 'text-slate-200 font-medium'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {isUserChoice && (
                        <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded shrink-0">
                          आपका वोट
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-black font-mono ${
                          isUserChoice ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="h-2 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        isUserChoice
                          ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                          : 'bg-gradient-to-r from-slate-600 to-slate-400'
                      }`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>{opt.votes.toLocaleString('hi-IN')} वोट</span>
                    <span>{pct}% कुल भागीदारी</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Voting Choices List */
        <div className="space-y-2 pt-1 font-kd-meta">
          <div className="space-y-2">
            {pollOptions.map((opt, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D', 'E'];
              const isSelected = selectedOption === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-red-600/20 border-red-500 text-white shadow-xs'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 font-mono transition ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 group-hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      {optionLetters[idx] || idx + 1}
                    </span>
                    <span className="leading-snug">{opt.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-slate-600 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>एक विकल्प चुनें और वोट दें</span>
            </span>

            <button
              type="button"
              disabled={!selectedOption || animating}
              onClick={() => selectedOption && handleVote(selectedOption)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 font-kd-meta cursor-pointer shadow-sm ${
                selectedOption
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white active:scale-95'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              <span>वोट दर्ज करें</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
