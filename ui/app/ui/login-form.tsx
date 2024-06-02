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
import { authenticate } from '@/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  identifier: z.string().min(2, {
    message: 'identifier must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.',
  }),
  redirectTo: z.string().optional(),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      identifier: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authenticate(values);
  }

  return (
    <>
      <Form {...form}>
        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
          <Card className='w-full max-w-sm'>
            <CardHeader>
              <CardTitle className='text-2xl'>Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='identifier'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>identifier</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' {...field} />
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
              </div>
            </CardContent>
            <CardFooter>
              <Button className='w-full' type='submit'>
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
