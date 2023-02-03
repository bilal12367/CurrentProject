import React, { useEffect, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Type } from 'typescript'
import { actions, State, useAppDispatch, useAppSelector } from '../store'
import { useGetUserQuery } from '../store/RTKQuery'
interface PropType {
  children: ReactNode
}
const ProtectedRoute = ({ children }: PropType) => {
  //   useEffect(() => {
  //     const user = useSelector((state: State) => state.user)
  //     if(user==null) {
  //         const navigate = useNavigate();
  //         navigate('/auth/register');
  //     }
  //   }, [])
  const { data, error, isLoading, isFetching, isSuccess } = useGetUserQuery();
  const user = useAppSelector((state) => state.slice.user)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user == null) {
      if (isLoading == false && isSuccess == true && data == null) {
        console.log("Navigating to register page from protected route")
        navigate('/auth/register')
      } else if (isLoading == false && isSuccess == true && data != null) {
        dispatch(actions.slice1.setUser(data))
      }
    }
  }, [user, data])

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}

export default ProtectedRoute
