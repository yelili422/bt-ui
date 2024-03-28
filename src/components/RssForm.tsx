import { FloatButton, Form, FormInstance, Input, InputNumber, Modal, Select, Switch } from "antd";
import { createRss, type RssProps } from "../api/rss";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const RssForm: React.FC<{
  onFormInstanceReady: (instance: FormInstance<RssProps>) => void;
}> = ({
  onFormInstanceReady,
}) => {
    const [form] = Form.useForm<RssProps>();
    useEffect(() => {
      onFormInstanceReady(form);
    });
    return (
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          title: '',
          season: 1,
          rss_type: 'mikan',
          url: '',
          enabled: true,
        }}
      >
        <Form.Item<RssProps> name="enabled" label="Enabled" style={{ display: 'none' }}>
          <Switch />
        </Form.Item>
        <Form.Item<RssProps> name="title" label="Title">
          <Input />
        </Form.Item>
        <Form.Item<RssProps>
          name="season"
          label="Season"
          rules={[{ type: 'number', min: 1, max: 999 }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<RssProps> name="rss_type" label="RSS Type">
          <Select options={[
            { label: 'Mikan', value: 'mikan' },
          ]} />
        </Form.Item>
        <Form.Item<RssProps>
          name="url"
          label="URL"
          rules={[{ type: 'url', required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    );
  };

const RssFormModal: React.FC = () => {
  const [formInstance, setFormInstance] = useState<FormInstance<RssProps>>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatButton type="primary" icon={<PlusOutlined />} onClick={() => setOpen(!open)} />
      <Modal
        title="Add RSS"
        open={open}
        centered={true}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
        onOk={async () => {
          try {
            const values = await formInstance?.validateFields();
            await createRss(values!);
            setOpen(false);
          } catch (error) {
            console.error('Failed:', error);
          }
        }}
      >
        <RssForm onFormInstanceReady={(instance) => {
          setFormInstance(instance);
        }} />
      </Modal>
    </>
  )
};


export default RssFormModal;