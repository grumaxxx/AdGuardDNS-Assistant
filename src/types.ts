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

export interface DeviceStatsValue {
  blocked: number;
  companies: number;
  queries: number;
}

export interface DeviceStatsItem {
  device_id: string;
  last_activity_time_millis: number;
  value: DeviceStatsValue;
}

export interface DeviceStat {
  queries: number;
  blocked: number;
}

export interface AccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface TokenServerError {
  error: string;
  error_code: string;
  error_description: string;
}

interface IPAddress {
  ip_address: string;
  type: string;
}

interface DNSAddresses {
  adguard_dns_over_https_url: string;
  adguard_dns_over_quic_url: string;
  adguard_dns_over_tls_url: string;
  adguard_vpn_dns_over_https_url: string;
  adguard_vpn_dns_over_quic_url: string;
  adguard_vpn_dns_over_tls_url: string;
  dns_over_https_url: string;
  dns_over_quic_url: string;
  dns_over_tls_url: string;
  ip_addresses: IPAddress[];
}

interface DeviceSettings {
  protection_enabled: boolean;
}

export interface Device {
  device_type: string;
  dns_addresses: DNSAddresses;
  dns_server_id: string;
  id: string;
  name: string;
  settings: DeviceSettings;
}