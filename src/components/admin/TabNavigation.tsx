
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex space-x-1 space-x-reverse bg-card rounded-md p-1 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className={cn(
            "rounded-md",
            activeTab === tab.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};
