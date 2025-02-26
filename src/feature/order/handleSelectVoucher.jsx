import { Select } from 'antd';

const handleSelectVoucher = ({ vouchers, onSelect }) => {
    return (
        <Select placeholder="Chọn voucher" style={{ width: '100%' }} onChange={onSelect}>
          {vouchers.map(voucher => (
            <Select.Option key={voucher.id} value={voucher.discount}>
              {voucher.name} - Giảm {voucher.discount}%
            </Select.Option>
          ))}
        </Select>
      );
    };

export default handleSelectVoucher;