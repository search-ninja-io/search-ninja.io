<style>

</style>

<script>
    import { onMount } from 'svelte';

    export let segment;

    onMount(async () => {
        await import('../../../../../node_modules/materialize-css/dist/js/materialize');

        var sideNavElems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sideNavElems);

        var parallaxElems = document.querySelectorAll('.parallax');
        M.Parallax.init(parallaxElems);
    });
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <title>Badmintonclub Effretikon</title>
</svelte:head>

<nav class="white" role="navigation">
    <div class="nav-wrapper container">
        <a id="logo-container" href="#!" class="brand-logo">Logo</a>
        <ul class="right hide-on-med-and-down">
            <li>
                <a href="#!">Navbar Link</a>
            </li>
        </ul>

        <ul id="nav-mobile" class="sidenav">
            <li>
                <a href="#!">Navbar Link</a>
            </li>
        </ul>
        <a href="#!" data-target="nav-mobile" class="sidenav-trigger">
            <i class="material-icons">menu</i>
        </a>
    </div>
</nav>

<main>
    <slot segment="{segment}" />
</main>

<footer class="page-footer teal">
    <div class="container">
        <div class="row">
            <div class="col l6 s12">
                <h5 class="white-text">Company Bio</h5>
                <p class="grey-text text-lighten-4">
                    We are a team of college students working on this project like it's our full time job. Any amount
                    would help support and continue development on this project and is greatly appreciated.
                </p>

            </div>
            <div class="col l3 s12">
                <h5 class="white-text">Settings</h5>
                <ul>
                    <li>
                        <a class="white-text" href="#!">Link 1</a>
                    </li>
                    <li>
                        <a class="white-text" href="#!">Link 2</a>
                    </li>
                    <li>
                        <a class="white-text" href="#!">Link 3</a>
                    </li>
                    <li>
                        <a class="white-text" href="#!">Link 4</a>
                    </li>
                </ul>
            </div>
            <div class="col l3 s12">
                <h5 class="white-text">Connect</h5>
                <ul>
                    <li>
                        <a class="white-text" href="#!">Link 1</a>
                    </li>
                    <li>
                        <a class="white-text" href="#!">Link 2</a>
                    </li>
                    <li>
                        <a class="white-text" href="#!">Link 3</a>
                    </li>
                    <li>
                        <a class="white-text" href="#!">Link 4</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="footer-copyright">
        <div class="container">
            Made by
            <a class="brown-text text-lighten-3" href="http://materializecss.com">Materialize</a>
        </div>
    </div>
</footer>
