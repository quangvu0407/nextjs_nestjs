"use client";

import { useEffect, useState } from "react";
import { Modal, Checkbox, InputNumber, Button, Typography, Divider } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { ICartOption } from "@/store/cartStore";
import { useCart } from "@/store/useCart";
import { notification } from "antd";

const { Text } = Typography;

interface IMenuItem {
  _id: string;
  title: string;
  basePrice: number;
  image: string;
  restaurantId: string;
}

interface IMenuItemOption {
  _id: string;
  title: string;
  additionalPrice: number;
  description?: string;
}

interface Props {
  item: IMenuItem | null;
  options: IMenuItemOption[];
  open: boolean;
  onClose: () => void;
}

const AddToCartModal = ({ item, options, open, onClose }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart()((s) => s.addItem);

  useEffect(() => {
    if (!item || !open) return;
    setSelected([]);
    setQuantity(1);
  }, [item, open]);

  if (!item) return null;

  const selectedOptions: ICartOption[] = options
    .filter((o) => selected.includes(o._id))
    .map((o) => ({ _id: o._id, title: o.title, additionalPrice: o.additionalPrice }));

  const total = (item.basePrice + selectedOptions.reduce((s, o) => s + o.additionalPrice, 0)) * quantity;

  const handleAdd = () => {
    addItem({
      menuItemId: item._id,
      title: item.title,
      basePrice: item.basePrice,
      image: item.image,
      quantity,
      selectedOptions,
      restaurantId: item.restaurantId,
    });
    notification.success({ title: `Đã thêm "${item.title}" vào giỏ`, duration: 2 });
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={item.title}
      centered
    >
      <>
        {options.length > 0 && (
          <>
            <Text strong>Tùy chọn thêm:</Text>
            <div style={{ marginTop: 8, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {options.map((opt) => (
                <Checkbox
                  key={opt._id}
                  checked={selected.includes(opt._id)}
                  onChange={(e) =>
                    setSelected(e.target.checked
                      ? [...selected, opt._id]
                      : selected.filter((id) => id !== opt._id)
                    )
                  }
                >
                  <span>{opt.title}</span>
                  {opt.additionalPrice > 0 && (
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                      +{opt.additionalPrice.toLocaleString("vi-VN")}đ
                    </Text>
                  )}
                  {opt.description && (
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>
                      ({opt.description})
                    </Text>
                  )}
                </Checkbox>
              ))}
            </div>
            <Divider style={{ margin: "12px 0" }} />
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Text>Số lượng:</Text>
          <InputNumber min={1} max={99} value={quantity} onChange={(v) => setQuantity(v ?? 1)} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text strong style={{ fontSize: 16, color: "#e53935" }}>
            {total.toLocaleString("vi-VN")}đ
          </Text>
          <Button
            type="primary"
            danger
            icon={<ShoppingCartOutlined />}
            onClick={handleAdd}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default AddToCartModal;
