<style>

</style>

<script>
    export let segment;
</script>

<nav>
    <ul>
        <li>
            <a aria-current="{segment === undefined ? 'page' : undefined}" href=".">home</a>
        </li>
        <li>
            <a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">about</a>
        </li>
        for the blog link, we're using rel=prefetch so that Sapper prefetches
        <li>
            <a rel="prefetch" aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog">blog</a>
        </li>
    </ul>
</nav>
