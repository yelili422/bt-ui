import { Col, Form, FormInstance, Input, InputNumber, Modal, Row, Select, SelectProps, Switch, Tag } from "antd";
import { createRss, RssProps, RssFilterProps, RssFilterAction, RssFilterRule, updateRss } from "../api/rss";
import { useEffect, useState } from "react";

import './RssForm.css';
import { splitBefore } from "../libs/string";

type TagRender = SelectProps['tagRender'];
type SelectOptions = SelectProps['options'];
type OptionRender = SelectProps['optionRender'];

const filterOptions: SelectOptions = [
  { label: 'Baha', value: 'Include-FilenameRegex-Baha' },
  { label: 'Crunchyroll', value: 'Include-FilenameRegex-CR|Crunchyroll' },
  { label: '*.mp4', value: 'Exclude-FilenameRegex-\\.mp4$' },
  { label: '合集', value: 'Exclude-FilenameRegex-合集' },
  { label: '简日', value: 'Exclude-FilenameRegex-简日' },
  { label: '繁日', value: 'Exclude-FilenameRegex-繁日' },
];

const splitFilterValue = (value: string): RssFilterProps => {
  const [ruleAction, rest] = splitBefore('-', value);
  const [ruleType, content] = splitBefore('-', rest);
  return [
    { [ruleType]: content } as RssFilterRule,
    ruleAction as RssFilterAction,
  ];
};

const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const [_rule, action] = splitFilterValue(value?.toString() || '');
  const labelColor = action === 'Include' ? 'blue' : 'red';

  return (
    <Tag
      color={labelColor}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
    >
      {label}
    </Tag>
  )
};

const filterOptionContent = (rule: RssFilterRule) => {
  if ('FilenameRegex' in rule) {
    return (
      <span>
        <span className="rule-wrapper-text">/</span>
        <span>{rule.FilenameRegex}</span>
        <span className="rule-wrapper-text">/i</span>
      </span>
    );
  }
};

const optionRender: OptionRender = (option) => {
  const [rule, action] = splitFilterValue(option.data.value);
  return (
    <Row>
      <Col span={20}>
        {filterOptionContent(rule)}
      </Col>
      <Col span={4}>
        <span className='rule-action-text'>
          {action.toLowerCase()}
        </span>
      </Col>
    </Row>
  )
}

const RssForm: React.FC<{
  onFormInstanceReady: (instance: FormInstance<RssProps>) => void;
  initialValues?: RssProps;
}> = ({
  onFormInstanceReady,
  initialValues,
}) => {
    const [form] = Form.useForm<RssProps>();
    useEffect(() => {
      onFormInstanceReady(form);
    });
    return (
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
      >
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
        <Form.Item<RssProps> name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item<RssProps> name="id" label="id" style={{ display: 'none' }}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Filters">
          <Form.Item<RssProps> name="filters" label="Filters" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Select
            mode="tags"
            tagRender={tagRender}
            optionRender={optionRender}
            options={filterOptions}
            onChange={(values: string[]) => {
              const filters = values.map((value) => splitFilterValue(value));
              form.setFieldValue('filters', filters);
            }}
          />
        </Form.Item>
      </Form>
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
    <>
      <Modal
        title={isUpdate ? "Update RSS" : "Add RSS"}
        open={open}
        centered={true}
        onCancel={() => onClose()}
        destroyOnClose={true}
        maskClosable={false}
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
    </>
  )
};

export default RssFormModal;
