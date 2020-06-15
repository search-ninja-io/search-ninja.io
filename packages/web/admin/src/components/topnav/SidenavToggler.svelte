<script>
    import { globalSidenavStyle, pin, unpin, toggle } from '../../stores/sidenav.js';
    const toggleSidenav = () => toggle($globalSidenavStyle.pinned);
</script>

<!-- Sidenav toggler -->
<div
    class="pr-3 sidenav-toggler sidenav-toggler-dark {$globalSidenavStyle.pinned && 'active'}"
    on:click="{toggleSidenav}"
>
    <div class="sidenav-toggler-inner">
        <i class="sidenav-toggler-line"></i>
        <i class="sidenav-toggler-line"></i>
        <i class="sidenav-toggler-line"></i>
    </div>
</div>
