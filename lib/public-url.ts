import aliases from '@/content/asset-aliases.json';
export function publicUrl(path:string):string {
  if(!path.startsWith('/') || path.startsWith('//')) return path;
  return (process.env.NEXT_PUBLIC_BASE_PATH||'')+((aliases as Record<string,string>)[path]||path);
}
export function publicResources<T>(value:T):T {
  if(typeof value==='string') return publicUrl(value) as T;
  if(Array.isArray(value)) return value.map(publicResources) as T;
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,publicResources(item)])) as T;
  return value;
}
