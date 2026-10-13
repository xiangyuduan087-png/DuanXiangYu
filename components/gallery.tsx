'use client';
import {useState} from 'react';
import type {MediaImage} from '@/lib/types';
import ArtworkImage from './artwork-image';
import ImageViewer from './image-viewer';
export default function Gallery({images,compact=false}:{images:MediaImage[];transitionName?:string;compact?:boolean}){
 const [index,setIndex]=useState(0),[open,setOpen]=useState(false);
 if(!images.length)return <div className="pending-block">作品图片待补充。</div>;
 return <><div className="artwork-gallery">{images.map((image,i)=><figure key={`${image.src}-${i}`} data-long={image.height/image.width>2.2} className={image.height/image.width>1.2?'portrait-artwork':''}><button type="button" className="image-button" aria-label={`放大查看：${image.alt}`} onClick={()=>{setIndex(i);setOpen(true);}}><ArtworkImage src={compact?image.thumbnail||image.src:image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async"/><span className="zoom-label" aria-hidden="true">放大查看 ↗</span></button>{image.caption&&<figcaption>{image.caption}</figcaption>}</figure>)}</div><ImageViewer images={images} index={index} open={open} onIndex={setIndex} onClose={()=>setOpen(false)}/></>;
}