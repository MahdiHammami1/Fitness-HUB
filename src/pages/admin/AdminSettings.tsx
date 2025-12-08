import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Wouhouch Hub',
    heroTitle: 'PUSH YOUR LIMITS',
    heroSubtitle: 'Expert coaching, powerful events, and premium gear.',
    contactEmail: 'contact@wouhouch.com',
    whatsappNumber: '+212 600 000 000',
    instagramHandle: '@wouhouch_hub'
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure site settings and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* General Settings */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-display text-xl text-foreground mb-6">General</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Site Name
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Hero Title
              </label>
              <Input
                value={settings.heroTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
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
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-display text-xl text-foreground mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Contact Email
              </label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                WhatsApp Number
              </label>
              <Input
                value={settings.whatsappNumber}
                onChange={(e) => setSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Instagram Handle
              </label>
              <Input
                value={settings.instagramHandle}
                onChange={(e) => setSettings(prev => ({ ...prev, instagramHandle: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
