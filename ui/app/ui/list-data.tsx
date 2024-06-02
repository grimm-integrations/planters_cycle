/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import BreadCrumb from '@/components/bread-crumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ListFilter, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import type { RankingInfo } from '@tanstack/match-sorter-utils';
import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    cellClassName?: string;
    className?: string;
    headerClassName?: string;
  }
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface ListDataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  description: string;
  name: string;
  searchParams?: {
    page?: string;
    query?: string;
  };
}

export default function ListData<TData, TValue>({
  columns,
  data,
  description,
  name,
  searchParams,
}: ListDataProps<TData, TValue>) {
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;

  const [pagination, setPagination] = React.useState({
    pageIndex: currentPage - 1, //initial page index
    pageSize: 10, //default page size
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState(query);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
      sorting,
    },
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    setGlobalFilter(term);
  }, 100);

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 '>
        <header className='sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <BreadCrumb />
          <div className='relative ml-auto flex-1 md:grow-0'>
            <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
            <Input
              className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
              onChange={(e) => handleSearch(e.target.value)}
              placeholder='Search...'
              type='search'
              value={globalFilter ?? ''}
            />
          </div>
          <div className='flex items-center'>
            <div className='ml-auto flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='h-8 gap-1' size='sm' variant='outline'>
                    <ListFilter className='size-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                      Columns
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          checked={column.getIsVisible()}
                          className='capitalize'
                          key={column.id}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          onSelect={(event) => event.preventDefault()}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href={`/admin/${name.toLowerCase()}s/create`}>
                <Button className='h-8 gap-1' size='sm'>
                  <PlusCircle className='size-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Add {name}
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <Card>
            <CardHeader>
              <CardTitle>{name}s</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              className={cn(
                                header.column.columnDef.meta?.headerClassName ??
                                  '',
                                header.column.columnDef.meta?.className ?? ''
                              )}
                              key={header.id}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          data-state={row.getIsSelected() && 'selected'}
                          key={row.id}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              className={cn(
                                cell.column.columnDef.meta?.cellClassName ?? '',
                                cell.column.columnDef.meta?.className ?? ''
                              )}
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          className='h-24 text-center'
                          colSpan={columns.length}
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className='flex items-center space-x-2 py-4'>
                  <div className='flex-1 text-sm text-muted-foreground'>
                    Showing {table.getPaginationRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} total.{' '}
                    {table.getPageCount()} total page(s).
                  </div>
                  <div className='justify-end'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationFirst
                            aria-disabled={!table.getCanPreviousPage()}
                            className={
                              !table.getCanPreviousPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            href=''
                            onClick={() => table.firstPage()}
                            tabIndex={
                              !table.getCanPreviousPage() ? -1 : undefined
                            }
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationPrevious
                            aria-disabled={!table.getCanPreviousPage()}
                            className={
                              !table.getCanPreviousPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            href=''
                            onClick={() => table.previousPage()}
                            tabIndex={
                              !table.getCanPreviousPage() ? -1 : undefined
                            }
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            aria-disabled={true}
                            className={'pointer-events-none'}
                            href=''
                            tabIndex={-1}
                          >
                            {table.getState().pagination.pageIndex + 1}
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            aria-disabled={!table.getCanNextPage()}
                            className={
                              !table.getCanNextPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            href=''
                            onClick={() => table.nextPage()}
                            tabIndex={!table.getCanNextPage() ? -1 : undefined}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLast
                            aria-disabled={!table.getCanNextPage()}
                            className={
                              !table.getCanNextPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            href=''
                            onClick={() => table.lastPage()}
                            tabIndex={!table.getCanNextPage() ? -1 : undefined}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
