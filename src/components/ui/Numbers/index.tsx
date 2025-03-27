import { Percentage } from "./Percentage"
export { Monetary } from "./Monetary"

import { withDynamicProps } from "@/components/ui/Text"

// an arbitrary threshold for the weight modifier
const THRESHOLD = 4

// @TODO: account for exact 0 values
export const FormattedPercentage = withDynamicProps(Percentage, (props) => ({
  ...props,
  color: props.value >= 0 ? "teal" : "crimson",
  weight: Math.abs(props.value) > THRESHOLD ? "bold" : "regular",
}))

export {
  Percentage,
}