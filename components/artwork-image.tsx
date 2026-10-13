'use client';
import {useState} from 'react';
import type {ImgHTMLAttributes} from 'react';
export default function ArtworkImage(props:ImgHTMLAttributes<HTMLImageElement>){
 const [failed,setFailed]=useState(false);
 return failed?<span className="image-error" role="status">图片暂时无法加载，请稍后重试。</span>:<img {...props} onError={()=>setFailed(true)}/>;
}
