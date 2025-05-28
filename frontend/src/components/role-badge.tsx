import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export default function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleClasses = {
    USER: "role-badge user",
    MANAGER: "role-badge manager", 
    ADMIN: "role-badge admin",
  };

  return (
    <span className={cn(roleClasses[role as keyof typeof roleClasses] || "role-badge", className)}>
      {role}
    </span>
  );
}
