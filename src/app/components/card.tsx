import React from 'react'

type CardProps = {
    title?: string | React.ReactNode,
    id?:string,
    extrainfo?:string,
    children?:React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
    return <div ref={ref} className="card bg-base-100 w-full shadow-xl">
        <div className="card-body">
        {!!props.title && <h4 className="card-title">
            {!!props.id && <span id={props.id} style={{display: 'block', position: 'absolute', visibility: 'hidden', marginTop: '-23px', paddingTop: '23px'}}></span>}
            {props.title}
        </h4>}
        
        {props.children}
        
        {!!props.extrainfo && <div className="card-actions justify-end text-sm text-base-300">
            {props.extrainfo}
        </div>}
        </div>
    </div>
});

export default Card