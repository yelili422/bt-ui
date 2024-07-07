import { Card, Col, Form, FormInstance, Input, InputNumber, Modal, Row, Select, SelectProps, Switch, Tag, Tree, TreeDataNode } from "antd";
import { createRss, RssProps, updateRss, usePreviewRss, RssPreviewProps } from "../api/rss";
import { useEffect, useState } from "react";

import './RssForm.css';
import { splitBefore } from "../libs/string";
import { mergeDeep } from "../libs/object";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";

type TagRender = SelectProps['tagRender'];
type SelectOptions = SelectProps['options'];
type OptionRender = SelectProps['optionRender'];
type PreviewMap = {
  [key: string]: PreviewMap | null;
};

const filterOptions: SelectOptions = [
  { label: 'Baha', value: 'FilenameRegex-Baha' },
  { label: 'Crunchyroll', value: 'FilenameRegex-CR|Crunchyroll' },
  { label: '*.mp4', value: 'FilenameRegex-\\.mp4$' },
  { label: '合集', value: 'FilenameRegex-合集' },
  { label: '简日', value: 'FilenameRegex-简日' },
  { label: '繁日', value: 'FilenameRegex-繁日' },
];

const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={'red'}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
    >
      {label}
    </Tag>
  )
};

const filterOptionContent = (rule: string, content: string) => {
  if ('FilenameRegex' === rule) {
    return (
      <span>
        <span className="rule-wrapper-text">/</span>
        <span>{content}</span>
        <span className="rule-wrapper-text">/i</span>
      </span>
    );
  }
};

const optionRender: OptionRender = (option) => {
  const [rule, content] = splitBefore('-', option.data.value)
  return (
    <Row>
      <Col span={20}>
        {filterOptionContent(rule, content)}
      </Col>
    </Row>
  )
}


const parsePreviewPath = (path: string): PreviewMap => {
  const [slug, ...rest] = path.split('/');
  const res: PreviewMap = {};

  res[slug] = rest.length === 0 ? null : parsePreviewPath(rest.join('/'));
  return res;
}

const parsePreviewPaths = (paths: string[]): PreviewMap => {
  return paths.reduce((acc, path) => mergeDeep(acc, parsePreviewPath(path)), {});
}

const convertPreviewToTree = (preview: PreviewMap, parentKey: string): TreeDataNode[] => {
  return Object.keys(preview).map((key, index) => {
    const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
    const value = preview[key];

    if (!value) {
      return {
        title: key,
        key: currentKey,
        children: [],
      };
    } else {
      return {
        title: key,
        key: currentKey,
        children: convertPreviewToTree(value, currentKey),
      };
    }
  });
}

const RssForm: React.FC<{
  onFormInstanceReady: (instance: FormInstance<RssProps>) => void;
  initialValues?: RssProps;
}> = ({
  onFormInstanceReady,
  initialValues,
}) => {
    const [form] = Form.useForm<RssProps>();
    const updateForm = (previewData: RssPreviewProps) => {
      if (!previewData.rss || previewData.rss.items.length === 0) {
        return;
      }
      const item = previewData.rss.items[0];
      form.setFieldValue('title', item.title);
      form.setFieldValue('season', item.season);
      console.log('update form: ', item.title, item.season);
    };
    const [previewParam, setPreviewParam] = useState<RssProps>(form.getFieldsValue());
    const { preview, isLoading, isError } = usePreviewRss(previewParam, updateForm);

    useEffect(() => {
      onFormInstanceReady(form);
    });

    return (
      <Row gutter={24}>
        <Col span={12}>
          <Form
            layout="vertical"
            form={form}
            initialValues={initialValues}
          >
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
              <Input.TextArea onBlur={async () => {
                console.log('on url blur');
                setPreviewParam(form.getFieldsValue());
              }} />
            </Form.Item>
            <Form.Item<RssProps> name="enabled" label="Enabled" style={{ display: 'none' }}>
              <Switch />
            </Form.Item>
            <Form.Item<RssProps>
              name="title"
              label="Title"
              normalize={(value) => value.trim()}
            >
              <Input />
            </Form.Item>
            <Form.Item<RssProps>
              name="season"
              label="Season"
              rules={[{ type: 'number', min: 1, max: 999 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item<RssProps> name="category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item<RssProps> name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item<RssProps> name="id" label="id" style={{ display: 'none' }}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="filters" label="Filters">
              <Select
                mode="tags"
                tagRender={tagRender}
                optionRender={optionRender}
                options={filterOptions}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Card
            loading={isLoading}
            title="Preview"
            size="small">
            {(!preview || isError) && <div style={{ textAlign: 'center', margin: 20 }}>
              <SmileOutlined style={{ fontSize: 24 }} />
              <p>No Preview</p>
            </div>}
            {preview && <Tree
              showLine
              defaultExpandAll
              switcherIcon={<DownOutlined />}
              treeData={convertPreviewToTree(parsePreviewPaths(preview.paths), '')}
              height={600}>
            </Tree>}
          </Card>
        </Col>
      </Row>
    );
  };

const RssFormModal: React.FC<{
  isUpdate?: boolean;
  initialValues?: RssProps;
  showForm?: boolean;
  onClose: () => void;
}> = ({ isUpdate, initialValues, showForm: open, onClose }) => {
  const [formInstance, setFormInstance] = useState<FormInstance<RssProps>>();
  return (
    <Modal
      title={isUpdate ? "Update RSS" : "Add RSS"}
      open={open}
      centered={true}
      onCancel={() => onClose()}
      destroyOnClose={true}
      maskClosable={false}
      width={'60%'}
      onOk={async () => {
        try {
          const formValues = await formInstance?.validateFields();
          isUpdate ? await updateRss(formValues!) : await createRss(formValues!);
          onClose();
        } catch (error) {
          console.error('Failed:', error);
        }
      }}
    >
      <RssForm
        initialValues={initialValues}
        onFormInstanceReady={(instance) => {
          setFormInstance(instance);
        }}
      />
    </Modal>
  )
};

export default RssFormModal;
