export const TABLE_STATUS = {
    EMPTY: "EMPTY",
    RESERVED: "RESERVED",
    OCCUPIED: "OCCUPIED"
};

export const TABLE_STATUS_LABELS = {
    [TABLE_STATUS.EMPTY]: "Trống",
    [TABLE_STATUS.RESERVED]: "Đã đặt",
    [TABLE_STATUS.OCCUPIED]: "Đang phục vụ"
};

export const TABLE_STATUS_COLORS = {
    [TABLE_STATUS.EMPTY]: "#52c41a", // Green
    [TABLE_STATUS.RESERVED]: "#faad14", // Yellow
    [TABLE_STATUS.OCCUPIED]: "#f5222d" // Red
}; 