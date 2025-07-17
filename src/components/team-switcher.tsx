"use client"
import * as React from "react"
import { SidebarMenu, SidebarMenuItem, sidebarMenuButtonVariants } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string
    logo: React.ElementType
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className={cn(sidebarMenuButtonVariants(), "w-fit px-1.5")}>
          <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <team.logo className="size-3" />
          </div>
          <span className="truncate font-medium">{team.name}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
