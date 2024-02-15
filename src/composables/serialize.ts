export function useSerialize(obj: any) {
  const str = [];
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          for (let i in obj[key]) {
            str.push(encodeURIComponent(key) + "[]=" + obj[key][i]);
          }
        } else {
          str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
        }
      }
    }  
  }
  return str.join("&");
}