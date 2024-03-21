import { useRss } from "../api/rss";
import { Table } from 'antd';

const RssTable = () => {
  const { rssList, isError, isLoading } = useRss();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'RSS Type',
      dataIndex: 'rss_type',
      key: 'rss_type',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
  ]

  return (
    <Table
      loading={isLoading}
      dataSource={isError ? [] : rssList}
      columns={columns}
      rowKey={(record) => record.id.toString()}
    />
  );
};

export default RssTable;
