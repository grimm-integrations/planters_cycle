/*
 * Copyright (c) Johannes Grimm 2024.
 */
'use client';

import SubmitButton from '@/components/submit-button';
import { Badge } from '@/components/ui/badge';
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { createUser, editUser, redirectToUsers } from '@/lib/repos/user';
import { cn } from '@/lib/utils';
import { UserModel, UsersInRolesModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Role, UsersInRoles } from '@prisma/client';

const editUserSchema = UserModel.partial({
  createdAt: true,
  id: true,
  lastLogin: true,
});

interface CompleteUser extends z.infer<typeof editUserSchema> {
  roles: UsersInRoles[];
}

/**
 * Schema for the related user model.
 * @type {z.ZodSchema<CompleteUser>}
 */
const relatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  editUserSchema.extend({
    roles: UsersInRolesModel.array(),
  })
);

/**
 * EditUserForm component is a form for editing or creating a user.
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.edit - Indicates whether the form is for editing an existing user or creating a new user.
 * @param {string} props.id - The ID of the user being edited.
 * @param {Role[]} props.roles - An array of available roles.
 * @param {CompleteUser} props.user - The user object being edited.
 * @returns {JSX.Element} The rendered EditUserForm component.
 */
export default function EditUserForm({
  edit,
  id,
  roles,
  user,
}: {
  edit: boolean;
  id: string;
  roles: Role[];
  user: CompleteUser;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof relatedUserModel>>({
    defaultValues: {
      displayName: user.displayName,
      email: user.email,
      password: '',
      roles: user.roles.map((role) => {
        return {
          assignedAt: new Date(role.assignedAt),
          assignedBy: role.assignedBy,
          roleId: role.roleId,
          userId: role.userId,
        };
      }),
    },
    resolver: zodResolver(relatedUserModel),
  });

  async function onSubmit(values: z.infer<typeof relatedUserModel>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    values = {
      ...values,
      createdAt: user.createdAt,
      id: user.id,
      lastLogin: user.lastLogin,
    };

    try {
      if (edit) {
        await editUser(id, values);
        toast({
          description: `Updated user ${values.displayName}.`,
          title: 'Success 🎉',
        });
      } else {
        await createUser(values);
        toast({
          description: `Created user ${values.displayName}.`,
          title: 'Success 🎉',
        });
      }
      await redirectToUsers();
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

  function toggleRole(role: Role): UsersInRoles[] {
    const formRoles = form.getValues('roles');
    const index = formRoles.findIndex((r) => r.roleId === role.id);
    if (index === -1) {
      return [
        ...formRoles,
        {
          assignedAt: new Date(),
          assignedBy: '',
          roleId: role.id,
          userId: user.id ?? '',
        },
      ];
    } else {
      return formRoles.filter((r) => r.roleId !== role.id);
    }
  }

  function isRoleActive(role: Role): boolean {
    return form.getValues('roles').some((r) => r.roleId === role.id);
  }

  function DisplayRoles() {
    const formRoles = form.getValues('roles');

    if (formRoles.length == 0) return 'Roles';

    return (
      <div className='flex w-full'>
        {formRoles.map((role) => {
          const orgRole = roles.find((val) => val.id == role.roleId);
          return (
            <div className='flex-initial p-0.5' key={role.roleId}>
              <Badge>{orgRole?.name}</Badge>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{edit ? 'Edit' : 'Create'} User</CardTitle>
              <CardDescription>
                {edit
                  ? "Edit the user's information below."
                  : 'Create a new user account.'}
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='displayName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Max Mustermann' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>eMail</FormLabel>
                      <FormControl>
                        <Input placeholder='dev@r4p1d.xyz' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your email address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='********'
                          type='password'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your private password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='roles'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Roles</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                ' justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                              role='combobox'
                              variant='outline'
                            >
                              <DisplayRoles />
                              <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          align='start'
                          className='p-0'
                          side='bottom'
                        >
                          <Command>
                            <CommandInput placeholder='Search role...' />
                            <CommandEmpty>No role found.</CommandEmpty>
                            <CommandGroup>
                              {roles.map((role) => {
                                return (
                                  <CommandItem
                                    key={role.name}
                                    onSelect={() => {
                                      form.setValue('roles', toggleRole(role));
                                    }}
                                    value={role.name}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        isRoleActive(role)
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {role.name}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        This are the roles the user get assigned to.
                      </FormDescription>
                      <FormMessage />
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
