<script>
    import Search from './Search.svelte';
    import SearchLink from './SearchLink.svelte';
    import User from './User.svelte';
    import SidenavToggler from './SidenavToggler.svelte';
    import Notifications from './Notifications.svelte';
    import Shortcuts from './Shortcuts.svelte';
</script>

<nav class="navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom">
    <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <Search />
            <ul class="navbar-nav align-items-center ml-md-auto ">
                <li class="nav-item d-xl-none">
                    <SidenavToggler />
                </li>
                <li class="nav-item d-sm-none">
                    <SearchLink />
                </li>
                <li class="nav-item dropdown">
                    <Notifications />
                </li>
                <li class="nav-item dropdown">
                    <Shortcuts />
                </li>
            </ul>
            <User />
        </div>
    </div>
</nav>
