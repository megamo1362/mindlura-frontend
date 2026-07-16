// STAGING NOTE: see app/redesign/dashboard/journal/page.tsx — same pattern.
// Known limitation: this page's own theme toggle controls the LIVE app's
// theme (app/i18n/ThemeContext), a separate mechanism from the new
// rd-theme cookie used by this redesign shell's ThemeToggle in the topbar.
// Harmless (each only affects its own scope) but worth unifying at go-live.
import SettingsPage from '@/app/dashboard/settings/page';

export default function RedesignSettingsPage() {
  return <SettingsPage />;
}
