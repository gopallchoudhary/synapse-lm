import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";



export const useCreateTest = () => {
    const trpc = useTRPC();
    const {
        mutate: createTest,
        mutateAsync: createtestAsync,
        error,
        isError,
        status,
        isSuccess,
    } = useMutation(trpc.test.createTest.mutationOptions());

    return { createTest, createtestAsync, error, isError, status, isSuccess }

};
