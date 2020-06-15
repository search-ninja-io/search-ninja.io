import { writable } from 'svelte/store';

const initialGlobalStyle = {
    pinned: true,
    show: true,
    hidden: false,
};

export const globalSidenavStyle = writable(initialGlobalStyle);

export const pin = () =>
    globalSidenavStyle.set({
        pinned: true,
        show: true,
        hidden: false,
    });

export const unpin = () =>
    globalSidenavStyle.set({
        pinned: false,
        show: false,
        hidden: true,
    });

export const toggle = (pinned) => (pinned ? unpin() : pin());

export const hide = (pinned, width) => {
    if (pinned && width <= 1200) {
        globalSidenavStyle.set({
            pinned: true,
            show: false,
            hidden: false,
        });
        setTimeout(() => unpin(), 300);
    }
};
