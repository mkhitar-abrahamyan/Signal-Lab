'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { runScenario } from '@/lib/api';
import { Loader2 } from 'lucide-react';

type FormValues = {
  type: string;
  name?: string;
};

const SCENARIO_TYPES = [
  { value: 'success', label: 'Success' },
  { value: 'validation_error', label: 'Validation Error' },
  { value: 'system_error', label: 'System Error' },
  { value: 'slow_request', label: 'Slow Request' },
  { value: 'teapot', label: 'Teapot (Easter Egg)' },
];

export function ScenarioForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { type: 'success', name: '' },
  });

  const selectedType = watch('type');

  const mutation = useMutation({
    mutationFn: runScenario,
    onSuccess: (data) => {
      if (data.statusCode === 418) {
        toast.success("I'm a teapot!", { description: `Signal: ${data.signal}` });
      } else {
        toast.success('Scenario completed', {
          description: `Status: ${data.status}, Duration: ${data.duration}ms`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      reset({ type: selectedType, name: '' });
    },
    onError: (error: Error) => {
      toast.error('Scenario failed', { description: error.message });
      queryClient.invalidateQueries({ queryKey: ['runs'] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Scenario</CardTitle>
        <CardDescription>Select a scenario type and trigger it</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Scenario Type</Label>
            <Select
              value={selectedType}
              onValueChange={(val) => setValue('type', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select scenario type" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIO_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder="My test scenario"
              {...register('name')}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run Scenario'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
