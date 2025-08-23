"use client"

import { ActionState, FieldErrors } from "@/lib/create-safe-action";
import { useActionState, useCallback, useState } from 'react';

type Action<TInput, TOutput> = (data: TInput) => 
    Promise<ActionState<TInput, TOutput>>

interface UseActionOptions<TOutput> {
    onSuccess?: (data: TOutput) => void;
    onError?: (error: string) => void;
    onComplete?: () => void
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined); // ✅ new
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);
      setError(undefined);
      setMessage(undefined); // reset old message

      try {
        const result = await action(input);

        if (!result) return;

          setFieldErrors(result.fieldErrors);

        if (result.errors) {
          setError(result.errors);
          options.onError?.(result.errors);
        }

        if (result.data) {
          setData(result.data);
          setMessage("Board created successfully!");
          options.onSuccess?.(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    [action, options]
  );

  return {
    execute,
    fieldErrors,
    error,
    message,  // ✅ return message
    data,
    isLoading,
  };
};
