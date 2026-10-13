'use client';
import {useEffect,useRef,useState} from 'react';
import type {PersonalProfile} from '@/lib/types';
import {contact} from '@/content/profile';
import Gallery from './gallery';
export default function Contacts({email,socials}:Pick<PersonalProfile,'email'|'wechat'|'socials'>){
 const [feedback,setFeedback]=useState(''),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const copy=async(value:string,label:string)=>{try{await navigator.clipboard.writeText(value);setFeedback(`${label}已复制`);}catch{setFeedback('请选中内容手动复制');}if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setFeedback(''),2600);};
 return <div className="contact-cards"><article className="contact-card phone-card"><span className="eyebrow">01 / PHONE</span><h3>电话</h3><a className="contact-value" href={`tel:${contact.phone}`}>{contact.phone}</a><div className="contact-actions"><a href={`tel:${contact.phone}`}>拨打电话 ↗</a><button onClick={()=>copy(contact.phone,'电话')}>复制电话</button></div></article>
 <article className="contact-card mail-card"><span className="eyebrow">02 / EMAIL</span><h3>邮箱</h3>{email&&<><a className="contact-value" href={`mailto:${email}`}>{email}</a><div className="contact-actions"><a href={`mailto:${email}`}>写一封邮件 ↗</a><button onClick={()=>copy(email,'邮箱')}>复制邮箱</button></div></>}</article>
 <article className="contact-card scan-card wechat-scan"><span className="eyebrow">03 / WECHAT</span><h3>微信</h3><p>扫码添加微信</p><Gallery images={[{src:contact.wechatQR,alt:'扫码添加微信 · 完整原图',width:1094,height:1609}]}/><span className="scan-note">点击二维码，查看完整原图 ↗</span></article>
 <article className="contact-card scan-card bili-scan"><span className="eyebrow">04 / BILIBILI</span><h3>{contact.bilibili.name}</h3><p>扫码查看 B 站动态与作品</p><Gallery images={[{src:contact.bilibili.qr,alt:'扫码查看 B 站动态与作品',width:980,height:980}]}/><div className="contact-actions"><a href={contact.bilibili.dynamic} target="_blank" rel="noopener noreferrer">打开 B 站动态 ↗</a><a href={contact.bilibili.uploads} target="_blank" rel="noopener noreferrer">查看全部投稿 ↗</a></div></article><p className="copy-feedback" role="status" aria-live="polite">{feedback}</p></div>;
}
