import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const SheetContext = React.createContext(null);

function useSheet() {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("Sheet components must be used inside <Sheet>");
  return ctx;
}

export function Sheet({ open: controlledOpen, onOpenChange, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ asChild, children, ...props }) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e);
        setOpen(true);
      },
    });
  }

  return (
    <button {...props} onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

export function SheetPortal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export function SheetOverlay({ className = "", ...props }) {
  const { open, setOpen } = useSheet();
  if (!open) return null;

  return (
    <div
      {...props}
      className={`fixed inset-0 z-50 bg-black/60 ${className}`}
      onClick={() => setOpen(false)}
    />
  );
}

export function SheetContent({
  side = "right",
  className = "",
  children,
  ...props
}) {
  const { open, setOpen } = useSheet();
  if (!open) return null;

  const sideClass =
    side === "left"
      ? "left-0 top-0 h-full"
      : side === "top"
      ? "top-0 left-0 w-full"
      : side === "bottom"
      ? "bottom-0 left-0 w-full"
      : "right-0 top-0 h-full";

  const sizeClass =
    side === "left" || side === "right"
      ? "w-80 max-w-[90vw]"
      : "h-80 max-h-[90vh]";

  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        {...props}
        className={`fixed z-50 bg-background border-border border shadow-2xl ${sideClass} ${sizeClass} ${className}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </SheetPortal>
  );
}

export function SheetClose({ asChild, children, ...props }) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e);
        setOpen(false);
      },
    });
  }

  return (
    <button {...props} onClick={() => setOpen(false)}>
      {children}
    </button>
  );
}

export function SheetHeader({ className = "", ...props }) {
  return <div className={`p-4 pb-2 ${className}`} {...props} />;
}

export function SheetFooter({ className = "", ...props }) {
  return <div className={`p-4 pt-2 ${className}`} {...props} />;
}

export function SheetTitle({ className = "", ...props }) {
  return <h2 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function SheetDescription({ className = "", ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props} />
  );
}
