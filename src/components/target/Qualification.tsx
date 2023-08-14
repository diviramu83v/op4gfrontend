import { useRef } from "react";
import { useDrag } from 'react-dnd';
import {
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
export const COLUMN_NAMES = {
  DO_IT: 'Do it',
  IN_PROGRESS: 'In Progress',
};
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const Qualification = ({
  name, index, setItems
}: any) => {

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'Our first type',
    item: { index, name, type: 'Our first type' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        // const { name } = dropResult as any;
        setItems(name);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(ref);

  return (
    <ListItem
      ref={ref}
      style={{ opacity, border: '1px solid #e0e0e0' }}
    >
      <ListItemIcon>
        <DragIndicatorIcon />
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
}
export default Qualification;
