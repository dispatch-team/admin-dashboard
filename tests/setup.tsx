import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock PointerEvent
if (!window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
    }
  }
  // @ts-expect-error - Mocking PointerEvent
  window.PointerEvent = PointerEvent;
}

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Simple Radix Mocks to avoid portal issues
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: any) => <div data-testid="dropdown-root">{children}</div>,
  Trigger: ({ children, asChild }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  Portal: ({ children }: any) => <>{children}</>,
  Content: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  Item: ({ children, onClick, className }: any) => (
    <div onClick={onClick} className={className} role="menuitem">
      {children}
    </div>
  ),
  CheckboxItem: ({ children, checked, onCheckedChange, className }: any) => (
    <div 
      onClick={() => onCheckedChange?.(!checked)} 
      className={className} 
      role="menuitemcheckbox" 
      aria-checked={checked}
    >
      {children}
    </div>
  ),
  RadioGroup: ({ children, value, onValueChange }: any) => (
    <div data-testid="dropdown-radio-group">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { checked: (child.props as any).value === value, onValueChange });
        }
        return child;
      })}
    </div>
  ),
  RadioItem: ({ children, value, checked, onValueChange, className }: any) => (
    <div 
      onClick={() => onValueChange?.(value)} 
      className={className} 
      role="menuitemradio" 
      aria-checked={checked}
    >
      {children}
    </div>
  ),
  ItemIndicator: ({ children }: any) => <div data-testid="item-indicator">{children}</div>,
  Label: ({ children, className }: any) => <div className={className}>{children}</div>,
  Group: ({ children }: any) => <div>{children}</div>,
  Separator: ({ className }: any) => <div className={className} />,
  Sub: ({ children }: any) => <div>{children}</div>,
  SubTrigger: ({ children }: any) => <div>{children}</div>,
  SubContent: ({ children }: any) => <div>{children}</div>,
}));

const SelectContext = createContext<any>(null);

vi.mock('@radix-ui/react-select', () => ({
  Root: ({ children, onValueChange, value, defaultValue }: any) => {
    const [val, setVal] = useState(value || defaultValue);
    useEffect(() => {
      if (value !== undefined) setVal(value);
    }, [value]);

    const handleValueChange = (newValue: string) => {
      setVal(newValue);
      onValueChange?.(newValue);
    };

    return (
      <SelectContext.Provider value={{ value: val, onValueChange: handleValueChange }}>
        <div data-testid="select-root">{children}</div>
      </SelectContext.Provider>
    );
  },
  Trigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  Value: ({ placeholder }: any) => {
    const { value } = useContext(SelectContext);
    return <span>{value || placeholder}</span>;
  },
  Portal: ({ children }: any) => <>{children}</>,
  Content: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  Viewport: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, value }: any) => {
    const { onValueChange } = useContext(SelectContext);
    return (
      <div
        role="option"
        onClick={() => onValueChange(value)}
      >
        {children}
      </div>
    );
  },
  ItemText: ({ children }: any) => <span>{children}</span>,
  ItemIndicator: ({ children }: any) => <div>{children}</div>,
  Label: ({ children }: any) => <div>{children}</div>,
  Group: ({ children }: any) => <div>{children}</div>,
  Separator: () => <hr />,
  Icon: ({ children }: any) => <div>{children}</div>,
  ScrollUpButton: () => null,
  ScrollDownButton: () => null,
}));

// Mock lucide-react
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
  };
});

const TabsContext = createContext<any>(null);

vi.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, onValueChange, value, defaultValue }: any) => {
    const [val, setVal] = useState(value || defaultValue);
    useEffect(() => {
      if (value !== undefined) setVal(value);
    }, [value]);

    const handleValueChange = (newValue: string) => {
      setVal(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: val, onValueChange: handleValueChange }}>
        <div data-testid="tabs-root">{children}</div>
      </TabsContext.Provider>
    );
  },
  List: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  Trigger: ({ children, value }: any) => {
    const { onValueChange, value: activeValue } = useContext(TabsContext);
    return (
      <button
        data-testid={`tabs-trigger-${value}`}
        data-state={activeValue === value ? 'active' : 'inactive'}
        onClick={() => onValueChange(value)}
      >
        {children}
      </button>
    );
  },
  Content: ({ children, value }: any) => {
    const { value: activeValue } = useContext(TabsContext);
    if (activeValue !== value) return null;
    return <div data-testid={`tabs-content-${value}`}>{children}</div>;
  },
}));

