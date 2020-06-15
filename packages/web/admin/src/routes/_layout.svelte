<style type="text/scss" global>
    @import '../styles/global.scss';
</style>

<script>
    export let segment;

    import Sidenav from '../components/sidenav/Sidenav.svelte';
    import Topnav from '../components/topnav/Topnav.svelte';
    import Header from '../components/Header.svelte';
    import Footer from '../components/Footer.svelte';

    import { globalSidenavStyle } from '../stores/sidenav.js';
    import { globalSearchStyle } from '../stores/search.js';
    const log = () => console.log('click');
</script>

<svelte:head>
    <title>Search Ninja - Admin Dashboard</title>
</svelte:head>

<div
    class:g-sidenav-pinned="{$globalSidenavStyle.pinned}"
    class:g-sidenav-show="{$globalSidenavStyle.show}"
    class:g-sidenav-hidden="{$globalSidenavStyle.hidden}"
    class:g-navbar-search-show="{$globalSearchStyle.show}"
    class:g-navbar-search-showing="{$globalSearchStyle.showing}"
    class:g-navbar-search-shown="{$globalSearchStyle.shown}"
    class:g-navbar-search-hiding="{$globalSearchStyle.hiding}"
    class:g-navbar-search-hidden="{$globalSearchStyle.hidden}"
>

    <Sidenav />

    <div class="main-content" id="panel">

        <Topnav />

        <Header segment="{segment}" />

        <div class="container-fluid mt--6">
            <slot segment="{segment}" />
            <Footer />
        </div>

    </div>
</div>
