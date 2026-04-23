import { render, screen, fireEvent } from '@test/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Tabs', () => {
  it('renders correctly and switches tabs', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="account" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account settings here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Account settings here.')).toBeInTheDocument();
    expect(screen.queryByText('Change your password here.')).not.toBeInTheDocument();

    const passwordTrigger = screen.getByText('Password');
    fireEvent.click(passwordTrigger);

    expect(onValueChange).toHaveBeenCalledWith('password');
    expect(screen.getByText('Change your password here.')).toBeInTheDocument();
    expect(screen.queryByText('Account settings here.')).not.toBeInTheDocument();
  });
});
