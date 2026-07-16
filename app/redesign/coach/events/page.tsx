// STAGING NOTE: reuses the live coach events component as-is (same data
// fetching + business logic). Only the surrounding shell is redesigned;
// see the go-live checklist for the follow-up token migration.
import { CoachEventsPage } from '@/components/coach/coach-events-page';

export default function RedesignCoachEventsRoute() {
  return <CoachEventsPage />;
}
