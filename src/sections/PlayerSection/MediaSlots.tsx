import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./styles.css";
import {
  BaseDirectory,
  readTextFile,
} from "@tauri-apps/api/fs";
import { MediaSlot, MediaSlotRefType } from "./MediaSlot";

const NUM_SLOTS = 4

function MediaSlots() : JSX.Element {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  let loopNextVideo = false
  let promiseVideoLoop: Promise<void> | null = null

  const refFile = useRef<HTMLInputElement>(null)
  const slotRefs = Array(NUM_SLOTS).fill(0).map(() => useRef<MediaSlotRefType | null>(null))

  console.log(slotRefs)

  useEffect(() => {
    loopNextVideo = true
    if (!promiseVideoLoop) {
      promiseVideoLoop = fnVideoLoop()
    }
    return () => {
      loopNextVideo = false
    }
  }, [videoUrl, loopNextVideo])

  const fnVideoLoop = async () => {
    let currVideoIndex = 0
    let firstIter = true
    while (loopNextVideo) {
      if (!videoUrl) {
        console.log("No video skipping ... " + videoUrl)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        continue
      }
      console.log("Has video, playing ... " + currVideoIndex)

      const currSlot = slotRefs[currVideoIndex].current as MediaSlotRefType
      if (firstIter) {
        currSlot.prepare(videoUrl)
        firstIter = false
      }
      currSlot.playVideo()

      // Wait 2s.
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const nextVideoIndex = (currVideoIndex + 1) % slotRefs.length
      const nextSlot = slotRefs[nextVideoIndex].current as MediaSlotRefType
      nextSlot.prepare(videoUrl)

      console.log("awaiting end ... " + currVideoIndex)
      const endMsg: string = await currSlot.waitTillEnd()
      console.log("endMessage = " + endMsg)
    
      // await new Promise((resolve) => setTimeout(resolve, 5000))
      currVideoIndex = nextVideoIndex
    }
  }


  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList
    const file: File = files[0]
    const fieUrl = URL.createObjectURL(file)
    setVideoUrl(fieUrl)

    /*
    const reader = new FileReader();
    reader.onload = function(event: ProgressEvent<FileReader>) {
      console.log("File size:", file.size, "bytes");
    }
    reader.onloadend = (ev: ProgressEvent<FileReader>) => {
      console.log(ev)
      const arrayBuffer = ev.target?.result as ArrayBuffer;
      console.log(arrayBuffer);
    }
    reader.readAsArrayBuffer(file);
    */
  }

 
  return (<>
    <div>
    MediaSlots:
    {slotRefs.map(
      (ref, index) => <MediaSlot ref={ref} key={index} />)
    }
    <form>
      <input type="file" multiple ref={refFile} onChange={onChangeFile}></input>
      <input type="file" webkitdirectory="true" directory="true" multiple></input>
    </form>

    </div>
  </>)
}

export { MediaSlots }
