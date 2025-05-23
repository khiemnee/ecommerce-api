
export const cartTotal = async (cartItems : any[]) =>{
    const total = cartItems.reduce((temptTotal,index)=> temptTotal + (index.quantity * index.product!.price),0)
    return total
}