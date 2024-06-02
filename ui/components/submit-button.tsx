import { Loader2 } from 'lucide-react';

import { Button } from './ui/button';

export default function SubmitButton({
  isSubmitting,
  text,
}: {
  isSubmitting: boolean;
  text: string;
}) {
  if (isSubmitting)
    return (
      <Button aria-disabled={true} className='w-full' disabled>
        <Loader2 className='mr-2 size-4 animate-spin' />
        Please wait
      </Button>
    );

  return (
    <Button className='w-full' type='submit'>
      {text}
    </Button>
  );
}
