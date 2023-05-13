export interface QueryLogFilteringInfo {
  blocked_service_id: string;
  filter_id: string;
  filter_rule: string;
  filtering_status: string;
  filtering_type: string;
}

export interface QueryLogItem {
  asn: number;
  category_type: string;
  client_country: string;
  company_id: string;
  device_id: string;
  dns_proto_type: string;
  dns_request_type: string;
  dns_response_type: string;
  dnssec: boolean;
  domain: string;
  filtering_info: QueryLogFilteringInfo;
  network: string;
  response_country: string;
  time_iso: string;
  time_millis: number;
}

export interface QueryLogPage {
  current: boolean;
  page_cursor: string;
  page_number: number;
}

export interface QueryLogServerResponse {
  items: QueryLogItem[];
  pages: QueryLogPage[];
}

export interface StatsValue {
  blocked: number;
  companies: number;
  queries: number;
}

export interface StatsItem {
  time_millis: number;
  value: StatsValue;
}