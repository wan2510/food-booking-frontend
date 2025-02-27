import { Select } from "antd";
import { useMemo } from "react";

const HandleSelectTable = ({ tables = [], selectedTable, onSelect }) => {
  const options = useMemo(
    () =>
      tables.map((table) => ({
        label: `Bàn ${table.number} (${table.seats} chỗ)`,
        value: table.id,
      })),
    [tables]
  );

  return (
    <Select
      placeholder="Chọn bàn"
      style={{ width: "100%" }}
      onChange={onSelect}
      value={selectedTable || undefined}
      disabled={!!selectedTable}
      options={options}
    />
  );
};

export default HandleSelectTable;
