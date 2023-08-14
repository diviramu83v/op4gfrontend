import { QueryClient } from '@tanstack/react-query';
import { useReducer } from 'react';

interface State {
  queryClient: QueryClient;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false
      }
    }
  })
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_QUERY_CLIENT':
      return {
        ...state,
        queryClient: action.payload
      };
    default:
      return state;
  }
}

const QueryClientReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

export default QueryClientReducer;
