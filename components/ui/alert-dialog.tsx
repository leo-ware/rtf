import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface AlertDialogContentProps {
  className?: string
  children: React.ReactNode
}

interface AlertDialogActionProps {
  onClick?: () => void
  className?: string
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: boolean
}

interface AlertDialogCancelProps {
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    {children}
  </Dialog>
)

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <Button ref={ref} {...props}>
    {children}
  </Button>
))
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ className, children, ...props }) => (
  <DialogContent className={cn("max-w-md", className)} {...props}>
    {children}
  </DialogContent>
)

const AlertDialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <DialogHeader className={className}>
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  </DialogHeader>
)

const AlertDialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <DialogTitle className={cn("text-left", className)}>
    {children}
  </DialogTitle>
)

const AlertDialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <DialogDescription className={cn("text-left", className)}>
    {children}
  </DialogDescription>
)

const AlertDialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <DialogFooter className={cn("flex-row justify-end space-x-2", className)}>
    {children}
  </DialogFooter>
)

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ 
  onClick, 
  className, 
  children, 
  variant = "destructive",
  disabled
}) => (
  <Button 
    onClick={onClick}
    variant={variant}
    className={className}
    disabled={disabled}
  >
    {children}
  </Button>
)

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ onClick, className, children }) => (
  <Button 
    onClick={onClick}
    variant="outline"
    className={className}
  >
    {children}
  </Button>
)

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
