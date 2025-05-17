import { useMutation, useQuery } from "@tanstack/react-query";
import { useMessageModal } from "./useMessage";
import { AxiosError } from "axios";
import { Any } from "../types/global.type";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";

const API_BAD_REQUEST = 401;
const SUBSCRIPTION_EXPIRED = 560;

export function useGetQuery({
  onError,
  onSuccess,
  enabled,
  queryFn,
  queryKey = [],
}: Any) {
  const { showMessage } = useMessageModal();
  const auth = useAuth();
  const { isLoading, error, data, isFetching } = useQuery<Any, Any>({
    queryKey,
    queryFn,
    enabled: enabled,
    onSuccess,
    retry: false,
    onError: (error: Any) => {
      onError && onError(error);
      if (error?.response?.data.code === 401) {
        //auth?.deleteToken();
      }
      showMessage({
        heading: "Error",
        body: <p>{error?.response?.data?.message}</p>,
        type: "error",
      });
    },
  });
  return { isLoading, error, data, isFetching };
}

export function useCustomMutation({ mutationFn, onSuccess, onError }: Any) {
  const { showMessage } = useMessageModal();
  const auth = useAuth();
  return useMutation<Any, Any, Any>({
    mutationFn,
    onSuccess,
    onError: (error: AxiosError<{ message: string; status: number, code: number }>) => {
      
      if (error?.response?.data.code === API_BAD_REQUEST) {
        auth?.deleteToken();
      }
      showMessage({
        heading: "Error",
        body: <p>{error?.response?.data?.message}</p>,
        type: "error",
        callback: () => {
          onError && onError(error);
        }
      });
    },
  });
}
