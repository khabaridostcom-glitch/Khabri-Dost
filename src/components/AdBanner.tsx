import React from 'react';
import { AdResponsiveBreakpoints } from '../types/news';
import { AdSlot } from './AdSlot';

export interface AdBannerProps {
  slot: 'leaderboard' | 'in-content' | 'sidebar' | 'bottom' | 'mobile_sticky';
  type?: 'adsense' | 'private' | 'custom_html' | 'script';
  privateBannerUrl?: string;
  privateBannerLink?: string;
  privateBannerTitle?: string;
  customScriptOrHtml?: string;
  adsenseClientId?: string;
  adsenseSlotId?: string;
  isTestingMode?: boolean;
  onOpenContactPage?: () => void;
  className?: string;
  breakpoints?: AdResponsiveBreakpoints;
}

/**
 * AdBanner component (powered by the smart, reusable AdSlot engine)
 * Ensures:
 * - One slot, one active source.
 * - Testing banner / placeholder disappears automatically when a real ad (AdSense/Script/Image) loads.
 * - Responsive breakpoints and standard sizes.
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  type = 'adsense',
  privateBannerUrl,
  privateBannerLink = '#contact',
  privateBannerTitle = 'खबरी दोस्त मीडिया नेटवर्क | प्रायोजित विज्ञापन',
  customScriptOrHtml,
  adsenseClientId,
  adsenseSlotId,
  isTestingMode = false,
  onOpenContactPage,
  className = '',
  breakpoints,
}) => {
  return (
    <AdSlot
      slotId={slot}
      slotLabel={slot.toUpperCase()}
      adType={type}
      customScriptOrHtml={customScriptOrHtml}
      adsenseConfig={{
        clientId: adsenseClientId,
        slotId: adsenseSlotId,
        responsive: true,
      }}
      privateBanner={{
        imageUrl: privateBannerUrl,
        linkUrl: privateBannerLink,
        title: privateBannerTitle,
      }}
      isTestingMode={isTestingMode}
      breakpoints={breakpoints}
      onOpenContactPage={onOpenContactPage}
      className={className}
    />
  );
};
