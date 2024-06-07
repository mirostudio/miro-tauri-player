import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

interface MediaSlotRefType {
  prepare(url: string) : void;
  playVideo() : void;
  waitTillEnd() : Promise<string>;
}

enum MediaSlotState {
  STATE_INIT,
  STATE_PREPARED,
  STATE_PLAYING,
  STATE_ENDED,
}

const MediaSlot = forwardRef((props, ref: ForwardedRef<MediaSlotRefType>) => {
  const refVideo = useRef<HTMLVideoElement>(null);
  const [slotState, setSlotState] = useState<MediaSlotState>(MediaSlotState.STATE_INIT)
  let timeStamp = 0;

  const endResolves: any[] = useMemo(() => [], [])

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    prepare(url: string) : void {
      if (!refVideo.current) return
      setSlotState(MediaSlotState.STATE_PREPARED)
      const video = refVideo.current as HTMLVideoElement
      video.src = url
      // video.pause()
    },

    playVideo() : void {
      if (!refVideo.current) return
      setSlotState(MediaSlotState.STATE_PLAYING)
      const video = refVideo.current as HTMLVideoElement
      video.play()
    },

    waitTillEnd() : Promise<string> {
      return new Promise((resolve, reject) => {
        endResolves.push(resolve)
        console.log("In waitTillEnd, endResolves_size = " + endResolves.length)
      })
    },
  }));

  useEffect(() => {
    if (!refVideo.current) return
    const video: HTMLVideoElement = refVideo.current;
    video.ontimeupdate = onTimeUpdate
    video.onended = onVideoEnded
  }, [slotState])

  const onTimeUpdate = (evt: Event) => {
    if (evt.timeStamp > 0) {
      timeStamp = evt.timeStamp
    }
    // console.log(timeStamp)
  }

  const onVideoEnded = (evt: Event) => {
    console.log("Video ended, resolves_size = " + endResolves.length)
    setSlotState(MediaSlotState.STATE_ENDED)
    while (endResolves.length > 0) {
      const resolve = endResolves.pop()
      resolve("Fg87H")
    }
   }


return (<>
    { /*(slotState == MediaSlotState.STATE_PREPARED || slotState == MediaSlotState.STATE_PLAYING)*/
    <video controls className="vid" ref={refVideo} {...props}></video>}
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
  </>)
});

export { MediaSlot, type MediaSlotRefType }
