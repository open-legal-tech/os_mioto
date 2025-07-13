import type { TEdgeId, TNodeId } from "../id";

declare global {
  interface TreeEvents {
    deleteNode: { nodeId: TNodeId };
    deleteEdge: { edgeId: TEdgeId };
    addNode: { nodeId: TNodeId };
    addEdge: { edgeId: TEdgeId };
    updateNode: { nodeId: TNodeId };
    updateEdge: { edgeId: TEdgeId };
    updateStartNode: { startNodeId: TNodeId };
  }
}

type Listener<T> = (eventData: T) => void;

class TreeEventEmitter {
  private listeners: {
    [K in keyof TreeEvents]?: Array<{
      groupId: string;
      listener: Listener<TreeEvents[K]>;
    }>;
  } = {};
  private static groupIdCounter = 0;

  static generateGroupId() {
    return `group_${TreeEventEmitter.groupIdCounter++}`;
  }

  on<K extends keyof TreeEvents>(
    eventTypes: K[],
    listener: Listener<TreeEvents[K]>,
  ): string {
    const groupId = TreeEventEmitter.generateGroupId();
    eventTypes.forEach((eventType) => {
      if (!this.listeners[eventType]) {
        this.listeners[eventType] = [];
      }
      this.listeners[eventType]?.push({ groupId, listener });
    });

    return groupId;
  }

  offGroup(groupId: string): void {
    Object.keys(this.listeners).forEach((key) => {
      const eventType = key as keyof TreeEvents;
      this.listeners[eventType] = this.listeners[eventType]?.filter(
        (
          listenerObj,
        ): listenerObj is {
          groupId: string;
          listener: Listener<TreeEvents[keyof TreeEvents]>;
        } => listenerObj.groupId !== groupId,
      );
    });
  }

  emit<K extends keyof TreeEvents>(
    eventType: K,
    eventData: TreeEvents[K],
  ): void {
    const listeners = this.listeners[eventType];
    if (!listeners) {
      return;
    }
    listeners.forEach(({ listener }) => listener(eventData));
  }
}

export const TreeEvent = new TreeEventEmitter();
