import { Flex, Text, type TextProps, type FlexProps } from "@radix-ui/themes"
import { TriangleUpIcon, TriangleDownIcon } from "@radix-ui/react-icons"

type PercentageProps = TextProps & Pick<FlexProps, "justify"> & {
  value: number
}

export const Percentage = ({ value, color, justify = "end", ...props }: PercentageProps) => {
  // @TODO: account for exact 0 values
  const isPositive = value >= 0
  const Triangle = isPositive ? TriangleUpIcon : TriangleDownIcon

  return (
    <Flex align="center" justify={justify} gap="0">
      <Triangle color={color} />
      <Text as="span" className="font-mono" color={color} {...props}>
        {Math.abs(value)}%
      </Text>
    </Flex>
  )
}