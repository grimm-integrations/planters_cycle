/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import SubmitButton from '@/components/submit-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { createRole, editRole, redirectToRoles } from '@/lib/repos/role';
import { RoleModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Role } from '@prisma/client';
import type { z } from 'zod';

/**
 * Represents the schema for editing a role.
 * @remarks
 * This schema includes the `id` property.
 */
const editRoleSchema = RoleModel.partial({
  id: true,
});

/**
 * Renders a form for editing or creating a role.
 * @param edit - A boolean indicating whether the form is for editing an existing role.
 * @param id - The ID of the role being edited.
 * @param role - The role object containing the initial values for the form fields.
 * @returns The JSX element representing the form.
 */
export default function EditRoleForm({
  edit,
  id,
  role,
}: {
  edit: boolean;
  id: string;
  role: Role;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof editRoleSchema>>({
    defaultValues: {
      isDefault: role.isDefault,
      name: role.name,
    },
    resolver: zodResolver(editRoleSchema),
  });

  async function onSubmit(values: z.infer<typeof editRoleSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (edit) {
        await editRole(id, values);
        toast({
          description: `Edited role ${values.name}.`,
          title: 'Success 🎉',
        });
      } else {
        await createRole(values);
        toast({
          description: `Created role ${values.name}.`,
          title: 'Success 🎉',
        });
      }
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
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{edit ? 'Edit' : 'Create'} Role</CardTitle>
              <CardDescription>
                {edit
                  ? "Edit the role's information below."
                  : 'Create a new role account.'}
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
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='isDefault'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Is default role</FormLabel>
                        <FormDescription>
                          Default roles get automaticly assigned to new users.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton
                isSubmitting={isSubmitting}
                text={edit ? 'Save' : 'Create'}
              />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
