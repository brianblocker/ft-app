import { NumericFormat } from "react-number-format"
import { Code } from "@radix-ui/themes"
// just adding this to demonstrate how we might make it configurable
// Currency probably wouldn't be defined here because it would need
// to also be passed in the API call probably

type Currency = "usd"// | "eur" | "gbp" | "cad" | "aud"

const currencyMap = new Map<Currency, string>([
  ["usd", "$"],
  // ["eur", "€"],
  // ["gbp", "£"],
  // ["cad", "$"],
  // ["aud", "$"],
])

// for now, default to USD, but could make it configurable
export const Monetary = ({ value, currency = "usd" }: { value: number, currency?: Currency }) => {
  return (
    <span className="text-gray-100 font-mono">
      <NumericFormat
        value={value}
        thousandSeparator
        displayType="text"
          prefix={currencyMap.get(currency)}
        />
    </span>
  )
}
