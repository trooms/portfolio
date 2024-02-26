import './src/css/index.css';

let scriptLoaded = false;

export const onRouteUpdate = ({ location }) => {
    function initializeCanvas() {
        if (!scriptLoaded) {
            loadScriptsSequentially();
        }
    }

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
        if (location.pathname.includes('/lightride/')) {
            try {
                await loadScript('/TweenMax.min.js');
                await loadScript('/introduction.js');
                scriptLoaded = true;
            } catch (error) {
                console.error("Script loading failed:", error);
            }
        }
    }

    if (location.pathname.includes('/lightride/')) {
        initializeCanvas();
    }
};

export const onRouteUpdateDelayed = ({ location }) => {
    if (location.pathname.includes('/lightride/')) {
        // Additional checks or reinitializations if needed
        if (!scriptLoaded) {
            initializeCanvas();
        }
    }
};
