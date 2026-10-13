'use client';
import {publicUrl} from '@/lib/public-url';

import { useEffect, useRef } from 'react';
import gazeFrames from './gaze-frames.json';

const TAU = Math.PI * 2;
const wrappedAngle = (angle: number) => (angle % TAU + TAU) % TAU;
function timeForAngle(angle: number) {
  const target = wrappedAngle(angle);
  let nearestTime = gazeFrames[0][1];
  let nearestDistance = Infinity;
  for (const [sampleAngle, time] of gazeFrames) {
    const difference = Math.abs(target - sampleAngle);
    const distance = Math.min(difference, TAU - difference);
    if (distance < nearestDistance) { nearestDistance = distance; nearestTime = time; }
  }
  return nearestTime + 1 / 240;
}

export default function FooterBackground({ enabled = true }: { enabled?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const enabledRef = useRef(enabled);
  useEffect(() => { enabledRef.current = enabled; videoRef.current?.dispatchEvent(new Event('gaze-enable')); }, [enabled]);
  useEffect(() => {
    const video = videoRef.current!;
    let frame = 0;
    let desiredTime = 0;
    const neutralAngle = [...gazeFrames].sort((a,b)=>a[1]-b[1])[0][0];
    let currentAngle = neutralAngle, targetAngle = neutralAngle, last = 0, handoff = 0;
    const difference = (a:number,b:number) => Math.atan2(Math.sin(a-b),Math.cos(a-b));
    let visible = false;
    let disposed = false;
    let pointer: { x: number; y: number } | null = null;
    const mobile = window.matchMedia('(max-width: 700px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowPerformance = (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) || (device.deviceMemory !== undefined && device.deviceMemory <= 2) || device.connection?.saveData;
    const canAnimate = () => enabledRef.current && visible && !document.hidden && !reduced.matches && !lowPerformance;
    const seek = (now:number) => {
      frame = 0;
      if (disposed || !canAnimate() || mobile.matches || !finePointer.matches || video.readyState < 2 || video.seeking) return;
      const dt = Math.min((now-last)/1000 || .016,.05); last=now;
      if (handoff) {
        const progress=Math.min(1,(now-handoff)/650),ease=progress*progress*(3-2*progress);
        currentAngle=neutralAngle+difference(targetAngle,neutralAngle)*ease;
        if(progress===1)handoff=0;
      } else currentAngle+=difference(targetAngle,currentAngle)*(1-Math.exp(-dt/0.065));
      desiredTime=timeForAngle(currentAngle);
      if (Math.abs(video.currentTime - desiredTime) > 1 / 48) video.currentTime = Math.max(0, Math.min(desiredTime, video.duration - 1 / 24));
      if(handoff || Math.abs(difference(targetAngle,currentAngle))>.01) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(seek); };
    const updateTarget = () => {
      if (!canAnimate() || mobile.matches || !finePointer.matches || !pointer) return;
      const rect = video.getBoundingClientRect();
      const scale = Math.max(rect.width / 1920, rect.height / 1080);
      const eyeX = rect.left + rect.width / 2 + (948 - 960) * scale;
      const eyeY = rect.top + rect.height / 2 + (418 - 540) * scale;
      const dx = pointer.x - eyeX;
      const dy = pointer.y - eyeY;
      if (Math.hypot(dx, dy) > 8) { targetAngle = Math.atan2(dy, dx); schedule(); }
    };
    const move = (event: PointerEvent) => { pointer = { x: event.clientX, y: event.clientY }; updateTarget(); };
    const ready = () => {
      if (disposed) return;
      if (!visible || document.hidden || reduced.matches || lowPerformance || (!mobile.matches && !finePointer.matches)) { video.pause(); return; }
      const source = mobile.matches ? publicUrl('/footer-background.mp4') : publicUrl('/footer-scrub.mp4');
      if (video.getAttribute('src') !== source) { video.pause(); video.src = source; video.load(); return; }
      if(!enabledRef.current){video.pause();return;}
      video.loop = mobile.matches;
      if (mobile.matches) void video.play().catch(() => {});
      else {
        video.pause();
        // A paused decoded frame can retain a stale compositor tile after scrolling away.
        // Seek by a sub-frame amount on re-entry without resetting the gaze direction.
        if(video.readyState>=2&&!video.seeking&&Number.isFinite(video.duration))video.currentTime=Math.min(video.duration-1/24,video.currentTime+1/1000);
        updateTarget(); schedule();
      }
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; ready(); }, { threshold: 0.08 });
    observer.observe(video);
    const enable = () => {handoff=performance.now();currentAngle=neutralAngle;last=0;ready();};
    video.addEventListener('gaze-enable',enable);
    video.addEventListener('seeked', schedule);
    video.addEventListener('loadeddata', ready);
    mobile.addEventListener('change', ready);
    reduced.addEventListener('change', ready);
    finePointer.addEventListener('change', ready);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', ready);
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, { passive: true });
    return () => {
      disposed = true; observer.disconnect(); cancelAnimationFrame(frame); video.pause();
      video.removeEventListener('gaze-enable',enable);
      video.removeEventListener('seeked', schedule); video.removeEventListener('loadeddata', ready);
      mobile.removeEventListener('change', ready); reduced.removeEventListener('change', ready); finePointer.removeEventListener('change', ready);
      document.removeEventListener('visibilitychange', ready);
      window.removeEventListener('pointermove', move); window.removeEventListener('resize', updateTarget); window.removeEventListener('scroll', updateTarget);
    };
  }, []);
  return <div className="footer-background" aria-hidden="true"><video ref={videoRef} muted playsInline preload="none" poster={publicUrl('/images/brand-character.webp')} tabIndex={-1}/></div>;
}


