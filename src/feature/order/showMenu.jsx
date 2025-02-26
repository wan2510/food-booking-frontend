import React from 'react';
import { Card, List } from 'antd';

const ShowMenu = () => {
  const foods = [
    { title: 'Title 1' },
    { title: 'Title 2' },
    { title: 'Title 3' },
    { title: 'Title 4' },
    { title: 'Title 5' },
    { title: 'Title 6' },
  ];

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
      }}
      dataSource={foods}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.title}>Món ăn ngon</Card>
        </List.Item>
      )}
    />
  );
};

export default ShowMenu;