const DialogContext = createContext<any>(null);

vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open, onOpenChange, defaultOpen }: any) => {
    const [isOpen, setIsOpen] = useState(open || defaultOpen || false);
    useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);

    const handleOpenChange = (val: boolean) => {
      setIsOpen(val);
      onOpenChange?.(val);
    };

    return (
      <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
        <div data-testid="dialog-root">{children}</div>
      </DialogContext.Provider>
    );
  },
  Trigger: ({ children }: any) => {
    const { setIsOpen } = useContext(DialogContext);
    return (
      <div data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
        {children}
      </div>
    );
  },
  Portal: ({ children }: any) => <>{children}</>,
  Overlay: () => {
    const { isOpen } = useContext(DialogContext);
    if (!isOpen) return null;
    return <div data-testid="dialog-overlay" />;
  },
  Content: ({ children }: any) => {
    const { isOpen, setIsOpen } = useContext(DialogContext);
    if (!isOpen) return null;
    return (
      <div data-testid="dialog-content">
        {children}
        <button data-testid="dialog-close" onClick={() => setIsOpen(false)}>Close</button>
      </div>
    );
  },
  Header: ({ children }: any) => <div>{children}</div>,
  Footer: ({ children }: any) => <div>{children}</div>,
  Title: ({ children }: any) => <h2>{children}</h2>,
  Description: ({ children }: any) => <p>{children}</p>,
  Close: ({ children }: any) => {
    const { setIsOpen } = useContext(DialogContext);
    return (
      <div onClick={() => setIsOpen(false)}>{children}</div>
    );
  },
}));

const AccordionContext = createContext<any>(null);

