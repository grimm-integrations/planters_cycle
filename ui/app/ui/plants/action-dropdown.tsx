/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { CompletePlant } from '@/prisma/zod';

export default function ActionDropdown({ plant }: { plant: CompletePlant }) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  function onClickDelete(plant: CompletePlant) {
    try {
      // await deletePlant(plant.id);
      toast({
        description: `Deleted plant ${plant.name}.`,
        title: 'Success 🎉',
      });
      setOpen(false);
      // await redirectToPlants();
    } catch (error: unknown) {
      let errorMessage = 'There was a problem with your request.';
      if (error instanceof Error) {
        errorMessage += `\n${error.message}`;
      }
      toast({
        description: errorMessage,
        title: 'Uh oh! Something went wrong.',
      });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup='true' size='icon' variant='ghost'>
            <MoreHorizontal className='size-4' />
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link href={`/dashboard/plants/${plant.id}/edit`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {plant.name} plant from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onClickDelete(plant)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
