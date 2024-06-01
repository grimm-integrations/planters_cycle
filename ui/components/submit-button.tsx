import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export default function SubmitButton({
  text,
  isSubmitting,
}: {
  text: string;
  isSubmitting: boolean;
}) {
  if (isSubmitting)
    return (
      <Button className='w-full' aria-disabled={true} disabled>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        Please wait
      </Button>
    );

  return (
    <Button type='submit' className='w-full'>
      {text}
    </Button>
  );
}
