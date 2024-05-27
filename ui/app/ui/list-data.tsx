'use client';

import {
  RankingInfo,
  compareItems,
  rankItem,
} from '@tanstack/match-sorter-utils';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
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
  PaginationEllipsis,
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

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    className?: string;
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
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface ListDataProps<TData, TValue> {
  name: string;
  description: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export default function ListData<TData, TValue>({
  name,
  description,
  columns,
  data,
  searchParams,
}: ListDataProps<TData, TValue>) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState('');

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
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
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search...'
              className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
              onChange={(e) => handleSearch(e.target.value)}
              value={globalFilter ?? ''}
            />
          </div>
          <div className='flex items-center'>
            <div className='ml-auto flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='h-8 gap-1'>
                    <ListFilter className='h-3.5 w-3.5' />
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
                          key={column.id}
                          className='capitalize'
                          checked={column.getIsVisible()}
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

              <Link href='/admin/users/create'>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
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
                              key={header.id}
                              className={cn(
                                header.column.columnDef.meta?.headerClassName ??
                                  '',
                                header.column.columnDef.meta?.className ?? ''
                              )}
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
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                cell.column.columnDef.meta?.cellClassName ?? '',
                                cell.column.columnDef.meta?.className ?? ''
                              )}
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
                          colSpan={columns.length}
                          className='h-24 text-center'
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
                            href=''
                            onClick={() => table.firstPage()}
                            className={
                              !table.getCanPreviousPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            aria-disabled={!table.getCanPreviousPage()}
                            tabIndex={
                              !table.getCanPreviousPage() ? -1 : undefined
                            }
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationPrevious
                            href=''
                            onClick={() => table.previousPage()}
                            className={
                              !table.getCanPreviousPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            aria-disabled={!table.getCanPreviousPage()}
                            tabIndex={
                              !table.getCanPreviousPage() ? -1 : undefined
                            }
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            href=''
                            className={'pointer-events-none'}
                            aria-disabled={true}
                            tabIndex={-1}
                          >
                            {table.getState().pagination.pageIndex + 1}
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            href=''
                            onClick={() => table.nextPage()}
                            className={
                              !table.getCanNextPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            aria-disabled={!table.getCanNextPage()}
                            tabIndex={!table.getCanNextPage() ? -1 : undefined}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLast
                            href=''
                            onClick={() => table.lastPage()}
                            className={
                              !table.getCanNextPage()
                                ? 'pointer-events-none'
                                : ''
                            }
                            aria-disabled={!table.getCanNextPage()}
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
