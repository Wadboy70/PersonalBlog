import React from 'react';
import Logo from '../Logo/Logo';
import Link from 'next/link';

const Header = () => {
    const pages = [
        {
            name: 'Blog',
            url: '/blog'
        },
        {
            name: 'About',
            url: '/about'
        }
    ]

    return(
        <header>
            <div>
                <Logo/>
                <nav>
                    <ul>
                        {
                            pages.map(page=>{
                                return(
                                    <li key = {page.name}>
                                        <Link href={page.url}>
                                            <a>
                                                {page.name}
                                            </a>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;