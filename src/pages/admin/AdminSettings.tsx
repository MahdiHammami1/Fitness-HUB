import { useState, useEffect } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import { toast } from 'sonner';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export const AdminSettings = () => {
  const { settings: contextSettings, updateSettings } = useSiteSettings();
  const [settings, setSettings] = useState(contextSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(contextSettings);
  }, [contextSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update the global context
      updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err: any) {
      console.error('Failed to save settings', err);
      toast.error(err?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Configure site settings and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6 sm:space-y-8">
        {/* General Settings */}
        <div className="rounded-xl bg-card border border-border p-4 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl text-foreground mb-6">General</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Site Name
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Hero Title
              </label>
              <Input
                value={settings.heroTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Hero Subtitle
              </label>
              <Textarea
                value={settings.heroSubtitle}
                onChange={(e) => setSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                rows={2}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="rounded-xl bg-card border border-border p-4 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl text-foreground mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Contact Email
              </label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                WhatsApp Number
              </label>
              <Input
                value={settings.whatsappNumber}
                onChange={(e) => setSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Instagram Handle
              </label>
              <Input
                value={settings.instagramHandle}
                onChange={(e) => setSettings(prev => ({ ...prev, instagramHandle: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} size="lg" disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
