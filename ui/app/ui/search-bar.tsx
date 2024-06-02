/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 100);

  return (
    <div className='relative ml-auto flex-1 md:grow-0'>
      <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
      <Input
        className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        type='search'
      />
    </div>
  );
}
