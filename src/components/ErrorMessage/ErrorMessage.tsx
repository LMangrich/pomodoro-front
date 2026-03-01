import { cn } from "@/src/lib/utils";
import { AlertCircleIcon } from "@/src/components/Icon/Icon";

interface ErrorMessageProps {
  message?: string | null;
  errors?: string[];
  className?: string;
  showIcon?: boolean;
}

export const ErrorMessage = ({
  message,
  errors,
  className,
  showIcon = true,
}: ErrorMessageProps) => {
  const errorList = errors || (message ? [message] : []);

  if (errorList.length === 0) return null;

  return (
    <div className={cn("rounded-[12px] border border-red-500/30 bg-red-500/10 p-4",
        className
      )}
    >
      {errorList.length === 1 ? (
        <div className="flex items-center gap-3">
          {showIcon && (
            <AlertCircleIcon className="h-5 w-5 flex-shrink-0 text-red-400" />
          )}
          <p className="text-14 text-red-400">{errorList[0]}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {showIcon && (
              <AlertCircleIcon className="h-5 w-5 flex-shrink-0 text-red-400" />
            )}
            <p className="text-14 font-semibold text-red-400">
              Por favor, corrija os erros marcados abaixo antes de prosseguir:
            </p>
          </div>
          <ul className="ml-8 list-disc space-y-1">
            {errorList.map((error, index) => (
              <li key={index} className="text-14 text-red-400">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
