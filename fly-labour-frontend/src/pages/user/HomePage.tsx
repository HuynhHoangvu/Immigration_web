import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import HeroBanner from "@/components/home/HeroBanner";
import FlashSaleJobs from "@/components/home/FlashSaleJobs";
import CategoriesSection from "@/components/home/CategoriesSection";
import LatestJobsSection from "@/components/home/LatestJobsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import NewsSection from "@/components/home/NewsSection";
import EmployerCTASection from "@/components/home/EmployerCTASection";
import CtaSection from "@/components/home/CtaSection";
import { DraggableSection } from "@/components/ui/DraggableSection";
import { useEditModeStore } from "@/store/editModeStore";
import { useSectionManager } from "@/hooks/useSectionManager";

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  hero:       <HeroBanner />,
  flashsale:  <FlashSaleJobs />,
  categories: <CategoriesSection />,
  latestjobs: <LatestJobsSection />,
  why:        <WhyChooseUs />,
  employer:   <EmployerCTASection />,
  news:       <NewsSection />,
  cta:        <CtaSection />,
}

export default function HomePage() {
  const isEditMode = useEditModeStore(s => s.isEditMode)
  const { order, reorder } = useSectionManager()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id))
    }
  }

  if (!isEditMode) {
    // Render mode: chỉ hiện section không bị ẩn, theo đúng thứ tự + màu nền
    return (
      <main>
        {order.map(id => {
          const component = SECTION_COMPONENTS[id]
          if (!component) return null
          return (
            <DraggableSection key={id} id={id}>
              {component}
            </DraggableSection>
          )
        })}
      </main>
    )
  }

  // Edit mode: drag & drop sortable
  return (
    <main>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map(id => {
            const component = SECTION_COMPONENTS[id]
            if (!component) return null
            return (
              <DraggableSection key={id} id={id}>
                {component}
              </DraggableSection>
            )
          })}
        </SortableContext>
      </DndContext>
    </main>
  )
}