vi.mock('@radix-ui/react-accordion', () => ({
  Root: ({ children, value, onValueChange, type, defaultValue }: any) => {
    const [val, setVal] = useState(value || defaultValue || (type === 'single' ? '' : []));
    useEffect(() => {
      if (value !== undefined) setVal(value);
    }, [value]);

    const handleValueChange = (newValue: any) => {
      let nextValue = newValue;
      if (type === 'multiple') {
         const current = Array.isArray(val) ? val : [];
         nextValue = current.includes(newValue) 
           ? current.filter(v => v !== newValue)
           : [...current, newValue];
      } else {
         nextValue = val === newValue ? '' : newValue;
      }
      setVal(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <AccordionContext.Provider value={{ value: val, onValueChange: handleValueChange, type }}>
        <div data-testid="accordion-root">{children}</div>
      </AccordionContext.Provider>
    );
  },
  Item: ({ children, value }: any) => {
    const { value: activeValue, type } = useContext(AccordionContext);
    const isOpen = type === 'multiple' 
      ? Array.isArray(activeValue) && activeValue.includes(value)
      : activeValue === value;
    
    return (
      <div data-testid={`accordion-item-${value}`} data-state={isOpen ? 'open' : 'closed'}>
        {React.Children.map(children, child => {
           if (React.isValidElement(child)) {
             return React.cloneElement(child as any, { value, isOpen });
           }
           return child;
        })}
      </div>
    );
  },
  Header: ({ children }: any) => <div>{children}</div>,
  Trigger: ({ children, value }: any) => {
    const { onValueChange } = useContext(AccordionContext);
    return (
      <button data-testid={`accordion-trigger-${value}`} onClick={() => onValueChange(value)}>
        {children}
      </button>
    );
  },
  Content: ({ children, value, isOpen }: any) => {
    if (!isOpen) return null;
    return <div data-testid={`accordion-content-${value}`}>{children}</div>;
  },
}));

vi.mock('@radix-ui/react-checkbox', () => ({
  Root: ({ children, checked, onCheckedChange, defaultChecked, id, disabled }: any) => {
    const [isChecked, setIsChecked] = useState(checked || defaultChecked || false);
    useEffect(() => {
      if (checked !== undefined) setIsChecked(checked);
    }, [checked]);

    const handleClick = () => {
      if (disabled) return;
      const next = !isChecked;
      setIsChecked(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        role="checkbox"
        aria-checked={isChecked}
        data-state={isChecked ? 'checked' : 'unchecked'}
        onClick={handleClick}
        id={id}
        disabled={disabled}
      >
        {React.Children.map(children, child => {
           if (React.isValidElement(child)) {
             return React.cloneElement(child as any, { checked: isChecked });
           }
           return child;
        })}
      </button>
    );
  },
  Indicator: ({ children, checked }: any) => {
    if (!checked) return null;
    return <div data-testid="checkbox-indicator">{children}</div>;
  },
}));

vi.mock('@radix-ui/react-switch', () => ({
  Root: ({ children, checked, onCheckedChange, defaultChecked, id, disabled }: any) => {
    const [isChecked, setIsChecked] = useState(checked || defaultChecked || false);
    useEffect(() => {
      if (checked !== undefined) setIsChecked(checked);
    }, [checked]);

    const handleClick = () => {
      if (disabled) return;
      const next = !isChecked;
      setIsChecked(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        role="switch"
        aria-checked={isChecked}
        data-state={isChecked ? 'checked' : 'unchecked'}
        onClick={handleClick}
        id={id}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },
  Thumb: () => <span data-testid="switch-thumb" />,
}));

const AlertDialogContext = createContext<any>(null);

vi.mock('@radix-ui/react-alert-dialog', () => ({
  Root: ({ children, open, onOpenChange, defaultOpen }: any) => {
    const [isOpen, setIsOpen] = useState(open || defaultOpen || false);
    useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);

    const handleOpenChange = (val: boolean) => {
      setIsOpen(val);
      onOpenChange?.(val);
    };

    return (
      <AlertDialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
        <div data-testid="alert-dialog-root">{children}</div>
      </AlertDialogContext.Provider>
    );
  },
  Trigger: ({ children }: any) => {
    const { setIsOpen } = useContext(AlertDialogContext);
    return (
      <div data-testid="alert-dialog-trigger" onClick={() => setIsOpen(true)}>
        {children}
      </div>
    );
  },
  Portal: ({ children }: any) => <>{children}</>,
  Overlay: () => {
    const { isOpen } = useContext(AlertDialogContext);
    if (!isOpen) return null;
    return <div data-testid="alert-dialog-overlay" />;
  },
  Content: ({ children }: any) => {
    const { isOpen } = useContext(AlertDialogContext);
    if (!isOpen) return null;
    return (
      <div data-testid="alert-dialog-content">
        {children}
      </div>
    );
  },
  Header: ({ children }: any) => <div>{children}</div>,
  Footer: ({ children }: any) => <div>{children}</div>,
  Title: ({ children }: any) => <h2>{children}</h2>,
  Description: ({ children }: any) => <p>{children}</p>,
  Action: ({ children, onClick }: any) => {
    const { setIsOpen } = useContext(AlertDialogContext);
    return (
      <button 
        data-testid="alert-dialog-action" 
        onClick={(e) => {
          onClick?.(e);
          setIsOpen(false);
        }}
      >
        {children}
      </button>
    );
  },
  Cancel: ({ children, onClick }: any) => {
    const { setIsOpen } = useContext(AlertDialogContext);
    return (
      <button 
        data-testid="alert-dialog-cancel" 
        onClick={(e) => {
          onClick?.(e);
          setIsOpen(false);
        }}
      >
        {children}
      </button>
    );
  },
}));

vi.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children }: any) => <div data-testid="avatar-root">{children}</div>,
  Image: ({ src, alt }: any) => <img data-testid="avatar-image" src={src} alt={alt} />,
  Fallback: ({ children }: any) => <div data-testid="avatar-fallback">{children}</div>,
}));

const CollapsibleContext = createContext<any>(null);

