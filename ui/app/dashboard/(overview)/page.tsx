import { ModeToggle } from '@/app/ui/theme-toggler';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  return (
    <main>
      <ModeToggle />
    </main>
  );
}
