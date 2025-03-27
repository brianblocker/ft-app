import { NumericFormat } from "react-number-format"
import { Text, type TextProps } from "@radix-ui/themes"
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
export const Monetary = ({ value, currency = "usd", size = "2" }: { value: number, currency?: Currency, size?: TextProps["size"] }) => {
  return (
    <Text as="span" className="text-gray-100 font-mono" size={size}>
      <NumericFormat
        value={value}
        thousandSeparator
        displayType="text"
        prefix={currencyMap.get(currency)}
      />
    </Text>
  )
}
