import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '@/app/ui/theme-toggler';
import Link from 'next/link';
import { Menu, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserDropdown from './user-dropdown';
import NavLinks from './nav-links';

export default function TopNav() {
  const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Orders', href: '/orders' },
    { name: 'Products', href: '/products' },
    { name: 'Customers', href: '/customers' },
    { name: 'Analytics', href: '/analytics' },
  ];

  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          href='#'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <Package2 className='h-6 w-6' />
          <span className='sr-only'>Acme Inc</span>
        </Link>

        <NavLinks links={links} />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              href='#'
              className='flex items-center gap-2 text-lg font-semibold'
            >
              <Package2 className='h-6 w-6' />
              <span className='sr-only'>Acme Inc</span>
            </Link>
            <NavLinks links={links} />
          </nav>
        </SheetContent>
      </Sheet>
      <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <div className='ml-auto flex-1 sm:flex-initial'>
          <div className='relative'></div>
        </div>
        <UserDropdown />
        <ModeToggle />
      </div>
    </header>
  );
}
