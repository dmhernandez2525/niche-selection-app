import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToastContext } from '@/context/ToastContext';
import {
  User,
  Mail,
  Key,
  Bell,
  Shield,
  Palette,
  Download,
  Trash2,
  Save,
  Moon,
  Sun,
  Monitor,
  Check
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface UserSettings {
  name: string;
  email: string;
  notifications: {
    email: boolean;
    browser: boolean;
    analysisComplete: boolean;
    weeklyDigest: boolean;
  };
  theme: Theme;
  exportFormat: 'csv' | 'pdf';
}

function SettingToggle({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function ThemeButton({
  theme,
  currentTheme,
  icon: Icon,
  label,
  onClick
}: {
  theme: Theme;
  currentTheme: Theme;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  const isActive = currentTheme === theme;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
        isActive
          ? 'border-primary bg-primary/5'
          : 'border-transparent bg-muted/50 hover:bg-muted'
      }`}
    >
      <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className={`text-sm ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
        {label}
      </span>
      {isActive && <Check className="h-4 w-4 text-primary" />}
    </button>
  );
}

export function Profile() {
  const toast = useToastContext();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Demo User',
    email: 'demo@example.com',
    notifications: {
      email: true,
      browser: false,
      analysisComplete: true,
      weeklyDigest: true
    },
    theme: 'system',
    exportFormat: 'csv'
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    toast.info('Preparing your data export...');
    setTimeout(() => {
      toast.success('Data export ready for download!');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    toast.warning('Account deletion requires confirmation. Please contact support.');
  };

  const updateNotification = (key: keyof UserSettings['notifications'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{settings.name}</h3>
              <p className="text-sm text-muted-foreground">{settings.email}</p>
              <Badge variant="secondary" className="mt-1">Free Plan</Badge>
            </div>
          </div>
          <div className="grid gap-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Display Name
              </label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <ThemeButton
              theme="light"
              currentTheme={settings.theme}
              icon={Sun}
              label="Light"
              onClick={() => setSettings((prev) => ({ ...prev, theme: 'light' }))}
            />
            <ThemeButton
              theme="dark"
              currentTheme={settings.theme}
              icon={Moon}
              label="Dark"
              onClick={() => setSettings((prev) => ({ ...prev, theme: 'dark' }))}
            />
            <ThemeButton
              theme="system"
              currentTheme={settings.theme}
              icon={Monitor}
              label="System"
              onClick={() => setSettings((prev) => ({ ...prev, theme: 'system' }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingToggle
            label="Email Notifications"
            description="Receive updates via email"
            checked={settings.notifications.email}
            onChange={(v) => updateNotification('email', v)}
          />
          <SettingToggle
            label="Browser Notifications"
            description="Get push notifications in your browser"
            checked={settings.notifications.browser}
            onChange={(v) => updateNotification('browser', v)}
          />
          <SettingToggle
            label="Analysis Complete Alerts"
            description="Get notified when an analysis finishes"
            checked={settings.notifications.analysisComplete}
            onChange={(v) => updateNotification('analysisComplete', v)}
          />
          <SettingToggle
            label="Weekly Digest"
            description="Receive a weekly summary of your niche insights"
            checked={settings.notifications.weeklyDigest}
            onChange={(v) => updateNotification('weeklyDigest', v)}
          />
        </CardContent>
      </Card>

      {/* Export Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Preferences
          </CardTitle>
          <CardDescription>Choose your default export format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setSettings((prev) => ({ ...prev, exportFormat: 'csv' }))}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                settings.exportFormat === 'csv'
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-muted/50 hover:bg-muted'
              }`}
            >
              <p className="font-medium">CSV</p>
              <p className="text-xs text-muted-foreground">Best for spreadsheets</p>
            </button>
            <button
              onClick={() => setSettings((prev) => ({ ...prev, exportFormat: 'pdf' }))}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                settings.exportFormat === 'pdf'
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-muted/50 hover:bg-muted'
              }`}
            >
              <p className="font-medium">PDF</p>
              <p className="text-xs text-muted-foreground">Best for sharing</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full sm:w-auto">
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <p className="text-xs text-muted-foreground">
            Last password change: Never
          </p>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Deleting your account will permanently remove all your data. This action cannot be undone.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-6">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
