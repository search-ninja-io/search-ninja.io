// src/components/Task.stories.js
import Task from './Task.svelte';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';
export default {
    title: 'Task',
    decorators: [withKnobs],
    parameters: {
        assets: ['/successkid.jpg', '/logo-512.png'],
    },
    excludeStories: /.*Data$/,
};

export const actionsData = {
    onPinTask: action('onPinTask'),
    onArchiveTask: action('onArchiveTask'),
};

export const taskData = {
    id: '1',
    title: 'Test Task',
    state: 'Task_INBOX',
    updated_at: new Date(2019, 0, 1, 9, 0),
};

// default task state
export const Default = () => ({
    Component: Task,
    props: {
        task: object('task', { ...taskData }),
    },
    on: {
        ...actionsData,
    },
});
// pinned task state
export const Pinned = () => ({
    Component: Task,
    props: {
        task: {
            ...taskData,
            state: 'TASK_PINNED',
        },
    },
    on: {
        ...actionsData,
    },
});
// archived task state
export const Archived = () => ({
    Component: Task,
    props: {
        task: {
            ...taskData,
            state: 'TASK_ARCHIVED',
        },
    },
    on: {
        ...actionsData,
    },
});

const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = () => ({
    Component: Task,
    props: {
        task: {
            ...taskData,
            title: longTitle,
        },
    },
});
