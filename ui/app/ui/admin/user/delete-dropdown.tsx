'use client';

import { User } from '@prisma/client';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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

import { deleteUser, redirectToUsers } from '@/lib/actions';

export default function DeleteDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  async function onClickDelete(user: User) {
    try {
      await deleteUser(user.id);
      toast({
        title: 'Success 🎉',
        description: `Deleted user ${user.displayName}.`,
      });
      await redirectToUsers();
    } catch (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem with your request.\n${error}`,
      });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup='true' size='icon' variant='ghost'>
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link href={`/admin/users/${user.id}/edit`}>
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
              {user.displayName} user from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onClickDelete(user)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
