
import { DashboardStats, IATResult } from "@/types/iat-types";
import StatCards from "./StatCards";
import DistributionCharts from "./DistributionCharts";
import DScoreChart from "./DScoreChart";

interface DashboardProps {
  stats: DashboardStats;
  results: IATResult[];
}

const Dashboard = ({ stats, results }: DashboardProps) => {
  return (
    <>
      <StatCards stats={stats} results={results} />
      <DistributionCharts stats={stats} />
      <DScoreChart results={results} />
    </>
  );
};

export default Dashboard;
