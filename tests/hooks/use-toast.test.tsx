import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useToast hook', () => {
  it('adds and removes a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
      });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test Title');

    act(() => {
      result.current.dismiss(result.current.toasts[0].id);
    });

    // Dismiss sets open to false, it doesn't remove it immediately because of TOAST_REMOVE_DELAY
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('updates a toast', () => {
    const { result } = renderHook(() => useToast());
    let toastObj: any;

    act(() => {
      toastObj = result.current.toast({
        title: 'Original Title',
      });
    });

    act(() => {
      toastObj.update({
        id: toastObj.id,
        title: 'Updated Title',
      });
    });

    expect(result.current.toasts[0].title).toBe('Updated Title');
  });

  it('respects TOAST_LIMIT', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
    });

    // TOAST_LIMIT is 1 in the hook
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Toast 2');
  });
});
