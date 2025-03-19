import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import {
    TABLE_STATUS,
    TABLE_STATUS_LABELS,
} from '../../../../constant/tableStatus';

const { Option } = Select;

const validationRules = {
    tableNumber: [
        { required: true, message: 'Vui lòng nhập số bàn' },
        {
            pattern: /^[A-Z][0-9]{2}$/,
            message: 'Số bàn phải có định dạng [Chữ cái][Số], ví dụ: A01, B02',
        },
    ],
    description: [
        { required: true, message: 'Vui lòng nhập mô tả' },
        { min: 5, message: 'Mô tả phải có ít nhất 5 ký tự' },
        { max: 200, message: 'Mô tả không được quá 200 ký tự' },
    ],
    capacity: [
        { required: true, message: 'Vui lòng nhập sức chứa' },
        { type: 'number', min: 1, message: 'Sức chứa phải lớn hơn 0' },
    ],
    status: [{ required: true, message: 'Vui lòng chọn trạng thái' }],
};
const TableForm = ({ form, editingTable }) => {
    useEffect(() => {
        if (editingTable) {
            form.setFieldsValue(editingTable);
        } else {
            form.setFieldsValue({
                status: TABLE_STATUS.EMPTY, // Default status for new tables
            });
        }
    }, [editingTable, form]);

    return (
        <Form form={form} layout="vertical">
<Form.Item
                name="tableNumber"
                label="Số bàn"
                rules={validationRules.tableNumber}
                validateTrigger={['onChange', 'onBlur']}
                hasFeedback
                tooltip="Số bàn phải có 1 chữ cái viết hoa và 2 số, ví dụ: A01, B02"
            >
                <Input 
                    placeholder="Nhập số bàn (VD: A01, B02)"
                    onBlur={(e) => {
                        form.validateFields(['tableNumber']);
                    }}
                />
            </Form.Item>

<Form.Item
                name="description"
                label="Mô tả"
                rules={validationRules.description}
                validateTrigger={['onChange', 'onBlur']}
                hasFeedback
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Nhập mô tả về vị trí hoặc đặc điểm của bàn"
                />
            </Form.Item>

<Form.Item
                name="capacity"
                label="Sức chứa"
                rules={validationRules.capacity}
                validateTrigger={['onChange', 'onBlur']}
                hasFeedback
            >
                <InputNumber
                    min={1}
                    max={20}
                    style={{ width: '100%' }}
                    placeholder="Nhập số người tối đa có thể phục vụ"
                />
            </Form.Item>

<Form.Item
                name="status"
                label="Trạng thái"
                rules={validationRules.status}
                validateTrigger={['onChange', 'onBlur']}
                hasFeedback
            >
                <Select placeholder="Chọn trạng thái">
                    {Object.entries(TABLE_STATUS_LABELS).map(([key, label]) => (
                        <Option key={key} value={key}>
                            {label}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};

export default TableForm;
