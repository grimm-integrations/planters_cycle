/*
 * Copyright (c) Johannes Grimm 2024.
 */
'use client';

import { UserModel, UsersInRolesModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role, User, UsersInRoles } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import { createUser, editUser, redirectToUsers } from '@/lib/actions';
import { cn } from '@/lib/utils';

const editUserSchema = UserModel.partial({
  id: true,
  createdAt: true,
  lastLogin: true,
  password: true,
});

interface CompleteUser extends z.infer<typeof editUserSchema> {
  roles: UsersInRoles[];
}

const relatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  editUserSchema.extend({
    roles: UsersInRolesModel.array(),
  })
);

export default function EditUserForm({
  id,
  user,
  roles,
  sessionUserId,
  edit,
}: {
  id: string;
  user: User & { roles: UsersInRoles[] };
  roles: Role[];
  sessionUserId: string;
  edit: boolean;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof relatedUserModel>>({
    resolver: zodResolver(relatedUserModel),
    defaultValues: {
      displayName: user.displayName,
      email: user.email,
      roles: user.roles.map((role) => {
        return {
          roleId: role.roleId,
          userId: role.userId,
          assignedBy: role.assignedBy,
          assignedAt: new Date(role.assignedAt),
        };
      }),
    },
  });

  async function onSubmit(values: z.infer<typeof relatedUserModel>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    values = {
      ...values,
      id: user.id,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };
    if (values.password == undefined && edit) values.password = '';

    try {
      if (edit) {
        await editUser(id, values);
        toast({
          title: 'Success 🎉',
          description: `Updated user ${values.displayName}.`,
        });
      } else {
        await createUser(values);
        toast({
          title: 'Success 🎉',
          description: `Created user ${values.displayName}.`,
        });
      }
      redirectToUsers();
    } catch (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem with your request.\n${error}`,
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
          roleId: role.id,
          userId: user.id,
          assignedBy: sessionUserId,
          assignedAt: new Date(),
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
          let orgRole = roles.find((val) => val.id == role.roleId);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                          type='password'
                          placeholder='********'
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
                              variant='outline'
                              role='combobox'
                              className={cn(
                                ' justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <DisplayRoles />
                              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className='p-0'
                          side='bottom'
                          align='start'
                        >
                          <Command>
                            <CommandInput placeholder='Search role...' />
                            <CommandEmpty>No role found.</CommandEmpty>
                            <CommandGroup>
                              {roles.map((role) => {
                                return (
                                  <CommandItem
                                    value={role.name}
                                    key={role.name}
                                    onSelect={() => {
                                      form.setValue('roles', toggleRole(role));
                                    }}
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
                text={edit ? 'Save' : 'Create'}
                isSubmitting={isSubmitting}
              />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
