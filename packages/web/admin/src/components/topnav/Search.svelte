<script>
    import { searchClose } from '../../stores/search.js';
    let focused = false;
    const toggleFocused = (e) => (focused = e.type === 'focus');
</script>

<!-- Search form -->
<form class="navbar-search navbar-search-light form-inline mr-sm-3" id="navbar-search-main">
    <div class="form-group mb-0" class:focused>
        <div class="input-group input-group-alternative input-group-merge">
            <div class="input-group-prepend">
                <span class="input-group-text">
                    <i class="fas fa-search"></i>
                </span>
            </div>
            <input
                class="form-control"
                placeholder="Search"
                type="text"
                on:focus|preventDefault="{toggleFocused}"
                on:blur|preventDefault="{toggleFocused}"
            />
        </div>
    </div>
    <button type="button" class="close" aria-label="Close" on:click="{searchClose}">
        <span aria-hidden="true">×</span>
    </button>
</form>
