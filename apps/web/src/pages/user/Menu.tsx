import React, { useState } from "react";
import {
  Plus, Edit2, Trash2, GripVertical, Search, Check, Save
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Component dòng có thể kéo thả ---
const SortableMenuRow = ({ item, index }: { item: MenuItem; index: number }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group hover:bg-slate-50/50 ${isDragging ? "bg-emerald-50 shadow-inner" : ""}`}
    >
      <TableCell className="text-center">
        {/* Nút cầm để kéo (Drag Handle) */}
        <button
          {...attributes} {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="text-center text-slate-400">{index + 1}</TableCell>
      <TableCell>
        <span className={`font-medium ${item.level > 0 ? 'text-slate-500 pl-4' : 'text-slate-900'}`}>
          {item.menuTitle}
        </span>
      </TableCell>
      <TableCell className="font-mono text-xs text-blue-600">{item.menuUrl}</TableCell>
      <TableCell className="text-center">
        <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">
          {item.order}
        </span>
      </TableCell>
      <TableCell className="text-slate-500 text-xs italic">{item.icon}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// --- Màn hình chính ---
const MenuConfigurationWithDnD = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([
    { id: "1", menuTitle: "Trang chủ", menuUrl: "/", order: 9999, icon: "bi-grid", level: 0 },
    { id: "2", menuTitle: "Quản lý khách sạn", menuUrl: "#", order: 1000, icon: "bx-bus", level: 0 },
    { id: "3", menuTitle: "--- Quản lý phòng", menuUrl: "/HotelQuanLyPhong/Index", order: 100, icon: "bx-hotel", level: 1 },
    { id: "4", menuTitle: "--- Quản lý đặt phòng", menuUrl: "/HotelQuanLyDatPhong/TinhTrang", order: 90, icon: "bx-calendar", level: 1 },
    { id: "5", menuTitle: "Lễ tân", menuUrl: "#", order: 999, icon: "bx-user", level: 0 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setMenuData((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);

        // Cập nhật lại logic "order" (MenuPeriod) dựa trên vị trí mới
        return newArray.map((item, idx) => ({
          ...item,
          order: (newArray.length - idx) * 10 // Ví dụ: gán lại order theo bước 10
        }));
      });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cấu hình Menu (Sắp xếp)</h1>
          <p className="text-sm text-slate-500 font-medium italic">Kéo biểu tượng <GripVertical className="inline h-3 w-3" /> để thay đổi thứ tự</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="text-emerald-700 border-emerald-600">
                <Save className="w-4 h-4 mr-2" /> Lưu vị trí
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Thêm mới menu
            </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[60px] text-center">#</TableHead>
                <TableHead className="font-bold">TIÊU ĐỀ MENU</TableHead>
                <TableHead className="font-bold">URL</TableHead>
                <TableHead className="w-[120px] font-bold text-center">THỨ TỰ</TableHead>
                <TableHead className="w-[150px] font-bold">MÃ ICON</TableHead>
                <TableHead className="w-[100px] text-right">THAO TÁC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={menuData.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {menuData.map((item, index) => (
                  <SortableMenuRow key={item.id} item={item} index={index} />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
};
ất cả các con và cháu của một menu
const getAllDescendants = (items: MenuItem[], parentId: string): MenuItem[] => {
  const children = items.filter(item => item.parentId === parentId);
  return children.reduce((acc, child) => {
    return [...acc, child, ...getAllDescendants(items, child.id)];
  }, [] as MenuItem[]);
};

// Sắp xếp lại danh sách để đảm bảo con luôn đi theo cha trong mảng phẳng
const flattenTree = (items: MenuItem[], parentId?: string): MenuItem[] => {
  return items
    .filter(item => item.parentId === parentId)
    .sort((a, b) => b.order - a.order) // Sắp xếp theo MenuPeriod trong DB [1]
    .reduce((acc, item) => {
      return [...acc, item, ...flattenTree(items, item.id)];
    }, [] as MenuItem[]);
};
2. Thành phần Menu với Logic Kéo Khối (TSX)
import React, { useState, useMemo } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, Save, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const HierarchicalMenuDnD = () => {
  const [menus, setMenus] = useState<MenuItem[]>([
    { id: "M1", menuTitle: "Quản lý khách sạn", menuUrl: "#", order: 1000, icon: "bx-bus", level: 0 },
    { id: "M2", menuTitle: "Quản lý phòng", menuUrl: "/Room", order: 100, icon: "bx-hotel", level: 1, parentId: "M1" },
    { id: "M3", menuTitle: "Quản lý đặt phòng", menuUrl: "/Booking", order: 90, icon: "bx-calendar", level: 1, parentId: "M1" },
    { id: "M4", menuTitle: "Lễ tân", menuUrl: "#", order: 999, icon: "bx-user", level: 0 },
    { id: "M5", menuTitle: "Booking tại quầy", menuUrl: "/Pos", order: 100, icon: "bx-cart", level: 1, parentId: "M4" },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setMenus((prevMenus) => {
      const activeItem = prevMenus.find(m => m.id === active.id);
      if (!activeItem) return prevMenus;

      // 1. Xác định "khối" cần di chuyển (Cha + tất cả con)
      const descendants = getAllDescendants(prevMenus, activeItem.id);
      const blockIds = [activeItem.id, ...descendants.map(d => d.id)];

      // 2. Tìm vị trí mục tiêu
      const oldIndex = prevMenus.findIndex(m => m.id === active.id);
      const newIndex = prevMenus.findIndex(m => m.id === over.id);

      // 3. Tạo mảng mới bằng cách tách khối ra và chèn vào vị trí mới
      const remainingItems = prevMenus.filter(m => !blockIds.includes(m.id));
      const movedBlock = prevMenus.filter(m => blockIds.includes(m.id));

      // Tính toán vị trí chèn mới trong mảng đã lọc
      const adjustedNewIndex = remainingItems.findIndex(m => m.id === over.id);

      const result = [...remainingItems];
      result.splice(adjustedNewIndex, 0, ...movedBlock);

      // 4. Cập nhật lại thuộc tính 'order' (MenuPeriod [1]) để đồng bộ DB
      return result.map((item, idx) => ({
        ...item,
        order: (result.length - idx) * 10
      }));
    });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cấu hình Menu Hệ thống</h2>
          <p className="text-emerald-600 text-sm font-medium">Nhấn giữ kéo để di chuyển cả nhóm Menu cha và con</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
           <Save className="w-4 h-4 mr-2" /> Lưu cấu hình vị trí
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>TIÊU ĐỀ MENU</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-center">THỨ TỰ</TableHead>
                <TableHead>ICON</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext items={menus.map(m => m.id)} strategy={verticalListSortingStrategy}>
                {menus.map((menu) => (
                  <SortableRow key={menu.id} menu={menu} />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
};

// Component dòng đơn lẻ (SortableRow)
const SortableRow = ({ menu }: { menu: MenuItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: menu.id });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "#f0fdf4" : undefined,
      }}
      className="group"
    >
      <TableCell>
        <div {...attributes} {...listeners} className="cursor-grab p-2 hover:text-emerald-600">
          <GripVertical className="w-4 h-4" />
        </div>
      </TableCell>
      <TableCell className={menu.level > 0 ? "pl-8 text-slate-500" : "font-bold text-slate-900"}>
        {menu.level > 0 && <span className="mr-2 text-slate-300">|—</span>}
        {menu.menuTitle}
      </TableCell>
      <TableCell className="text-blue-600 font-mono text-xs">{menu.menuUrl}</TableCell>
      <TableCell className="text-center font-bold text-slate-600">{menu.order}</TableCell>
      <TableCell className="text-xs text-slate-400 italic">{menu.icon}</TableCell>
    </TableRow>
  );
};
Điểm const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setMenus((prevMenus) => {
    const oldIndex = prevMenus.findIndex((m) => m.id === active.id);
    const newIndex = prevMenus.findIndex((m) => m.id === over.id);

    // Tạo mảng mới sau khi di chuyển vị trí
    let newArray = arrayMove(prevMenus, oldIndex, newIndex);

    // Lấy item vừa được kéo
    const draggedItem = newArray[newIndex];

    // --- LOGIC TỰ ĐỘNG CHUYỂN THÀNH MENU CHA ---
    if (draggedItem.parentId) {
      // Kiểm tra mục nằm ngay phía trên nó ở vị trí mới
      const itemAbove = newIndex > 0 ? newArray[newIndex - 1] : null;

      // Nếu kéo lên đầu danh sách HOẶC mục phía trên không liên quan đến cha cũ
      // (Không phải là cha nó, và không phải là anh em cùng cha với nó)
      const isMovedOut = !itemAbove ||
                         (itemAbove.id !== draggedItem.parentId &&
                          itemAbove.parentId !== draggedItem.parentId);

      if (isMovedOut) {
        // Cập nhật item này thành Menu Cha (Level 0)
        newArray[newIndex] = {
          ...draggedItem,
          parentId: undefined, // Xóa liên kết cha [1]
          level: 0,            // Chuyển về cấp cao nhất
          menuTitle: draggedItem.menuTitle.replace("--- ", "") // Xóa tiền tố hiển thị [2]
        };
      }
    }

    // Cập nhật lại thuộc tính 'order' (MenuPeriod) cho toàn bộ mảng [1]
    return newArray.map((item, idx) => ({
      ...item,
      order: (newArray.length - idx) * 10
    }));
  });
};
2. Thành phần Giao diện Hoàn thiện (TSX)
Tôi sẽ tích hợp thêm hiệu ứng hình ảnh (Visual Feedback) để người dùng thấy rõ khi một menu "thoát khỏi" nhóm cha.
import { CSS } from "@dnd-kit/utilities";
// ... (các import khác như PointerSensor, SortableContext)

const SortableMenuRow = ({ menu, index }: { menu: MenuItem, index: number }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    // Khi đang kéo, nếu là menu con thì hiển thị hiệu ứng "đang được gỡ ra"
    backgroundColor: isDragging ? "#ecfdf5" : "transparent",
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="group transition-colors">
      <TableCell className="w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-emerald-600 p-2">
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell className="w-12 text-center text-slate-400 text-xs">
        {index + 1}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {/* Render thụt lề dựa trên level [2] */}
          {menu.level > 0 && (
             <span className="text-slate-300 mr-2 font-mono">|———</span>
          )}
          <span className={`${menu.level === 0 ? "font-bold text-slate-900" : "text-slate-600"}`}>
            {menu.menuTitle}
          </span>
          {/* Badge hiển thị trạng thái nếu là menu vừa được "Thăng cấp" */}
          {isDragging && menu.parentId && (
            <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1 rounded animate-pulse">
              Thả để chuyển thành Menu Cha
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="font-mono text-[11px] text-blue-500">{menu.menuUrl}</TableCell>
      <TableCell className="text-center font-bold text-slate-500">{menu.order}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 p-1 rounded text-slate-400">{menu.icon}</span>
        </div>
      </TableCell>
    </TableRow>
  );
};
Giải thích cconst handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setMenus((prevMenus) => {
    const oldIndex = prevMenus.findIndex((m) => m.id === active.id);
    const newIndex = prevMenus.findIndex((m) => m.id === over.id);

    const draggedItem = prevMenus[oldIndex];
    const targetItem = prevMenus[newIndex];

    // --- LOGIC KÉO VÀO TRONG (NESTING) ---
    // Giả sử nếu kéo đè lên một mục, mục đó sẽ trở thành cha
    const updatedDraggedItem = {
      ...draggedItem,
      parentId: targetItem.id, // Gán ParentId là Id của mục tiêu [1]
      level: targetItem.level + 1, // Tăng cấp độ phân cấp
      menuTitle: draggedItem.menuTitle.startsWith("---")
                 ? draggedItem.menuTitle
                 : `--- ${draggedItem.menuTitle}` // Thêm tiền tố như trong ảnh [2]
    };

    // Tạo mảng mới: Xóa item cũ và chèn vào vị trí ngay sau menu cha mới
    let newArray = prevMenus.filter(m => m.id !== active.id);
    const targetIdxInNew = newArray.findIndex(m => m.id === over.id);
    newArray.splice(targetIdxInNew + 1, 0, updatedDraggedItem);

    // Cập nhật lại 'MenuPeriod' (Thứ tự hiển thị) để đồng bộ database [1]
    return newArray.map((item, idx) => ({
      ...item,
      order: (newArray.length - idx) * 10
    }));
  });
};
2. Thành phần Giao diện với Chỉ báo Visual (TSX)
Để người dùng biết họ đang chuẩn bị "gán con", chúng ta sẽ thêm các hiệu ứng phản hồi trên dòng mục tiêu.
const SortableMenuRow = ({ menu, index, isOver }: { menu: MenuItem, index: number, isOver?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    // Hiệu ứng khi có một menu khác đang kéo đè lên dòng này
    backgroundColor: isOver ? "#dcfce7" : "transparent",
    borderLeft: isOver ? "4px solid #059669" : "none"
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group transition-all ${isOver ? "scale-[1.02] shadow-md" : ""}`}
    >
      <TableCell className="w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-emerald-600 p-2">
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell className="w-12 text-center text-slate-400 font-mono text-xs">
        {index + 1}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {/* Render thụt lề mô phỏng giao diện nguồn [2] */}
          {Array.from({ length: menu.level }).map((_, i) => (
            <span key={i} className="text-slate-300 font-mono">|———</span>
          ))}
          <span className={`${menu.level === 0 ? "font-bold text-slate-900" : "text-slate-600 italic"}`}>
            {menu.menuTitle}
          </span>
          {isOver && (
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full animate-bounce">
              Làm Menu Cha
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="font-mono text-[11px] text-blue-500 underline decoration-slate-200">
        {menu.menuUrl}
      </TableCell>
      <TableCell className="text-center">
        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
            {menu.order}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs uppercase border border-slate-200 px-1 rounded">{menu.icon}</span>
        </div>
      </TableCell>
    </TableRow>
  );
};
