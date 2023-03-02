import React, { ReactNode, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { actions, useAppDispatch, useAppSelector, User } from '../store'
import { useGetUserQuery } from '../store/RTKQuery'
interface PropType {
    children: ReactNode
  }

const CheckUserRoute = ({children}: PropType) => {
    const {user} = useAppSelector((state)=> state.slice)
    const navigate = useNavigate();
    const {data,error,isLoading,isFetching,isSuccess} =  useGetUserQuery();
    const dispatch = useAppDispatch();
    useEffect(()=>{
        if(user!=null){
          // console.log("Navigating to dashboard from checkuserroute")
            navigate('/dashboard')
        } else{
            
        }
    },[user])
    useEffect(()=>{
        // console.table({data,error,isLoading,isFetching})
        // console.log("Data retrieved: ",data)
        if(isLoading==false && data != null){
            const user1: User | null =  data;
            dispatch(actions.slice1.setUser(data))
            // dispatch()
        }
    },[isLoading])
  if(isLoading == false && isSuccess == true){
    return (
      <React.Fragment>
          {children}
      </React.Fragment>
    )
  }else {
    return <></>
  }
  
}

export default CheckUserRoute
