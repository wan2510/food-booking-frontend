import { message } from 'antd';

const API_URL = 'http://localhost:8080/api/voucher';

export const getVouchers = async () => {
    try {
        const response = await fetch(`${API_URL}/getListVoucher`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
        });
        if (!response.ok) {
            throw new Error('Lỗi tải dữ liệu!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách voucher:', error);
        message.error(`Không thể lấy dữ liệu: ${error.message}`);
        throw error;
    }
};

export const createVoucher = async (voucherData) => {
    try {
        const response = await fetch(`${API_URL}/addNewVoucher`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
            body: JSON.stringify(voucherData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Không thể tạo voucher: ${response.status} - ${errorText}`,
            );
        }
        const data = await response.json();
        console.log('Voucher mới được tạo:', data);
        message.success('Tạo voucher thành công!');
        return data;
    } catch (error) {
        console.error('Lỗi khi tạo voucher:', error);
        message.error(`Không thể tạo voucher: ${error.message}`);
        throw error;
    }
};

export const updateVoucher = async (voucherData) => {
    try {
        const response = await fetch(`${API_URL}/updateVoucher`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
            body: JSON.stringify(voucherData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Không thể cập nhật voucher: ${response.status} - ${errorText}`,
            );
        }
        const data = await response.json();
        console.log('Voucher đã được cập nhật:', data);
        // Kiểm tra nếu voucherData có deletedAt không null, thì đây là thao tác xóa mềm
        if (voucherData.deletedAt) {
            message.success('Xóa voucher thành công!');
        } else {
            message.success('Cập nhật voucher thành công!');
        }
        return data;
    } catch (error) {
        console.error('Lỗi khi cập nhật voucher:', error);
        message.error('Cập nhật voucher thất bại!');
        throw error;
    }
};
