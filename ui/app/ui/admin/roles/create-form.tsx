'use client';

import { RoleModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

import { createRole, redirectToRoles } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';

const editRoleSchema = RoleModel.partial({
  id: true,
});

export default function CreateRoleForm() {
  const form = useForm<z.infer<typeof editRoleSchema>>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: '',
    },
  });
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof editRoleSchema>) {
    try {
      await createRole(values);
      toast({
        title: "Succsess 🎉",
        description: `Created role ${values.name}.`,
      })
      await redirectToRoles();
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: `There was a problem with your request.\n${error}`,
      })
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
              <Button type='submit' className='w-full'>
                Create
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
