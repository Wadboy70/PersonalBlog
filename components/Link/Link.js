import React from 'react';
import Link from 'next/link';

const LinkComponent = ({
    className = '',
    children,
    onClick = ()=>{},
    href
}) => {
    return(
        <Link 
            href={href}
            onClick={onClick}
        >
            <a className={className}>
                {children}
            </a>
        </Link>
    );
};

export default LinkComponent;