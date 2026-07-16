// STAGING NOTE: reuses the live journal page component as-is (same data
// fetching + business logic) so this route never diverges from production
// behavior. Its internal styling still uses the legacy globals.css tokens —
// only the surrounding shell (sidebar/topbar/nav/theme) is redesigned here.
// See the go-live checklist for the follow-up token migration.
import JournalPage from '@/app/dashboard/journal/page';

export default function RedesignJournalPage() {
  return <JournalPage />;
}