vi.mock('@radix-ui/react-collapsible', () => ({
  Root: ({ children, open, onOpenChange, defaultOpen }: any) => {
    const [isOpen, setIsOpen] = useState(open || defaultOpen || false);
    useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);

    const handleOpenChange = (val: boolean) => {
      setIsOpen(val);
      onOpenChange?.(val);
    };

    return (
      <CollapsibleContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
        <div data-testid="collapsible-root">{children}</div>
      </CollapsibleContext.Provider>
    );
  },
  Trigger: ({ children }: any) => {
    const { isOpen, setIsOpen } = useContext(CollapsibleContext);
    return (
      <div data-testid="collapsible-trigger" onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
    );
  },
  Content: ({ children }: any) => {
    const { isOpen } = useContext(CollapsibleContext);
    if (!isOpen) return null;
    return <div data-testid="collapsible-content">{children}</div>;
  },
  // Ensure named exports are present if used directly from Primitive
  CollapsibleTrigger: ({ children }: any) => {
    const { isOpen, setIsOpen } = useContext(CollapsibleContext);
    return (
      <div data-testid="collapsible-trigger" onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
    );
  },
  CollapsibleContent: ({ children }: any) => {
    const { isOpen } = useContext(CollapsibleContext);
    if (!isOpen) return null;
    return <div data-testid="collapsible-content">{children}</div>;
  },
}));

const PopoverContext = createContext<any>(null);

vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children, open, onOpenChange, defaultOpen }: any) => {
    const [isOpen, setIsOpen] = useState(open || defaultOpen || false);
    useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);

    const handleOpenChange = (val: boolean) => {
      setIsOpen(val);
      onOpenChange?.(val);
    };

    return (
      <PopoverContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
        <div data-testid="popover-root">{children}</div>
      </PopoverContext.Provider>
    );
  },
  Trigger: ({ children }: any) => {
    const { setIsOpen } = useContext(PopoverContext);
    return (
      <div data-testid="popover-trigger" onClick={() => setIsOpen(true)}>
        {children}
      </div>
    );
  },
  Portal: ({ children }: any) => <>{children}</>,
  Content: ({ children }: any) => {
    const { isOpen } = useContext(PopoverContext);
    if (!isOpen) return null;
    return (
      <div data-testid="popover-content">
        {children}
      </div>
    );
  },
  Anchor: ({ children }: any) => <div>{children}</div>,
  Close: ({ children }: any) => {
    const { setIsOpen } = useContext(PopoverContext);
    return (
      <div onClick={() => setIsOpen(false)}>{children}</div>
    );
  },
}));

vi.mock('@radix-ui/react-separator', () => ({
  Root: ({ orientation, className }: any) => (
    <div 
      data-testid="separator" 
      data-orientation={orientation} 
      className={className} 
    />
  ),
}));

vi.mock('@radix-ui/react-toggle', () => ({
  Root: ({ children, pressed, onPressedChange, defaultPressed }: any) => {
    const [isPressed, setIsPressed] = useState(pressed || defaultPressed || false);
    useEffect(() => {
      if (pressed !== undefined) setIsPressed(pressed);
    }, [pressed]);

    const handleClick = () => {
      const next = !isPressed;
      setIsPressed(next);
      onPressedChange?.(next);
    };

    return (
      <button
        role="button"
        aria-pressed={isPressed}
        data-state={isPressed ? 'on' : 'off'}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  },
}));

vi.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: any) => <>{children}</>,
  Root: ({ children, open, onOpenChange, defaultOpen }: any) => {
    const [isOpen, setIsOpen] = useState(open || defaultOpen || false);
    useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);

    return (
      <div data-testid="tooltip-root">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as any, { open: isOpen, onOpenChange: setIsOpen });
          }
          return child;
        })}
      </div>
    );
  },
  Trigger: ({ children, onOpenChange }: any) => (
    <div 
      data-testid="tooltip-trigger" 
      onMouseEnter={() => onOpenChange?.(true)}
      onMouseLeave={() => onOpenChange?.(false)}
    >
      {children}
    </div>
  ),
  Portal: ({ children }: any) => <>{children}</>,
  Content: ({ children, open }: any) => {
    if (!open) return null;
    return <div data-testid="tooltip-content">{children}</div>;
  },
}));

vi.mock('@radix-ui/react-aspect-ratio', () => ({
  Root: ({ children, ratio }: any) => (
    <div data-testid="aspect-ratio" data-ratio={ratio}>
      {children}
    </div>
  ),
}));
