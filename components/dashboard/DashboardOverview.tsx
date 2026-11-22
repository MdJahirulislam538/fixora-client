"use client";

import { useEffect, useState } from "react";
import {
  ActivityChart,
  DashboardError,
  DashboardPageHeading,
  StatsCards,
} from "./DashboardComponents";
import { dashboardRequest } from "./api";

interface OverviewData {
  stats: { label: string; value: number }[];
  activity: { label: string; value: number }[];
}

export function DashboardOverview({
  role,
  description,
  chartTitle,
}: {
  role: string;
  description: string;
  chartTitle: string;
}) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    dashboardRequest<OverviewData>("/api/dashboard/summary")
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <DashboardPageHeading
        eyebrow={`${role} dashboard`}
        title="Overview"
        description={description}
      />
      {error ? (
        <DashboardError>{error}</DashboardError>
      ) : !data ? (
        <p className="py-10 text-center text-sm text-[#737B87]">Loading overview...</p>
      ) : (
        <>
          <StatsCards stats={data.stats} />
          <div className="mt-6">
            <ActivityChart
              title={chartTitle}
              subtitle="Recent activity over the last seven days"
              data={data.activity}
            />
          </div>
        </>
      )}
    </div>
  );
}
