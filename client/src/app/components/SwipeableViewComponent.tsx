import React, { Children, ReactNode, useEffect, useState } from 'react'

interface SwipeableViewComponentPropType {
    children: ReactNode[] | ReactNode,
    position: number
}

const SwipeableViewComponent = ({ children, position }: SwipeableViewComponentPropType) => {

    const [positionState, setPositionState] = useState(0);
    useEffect(() => {
        if (children) {
            const childrenLength = Children.toArray(children).length
            if (position >= 1 && position <= childrenLength) {
                setPositionState(position - 1)
            }

        }
        return () => {

        }
    }, [position])
    if (children) {
        return (
            <div className="d-flex" style={{height:'100%', width:'100%', display: 'flex', overflow: 'hidden', position: 'relative' }}>
                <div className="" style={{ display: '-webkit-box', right: positionState + '00%', position: 'absolute', transition: 'all 0.4s ease',width:'100%',height:'100%' }}>
                    {Children.toArray(children).length >1 && Object.values(children).map((item) => {
                        const key = String(Math.random() * 1000)
                        return <div key={key} style={{ width: '100%', height: '100%' }}>
                            {item as ReactNode}
                        </div>
                    })}
                    {Children.toArray(children).length == 1 && children}
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

export default SwipeableViewComponent