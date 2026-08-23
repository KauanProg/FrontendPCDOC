export interface Product{id?:string;name:string;description:string;price:number;quantity:number}
export interface Movement{id?:string;productId:string;type:string;quantity:number;unitPrice:number;total:number;createdAt:string}
