import { RssProps, updateRss, useRss } from "../api/rss";
import { Button, Switch, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'

const RssTable = () => {
  const { rssList, isError, isLoading, reloadRss } = useRss();

  const columns = [
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: RssProps) => (
        <Switch checked={enabled} onChange={
          async (checked) => {
            record.enabled = checked;
            await updateRss(record);
            reloadRss();
          }
        } />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Season',
      dataIndex: 'season',
      key: 'season',
      render: (season: number | null) => (
        season ?
          <span>{season}</span> :
          <span style={{ color: 'gray', fontStyle: 'italic' }}>Default</span>
      ),
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
    {
      title: 'Action',
      key: 'action',
      render: (_val: string, record: RssProps) => (
        <Button type="primary" shape="circle" icon={<DeleteOutlined />} danger onClick={
          () => {
            console.log('delete', record.id);
          }
        } />
      ),
    }
  ]

  return (
    <Table
      loading={isLoading}
      dataSource={isError ? [] : rssList}
      columns={columns}
      rowKey={(record) => record.id.toString()}
      pagination={false}
    />
  );
};

export default RssTable;
