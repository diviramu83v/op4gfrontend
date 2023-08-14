import { DndProvider, useDrag, useDrop } from 'react-dnd';

const Column = ({ children, className, title }: any) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: title }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    // Override monitor.canDrop() function
    canDrop: (item: any) => {
      // const { DO_IT, IN_PROGRESS } = COLUMN_NAMES;
      // const { currentColumnName } = item;
      return true
      //   currentColumnName === title ||
      //   (currentColumnName === DO_IT && title === IN_PROGRESS) ||
      //   (currentColumnName === IN_PROGRESS)
      // );
    }
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return 'green';
      } else if (!canDrop) {
        return 'transparent';
      }
    } else {
      return 'transparent';
    }
  };

  return (
    <div
      ref={drop}
      className={className}
      style={{ borderColor: getBackgroundColor(), borderStyle: 'solid',borderWidth: '1px', width: '100%', height: '100%', minHeight: '100vh', boxSizing: 'border-box' }}
    >
      <p>{title}</p>
      {children}
    </div>
  );
};

export default Column;