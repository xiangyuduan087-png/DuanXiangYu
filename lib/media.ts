export function formatDuration(value:string|null|undefined){
 if(!value)return '';
 const seconds=Math.round(value.split(':').reduce((total,part)=>total*60+Number(part),0));
 if(!Number.isFinite(seconds))return value;
 return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
}
