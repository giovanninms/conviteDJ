import { useState } from "react";

export default function CartServices() {

    const [cartLoading, setCartLoading] = useState(false)
    const [refectGifts, setRefectGifts] = useState(true)
    const [cartList, setCartList] = useState({})

    const url = 'https://convite-dj.vercel.app/card'

    const getUserCart = (usersId) => {
        setCartLoading(true)
        fetch(`${url}/usercarts/${usersId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    setCartList(result.body)
                }else{
                    console.log(result)
                }
                console.log(result)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                setCartLoading(false);
                setRefectGifts(false)
            });
    }

    return { getUserCart, cartLoading, refectGifts, cartList }
}