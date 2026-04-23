import { render, screen, fireEvent } from "@test/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("DropdownMenu", () => {
  it("renders all parts correctly", () => {
    const onCheckedChange = vi.fn();
    const onRadioChange = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Profile<DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem
            checked={true}
            onCheckedChange={onCheckedChange}
          >
            Show Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="dark" onValueChange={onRadioChange}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.queryByText("My Account")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("My Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("⌘P")).toBeInTheDocument();

    const checkbox = screen.getByRole("menuitemcheckbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(false);

    const radioLight = screen
      .getByText("Light")
      .closest('[role="menuitemradio"]');
    fireEvent.click(radioLight!);
    expect(onRadioChange).toHaveBeenCalledWith("light");
  });
});
