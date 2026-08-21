import { cn } from "@/lib/utils";

export default function Price({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) {
  return (
    <p suppressHydrationWarning={true} className={className}>
      {`${new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      }).format(parseFloat(amount))}`}
      <span
        className={cn("ml-1 inline", currencyCodeClassName)}
      >{`${currencyCode}`}</span>
    </p>
  );
}
