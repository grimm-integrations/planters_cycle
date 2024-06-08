/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createRole, redirectToRoles } from '@/lib/repos/role';
import { RoleModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { z } from 'zod';

const editRoleSchema = RoleModel.partial({
  id: true,
});

/**
 * Component for creating a new role account.
 */
export default function CreateRoleForm() {
  const form = useForm<z.infer<typeof editRoleSchema>>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(editRoleSchema),
  });
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof editRoleSchema>) {
    try {
      await createRole(values);
      toast({
        description: `Created role ${values.name}.`,
        title: 'Success 🎉',
      });
      await redirectToRoles();
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
      <Form {...form}>
        <form
          className='space-y-8'
          onSubmit={() => {
            form.handleSubmit(onSubmit);
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create Role</CardTitle>
              <CardDescription>Create a new role account.</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Admin' {...field} />
                      </FormControl>
                      <FormDescription>This is the role name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className='w-full' type='submit'>
                Create
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
