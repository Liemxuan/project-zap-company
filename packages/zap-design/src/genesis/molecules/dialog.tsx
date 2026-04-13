'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-100 bg-black/[0.32] dark:bg-black/[0.52] backdrop-blur-[8px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

import { Button } from '../../genesis/atoms/interactive/button';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showClose?: boolean;
    closeButtonPosition?: 'right' | 'left' | 'header-right' | 'header-left';
    closeButton?: React.ReactNode;
    closeButtonClassName?: string;
    closeButtonShape?: 'default' | 'circle';
  }
>(({ className, children, showClose = true, closeButtonPosition = 'right', closeButton, closeButtonClassName, closeButtonShape = 'circle', ...props }, ref) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type as any).displayName === 'DialogHeader') {
      return React.cloneElement(child as any, {
        closeButtonPosition: closeButtonPosition.startsWith('header-') ? closeButtonPosition : (child.props as any).closeButtonPosition,
        closeButton: closeButton || (child.props as any).closeButton,
        closeButtonClassName: closeButtonClassName || (child.props as any).closeButtonClassName,
        closeButtonShape: closeButtonShape || (child.props as any).closeButtonShape,
      });
    }
    return child;
  });

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "fixed left-[50%] top-[50%] z-100 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-[length:var(--dialog-gap,1.5rem)] bg-[color:var(--dialog-bg,var(--color-surface-container-high))] border-[length:var(--dialog-border-width,var(--layer-4-border-width,0px))] border-outline-variant border-solid rounded-[length:var(--dialog-border-radius,var(--layer-4-border-radius,1.5rem))] p-[length:var(--dialog-padding,2rem)] shadow-[var(--md-sys-elevation-level3)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
        {...props}
      >
        {childrenWithProps}
        {showClose && (closeButtonPosition === 'right' || closeButtonPosition === 'left') && (
          closeButton ? (
            <div className={cn(
              "absolute h-8 w-8",
              closeButtonPosition === 'right' ? "right-6 top-6" : "left-6 top-6"
            )}>
              <DialogPrimitive.Close asChild>
                {closeButton}
              </DialogPrimitive.Close>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              shape={closeButtonShape}
              className={cn(
                "absolute h-8 w-8",
                closeButtonPosition === 'right' ? "right-6 top-6" : "left-6 top-6",
                closeButtonClassName
              )}
              asChild
            >
              <DialogPrimitive.Close>
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </Button>
          )
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  closeButtonPosition,
  closeButton,
  closeButtonClassName,
  closeButtonShape = 'circle',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  closeButtonPosition?: 'header-right' | 'header-left',
  closeButton?: React.ReactNode,
  closeButtonClassName?: string,
  closeButtonShape?: 'default' | 'circle'
}) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left relative",
      className
    )}
    {...props}
  >
    {props.children}
    {(closeButtonPosition === 'header-right' || closeButtonPosition === 'header-left') && (
      closeButton ? (
        <div className={cn(
          "absolute top-2",
          closeButtonPosition === 'header-right' ? "right-2" : "left-2"
        )}>
          <DialogPrimitive.Close asChild>
            {closeButton}
          </DialogPrimitive.Close>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          shape={closeButtonShape}
          className={cn(
            "absolute top-2 h-8 w-8",
            closeButtonPosition === 'header-right' ? "right-2" : "left-2",
            closeButtonClassName
          )}
          asChild
        >
          <DialogPrimitive.Close>
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </Button>
      )
    )}
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display text-transform-primary text-2xl font-black tracking-tight leading-none text-on-surface",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("font-body text-transform-secondary text-sm text-balance text-on-surface-variant font-medium", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("py-2 max-h-[80vh] overflow-y-auto", className)} {...props} />
);
DialogBody.displayName = "DialogBody";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
};
