import { forwardRef, useImperativeHandle, useState } from "react";

interface EventMessageInterface {
  showEvent(payload: any): void;
}

const EventMessage = forwardRef<EventMessageInterface>(function EventMessage(props, ref): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [updated, setUpdated] = useState<Date | null>(null);

  function showEventImpl(payload: any) {
    setUpdated(new Date());
    setMessage(JSON.stringify(payload));
  }

  useImperativeHandle(ref, () => ({
    showEvent(payload: any) {
      showEventImpl(payload);
    },
  }) as EventMessageInterface, []);

  return (
    <>
      <div className="font-extrabold">
        Received event:
      </div>
      <div className="font-mono">
        {message}
      </div>
      <div className="text-xs font-light">
        Updated: {updated ? updated.toLocaleTimeString() : "-" }
      </div>
    </>
  );
});

export default EventMessage;
export { type EventMessageInterface };
