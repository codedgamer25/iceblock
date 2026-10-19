'use client';

import { motion, AnimatePresence } from 'motion/react';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cx } from '@/lib/cx';

/* ---------------------------------------------------------------------------
   Drawer Context
   --------------------------------------------------------------------------- */

interface DrawerContextValue {
  open: boolean;
  close: () => void;
  titleId: string;
  descriptionId: string;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer compound components must be used within a <Drawer />');
  }
  return context;
}

/* ---------------------------------------------------------------------------
   Spring & Slide Configuration
   --------------------------------------------------------------------------- */

const springTransition = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 300,
  mass: 0.8,
};

const slideVariants = {
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
};

const sideClasses = {
  right: 'inset-y-0 right-0 h-full w-full max-w-md border-l',
  left: 'inset-y-0 left-0 h-full w-full max-w-md border-r',
  top: 'inset-x-0 top-0 w-full max-h-[85vh] border-b rounded-b-2xl',
  bottom: 'inset-x-0 bottom-0 w-full max-h-[85vh] border-t rounded-t-2xl',
};

/* ---------------------------------------------------------------------------
   Drawer Root Component
   --------------------------------------------------------------------------- */

export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  side?: 'right' | 'left' | 'top' | 'bottom';
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  portal?: boolean;
  closeOnOutsideClick?: boolean;
}

export function Drawer({
  open,
  onClose,
  onOpenChange,
  side = 'right',
  children,
  className,
  overlayClassName,
  portal = true,
  closeOnOutsideClick = true,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  /* Keyboard listener for Escape key */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, handleClose]);

  /* Body scroll lock and Lenis integration */
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop?.();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.__lenis?.start?.();
    };
  }, [open]);

  /* Focus management */
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;

      const timer = window.setTimeout(() => {
        const focusable = panelRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) {
          focusable.focus();
        } else {
          panelRef.current?.focus();
        }
      }, 50);

      return () => window.clearTimeout(timer);
    } else {
      previousActiveElement.current?.focus?.();
    }
  }, [open]);

  const content = (
    <DrawerContext.Provider value={{ open, close: handleClose, titleId, descriptionId }}>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 pointer-events-auto">
            {/* Backdrop Scrim */}
            <motion.div
              key="drawer-scrim"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={closeOnOutsideClick ? handleClose : undefined}
              className={cx(
                'fixed inset-0 bg-deep/40 dark:bg-black/60 backdrop-blur-sm',
                overlayClassName
              )}
            />

            {/* Slide-in Panel */}
            <motion.div
              ref={panelRef}
              key="drawer-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              tabIndex={-1}
              data-lenis-prevent
              variants={slideVariants[side]}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springTransition}
              className={cx(
                'fixed z-50 flex flex-col outline-none',
                'bg-[rgb(255_255_255_/_0.85)] dark:bg-[rgb(7_24_34_/_0.92)]',
                'border-[var(--rule)]',
                'backdrop-blur-xl',
                'shadow-2xl',
                'text-deep dark:text-frost',
                sideClasses[side],
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DrawerContext.Provider>
  );

  if (!mounted) return null;
  if (portal && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}

/* ---------------------------------------------------------------------------
   Drawer Header
   --------------------------------------------------------------------------- */

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'flex flex-col space-y-1.5 p-6 border-b border-[var(--rule)] shrink-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DrawerHeader.displayName = 'DrawerHeader';

/* ---------------------------------------------------------------------------
   Drawer Title
   --------------------------------------------------------------------------- */

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, children, id, ...props }, ref) => {
    const { titleId } = useDrawer();
    return (
      <h2
        ref={ref}
        id={id || titleId}
        className={cx(
          'font-display text-xl font-semibold leading-tight tracking-tight text-deep dark:text-frost',
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
DrawerTitle.displayName = 'DrawerTitle';

/* ---------------------------------------------------------------------------
   Drawer Description
   --------------------------------------------------------------------------- */

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  ({ className, children, id, ...props }, ref) => {
    const { descriptionId } = useDrawer();
    return (
      <p
        ref={ref}
        id={id || descriptionId}
        className={cx('text-sm text-steel dark:text-haze', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
DrawerDescription.displayName = 'DrawerDescription';

/* ---------------------------------------------------------------------------
   Drawer Content (Scrollable Body)
   --------------------------------------------------------------------------- */

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-lenis-prevent
        className={cx('flex-1 overflow-y-auto px-6 py-4 focus:outline-none', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DrawerContent.displayName = 'DrawerContent';

/* ---------------------------------------------------------------------------
   Drawer Footer
   --------------------------------------------------------------------------- */

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 border-t border-[var(--rule)] shrink-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DrawerFooter.displayName = 'DrawerFooter';

/* ---------------------------------------------------------------------------
   Drawer Close Button
   --------------------------------------------------------------------------- */

export interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { close } = useDrawer();

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) close();
        }}
        className={cx(
          'inline-flex items-center justify-center rounded-full p-2 text-steel hover:text-deep hover:bg-black/5 dark:text-haze dark:hover:text-frost dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          className
        )}
        aria-label="Close"
        {...props}
      >
        {children ?? (
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        )}
      </button>
    );
  }
);
DrawerClose.displayName = 'DrawerClose';
