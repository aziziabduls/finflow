
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

interface ResponsiveDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * ResponsiveSheet wrapper that uses Radix UI Sheet (side drawer)
 * for a consistent "side panel" entry experience on all devices.
 */
export const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  isOpen,
  setIsOpen,
  title,
  children,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l bg-background shadow-2xl">
        <SheetHeader className="mb-8 border-b pb-6">
          <SheetTitle className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-6 pb-20 sm:pb-8">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
