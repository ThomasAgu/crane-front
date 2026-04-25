import apiRequest from "./apiClient";
import { StatsReportDto } from "../dto/StatsReportDto";
import { AlertDto } from "../dto/AlertReportDto";
import { CombinedReportDto } from "../dto/CombinedReportDto";
import { TimeRange } from "../../lib/types/TimeRange"; 

// GET /{app_id}/stats
const getStats = (appId: string, timeRange: TimeRange = "1h") => {
  return timeRange === "0" ? apiRequest<StatsReportDto>(
    `/reports/${appId}/stats`,
    "GET" 
  ) : apiRequest<StatsReportDto>(
    `/reports/${appId}/stats?time_range=${timeRange}`,
    "GET"
  );
};

// GET /{app_id}/alerts
const getAlerts = (appId: string, timeRange: TimeRange = "1h") =>
  apiRequest<AlertDto[]>(
    `/${appId}/alerts?time_range=${timeRange}`,
    "GET"
  );

// GET /{app_id}/alerts/active
const getActiveAlerts = (appId: string) =>
  apiRequest<AlertDto[]>(
    `/${appId}/alerts/active`,
    "GET"
  );

// GET /{app_id}/combined
const getCombined = (appId: string, timeRange: TimeRange = "1h") =>
  apiRequest<CombinedReportDto>(
    `/reports/${appId}/combined?time_range=${timeRange}`,
    "GET"
  );

export const ReportService = {
  getStats,
  getAlerts,
  getActiveAlerts,
  getCombined,
};