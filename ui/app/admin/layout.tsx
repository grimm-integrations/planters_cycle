import TopNav from '@/app/ui/nav/top-nav';
import SideNav from '@/app/ui/admin/side-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className='grid h-screen w-full pl-[56px]'>
        <SideNav />
        <TopNav />
        <div className='flex min-h-screen w-full flex-col'>{children}</div>
      </div>
    </main>
  );
}
