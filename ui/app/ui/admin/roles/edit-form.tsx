'use client';

import { RoleModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import { editRole } from '@/lib/actions';

const editRoleSchema = RoleModel.partial({
  id: true,
});

export default function EditRoleForm({ id, role }: { id: string; role: Role }) {
  const form = useForm<z.infer<typeof editRoleSchema>>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: role.name,
    },
  });

  async function onSubmit(values: z.infer<typeof editRoleSchema>) {
    await editRole(id, values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
              <Button type='submit' className='w-full'>
                Save
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
