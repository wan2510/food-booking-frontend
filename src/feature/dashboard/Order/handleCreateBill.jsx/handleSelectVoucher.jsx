import { Select } from "antd";

const HandleSelectVoucher = ({ vouchers = [], onSelect }) => {
  const options = vouchers.map((voucher) => ({
    label: `${voucher.name} - Giảm ${voucher.discount}%`,
    value: voucher.id, // Dùng ID thay vì discount để linh hoạt hơn
  }));

  return (
    <Select
      placeholder="Chọn voucher"
      style={{ width: "100%" }}
      onChange={(value) => {
        const selectedVoucher = vouchers.find((voucher) => voucher.id === value);
        onSelect(selectedVoucher); // Trả về toàn bộ object voucher
      }}
      options={options}
    />
  );
};

export default HandleSelectVoucher;
