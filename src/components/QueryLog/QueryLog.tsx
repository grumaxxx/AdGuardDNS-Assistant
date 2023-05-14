import React, { useState, useEffect } from 'react';
import { List, Spin, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { QueryLogItem } from './../../types';
import { getQueryLog } from './../Api'; // Ваш API запрос

const QueryLog: React.FC = () => {
  const [items, setItems] = useState<QueryLogItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchItems = async () => {
    const currentTimeMillis = new Date().getTime();
    const timeFromMillis = currentTimeMillis - 24 * 60 * 60 * 1000;
    const timeToMillis = currentTimeMillis;

    if (token) {
      const result = await getQueryLog(token, timeFromMillis, timeToMillis);
      if (result instanceof Error) {
        console.error(result.message);
        message.error(`Error: ${result.message}`);
      } else {
        console.log(result.items);
        setItems(prevItems => [...prevItems, ...result.items]);
      }
    }
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
        marginLeft: '20px',
      }}
    >
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={items}
          renderItem={item => (
            <List.Item key={item.asn}>
              <List.Item.Meta
                title={`Domain: ${item.domain} Company: ${item.company_id}`}
                description={`Time: ${item.time_iso}`}
              />
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
