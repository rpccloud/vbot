import React, { useEffect } from "react";

const TabBrowser = () => {
    useEffect(() => {
        window.addEventListener('mousemove', () => {});

        // returned function will be called on component unmount
        return () => {
          window.removeEventListener('mousemove', () => {})
        }
      }, [])
}

export default TabBrowser
