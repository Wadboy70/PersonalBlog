import React from 'react';
import Image from 'next/image';
import logo from 'public/logo.png'

const Logo = () => {

    return(
        <div>
            <Image src={logo}/>
            <h3>Seyi Oluwaleimu</h3>
        </div>
    );
};

export default Logo;