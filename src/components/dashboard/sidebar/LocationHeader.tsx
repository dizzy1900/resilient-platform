import { Logo } from '../Logo';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface LocationHeaderProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const LocationHeader = ({ isMobile, onClose }: LocationHeaderProps) => {
  return (
    <>
      <div className="p-6 pb-4 flex items-center justify-between">
        <Logo />
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Separator className="bg-sidebar-border" />
    </>
  );
};
