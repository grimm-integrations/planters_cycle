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
import { editRole, redirectToRoles } from '@/lib/actions';
import { RoleModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { Role } from '@prisma/client';
import type { z } from 'zod';

const editRoleSchema = RoleModel.partial({
  id: true,
});

export default function EditRoleForm({ id, role }: { id: string; role: Role }) {
  const form = useForm<z.infer<typeof editRoleSchema>>({
    defaultValues: {
      name: role.name,
    },
    resolver: zodResolver(editRoleSchema),
  });
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof editRoleSchema>) {
    try {
      await editRole(id, values);
      toast({
        description: `Edited role ${values.name}.`,
        title: 'Succsess 🎉',
      });
      await redirectToRoles();
    } catch (error) {
      toast({
        description: `There was a problem with your request.\n${error}`,
        title: 'Uh oh! Something went wrong.',
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Edit Role</CardTitle>
              <CardDescription>
                Edit the role&apos;s information below.
              </CardDescription>
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
                Save
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
