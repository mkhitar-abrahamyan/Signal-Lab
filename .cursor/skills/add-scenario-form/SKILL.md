---
name: add-scenario-form
description: Add a React Hook Form + TanStack Query form with shadcn/ui components
---

# Add Scenario Form Skill

## When to Use
- Adding any user input form to the frontend
- Creating mutation-based interactions

## Template

```typescript
'use client';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type FormValues = {
  fieldName: string;
};

export function MyForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast.success('Action completed');
      queryClient.invalidateQueries({ queryKey: ['relevant-key'] });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <Input {...register('fieldName', { required: 'Required' })} />
      {errors.fieldName && <p>{errors.fieldName.message}</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Loading...' : 'Submit'}
      </Button>
    </form>
  );
}
```

## Checklist
- [ ] `useForm` with typed FormValues
- [ ] `useMutation` with `onSuccess` and `onError`
- [ ] `queryClient.invalidateQueries` on success
- [ ] Toast shown for both success and error
- [ ] Button disabled during pending state
- [ ] Form errors shown inline
