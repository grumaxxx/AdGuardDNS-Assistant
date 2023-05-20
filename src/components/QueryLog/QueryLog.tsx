import React, { useState, useEffect } from 'react';
import { List, Spin, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { QueryLogItem } from './../../types';
import { getQueryLog } from './../Api'; // Ваш API запрос
import './QueryLog.css';
import { testQueryLogItems } from './TestQueryLogData';
import moment from 'moment';

const actionTypeMessageMap: Record<string, string> = {
  UNKNOWN: 'UNKNOWN',
  NONE: 'PROCESSED',
  REQUEST_BLOCKED: 'Blocked',
  RESPONSE_BLOCKED: 'Blocked',
  REQUEST_ALLOWED: 'Allowed',
  RESPONSE_ALLOWED: 'Allowed',
  MODIFIED: 'Modified',
};

const QueryLog: React.FC = () => {
  const [items, setItems] = useState<QueryLogItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchItems = async () => {
    // const currentTimeMillis = new Date().getTime();
    // const timeFromMillis = currentTimeMillis - 24 * 60 * 60 * 1000;
    // const timeToMillis = currentTimeMillis;

    // if (token) {
    //   const result = await getQueryLog(token, timeFromMillis, timeToMillis);
    //   if (result instanceof Error) {
    //     console.error(result.message);
    //     message.error(`Error: ${result.message}`);
    //   } else {
    //     console.log(result.items);
    //     setItems(prevItems => [...prevItems, ...result.items]);
    //   }
    // }
    setItems(testQueryLogItems);
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('access_token');
    setToken(tokenFromStorage);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchMoreData = () => {
    if (!hasMore) return;
    fetchItems();
  };

  return token ? (
    <div
      id="scrollableDiv"
      style={{
        overflow: 'auto',
        height: '100vh',
        width: '100vw',
      }}
    >
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={item => (
            <List.Item key={item.asn}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  className={`status ${item.filtering_info.filtering_status.toLowerCase()}`}
                >
                  {actionTypeMessageMap[item.filtering_info.filtering_status]}
                </span>
                <span
                  style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    overflow: 'hidden',
                  }}
                >
                  {item.domain}
                </span>
              </div>
              <span style={{ marginRight: '10px' }}>
                <div>{moment(item.time_iso).format('HH:mm:ss')}</div>
                <div>{moment(item.time_iso).format('DD.MM.YYYY')}</div>
              </span>
            </List.Item>
          )}
        >
          {hasMore && (
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1>Please Log In</h1>
    </div>
  );
};

export default QueryLog;
