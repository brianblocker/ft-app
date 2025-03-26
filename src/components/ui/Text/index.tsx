// if we have more than just this one HOC, we'll have this index file
// be the exporter and move the code currently here to a separate file

import type { TextProps } from "@radix-ui/themes"
import type { ComponentType } from "react"

/**
 * A higher-order component that allows for props to be modified before
 * being passed to a component. This could be used other places, not just
 * for text components, but for now this is the only use case.
 * @param WrappedComponent - The component to wrap.
 * @param propsMapper - A function that maps the props to their final value.
 * @returns A new component with the dynamic props.
 */
export function withDynamicProps<P extends TextProps>(
  WrappedComponent: ComponentType<P>,
  propsMapper: (props: P) => P
) {
  function DynamicProps(props: P) {
    const dynamicProps = propsMapper(props)

    // intentionally putting props after dynamic props to allow for
    // overriding any dynamic props that may have been set
    return <WrappedComponent {...dynamicProps} {...props} />
  }

  DynamicProps.displayName = `withDynamicProps(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return DynamicProps
}
