import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import HeroBanner from "@components/home/HeroBanner";
import FlashSaleJobs from "@components/home/FlashSaleJobs";
import CategoriesSection from "@components/home/CategoriesSection";
import LatestJobsSection from "@components/home/LatestJobsSection";
import WhyChooseUs from "@components/home/WhyChooseUs";
import NewsSection from "@components/home/NewsSection";
import EmployerCTASection from "@components/home/EmployerCTASection";
import EnglishTestCtaRow from "@components/home/EnglishTestCtaRow";
import { useEditModeStore } from "@core/store/editModeStore";
import { useSectionManager } from "@core/hooks/useSectionManager";
import s from "./HomePage.module.scss";

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  hero: <HeroBanner />,
  flashsale: <FlashSaleJobs />,
  categories: <CategoriesSection />,
  latestjobs: <LatestJobsSection />,
  why: <WhyChooseUs />,
  employer: <EmployerCTASection />,
  news: <NewsSection />,
  englishtestcta: <EnglishTestCtaRow />,
};

// Khôi phục component DraggableSection dành riêng cho Edit Mode
function DraggableSection({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative" as const,
    zIndex: isDragging ? 50 : 1, // Đẩy section lên trên cùng khi đang được kéo
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Thêm một lớp phủ cursor-grab để biểu thị có thể kéo thả nếu cần */}
      <div className={s.dragWrap}>
        {children}
      </div>
    </div>
  );
}

export default function HomePage() {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const { order, reorder } = useSectionManager();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id));
    }
  };

  if (!isEditMode) {
    // Render mode: Render trực tiếp Component, không cần wrapper kéo thả
    return (
      <main>
        {order.map((id) => {
          const component = SECTION_COMPONENTS[id];
          if (!component) return null;
          return (
            <div key={id} id={id}>
              {component}
            </div>
          );
        })}
      </main>
    );
  }

  // Edit mode: Sử dụng DraggableSection để kích hoạt dnd-kit
  return (
    <main>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((id) => {
            const component = SECTION_COMPONENTS[id];
            if (!component) return null;
            return (
              <DraggableSection key={id} id={id}>
                {component}
              </DraggableSection>
            );
          })}
        </SortableContext>
      </DndContext>
    </main>
  );
}
