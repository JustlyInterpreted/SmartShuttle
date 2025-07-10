import { useEffect, useRef } from 'react';
import { wsManager } from '../lib/websocket';

export function useWebSocket(eventType: string, callback: (data: any) => void) {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const wrappedCallback = (data: any) => {
      callbackRef.current(data);
    };

    wsManager.subscribe(eventType, wrappedCallback);
    
    return () => {
      wsManager.unsubscribe(eventType, wrappedCallback);
    };
  }, [eventType]);
}
