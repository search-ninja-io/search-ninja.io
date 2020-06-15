<script>
    import { globalSidenavStyle, pin, unpin, hide } from '../../stores/sidenav.js';
    import { clickOutside } from '../../utils/click-outside.js';
    import SidenavItem from './SidenavItem.svelte';
    import SidenavDivider from './SidenavDivider.svelte';
    import SidenavHeading from './SidenavHeading.svelte';

    let width;
    $: width > 1200 ? pin() : unpin();

    const onMouseLeave = (event) => hide($globalSidenavStyle.pinned, width);
    const handleClickOutside = (event) => hide($globalSidenavStyle.pinned, width);
</script>

<svelte:window bind:innerWidth="{width}" />

<!-- Sidenav -->
<nav
    on:mouseleave="{onMouseLeave}"
    use:clickOutside
    on:click_outside="{handleClickOutside}"
    class="sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white"
    id="sidenav-main"
>
    <div class="scrollbar-inner">
        <!-- Brand -->
        <div class="sidenav-header align-items-center">
            <a class="navbar-brand" href="/">
                <img src="/vendor/argon-dashboard/img/brand/blue.png" class="navbar-brand-img" alt="..." />
            </a>
        </div>
        <div class="navbar-inner">
            <!-- Collapse -->
            <div class="collapse navbar-collapse" id="sidenav-collapse-main">
                <!-- Nav items -->
                <ul class="navbar-nav">
                    <SidenavItem title="Dashboard" icon="ni ni-tv-2 text-primary" href="/" />
                    <SidenavItem title="Icons" icon="ni ni-planet text-orange" href="/icons" />
                    <SidenavItem title="Google" icon="ni ni-pin-3 text-primary" href="/google" />
                    <SidenavItem title="Profile" icon="ni ni-single-02 text-yellow" href="/profile" />
                    <SidenavItem title="Tables" icon="ni ni-bullet-list-67 text-default" href="/tables" />
                    <SidenavItem title="Login" icon="ni ni-key-25 text-info" href="/login" />
                    <SidenavItem title="Register" icon="ni ni-circle-08 text-pink" href="/register" />
                    <SidenavItem title="Upgrade" icon="ni ni-send text-dark" href="/upgrade" />
                </ul>

                <SidenavDivider />

                <SidenavHeading title="Documentation" />

                <!-- Navigation -->
                <ul class="navbar-nav mb-md-3">
                    <SidenavItem
                        title="Getting started"
                        icon="ni ni-spaceship"
                        href="https://demos.creative-tim.com/argon-dashboard/docs/getting-started/overview.html"
                        target="_blank"
                    />
                    <SidenavItem
                        title="Foundation"
                        icon="ni ni-palette"
                        href="https://demos.creative-tim.com/argon-dashboard/docs/foundation/colors.html"
                        target="_blank"
                    />
                    <SidenavItem
                        title="Components"
                        icon="ni ni-ui-04"
                        href="https://demos.creative-tim.com/argon-dashboard/docs/components/alerts.html"
                        target="_blank"
                    />
                    <SidenavItem
                        title="Plugins"
                        icon="ni ni-chart-pie-35"
                        href="https://demos.creative-tim.com/argon-dashboard/docs/plugins/charts.html"
                        target="_blank"
                    />
                </ul>
            </div>
        </div>
    </div>
</nav>
