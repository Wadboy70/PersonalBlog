import React from "react";
import Logo from "../Logo/Logo";
import Link from "next/link";

import styles from "./Header.module.scss";
import { useAuth } from "lib/AuthUserContext";

const Header = () => {
  const { signOutFirebaseUser, authUser } = useAuth();
  const pages = [
    {
      name: "About",
      url: "/about",
    },
    {
      name: "Journal",
      url: "/journal",
    },
  ];

  return (
    <header className={styles.header}>
      <Logo />
      <nav>
        <ul className={styles.header_list}>
          {pages.map((page) => {
            return (
              <li key={page.name}>
                <Link href={page.url}>
                  <a>{page.name}</a>
                </Link>
              </li>
            );
          })}
          <li>
            <a href="https://seyio.substack.com" target="_blank">
              Blog
            </a>
          </li>
          <li>
            {authUser && (
              <button onClick={signOutFirebaseUser}>Sign Out</button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
