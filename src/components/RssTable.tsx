import { RssProps, deleteRss, updateRss, useRss } from "../api/rss";
import { Button, Col, FloatButton, Popconfirm, Row, Switch, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import RssFormModal from "./RssForm";
import { useState } from "react";

const RssTable: React.FC = () => {
  const { rssList, isError, isLoading, reloadRss } = useRss();
  const [showForm, setShowForm] = useState(false);
  const [initialValues, setInitialValues] = useState<RssProps>();
  const [isUpdate, setIsUpdate] = useState(false)

  const editModal = (isUpdate: boolean, value: RssProps) => {
    setIsUpdate(isUpdate)
    setInitialValues(value)
    setShowForm(true)
  };

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
        <Row gutter={8}>
          <Col>
            <Button
              icon={<EditOutlined />}
              shape="circle"
              onClick={() => editModal(false, record)}
            />
          </Col>
          <Col>
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
          </Col>
        </Row>
      ),
    }
  ]

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={isError ? [] : rssList}
        columns={columns}
        rowKey={(record) => record.id.toString()}
        pagination={false}
      />

      <FloatButton type="primary" icon={<PlusOutlined />} onClick={() => editModal(true, {
        id: 0,
        title: '',
        season: 1,
        rss_type: 'mikan',
        url: '',
        enabled: true,
        filters: [],
        description: '',
      })} />
      <RssFormModal isUpdate={isUpdate} initialValues={initialValues} showForm={showForm} onClose={() => setShowForm(false)} />
    </>
  );
};

export default RssTable;
