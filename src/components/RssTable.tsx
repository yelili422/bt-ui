import { RssProps, deleteRss, updateRss, useRss } from "../api/rss";
import { Button, Popconfirm, Switch, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'

const RssTable: React.FC = () => {
  const { rssList, isError, isLoading, reloadRss } = useRss();

  const columns = [
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: RssProps) => (
        <Switch checked={enabled} onChange={
          async (checked: boolean) => {
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
      render: (url: string) => (
        <a href={url} target="_blank">
          {url}
        </a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_val: string, record: RssProps) => (
        <Popconfirm
          title="Delete the RSS."
          description="Are you sure you want to delete this RSS?"
          onConfirm={async () => {
            await deleteRss(record.id);
            reloadRss();
          }}
        >
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            danger
            shape="circle"
          />
        </Popconfirm>
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
