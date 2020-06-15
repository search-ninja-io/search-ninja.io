<script>
    import Task from './Task.svelte';
    import LoadingRow from './LoadingRow.svelte';
    export let loading = false;
    export let tasks = [];

    // reactive declarations (computed prop in other frameworks)
    $: noTasks = tasks.length === 0;
    $: emptyTasks = tasks.length === 0 && !loading;
    $: tasksInOrder = [
        ...tasks.filter((t) => t.state === 'TASK_PINNED'),
        ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
    ];
</script>

<!--src/components/TaskList.svelte-->
{#if loading}
    <div class="list-items">
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
    </div>
{/if}
{#if noTasks && !loading}
    <div class="list-items">
        <div class="wrapper-message">
            <span class="icon-check"></span>
            <div class="title-message">You have no tasks</div>
            <div class="subtitle-message">Sit back and relax</div>
        </div>
    </div>
{/if}
{#each tasksInOrder as task}
    <Task task="{task}" on:onPinTask on:onArchiveTask />
{/each}
