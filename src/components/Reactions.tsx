import React, { useState, useEffect } from 'react';
import { ReactionType, ArticleReactions } from '../types/news';
import { updateArticleReaction } from '../services/newsService';

export interface ReactionsProps {
  articleId: string;
  initialReactions?: ArticleReactions;
  userReaction?: ReactionType | null;
  onReactionChange?: (type: ReactionType, newReactions: ArticleReactions) => void;
  className?: string;
}

interface ReactionItemConfig {
  type: ReactionType;
  emoji: string;
  label: string;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  activeRing: string;
}

const REACTION_CONFIG: ReactionItemConfig[] = [
  {
    type: 'like',
    emoji: '👍',
    label: 'Thumbs Up',
    activeColor: 'text-blue-600',
    activeBg: 'bg-blue-50',
    activeBorder: 'border-blue-300',
    activeRing: 'ring-2 ring-blue-400/30',
  },
  {
    type: 'love',
    emoji: '❤️',
    label: 'Love',
    activeColor: 'text-rose-600',
    activeBg: 'bg-rose-50',
    activeBorder: 'border-rose-300',
    activeRing: 'ring-2 ring-rose-400/30',
  },
  {
    type: 'funny',
    emoji: '😂',
    label: 'Haha',
    activeColor: 'text-amber-600',
    activeBg: 'bg-amber-50',
    activeBorder: 'border-amber-300',
    activeRing: 'ring-2 ring-amber-400/30',
  },
  {
    type: 'surprised',
    emoji: '😲',
    label: 'Surprised',
    activeColor: 'text-purple-600',
    activeBg: 'bg-purple-50',
    activeBorder: 'border-purple-300',
    activeRing: 'ring-2 ring-purple-400/30',
  },
];

export const Reactions: React.FC<ReactionsProps> = ({
  articleId,
  initialReactions,
  userReaction: controlledUserReaction,
  onReactionChange,
  className = '',
}) => {
  const [internalUserReaction, setInternalUserReaction] = useState<ReactionType | null>(() => {
    try {
      const stored = localStorage.getItem(`kd_reaction_${articleId}`);
      return (stored as ReactionType) || null;
    } catch {
      return null;
    }
  });

  const [reactions, setReactions] = useState<ArticleReactions>(() => ({
    like: initialReactions?.like || 0,
    love: initialReactions?.love || 0,
    funny: initialReactions?.funny || 0,
    surprised: initialReactions?.surprised || 0,
  }));

  const [animatingType, setAnimatingType] = useState<ReactionType | null>(null);

  // Sync internal state if props change
  useEffect(() => {
    if (initialReactions) {
      setReactions({
        like: initialReactions.like || 0,
        love: initialReactions.love || 0,
        funny: initialReactions.funny || 0,
        surprised: initialReactions.surprised || 0,
      });
    }
  }, [initialReactions]);

  useEffect(() => {
    if (controlledUserReaction !== undefined) {
      setInternalUserReaction(controlledUserReaction);
    } else {
      try {
        const stored = localStorage.getItem(`kd_reaction_${articleId}`);
        setInternalUserReaction((stored as ReactionType) || null);
      } catch {
        setInternalUserReaction(null);
      }
    }
  }, [articleId, controlledUserReaction]);

  const activeReaction = controlledUserReaction !== undefined ? controlledUserReaction : internalUserReaction;

  const handleReactionClick = async (type: ReactionType) => {
    const prev = activeReaction;
    const isTogglingOff = prev === type;
    const nextReaction = isTogglingOff ? null : type;

    // Trigger visual pop animation
    if (nextReaction) {
      setAnimatingType(nextReaction);
      setTimeout(() => setAnimatingType(null), 600);
    }

    // Calculate new reactions counts
    const updatedCounts: ArticleReactions = { ...reactions };
    if (prev && prev !== type && updatedCounts[prev] !== undefined) {
      updatedCounts[prev] = Math.max(0, (updatedCounts[prev] || 0) - 1);
    }
    if (isTogglingOff) {
      updatedCounts[type] = Math.max(0, (updatedCounts[type] || 0) - 1);
    } else {
      updatedCounts[type] = (updatedCounts[type] || 0) + 1;
    }

    // Local state updates
    setReactions(updatedCounts);
    setInternalUserReaction(nextReaction);

    try {
      if (nextReaction) {
        localStorage.setItem(`kd_reaction_${articleId}`, nextReaction);
      } else {
        localStorage.removeItem(`kd_reaction_${articleId}`);
      }
    } catch {
      // ignore localStorage quota error
    }

    if (onReactionChange) {
      onReactionChange(type, updatedCounts);
    }

    // Persist to backend / Firestore
    await updateArticleReaction(articleId, type, reactions, prev);
  };

  const formatCount = (count?: number) => {
    if (!count || count <= 0) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return count.toString();
  };

  return (
    <div className={`reactions-container py-2 flex items-center justify-center select-none font-kd-meta ${className}`}>
      <div className="inline-flex items-center space-x-1.5 sm:space-x-3 bg-slate-50/90 p-1.5 sm:p-2 rounded-full border border-slate-200/90 shadow-2xs backdrop-blur-xs">
        {REACTION_CONFIG.map((item) => {
          const isSelected = activeReaction === item.type;
          const isAnimating = animatingType === item.type;
          const count = reactions[item.type] || 0;

          return (
            <button
              key={item.type}
              type="button"
              onClick={() => handleReactionClick(item.type)}
              aria-label={item.label}
              className={`relative inline-flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-90 ${
                isSelected
                  ? `${item.activeBg} ${item.activeBorder} ${item.activeRing} ${item.activeColor} shadow-2xs scale-105`
                  : 'bg-white hover:bg-slate-100/90 text-slate-700 border border-slate-200/70 hover:border-slate-300'
              }`}
            >
              {/* Emoji Icon with micro-animation */}
              <span
                className={`text-lg sm:text-xl leading-none inline-block transform transition-transform duration-200 ${
                  isAnimating ? 'scale-135 -rotate-12' : isSelected ? 'scale-110' : 'hover:scale-115'
                }`}
              >
                {item.emoji}
              </span>

              {/* Number Count */}
              <span
                className={`font-mono text-xs sm:text-[13px] tabular-nums ${
                  isSelected ? item.activeColor : 'text-slate-600'
                }`}
              >
                {formatCount(count)}
              </span>

              {/* Floating ping effect on click */}
              {isAnimating && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Reactions;
