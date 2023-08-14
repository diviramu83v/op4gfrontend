import { useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';

const QualificationCard = ({
  children, index, moveCard, removeCard
}:any) => {

  const ref2 = useRef(null);

  const [, drop] = useDrop({
    accept: 'Our first type',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      
      if (!ref2.current) {
        return;
      }
      const dragIndex = (item as any).index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        // removeCard(dragIndex);
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = (ref2.current as any).getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      (item as any).index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type:'Our first type',
    item: { index, name, type: 'Our first type' },
    end: (item, monitor) => {
      // // Determine rectangle on screen
      const dropBounding = (ref2.current as any).getBoundingClientRect();
      // // Determine mouse position
      const clientOffset = monitor.getDifferenceFromInitialOffset();
      const hoverClientY = clientOffset && (clientOffset.x > dropBounding.width);
      if (hoverClientY) {
        removeCard(item.index)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref2))

  return (
    <div ref={ref2}>
      {children}
    </div>
  );
}
export default QualificationCard;
