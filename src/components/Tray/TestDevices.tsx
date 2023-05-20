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

interface Device {
  device_type: string;
  dns_addresses: DNSAddresses;
  dns_server_id: string;
  id: string;
  name: string;
  settings: DeviceSettings;
}

const testDevices: Device[] = [
  {
    id: '1',
    name: 'Windows laptop',
    device_type: 'WINDOWS',
    dns_server_id: 'server1',
    dns_addresses: {
      adguard_dns_over_https_url: 'https://adguard.com',
      adguard_dns_over_quic_url: 'quic://adguard.com',
      adguard_dns_over_tls_url: 'tls://adguard.com',
      adguard_vpn_dns_over_https_url: 'https://vpn.adguard.com',
      adguard_vpn_dns_over_quic_url: 'quic://vpn.adguard.com',
      adguard_vpn_dns_over_tls_url: 'tls://vpn.adguard.com',
      dns_over_https_url: 'https://dns.com',
      dns_over_quic_url: 'quic://dns.com',
      dns_over_tls_url: 'tls://dns.com',
      ip_addresses: [
        { ip_address: '192.168.1.1', type: 'ipv4' },
        { ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', type: 'ipv6' },
      ],
    },
    settings: {
      protection_enabled: true,
    },
  },
  {
    id: '1',
    name: 'Mark mobile',
    device_type: 'ANDROID',
    dns_server_id: 'server1',
    dns_addresses: {
      adguard_dns_over_https_url: 'https://adguard.com',
      adguard_dns_over_quic_url: 'quic://adguard.com',
      adguard_dns_over_tls_url: 'tls://adguard.com',
      adguard_vpn_dns_over_https_url: 'https://vpn.adguard.com',
      adguard_vpn_dns_over_quic_url: 'quic://vpn.adguard.com',
      adguard_vpn_dns_over_tls_url: 'tls://vpn.adguard.com',
      dns_over_https_url: 'https://dns.com',
      dns_over_quic_url: 'quic://dns.com',
      dns_over_tls_url: 'tls://dns.com',
      ip_addresses: [
        { ip_address: '192.168.1.1', type: 'ipv4' },
        { ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', type: 'ipv6' },
      ],
    },
    settings: {
      protection_enabled: true,
    },
  },
  {
    id: '1',
    name: 'Home router',
    device_type: 'ROUTER',
    dns_server_id: 'server1',
    dns_addresses: {
      adguard_dns_over_https_url: 'https://adguard.com',
      adguard_dns_over_quic_url: 'quic://adguard.com',
      adguard_dns_over_tls_url: 'tls://adguard.com',
      adguard_vpn_dns_over_https_url: 'https://vpn.adguard.com',
      adguard_vpn_dns_over_quic_url: 'quic://vpn.adguard.com',
      adguard_vpn_dns_over_tls_url: 'tls://vpn.adguard.com',
      dns_over_https_url: 'https://dns.com',
      dns_over_quic_url: 'quic://dns.com',
      dns_over_tls_url: 'tls://dns.com',
      ip_addresses: [
        { ip_address: '192.168.1.1', type: 'ipv4' },
        { ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', type: 'ipv6' },
      ],
    },
    settings: {
      protection_enabled: true,
    },
  },
  {
    id: '1',
    name: 'Sofia',
    device_type: 'IOS',
    dns_server_id: 'server1',
    dns_addresses: {
      adguard_dns_over_https_url: 'https://adguard.com',
      adguard_dns_over_quic_url: 'quic://adguard.com',
      adguard_dns_over_tls_url: 'tls://adguard.com',
      adguard_vpn_dns_over_https_url: 'https://vpn.adguard.com',
      adguard_vpn_dns_over_quic_url: 'quic://vpn.adguard.com',
      adguard_vpn_dns_over_tls_url: 'tls://vpn.adguard.com',
      dns_over_https_url: 'https://dns.com',
      dns_over_quic_url: 'quic://dns.com',
      dns_over_tls_url: 'tls://dns.com',
      ip_addresses: [
        { ip_address: '192.168.1.1', type: 'ipv4' },
        { ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', type: 'ipv6' },
      ],
    },
    settings: {
      protection_enabled: true,
    },
  },
  {
    id: '1',
    name: 'macbook (office)',
    device_type: 'MAC',
    dns_server_id: 'server1',
    dns_addresses: {
      adguard_dns_over_https_url: 'https://adguard.com',
      adguard_dns_over_quic_url: 'quic://adguard.com',
      adguard_dns_over_tls_url: 'tls://adguard.com',
      adguard_vpn_dns_over_https_url: 'https://vpn.adguard.com',
      adguard_vpn_dns_over_quic_url: 'quic://vpn.adguard.com',
      adguard_vpn_dns_over_tls_url: 'tls://vpn.adguard.com',
      dns_over_https_url: 'https://dns.com',
      dns_over_quic_url: 'quic://dns.com',
      dns_over_tls_url: 'tls://dns.com',
      ip_addresses: [
        { ip_address: '192.168.1.1', type: 'ipv4' },
        { ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', type: 'ipv6' },
      ],
    },
    settings: {
      protection_enabled: true,
    },
  },
  {
    id: '1',
    name: 'Device 6',
    device_type: 'UNKNOWN',
    dns_server_id: 'server1',
    dns_addresses: {
      adguard_dns_over_https_url: 'https://adguard.com',
      adguard_dns_over_quic_url: 'quic://adguard.com',
      adguard_dns_over_tls_url: 'tls://adguard.com',
      adguard_vpn_dns_over_https_url: 'https://vpn.adguard.com',
      adguard_vpn_dns_over_quic_url: 'quic://vpn.adguard.com',
      adguard_vpn_dns_over_tls_url: 'tls://vpn.adguard.com',
      dns_over_https_url: 'https://dns.com',
      dns_over_quic_url: 'quic://dns.com',
      dns_over_tls_url: 'tls://dns.com',
      ip_addresses: [
        { ip_address: '192.168.1.1', type: 'ipv4' },
        { ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', type: 'ipv6' },
      ],
    },
    settings: {
      protection_enabled: true,
    },
  },
  {
    id: '1',
    name: 'Device 7',
    device_type: 'SMART_TV',
    dns_server_id: 'server1',
    dns_addresses: {
      adguard_dns_over_https_url: 'https://adguard.com',
      adguard_dns_over_quic_url: 'quic://adguard.com',
      adguard_dns_over_tls_url: 'tls://adguard.com',
      adguard_vpn_dns_over_https_url: 'https://vpn.adguard.com',
      adguard_vpn_dns_over_quic_url: 'quic://vpn.adguard.com',
      adguard_vpn_dns_over_tls_url: 'tls://vpn.adguard.com',
      dns_over_https_url: 'https://dns.com',
      dns_over_quic_url: 'quic://dns.com',
      dns_over_tls_url: 'tls://dns.com',
      ip_addresses: [
        { ip_address: '192.168.1.1', type: 'ipv4' },
        { ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', type: 'ipv6' },
      ],
    },
    settings: {
      protection_enabled: true,
    },
  },
];

export default testDevices;
