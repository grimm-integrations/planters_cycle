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
import {
  createGenetic,
  editGenetic,
  redirectToGenetics,
} from '@/lib/repos/genetic';
import { GeneticModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';

import type { Genetic } from '@prisma/client';
import type { z } from 'zod';

/**
 * Renders a form for editing or creating a genetic entry.
 * @param {Object} props - The component props.
 * @param {Genetic} props.genetic - The genetic object to edit (optional).
 * @returns {JSX.Element} The rendered form component.
 */
export default function EditGeneticForm({ genetic }: { genetic?: Genetic }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const edit = Boolean(genetic == undefined);
  const form = useForm<z.infer<typeof GeneticModel>>({
    defaultValues: {
      flowerDays: genetic?.flowerDays ?? 0,
      name: genetic?.name ?? '',
    },
    resolver: zodResolver(GeneticModel),
  });

  /* const checkDuplicateNameDebounce = useDebouncedCallback(
    async (name: string) => {
      if (name == '') return;
      // Check if name is already in use
      const d = await checkDuplicateName(name);
      console.log(d);
    },
    100
  ); */

  const { watch } = form;
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name == 'flowerDays' && type == 'change') {
        form.setValue('flowerDays', Math.max(0, Number(value.flowerDays)), {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
      if (name == 'name' && type == 'change') {
        // checkDuplicateNameDebounce(String(value.name));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, watch]);

  async function onSubmit(formValues: z.infer<typeof GeneticModel>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (edit && genetic) {
        await editGenetic(genetic.id, formValues);
        toast({
          description: `Edited genetic: ${formValues.name}.`,
          title: 'Success 🎉',
        });
      } else {
        await createGenetic(formValues);
        toast({
          description: `Created genetic: ${formValues.name}.`,
          title: 'Success 🎉',
        });
      }
      await redirectToGenetics();
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
              <CardTitle>{edit ? 'Edit' : 'Create'} Genetic</CardTitle>
              <CardDescription>
                {edit
                  ? "Edit the genetic's information below."
                  : 'Create a new genetic.'}
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
                        <Input placeholder='Strawberry Cheesecake' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the genetic name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='flowerDays'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Flowering days</FormLabel>
                        <FormControl>
                          <Input type='number' {...field} />
                        </FormControl>
                        <FormDescription>
                          How many days this genetic usally needs to produce
                          ripe flowers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
