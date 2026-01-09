import ReactGA from 'react-ga4';

// GA4 초기화
export const initGA = () => {
    // Vite에서는 import.meta.env.VITE_... 를 사용합니다.
    // 사용자가 NEXT_PUBLIC_GA_ID를 선호할 수 있으므로 두 가지 모두 체크합니다.
    const gaId = import.meta.env.VITE_GA_ID || import.meta.env.NEXT_PUBLIC_GA_ID;

    if (gaId) {
        ReactGA.initialize(gaId);
        console.log(`GA4 Initialized with ID: ${gaId}`);
    } else {
        console.warn('GA4 ID not found in environment variables.');
    }
};

// 페이지 뷰 추적 (선택 사항)
export const trackPageView = (path: string) => {
    ReactGA.send({ hitType: "pageview", page: path });
};

// 커스텀 이벤트 추적
export const trackEvent = (eventName: string, params?: object) => {
    ReactGA.event(eventName, params);
};
