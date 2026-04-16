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

import HeroBanner from "@/themes/fly-labour/parts/home/HeroBanner";
import FlashSaleJobs from "@/themes/fly-labour/parts/home/FlashSaleJobs";
import CategoriesSection from "@/themes/fly-labour/parts/home/CategoriesSection";
import LatestJobsSection from "@/themes/fly-labour/parts/home/LatestJobsSection";
import WhyChooseUs from "@/themes/fly-labour/parts/home/WhyChooseUs";
import NewsSection from "@/themes/fly-labour/parts/home/NewsSection";
import EmployerCTASection from "@/themes/fly-labour/parts/home/EmployerCTASection";
import CtaSection from "@/themes/fly-labour/parts/home/CtaSection";
import EnglishTestSection from "@/themes/fly-labour/parts/home/EnglishTestSection";
import { DraggableSection } from "@/admin/components/DraggableSection";
import { useEditModeStore } from "@/core/store/editModeStore";
import { useSectionManager } from "@/core/hooks/useSectionManager";

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  hero:       <HeroBanner />,
  flashsale:  <FlashSaleJobs />,
  categories: <CategoriesSection />,
  latestjobs: <LatestJobsSection />,
  why:        <WhyChooseUs />,
  employer:   <EmployerCTASection />,
  news:        <NewsSection />,
  englishtest: <EnglishTestSection />,
  cta:         <CtaSection />,
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
