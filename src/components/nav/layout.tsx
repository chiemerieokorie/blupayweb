import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

// Compound component types
interface BreadCrumbsProps {
  children: React.ReactNode
}

interface ActionsProps {
  children: React.ReactNode
}

interface PageContentProps {
  children: React.ReactNode
}

// Compound components
const BreadCrumbs = ({ children }: BreadCrumbsProps) => {
  return <>{children}</>
}

const Actions = ({ children }: ActionsProps) => {
  return <>{children}</>
}

// PageHeader component type with compound components
interface PageHeaderComponent extends React.ForwardRefExoticComponent<
  { children?: React.ReactNode } & React.RefAttributes<HTMLElement>
> {
  BreadCrumbs: typeof BreadCrumbs
  Actions: typeof Actions
}

export const PageHeader = React.forwardRef<
  HTMLElement,
  { children?: React.ReactNode }
>(({ children }, ref) => {
  // Extract BreadCrumbs and Actions from children with proper typing
  const breadCrumbsComponent = children ? React.Children.toArray(children).find(
    (child): child is React.ReactElement<BreadCrumbsProps> =>
      React.isValidElement(child) && child.type === BreadCrumbs
  ) : undefined

  const actionsComponent = children ? React.Children.toArray(children).find(
    (child): child is React.ReactElement<ActionsProps> =>
      React.isValidElement(child) && child.type === Actions
  ) : undefined

  // Log when components are not available
  if (!breadCrumbsComponent) {
    console.info('PageHeader: No BreadCrumbs component provided')
  }
  
  if (!actionsComponent) {
    console.info('PageHeader: No Actions component provided')
  }

  return (
    <header ref={ref} className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {breadCrumbsComponent ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadCrumbsComponent.props.children}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}
      </div>
      <div className="ml-auto px-3 flex items-center gap-2">
        {actionsComponent ? actionsComponent.props.children : null}
      </div>
    </header>
  )
}) as PageHeaderComponent

PageHeader.displayName = "PageHeader"

PageHeader.BreadCrumbs = BreadCrumbs
PageHeader.Actions = Actions

// PageContent component
const PageContent = ({ children }: PageContentProps) => {
  return <>{children}</>
}

// PageContainer component
export const PageContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const childrenArray = React.Children.toArray(children)
  
  // Extract PageHeader (should be first child)
  const pageHeaderComponent = childrenArray.find(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === PageHeader
  )
  
  // Extract PageContent (should be second child)
  const pageContentComponent = childrenArray.find(
    (child): child is React.ReactElement<PageContentProps> =>
      React.isValidElement(child) && child.type === PageContent
  )
  
  return (
    <>
      {pageHeaderComponent}
      {pageContentComponent && (
        <div className={cn("flex flex-1 flex-col gap-4 px-12 py-8", className)}>
          {pageContentComponent.props.children}
        </div>
      )}
    </>
  )
}

// Export the compound components for easier importing
export { BreadCrumbs, Actions, PageContent }
