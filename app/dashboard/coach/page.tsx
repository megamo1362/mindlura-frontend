import { redirect } from 'next/navigation';

export default function CoachRoot() {
  redirect('/dashboard/coach/clients');
}
