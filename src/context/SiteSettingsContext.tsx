import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  whatsappNumber: string;
  instagramHandle: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (settings: SiteSettings) => void;
  loadSettings: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: 'Wouhouch Hub',
  heroTitle: 'PUSH YOUR LIMITS',
  heroSubtitle: 'Expert coaching, powerful events, and premium gear.',
  contactEmail: 'wouhouchteam@gmail.com',
  whatsappNumber: '+216 26 630 102',
  instagramHandle: '@wouhouch_hub'
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to load from localStorage first
        const stored = localStorage.getItem('siteSettings');
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    // Persist to localStorage
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, loadSettings: async () => {}, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
};
