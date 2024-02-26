import React from "react";

export function onRenderBody({ setHeadComponents, setPostBodyComponents }) {

    setHeadComponents([
        <script
            dangerouslySetInnerHTML={{
                __html: `
                function loadScript(url) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    document.body.appendChild(script);
                }

                document.addEventListener('DOMContentLoaded', (event) => {
                    if (window.location.href.includes('/lightride/')) {
                        loadScript('/introduction.js');
                    }
                });
                `
            }}
        />,
    ]);
}