<script>
    import { AppStore } from '../store';
    import InboxScreen from '../components/InboxScreen.svelte';
</script>

<!-- src/App.svelte-->
<InboxScreen error="{$AppStore}" />
