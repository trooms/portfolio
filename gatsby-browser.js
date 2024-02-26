import './src/css/index.css';

let scriptLoaded = false;

export const onRouteUpdate = ({ location }) => {
    if (location.pathname.includes('/lightride/')) {
        setTimeout(() => {
            window.initCanvas();
          }, "1000");
          
    }
};
