<script>
    export let title;
    export let icon;
    export let href;
    export let target = '';
</script>

<li class="nav-item">
    <a class="nav-link active" href="{href}" target="{target}">
        <i class="{icon}"></i>
        <span class="nav-link-text">{title}</span>
    </a>
</li>
