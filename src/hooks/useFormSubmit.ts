import { useCallback } from "react";
import { toast } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FormSubmitStatus = "success" | "error" | "captcha_error";

export interface FormSubmitResult {
  status: FormSubmitStatus;
  message?: string;
}

/**
 * Options for useFormSubmit.
 *
 * @param onSuccess   Called when the API returns a success response.
 * @param onError     Optional — called after an error toast fires. Use for extra local state (e.g. reset captcha).
 * @param successMsg  Toast message shown on success. Defaults to "Submitted successfully!"
 * @param errorMsg    Fallback toast message on unhandled errors. Defaults to server message or generic string.
 */
export interface UseFormSubmitOptions<TValues> {
  onSuccess?: (values: TValues) => void | Promise<void>;
  onError?: (error: unknown, message: string) => void;
  successMsg?: string;
  errorMsg?: string;
}

// ─── Core submit runner ───────────────────────────────────────────────────────

/**
 * Wraps an async form API call with:
 *  - Centralised success/error toast
 *  - Consistent error shape for downstream handlers
 *
 * @param apiFn      A function that performs the API call and returns the response.
 * @param options    Handlers and custom messages.
 */
export function useFormSubmit<TValues>(
  apiFn: (values: TValues) => Promise<{ code: string; message?: string }>,
  options: UseFormSubmitOptions<TValues> = {}
) {
  const {
    onSuccess,
    onError,
    successMsg = "Submitted successfully!",
    errorMsg,
  } = options;

  const handleSubmit = useCallback(
    async (
      values: TValues,
      formikHelpers: { setSubmitting: (b: boolean) => void; resetForm?: () => void }
    ): Promise<FormSubmitResult> => {
      const { setSubmitting, resetForm } = formikHelpers;
      let shouldReset = false;

      try {
        const response = await apiFn(values);

        if (response.code === "SUC200") {
          toast.success(successMsg);
          shouldReset = true;
          await onSuccess?.(values);
          return { status: "success" };
        }

        // Server returned an error code
        const serverMsg =
          response.message ||
          errorMsg ||
          "An unexpected error occurred. Please try again.";
        toast.error(serverMsg);
        onError?.(null, serverMsg);
        return { status: "error", message: serverMsg };
      } catch (err: unknown) {
        const fallback =
          errorMsg || "An unexpected error occurred. Please try again.";
        toast.error(fallback);
        console.error("[FormSubmit Error]", err);
        onError?.(err, fallback);
        return { status: "error", message: fallback };
      } finally {
        setSubmitting(false);
        if (shouldReset) {
          resetForm?.();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiFn, successMsg, errorMsg]
  );

  return { handleSubmit };
}

// ─── Captcha helper ───────────────────────────────────────────────────────────

/**
 * Validates a captcha and fires a toast if it fails.
 * Returns true if valid, false otherwise.
 */
export function validateAndNotifyCaptcha(
  userInput: string,
  actual: string
): boolean {
  const isValid = userInput.trim().toLowerCase() === actual.trim().toLowerCase();
  if (!isValid) {
    toast.error("Captcha does not match. Please try again.");
  }
  return isValid;
}
