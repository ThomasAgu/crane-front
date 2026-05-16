import apiRequest from "./apiClient";
import { StatsReportDto } from "../dto/StatsReportDto";
import { AlertDto, AlertReportDto } from "../dto/AlertReportDto";
import { CombinedReportDto } from "../dto/CombinedReportDto";
import { TimeRange } from "@/lib/types/TimeRange"; 
import { AppService } from "./appService";

// GET /{app_id}/stats
const getStats = (appId: string, timeRange: TimeRange = "1h") => {
  return timeRange === "0" 
    ? AppService.getStats(appId)
    : apiRequest<StatsReportDto>(
    `/reports/${appId}/stats?time_range=${timeRange}`,
    "GET"
  );
};

// GET /{app_id}/alerts
const getAlerts = (appId: string, timeRange: TimeRange = "1h") =>
  apiRequest<AlertReportDto>(
    `/reports/${appId}/alerts?time_range=${timeRange}`,
    "GET"
  );

// GET /{app_id}/alerts/active
const getActiveAlerts = (appId: string) =>
  apiRequest<AlertDto[]>(
    `/reports/${appId}/alerts/active`,
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