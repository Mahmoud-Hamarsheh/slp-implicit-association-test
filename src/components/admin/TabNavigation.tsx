
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalResults: number;
}

export const TabNavigation = ({ activeTab, setActiveTab, totalResults }: TabNavigationProps) => {
  const tabs = [
    { id: "dashboard", label: "لوحة المعلومات" },
    { id: "results", label: `النتائج (${totalResults})` },
  ];

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
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};
