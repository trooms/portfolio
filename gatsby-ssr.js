/*import React from "react";

export function onRenderBody({ setHeadComponents }) {
    setHeadComponents([
        <script
            dangerouslySetInnerHTML={{
                __html: `
                function loadScript(url) {
                    return new Promise((resolve, reject) => {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = url;
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });
                }

                async function loadScriptsSequentially() {
                    if (window.location.href.includes('/lightride/')) {
                        try {
                            await loadScript('/TweenMax.min.js');
                            await loadScript('/introduction.js');
                        } catch (error) {
                            console.error("Script loading failed:", error);
                        }
                    }
                }

                document.addEventListener('DOMContentLoaded', loadScriptsSequentially);
                `
            }}
        />
    ]);
}*/
