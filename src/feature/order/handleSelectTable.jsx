import { Select } from 'antd';

const handleSelectTable = ({ tables, selectedTable, onSelect }) => {
    return (
      <Select
        placeholder="Chọn bàn"
        style={{ width: "100%" }}
        onChange={onSelect}
        value={selectedTable || undefined}
        disabled={!!selectedTable}
      >
        {tables.map((table) => (
          <Select.Option key={table.id} value={table.id}>
            Bàn {table.number} ({table.seats} chỗ)
          </Select.Option>
        ))}
      </Select>
    );
  };
  
export default handleSelectTable;
