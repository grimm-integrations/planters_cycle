/*
 * Copyright (c) Johannes Grimm 2024.
 */
'use client';

import SubmitButton from '@/components/submit-button';
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
import {
  createPlant,
  generatePlantName,
  redirectToPlants,
} from '@/lib/repos/plant';
import { cn } from '@/lib/utils';
import { PlantModel } from '@/prisma/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus, Check, ChevronsUpDown, RefreshCcwDot } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Genetic } from '@prisma/client';
import type { z } from 'zod';

/**
 * Renders a form for creating a new plant.
 *
 * @component
 * @param {Genetic[]} genetics - The genetics to choose from.
 * @returns {JSX.Element} The rendered component.
 */
export default function CreatePlantForm({ genetics }: { genetics: Genetic[] }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof PlantModel>>({
    defaultValues: {
      geneticId: '',
      name: '',
    },
    resolver: zodResolver(PlantModel),
  });

  async function onSubmit(plant: z.infer<typeof PlantModel>) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await createPlant(plant);
      toast({
        description: `Created plant: ${plant.name}.`,
        title: 'Success 🎉',
      });
      await redirectToPlants();
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

  async function autoGenerateName() {
    if (isGenerating) return;
    setIsGenerating(true);

    const geneticId = form.getValues('geneticId');
    if (geneticId === '') {
      form.setError('name', { message: 'Please select a genetic first.' });
      setIsGenerating(false);
      return;
    }

    const geneticName = genetics.find(
      (genetic: Genetic) => genetic.id === geneticId
    )?.name;
    try {
      const plantTag = String(
        await generatePlantName(form.getValues('geneticId'))
      );
      form.setValue('name', `${geneticName} #${plantTag.padStart(8, '0')}`);
      form.clearErrors('name');
    } catch (error) {
      let errorMessage = 'There was a problem with your request.';
      if (error instanceof Error) {
        errorMessage += `\n${error.message}`;
      }
      toast({
        description: errorMessage,
        title: 'Uh oh! Something went wrong.',
      });
    }
    setIsGenerating(false);
  }

  return (
    <>
      <Form {...form}>
        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Create plant</CardTitle>
              <CardDescription>Create a new plant</CardDescription>
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
                        <Input placeholder='Genetic #4FC53B4A' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your plants identifier.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={() => autoGenerateName()} type='button'>
                  <RefreshCcwDot
                    className={`mr-2 size-4 ${
                      isGenerating ? ' animate-spin' : ''
                    }`}
                  />{' '}
                  Auto generate
                </Button>
              </div>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='geneticId'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Genetic</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                'justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                              role='combobox'
                              variant='outline'
                            >
                              {field.value
                                ? genetics.find(
                                    (genetic: Genetic) =>
                                      genetic.id === field.value
                                  )?.name
                                : 'Select genetic'}
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
                            <CommandInput placeholder='Search genetic...' />
                            <CommandEmpty>No genetic found.</CommandEmpty>
                            <CommandGroup>
                              {genetics.map((genetic: Genetic) => (
                                <CommandItem
                                  key={genetic.id}
                                  onSelect={() => {
                                    form.setValue('geneticId', genetic.id);
                                  }}
                                  value={genetic.name}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      genetic.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {genetic.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        This is the genetic the plant has.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton
                icon={<BadgePlus className='mr-2 size-4' />}
                isSubmitting={isSubmitting}
                text='Create'
              />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
