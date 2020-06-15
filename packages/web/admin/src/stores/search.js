import { writable } from 'svelte/store';

const initialGlobalSearchStyle = {
    show: false,
    showing: false,
    shown: false,
    hiding: false,
    hidden: false,
};

export const globalSearchStyle = writable(initialGlobalSearchStyle);

export const searchShow = () => {
    globalSearchStyle.set({
        show: false,
        showing: true,
        shown: false,
        hiding: false,
        hidden: false,
    });

    setTimeout(
        () =>
            globalSearchStyle.set({
                show: true,
                showing: false,
                shown: false,
                hiding: false,
                hidden: false,
            }),
        150,
    );

    setTimeout(
        () =>
            globalSearchStyle.set({
                show: true,
                showing: false,
                shown: true,
                hiding: false,
                hidden: false,
            }),
        300,
    );
};

export const searchClose = () => {
    globalSearchStyle.set({
        show: true,
        showing: false,
        shown: false,
        hiding: false,
        hidden: false,
    });

    setTimeout(
        () =>
            globalSearchStyle.set({
                show: false,
                showing: false,
                shown: false,
                hiding: true,
                hidden: false,
            }),
        150,
    );

    setTimeout(
        () =>
            globalSearchStyle.set({
                show: false,
                showing: false,
                shown: false,
                hiding: false,
                hidden: true,
            }),
        300,
    );

    setTimeout(
        () =>
            globalSearchStyle.set({
                show: false,
                showing: false,
                shown: false,
                hiding: false,
                hidden: false,
            }),
        500,
    );
};
