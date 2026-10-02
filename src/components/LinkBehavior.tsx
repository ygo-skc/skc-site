import { AnchorHTMLAttributes, forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'

/*
 * Root element for every MUI Link (wired up in MuiTheme). Call sites keep using `href`, which
 * MUI already types, and this decides how to honor it:
 *
 *   href='/about'                -> react-router Link, client-side navigation
 *   href='https://…' / 'mailto:' -> plain anchor, browser handles it
 *   no href                      -> plain anchor, not a destination (e.g. current breadcrumb)
 *
 * Keeping `href` as the prop is what makes this typecheck. MUI's `component` polymorphism is
 * resolved per call site at the type level, so a theme-level default is invisible to TypeScript:
 * swapping in react-router's Link directly would make every `to` a type error even though it
 * works at runtime. Translating href -> to here keeps one prop that both layers already accept.
 */

// scheme-qualified (https:, mailto:, tel:) or protocol-relative (//host) targets are off-origin
const isExternalHref = (href: string): boolean => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href)

const LinkBehavior = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(({ href, ...otherProps }, ref) => {
	if (href === undefined || isExternalHref(href)) {
		return <a ref={ref} href={href} {...otherProps} />
	}

	return <RouterLink ref={ref} to={href} {...otherProps} />
})

LinkBehavior.displayName = 'LinkBehavior'

export { isExternalHref }
export default LinkBehavior
